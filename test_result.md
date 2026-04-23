#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================
# (protocol block preserved — see git history)
#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

user_problem_statement: |
  Continue work on DevBroz landing page (GitHub: dakshrachit11-sudo/DB-website).
  Session was cut by credit exhaustion after backend Resend email setup.
  Pending tasks:
    1. Wire up ContactSection form to backend /api/contact with Resend.
    2. Custom 404 Not Found page.
    3. SEO meta + OG tags in index.html.
    4. sitemap.xml and robots.txt.
    5. Verify social links are in place.

backend:
  - task: "POST /api/contact — Resend email + MongoDB persistence"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: true
        comment: "Restored RESEND_API_KEY, SENDER_EMAIL=onboarding@resend.dev, CONTACT_RECIPIENT=devbroz.info@gmail.com in backend/.env. Smoke test returned {\"status\":\"sent\"} — email delivered via Resend. Endpoint persists to MongoDB first, then sends email; returns 502 with friendly detail if Resend fails."

frontend:
  - task: "ContactSection form wired to POST /api/contact with loading/success/error states"
    implemented: true
    working: "NA"
    file: "frontend/src/components/ContactSection.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: "NA"
        comment: "Replaced stub handleSubmit with axios POST to ${REACT_APP_BACKEND_URL}/api/contact. Added submitting (Loader2 spinner), success (Check icon + thank-you message with user's first name + email), and error (AlertCircle + detail string) UI states. Inputs disabled while submitting. All existing data-testids preserved; added contact-form-success, contact-form-error, contact-form-close-success."

  - task: "Custom 404 NotFound page"
    implemented: true
    working: true
    file: "frontend/src/components/NotFound.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: true
        comment: "Created NotFound.js with gradient 404, 'This page is out of scope' headline, 'Take me home' + 'Email the team' CTAs. Wired catch-all <Route path='*'> in App.js. Verified via screenshot that /some-random-url renders the 404 page."

  - task: "SEO meta + OG + Twitter + JSON-LD in index.html"
    implemented: true
    working: true
    file: "frontend/public/index.html"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: true
        comment: "Replaced emergent-default title/description with DevBroz brand SEO: real title, description, keywords, canonical, theme-color=#0a0a0a, favicon=/logo.png, apple-touch-icon, OG + Twitter card meta, Organization JSON-LD with email + sameAs for IG/LinkedIn."

  - task: "robots.txt and sitemap.xml"
    implemented: true
    working: true
    file: "frontend/public/robots.txt, frontend/public/sitemap.xml"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: true
        comment: "Added robots.txt (Allow: / + Sitemap directive) and sitemap.xml with 7 URLs (home, 5 service pages, partners). Verified both served at /robots.txt and /sitemap.xml on localhost:3000."

  - task: "Social links in footer (IG, LinkedIn, email)"
    implemented: true
    working: true
    file: "frontend/src/components/Footer.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: true
    status_history:
      - agent: "main"
        working: true
        comment: "Footer already contained wired links: Instagram https://www.instagram.com/dev.broz/, LinkedIn https://www.linkedin.com/company/devbroz/, mailto:enquiry@devbroz.com. Confirmed real hrefs (not '#'). Per user confirmation, no Facebook/Twitter requested."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 3
  run_ui: true

test_plan:
  current_focus:
    - "ContactSection form wired to POST /api/contact with loading/success/error states"
    - "POST /api/contact — Resend email + MongoDB persistence"
    - "Custom 404 NotFound page"
    - "robots.txt and sitemap.xml"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Restored repo from GitHub, recreated .env files, installed deps (resend, email-validator, all yarn packages). Backend smoke-tested /api/contact — Resend delivered successfully to devbroz.info@gmail.com.
      Implemented all 4 pending tasks:
      1) ContactSection form now POSTs to /api/contact with full state machine (idle → submitting → success/error).
      2) NotFound.js + catch-all route. Visually verified.
      3) index.html replaced with real DevBroz SEO + OG + JSON-LD.
      4) robots.txt + sitemap.xml in /public, both served correctly.
      Social links in footer were already wired (IG: dev.broz, LinkedIn: company/devbroz, mailto:enquiry@devbroz.com).
      Please run end-to-end tests focusing on contact form submission flow (happy path + error path) and verify 404 route, SEO meta, and that all existing landing page sections still load.
