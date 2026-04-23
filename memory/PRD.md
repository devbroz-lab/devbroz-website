# DevBroz Landing Page — PRD

## Original Problem Statement
Continue DevBroz landing page build from prior chat (credit exhausted mid-session). Repo: github.com/dakshrachit11-sudo/DB-website. Pick up: wire contact form, 404, SEO, sitemap, robots, social links, and then replace placeholder expertise GIF with per-domain animated SVGs.

## User Personas
- **DevBroz team (Daksh)** — agency owner running the site.
- **Prospective clients** — businesses looking for Data / AI / Analytics / Automation / Custom Software partners.

## Core Requirements (Static)
- Dark-mode-only landing page (no theme toggle).
- Floating pill navbar, particle hero swarm, marquee of services.
- Our Expertise slideshow (5 services), How We Work, Case Studies (5 w/ modal), About (Cobe globe), Contact (expanding modal), Footer, Service pages, Partners page.
- Contact form posts to backend and emails the team.
- Custom 404, SEO meta/OG/JSON-LD, robots.txt, sitemap.xml.
- Real social links.
- Per-domain animated SVGs in the Expertise slideshow (no generic placeholder).

## Architecture
- **Frontend:** React 19 (CRA + CRACO), Tailwind 3, Framer Motion 12, Three.js (hero), Cobe (globe), Lucide icons, React Router v7, Axios.
- **Backend:** FastAPI + Motor (Mongo) + Resend SDK. Single `/api/contact` endpoint persists to Mongo + emails via Resend.
- **Infra:** Supervisor-managed pod; backend :8001, frontend :3000; FE talks to BE via `${REACT_APP_BACKEND_URL}/api`.
- **Env (`backend/.env`):** `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `RESEND_API_KEY`, `SENDER_EMAIL=onboarding@resend.dev`, `CONTACT_RECIPIENT=devbroz.info@gmail.com`.

## What's Been Implemented

### Prior sessions (already on GitHub)
Navbar, particle hero + marquee, Expertise slideshow, How We Work, Case Studies + modal, About + Cobe globe, Contact modal + DotGrid ripple, Partners page, Service pages with full copy.

### Session: Jan 22, 2026 (part 1 — pickup)
- [x] Restored repo from GitHub; recreated `.env` files.
- [x] Installed `resend`, `email-validator`; rebuilt yarn deps.
- [x] `POST /api/contact` verified end-to-end with live Resend — email delivered to `devbroz.info@gmail.com`.
- [x] ContactSection form wired with full state machine (idle → submitting → success/error).
- [x] `NotFound.js` custom 404 page + catch-all `<Route path="*">`.
- [x] SEO meta/OG/Twitter/JSON-LD + favicon in `index.html`.
- [x] `robots.txt` + `sitemap.xml` in `/public` (7 URLs).
- [x] Social links verified in footer (IG `dev.broz`, LinkedIn `company/devbroz`, `mailto:enquiry@devbroz.com`).
- [x] Latent bug fixed: `logger` moved above route handlers in `server.py`.
- [x] testing_agent_v3 iteration 1 → **100% pass** (9/9 backend, all frontend flows + regression).

### Session: Jan 22, 2026 (part 2 — per-domain SVGs)
- [x] Replaced placeholder GIF on **4 of 5** Expertise slides with brand-matched animated SVGs:
  - Data Engineering & Warehousing → data-flow pipeline animation
  - Data Analytics → live dashboard animation
  - Business Automation → workflow engine animation
  - Custom Software → IDE/dev environment animation
- [x] Switched slide image sizing from `object-cover` → `object-contain` with `bg-[#0e0e0e] border-white/[0.04]` so diagrams are fully visible and framed, not cropped.
- [ ] **AI & Machine Learning SVG** — still on placeholder GIF. User has described the asset ("tokens streaming into pulsing latent space") but not uploaded the SVG. Waiting on asset.


### Session: Jan 22, 2026 (part 3 — Logo loader, minimal final)
- [x] Iterated the boot loader three times based on feedback:
  1. Three.js particle swarm (user rejected — wanted logo instead).
  2. Logo spinning with orbital arcs + radar rings + 3-spin minimum (user rejected — too busy, not premium, logo too big, too long).
  3. **Final: restrained minimal** — small 56px logo centered on jet-black, subtle breathing glow + scale pulse, 96px hairline indeterminate sweep bar below it. Nothing else.
- [x] **Preload fix retained**: `<link rel="preload" as="image" href="/logo.png" fetchpriority="high" />` in `index.html`, so the logo paints fully from the first frame (no progressive tip-first rendering).
- [x] Timing: fades out immediately when the hero dispatches `devbroz:hero-ready`. No minimum spin count or minimum duration — loader stays only as long as the landing particles need to form. 8s safety fallback.
- [x] `prefers-reduced-motion` respected, body scroll locked, z-index 9999.
## Prioritized Backlog

### P0 (next)
- Verify `devbroz.com` in Resend whenever Daksh is ready (user has deferred this — sandbox stays for now; form currently emails `devbroz.info@gmail.com`).

### P1
- Rate-limit `/api/contact` against spam (5 per IP/hr).
- Fill in real About section copy + testimonials / client logos.
- Proper 1200×630 OG social preview image.

### P2
- Track contact form submissions via PostHog event (already loaded in `index.html`).
- Blog / Insights section.
- Unit test for `_build_email_html`.

## Next Tasks
1. User to review the new Expertise slideshow visuals and flag if any slide needs further tuning.
2. Pick up P0/P1 backlog (About copy, rate-limiting, OG social image).
g.
