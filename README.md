# DevBroz Landing Page

A modern, dark-mode-only landing page for DevBroz — a technology partner specializing in Data Engineering, AI/ML, Data Analytics, Business Automation, and Custom Software.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 (CRA + CRACO) |
| Styling | Tailwind CSS 3 + custom CSS |
| Animations | Framer Motion 12 |
| 3D/WebGL | Three.js (particle swarm), Cobe (globe) |
| Data Viz | D3.js (installed but globe now uses Cobe) |
| Icons | Lucide React |
| Routing | React Router v7 |
| Font | Outfit (Google Fonts CDN) |
| Backend | FastAPI (minimal, not used by landing page) |
| Database | MongoDB (available but not used yet) |

## Project Structure

```
/app/
├── frontend/
│   ├── public/
│   │   └── logo.png                    # DevBroz geometric logo
│   ├── src/
│   │   ├── App.js                      # Main app — routes & section composition
│   │   ├── App.css                     # Global animations (blob, marquee, gradients, glass)
│   │   ├── index.css                   # Tailwind + CSS variables (dark mode only)
│   │   ├── index.js                    # React entry point
│   │   ├── components/
│   │   │   ├── Navbar.js               # Floating pill navbar (glass effect)
│   │   │   ├── HeroSection.js          # Hero with particle swarm + marquee + Explore Now
│   │   │   ├── LivingFluidBlob.js      # Three.js particle swarm (10k particles, bloom)
│   │   │   ├── LivingFluidBlob.backup.js # Previous 3D blob (kept as backup)
│   │   │   ├── ExpertiseSection.js     # Slideshow carousel (5 services)
│   │   │   ├── HowWeWork.js            # 4-step process grid
│   │   │   ├── CaseStudies.js          # 5 project cards + click-to-expand modal
│   │   │   ├── AboutSection.js         # Company info + Cobe globe
│   │   │   ├── RotatingGlobe.js        # Cobe globe with arcs from India/Germany
│   │   │   ├── ContactSection.js       # Expandable button → contact form modal + dot grid
│   │   │   ├── ServicePage.js          # Placeholder pages for /service/:slug
│   │   │   └── Footer.js              # Footer with nav + social links
│   │   ├── components/ui/              # Shadcn UI components (pre-installed)
│   │   ├── hooks/
│   │   │   └── use-toast.js
│   │   └── lib/
│   │       └── utils.js                # cn() utility
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── craco.config.js
│   ├── package.json
│   └── .env                            # REACT_APP_BACKEND_URL
├── backend/
│   ├── server.py                       # FastAPI (minimal, /api/ routes)
│   ├── requirements.txt
│   └── .env                            # MONGO_URL, DB_NAME
├── context.md                          # Full chat context & decisions
└── memory/
    └── PRD.md                          # Product requirements doc
```

## Key Dependencies

```json
{
  "three": "^0.183.2",          // Particle swarm hero animation
  "cobe": "^2.0.1",             // Interactive globe in About section
  "framer-motion": "^12.38.0",  // All animations (modals, slides, entrances)
  "d3": "^7.9.0",               // Installed (was used for previous globe)
  "lucide-react": "^0.507.0",   // All icons
  "react-router-dom": "^7.5.1", // Routing (/ and /service/:slug)
  "tailwind-merge": "^3.2.0",   // Tailwind class merging
  "tailwindcss-animate": "^1.0.7" // Animation utilities
}
```

## Running Locally

```bash
# Frontend (port 3000)
cd frontend
yarn install --ignore-engines
yarn start

# Backend (port 8001) — optional, landing page doesn't use it
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

## Environment Variables

**Frontend** (`frontend/.env`):
```
REACT_APP_BACKEND_URL=https://your-domain.com
WDS_SOCKET_PORT=443
```

**Backend** (`backend/.env`):
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Full landing page with all sections |
| `/service/data-engineering` | `ServicePage` | Placeholder — Data Engineering |
| `/service/ai-ml` | `ServicePage` | Placeholder — AI & Machine Learning |
| `/service/data-analytics` | `ServicePage` | Placeholder — Data Analytics |
| `/service/business-automation` | `ServicePage` | Placeholder — Business Automation |
| `/service/custom-software` | `ServicePage` | Placeholder — Custom Software |

## Color System

```css
--background: #0a0a0a          /* Page background */
--surface: #121212              /* Card/section surfaces */
--primary: #ff1493              /* Deep pink — CTAs, accents, highlights */
--primary-light: #ff69b4        /* Light pink — hover states */
--secondary: #4b0082            /* Indigo — gradient endpoints */
--secondary-light: #8A2BE2      /* Violet — gradient midpoints */
--accent: #ff6b35               /* Warm orange — occasional accent */
--text-primary: #ffffff          /* White text */
--text-secondary: #a1a1aa       /* Zinc-400 — body text */
--border: rgba(255,255,255,0.1) /* Subtle borders */
```

## Component Details

### LivingFluidBlob.js (Particle Swarm)
- 10,000 instanced tetrahedron particles
- Three.js with EffectComposer + UnrealBloomPass
- Torus-knot formation with simplex noise
- Mouse-only rotation (no auto-rotation): `rotY = mx * 0.25`, `tilt = 0.3 + my * 0.15`
- Pink/violet colors: hue `0.83 ± 0.08`

### HeroSection.js (Marquee)
- JS `requestAnimationFrame` driven (NOT CSS animation)
- Normal speed: `0.5px/frame`, hover: lerps to `0.3` target speed
- No jump/glitch on hover — smooth deceleration via `speedRef.current += (target - current) * 0.05`

### ExpertiseSection.js (Slideshow)
- `AnimatePresence mode="wait"` for slide transitions
- Slide animation: x ±300px enter/exit, 0.4s ease-in-out
- Cards are borderless/seamless (no border, no bg)
- GIF: `https://customer-assets.emergentagent.com/job_devbroz-ui/artifacts/hor0437h_Untitled%20design.gif`

### CaseStudies.js (Modal)
- 5 cards, first spans 2 cols (`md:col-span-2 lg:col-span-2`)
- Modal: scale 0.9→1 open, 1→0.95 close (150ms), backdrop-blur-sm
- No layoutId morph (caused stretching) — pure scale+opacity

### ContactSection.js (Expandable Button + Dot Grid)
- Button uses `layoutId="contact-expand"` to morph into modal
- DotGrid: canvas at z-0, content at z-10, mouse tracked on modal container via `onMouseMove`
- Ripple on open: 2 rings (main 1400px/s + trail 1100px/s, 120ms delay), quadratic ease-out
- Gap: 14px, dot radius: 0.6px, glow radius: 100px

### RotatingGlobe.js (Cobe)
- `createGlobe` from cobe library
- Dark purple base `[0.15, 0.05, 0.2]`, pink markers `[1, 0.08, 0.58]`
- 11 arcs from India (Delhi) and Germany (Berlin) to global cities
- Auto-rotates at 0.003 rad/frame, draggable with momentum

## Assets

| Asset | Location | Description |
|-------|----------|-------------|
| Logo | `/public/logo.png` | Geometric 3D cube logo |
| Service GIF | External URL | Placeholder for expertise carousel |
| Case Study Images | Emergent CDN | AI-generated images for 3 case studies |
| About Office Image | Unsplash | REMOVED — replaced with globe |

## What Needs To Be Done

### Priority 1 (Immediate)
- [ ] Fill service dedicated pages with real content
- [ ] Wire up contact form to email backend (SendGrid/Resend)
- [ ] Connect social media links

### Priority 2 (Soon)
- [ ] Replace placeholder GIF with real service-specific visuals
- [ ] Add real company copy to About section
- [ ] SEO meta tags, OG images, sitemap
- [ ] Mobile responsiveness polish

### Priority 3 (Later)
- [ ] Blog/Insights section
- [ ] Testimonials section
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] Analytics integration
