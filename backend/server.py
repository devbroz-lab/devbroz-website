from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import html
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging early so route handlers can use `logger` safely.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection (optional in email-only deployments)
mongo_url = os.environ.get("MONGO_URL")
db_name = os.environ.get("DB_NAME")
client = None
db = None

if mongo_url and db_name:
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        logger.info("MongoDB enabled for persistence")
    except Exception as mongo_err:  # noqa: BLE001
        logger.exception(f"MongoDB init failed, continuing without DB: {mongo_err}")
else:
    logger.warning(
        "MongoDB disabled: MONGO_URL/DB_NAME not set. Running email-only mode."
    )

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT = os.environ.get('CONTACT_RECIPIENT', 'enquiry@devbroz.com')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    if db is not None:
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        return []

    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ---------------------------------------------------------------------------
# Contact form
# ---------------------------------------------------------------------------
class ContactSubmission(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    business: Optional[str] = Field(default='', max_length=160)
    email: EmailStr
    details: str = Field(min_length=1, max_length=4000)


def _build_email_html(payload: ContactSubmission) -> str:
    """Minimal inline-styled HTML email, safe for most clients."""
    safe_name = html.escape(payload.name)
    safe_business = html.escape(payload.business or '—')
    safe_email = html.escape(payload.email)
    safe_details = html.escape(payload.details).replace('\n', '<br/>')

    return f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0a0a0a;padding:24px;color:#e4e4e7;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border:1px solid #27272a;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:22px 28px;border-bottom:1px solid #27272a;">
          <div style="font-size:11px;letter-spacing:3px;color:#ff1493;font-weight:700;text-transform:uppercase;">DevBroz · New enquiry</div>
          <div style="font-size:20px;color:#fff;font-weight:700;margin-top:6px;">{safe_name}</div>
          <div style="font-size:13px;color:#a1a1aa;">{safe_business}</div>
        </td></tr>
        <tr><td style="padding:22px 28px;">
          <div style="font-size:11px;letter-spacing:2px;color:#71717a;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Reply to</div>
          <a href="mailto:{safe_email}" style="font-size:15px;color:#ff69b4;text-decoration:none;font-weight:600;">{safe_email}</a>
        </td></tr>
        <tr><td style="padding:0 28px 24px;">
          <div style="font-size:11px;letter-spacing:2px;color:#71717a;font-weight:600;text-transform:uppercase;margin-bottom:10px;">Project details</div>
          <div style="font-size:14px;color:#d4d4d8;line-height:1.7;white-space:pre-wrap;">{safe_details}</div>
        </td></tr>
        <tr><td style="padding:14px 28px;border-top:1px solid #27272a;color:#52525b;font-size:11px;">
          Sent from the DevBroz website contact form.
        </td></tr>
      </table>
    </div>
    """


@api_router.post("/contact")
async def submit_contact(payload: ContactSubmission):
    # 1. Persist to MongoDB first as a fallback record (always runs).
    submission_id = str(uuid.uuid4())
    doc = {
        "id": submission_id,
        "name": payload.name,
        "business": payload.business or "",
        "email": payload.email,
        "details": payload.details,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "email_status": "pending",
        "email_error": None,
    }
    if db is not None:
        try:
            await db.contact_submissions.insert_one(doc.copy())
        except Exception as db_err:  # noqa: BLE001
            logger.error(f"Contact submission DB write failed: {db_err}")

    # 2. Fire-and-forward via Resend. Don't lose the submission if email fails.
    if not resend.api_key:
        if db is not None:
            await db.contact_submissions.update_one(
                {"id": submission_id},
                {"$set": {"email_status": "skipped", "email_error": "RESEND_API_KEY not set"}},
            )
        logger.warning("Resend API key missing — submission logged, email not sent.")
        return {"status": "logged", "id": submission_id}

    params = {
        "from": f"DevBroz Website <{SENDER_EMAIL}>",
        "to": [CONTACT_RECIPIENT],
        "reply_to": payload.email,
        "subject": f"New DevBroz enquiry — {payload.name}",
        "html": _build_email_html(payload),
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else None
        if db is not None:
            await db.contact_submissions.update_one(
                {"id": submission_id},
                {"$set": {"email_status": "sent", "email_id": email_id}},
            )
        return {"status": "sent", "id": submission_id}
    except Exception as e:  # noqa: BLE001
        logger.exception("Resend send failed")
        if db is not None:
            await db.contact_submissions.update_one(
                {"id": submission_id},
                {"$set": {"email_status": "failed", "email_error": str(e)[:500]}},
            )
        # Tell the frontend the enquiry was saved even if email didn't go out.
        raise HTTPException(
            status_code=502,
            detail="We couldn't send the notification email, but your enquiry was saved. Please email enquiry@devbroz.com directly.",
        )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client is not None:
        client.close()