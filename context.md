# DevBroz Landing Page — Context Document

## Overview
This is the complete development context for the DevBroz landing page website. This document captures all decisions, iterations, and current state from the full build conversation so any AI tool or developer can pick up exactly where we left off.

---

## Brand Identity
- **Company**: DevBroz — a technology partner offering Data Engineering, AI/ML, Data Analytics, Business Automation, and Custom Software services
- **Tagline**: "Your story, our code – together, we build digital legacies that last"
- **Logo**: Geometric 3D isometric cube/interlocking shape in gray tones on black (`/public/logo.png`)
- **Email**: devbroz.info@gmail.com
- **Social**: Instagram, LinkedIn, Facebook (links not connected yet)
- **Old website**: https://www.devbroz.com/

## Design Decisions
- **Dark mode ONLY** — no light/dark toggle, everything on `#0a0a0a` background
- **Color palette**: Pink `#ff1493`, Violet `#8A2BE2`, Indigo `#4b0082`, Warm `#ff6b35`, Surface `#121212`
- **Font**: Outfit (Google Fonts) — loaded via CDN in index.css
- **Design archetype**: Electric & Neon mixed with Swiss Brutalist
- **No emojis** — uses Lucide React icons throughout

## Source Material
- **Services & Portfolio PDF**: `ServicesPortfolioDevBroz.pdf` — contains all 5 service categories and 15+ case studies with outcomes
- **Wireframe PDF**: `Daksh.pdf` — hand-drawn wireframes for page layout
- **Original Next.js repo**: https://github.com/DakshSuryavanshi/devbroz-landing (reference only, not used directly)

---

## Section-by-Section Decisions

### 1. Hero Section (Landing)
- **3D Particle Swarm** behind the text — 10,000 tetrahedron particles forming a torus-knot pattern using raw Three.js with UnrealBloomPass post-processing
  - Pink/violet/indigo colors (hue 0.83 range)
  - Mouse movement rotates and tilts the structure (subtle, `0.25` and `0.15` multipliers)
  - NO auto-rotation — only moves with mouse
  - Previous blob animation backed up at `LivingFluidBlob.backup.js`
- **Headline**: Exact text "Your story, our code – together, we build digital legacies that last" — the word "together" has a gradient-text effect
- **"Technology Partner" overline and subtext REMOVED** — user explicitly asked to remove these
- **Services Carousel**: Infinite-scroll marquee of service names (Workflow Automations, AI Services, ML Models, Analytics, Web Development, Software Development, Data Engineering, IT Services)
  - JS-driven `requestAnimationFrame` marquee (NOT CSS animation) to avoid glitch on hover
  - On hover: smoothly decelerates to 30% speed via lerp (does NOT stop or jump)
  - Subtle transparent fade on edges (`#0a0a0a/40`, `w-12`) — user was very particular about no visible dark boxes
- **"Explore Now" button**: Scrolls to `#services` section using `window.scrollTo({ top: el.offsetTop })`
- **Navbar**: Floating pill-shaped, centered at top, rounded-full, dark glass effect (`bg-[#1a1a1a]/70 backdrop-blur-lg`). Inspired by createxp.com reference
  - Links: Home, About, Work, Services + "Get in Touch" CTA
  - Mobile: hamburger menu with dropdown

### 2. Our Expertise Section
- **Slideshow carousel** — NOT a grid. One card visible at a time
- Each card: GIF on left (`Untitled design.gif` from user), written content on right (title, description, 4 bullet points, "Learn More" button)
- Sleek prev/next arrows on left and right sides
- Dot pagination below + slide counter (01/05)
- "Learn More" links to `/service/:slug` (dedicated pages with placeholder content)
- **Cards are seamless/borderless** — no border, no bg color, just floating content on the dark background
- 5 services: Data Engineering & Warehousing, AI & Machine Learning, Data Analytics, Business Automation, Custom Software

### 3. How We Work Section
- 4 process cards in a 2x2 grid
- Business-First Thinking, Dedicated Project Manager, Transparent Pricing, Startup Speed Agency Quality
- Each card has a large faded step number (01-04), icon, title, description

### 4. Case Studies Section
- **5 cards** (NOT 6 — user explicitly asked to remove the 6th "Logistics Client Portal" for symmetry)
- **Non-uniform layout**: First card spans 2 columns (wider for emphasis) but same row height, remaining 4 in standard grid
- Cards are clickable — open a **modal** with full case study details
- **Modal animation**: Scale + fade (150ms) — NOT layoutId morph (caused stretching on close)
- Modal has **backdrop blur** (`backdrop-blur-sm`) and takes **75vh height, max-w-4xl**
- Case studies: AI Property Assistant (80% automated), D2C Live Dashboard (4hrs saved/week), E-Commerce Rebuild (+44% conversion), Churn Prediction Model (89% accuracy), B2B Website Redesign (+55% enquiries)

### 5. About Us Section
- Left: Content text + stats (50+ Projects Delivered, 5+ Industries Served)
- **"98% Client Satisfaction" REMOVED** — user explicitly asked to remove this
- Right: **Cobe globe** (NOT d3 wireframe — user rejected that, said "not looking good")
  - Dark purple base, pink markers, purple glow
  - **11 pink arcs** emerging from India (Delhi) and Germany (Berlin) to worldwide destinations (NYC, London, Dubai, Tokyo, Singapore, Sydney, SF, Sao Paulo, Paris)
  - No callout labels — just lines and dot markers
  - Auto-rotates, draggable with momentum

### 6. Contact Section
- "Turn Ideas into Innovation" heading
- **"Get in Touch" button expands into a modal** using framer-motion `layoutId` animation (button pill morphs into the modal card)
- Modal has **interactive dot grid** (canvas-based) covering the entire modal behind all content
  - Tiny dots (0.6px radius, 14px gap, 8% opacity)
  - Mouse proximity causes dots to glow pink/violet (tracked via `onMouseMove` on modal container, coords passed to canvas via ref)
  - **Ripple effect on open**: Two ripples burst from center — main (1400 px/s, 50px band) + trailing (1100 px/s, 35px band, 120ms delay). Both use quadratic ease-out (fast center, slow edges)
- Left panel: "Turn Ideas Into Innovation" heading
- Right panel: Contact form (Name, Business, Email, Project Details, Submit)
- Body scroll locked when modal is open

### 7. Footer
- Logo + "DevBroz" branding
- Navigation links (Home, About, Work, Services, Contact)
- Social links (Instagram, LinkedIn, Facebook, email) — not connected yet
- Gradient line separator
- Copyright 2026

---

## Key Technical Decisions

### Scrolling
- `scroll-behavior: smooth` on html
- All nav scroll uses `window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })` — NOT `scrollIntoView` (that had issues)
- Snap scrolling was tried (`scroll-snap-type: y proximity`) but REMOVED — it was locking users on the hero section

### Routing
- React Router v7 with two routes: `/` (landing page) and `/service/:slug` (service pages)
- Service slugs: `data-engineering`, `ai-ml`, `data-analytics`, `business-automation`, `custom-software`

### Performance
- Particle count reduced from 15k to 10k for low-end laptop performance
- Cobe globe uses `devicePixelRatio` capped at 2
- Images lazy-loaded by browser defaults

---

## User Preferences & Style Notes
- Prefers **sleek and classy** over flashy
- Wants things to feel **not like a card** — seamless, floating content
- Modal animations should be **fast** — user repeatedly asked to speed things up
- Carousel should **never stop** on hover — just slow down
- Very particular about **no visible dark boxes/artifacts** — especially on carousel edges
- Prefers **non-uniform layouts** for visual hierarchy (e.g., first case study card bigger)
- Likes interactive elements: draggable globe, mouse-reactive particles, glowing dot grids

---

## What's NOT Done Yet
1. **Service dedicated pages** — currently placeholder "coming soon" pages
2. **Contact form backend** — form submits but no email integration (needs SendGrid/Resend)
3. **Social media links** — Instagram, LinkedIn, Facebook hrefs are `#`
4. **About section real content** — paragraphs are generic, need real company copy
5. **Real GIFs/videos** for expertise carousel — currently uses one placeholder GIF for all slides
6. **SEO** — no meta tags, OG images, sitemap
7. **Mobile polish** — works but could use more refinement
8. **Blog/Insights section** — mentioned in wireframe but not built
9. **Testimonials section** — mentioned in wireframe but not built
