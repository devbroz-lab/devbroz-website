import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Check, CheckCircle2, ShieldCheck, Globe,
  MapPin, Briefcase, Building2, Users, Clock, TrendingUp, Search, Upload,
  ChevronDown, BadgeCheck, Landmark, Lock, Linkedin, Mail, IndianRupee,
  Sparkles, Target, AlertCircle, Loader2,
} from "lucide-react";
import RouteTransition from "@/components/RouteTransition";
import { submitCareersApplication } from "@/lib/submitCareersApplication";

// ── TOKENS ───────────────────────────────────────
const BG = "#FCFCFD", PAPER = "#FFFFFF", SURFACE = "#F4F5F8";
const BORDER = "#E4E6EC", BORDER_2 = "#D3D6DE";
const INK = "#14161C", BODY = "#3F434D", MUTE = "#6B7080", FAINT = "#9AA0AC";
const PRIMARY = "#2F45D6", PRIMARY_DK = "#1E2E9E", PRIMARY_BG = "#EEF0FD";
const TRUST = "#0E8F63", TRUST_BG = "#E7F5EE";
const DISPLAY = "'Fraunces', Georgia, serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const inputStyle = { width: "100%", background: PAPER, border: `1px solid ${BORDER_2}`, borderRadius: 8, padding: "11px 14px", color: INK, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: SANS };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 500, color: BODY, marginBottom: 6, fontFamily: SANS };

// ── DATA (aligned with Supabase schema — 5 shortlisted roles) ────
const ROLES = [
  { id: "backend", slug: "backend", title: "Senior Backend / Full-Stack Developer", domain: "Engineering", skills: ["Java", "Spring Boot", "Python", "Django/FastAPI", "React", "PostgreSQL"], experience: "4–9 years", salary: "₹54–81 LPA", desc: "Design and build scalable backend services and full-stack applications for European clients. You'll own production systems end-to-end — APIs, data layer, and frontend — embedded directly in the client's engineering team.", count: 5 },
  { id: "dataeng", slug: "dataeng", title: "Data Engineer", domain: "AI & Data", skills: ["Python", "SQL", "Spark", "Airflow", "dbt", "Snowflake"], experience: "3–8 years", salary: "₹54–94 LPA", desc: "Build the data foundations European companies make decisions on. Design ETL/ELT pipelines, warehouse architectures, and real-time streaming systems at enterprise scale.", count: 4 },
  { id: "aiml", slug: "aiml", title: "AI / ML Engineer", domain: "AI & Data", skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "LLMs", "Docker"], experience: "3–9 years", salary: "₹63–108 LPA", desc: "Build and deploy production machine learning systems for European clients — from classical ML to LLM-powered applications. Real production AI, not research prototypes.", count: 3 },
  { id: "pm", slug: "pm", title: "IT Project Manager (Agile / Scrum)", domain: "Business", skills: ["Scrum", "Jira", "Confluence", "Stakeholder Management", "Risk Management", "Reporting"], experience: "4–10 years", salary: "₹54–81 LPA", desc: "Own delivery for European client engagements — running agile teams, managing scope and risk, and keeping stakeholders aligned and informed across time zones.", count: 3 },
  { id: "bi", slug: "bi", title: "Business Intelligence / Data Analyst", domain: "Business", skills: ["SQL", "Power BI", "Tableau", "Data Modeling", "Python", "Stakeholder Reporting"], experience: "2–8 years", salary: "₹45–74 LPA", desc: "Turn raw data into decisions for European clients — building dashboards, reports, and analysis that business stakeholders act on directly.", count: 3 },
];
const DOMAINS = ["All", "Engineering", "AI & Data", "Business"];
const EXP_OPTIONS = ["0–2 years", "2–4 years", "4–6 years", "6–8 years", "8–10 years", "10+ years"];
const NOTICE_OPTIONS = [
  { label: "Immediate / serving notice", value: "immediate" },
  { label: "15 days", value: "15_days" },
  { label: "30 days", value: "30_days" },
  { label: "60 days", value: "60_days" },
  { label: "90+ days", value: "90_plus_days" },
];
const ENGLISH_OPTIONS = [
  { label: "5 — Fluent, client-facing ready", value: "5" },
  { label: "4 — Very comfortable, minor gaps", value: "4" },
  { label: "3 — Working proficiency", value: "3" },
  { label: "2 — Basic, needs support", value: "2" },
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  linkedinUrl: "",
  currentEmployer: "",
  totalExperienceYrs: "",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "",
  englishRating: "",
  skills: "",
  pitch: "",
};

function resolveRoleSlug(selectedRole, experienceBand) {
  if (selectedRole?.slug) return selectedRole.slug;
  const matches = matchRoles(experienceBand);
  if (matches.length === 0) {
    throw new Error("No open roles match your experience level. Please browse our open roles and apply to a specific position.");
  }
  return matches[0].slug;
}

function validateStep1(form, resumeFile) {
  const missing = [];
  if (!form.fullName.trim()) missing.push("full name");
  if (!form.email.trim()) missing.push("email");
  if (!form.phone.trim()) missing.push("phone");
  if (!form.city.trim()) missing.push("city");
  if (!form.linkedinUrl.trim()) missing.push("LinkedIn URL");
  if (!form.currentEmployer.trim()) missing.push("current employer");
  if (form.totalExperienceYrs === "" || Number.isNaN(Number(form.totalExperienceYrs))) missing.push("years of experience");
  if (!resumeFile) missing.push("resume (PDF)");
  if (missing.length) return `Please fill in: ${missing.join(", ")}.`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address.";
  return null;
}

function validateStep2(form, consent) {
  const missing = [];
  if (!form.currentCtc.trim()) missing.push("current CTC");
  if (!form.expectedCtc.trim()) missing.push("expected CTC");
  if (!form.noticePeriod) missing.push("notice period");
  if (!form.englishRating) missing.push("English proficiency");
  if (!form.skills.trim()) missing.push("skills");
  if (!form.pitch.trim()) missing.push("relevant project or achievement");
  if (missing.length) return `Please fill in: ${missing.join(", ")}.`;
  if (!consent) return "Please confirm consent before submitting.";
  return null;
}

const STEPS = [
  { n: 1, title: "Apply with your profile", desc: "Share your skills, experience, and expectations. Under five minutes. No interview yet — you're joining the network, not sitting an exam." },
  { n: 2, title: "We match you to a client", desc: "When a European company needs your exact skill set, we pull your profile and reach out. You'll always know the company and role before anything moves forward." },
  { n: 3, title: "Interview and get selected", desc: "One or two rounds with the client team. If selected, DevBroz makes you a written full-time offer — salary, benefits, and terms, all on paper before you decide." },
  { n: 4, title: "Start working, from India", desc: "You join the client's team remotely. DevBroz handles payroll, equipment, and everything operational. You focus on the work." },
];
const BENEFITS = [
  { icon: ShieldCheck, title: "Full-time employment", desc: "Full time employment — not a contract, not a gig." },
  { icon: Globe, title: "European clients, Indian base", desc: "Work with companies in Germany, the Netherlands, and across the EU — from home, anywhere in India." },
  { icon: TrendingUp, title: "A resume that compounds", desc: "International project experience and EU-standard ways of working. Work that opens doors for the rest of your career." },
  { icon: Clock, title: "Humane hours", desc: "A few hours of overlap with Central European Time. No graveyard shifts, no always-on expectations." },
  { icon: Users, title: "A team, not a bench", desc: "You're managed, supported, and kept engaged between and during projects. We invest in your growth because our model depends on it." },
  { icon: BadgeCheck, title: "A process that respects you", desc: "No eight-round gauntlets, no ghosting. When there's a match, we move fast — and you hear from us either way." },
];
const FAQS = [
  { q: "Am I applying for a job at DevBroz?", a: "You're joining a curated talent network. When a European client needs your skills, we hire you as a full-time DevBroz employee and you begin working with that client's team. Until then, you're in the pool with no obligation on either side — stay in your current job as long as you like." },
  { q: "Do I need a visa or work permit?", a: "No. You work entirely from India. The European client engages DevBroz as a service provider, so the contractual relationship is between companies — not between you and any EU government. You get international experience without relocation." },
  { q: "How is this different from freelancing?", a: "Completely. You're a full-time employee with a monthly salary under Indian labour law. DevBroz is your employer — not a marketplace passing through gig payments." },
  { q: "Does DevBroz charge candidates any fees?", a: "No. We are your employer — employers pay you, not the other way around. There are no charges for registration, training, placement, or anything else at any stage. If anyone using the DevBroz or GTC name asks you for payment, it is fraud — please report it to careers@devbroz.com." },
  { q: "What salary can I expect?", a: "Competitive Indian market salaries, benchmarked to your experience and skills. Every role on this site lists an honest range up front. When we make an offer, the number and all terms are in writing before you commit." },
  { q: "What happens if a client engagement ends?", a: "We work to redeploy you to another client quickly, and you remain a DevBroz employee throughout. Most engagements run a year or more, and keeping you working is directly in our interest too." },
  { q: "What timezone will I work in?", a: "Typically a 3–5 hour overlap with Central European Time — roughly 1 PM to 6 PM IST. The exact schedule depends on the client, but you won't be working nights." },
  { q: "How long until I hear back?", a: "We review new profiles every week. If there's a match with an active requirement, we reach out within days. If not, your profile stays active in the pool and we contact you the moment a fit appears — and we'll send you a status note either way within two weeks." },
  { q: "Who is GTC and what's their role?", a: "GreenTech Consulting GmbH (GTC) is our Germany-based partner and the European entity clients contract with. GTC's own consulting roots are in sustainability, and the DevBroz × GTC talent business is a separate commercial arm of that partnership — it brings the European client relationships, local presence, and compliance, while DevBroz employs and supports you. You deal only with DevBroz throughout." },
];
// ── HELPERS ──────────────────────────────────────
function parseBand(str) {
  const nums = (str.match(/\d+/g) || []).map(Number);
  if (str.includes("+")) return [nums[0] || 0, 99];
  return [nums[0] || 0, nums[1] != null ? nums[1] : (nums[0] || 0)];
}
function expOverlap(roleBand, sel) {
  if (!sel) return true;
  const r = parseBand(roleBand), s = parseBand(sel);
  return s[0] <= r[1] && r[0] <= s[1];
}
function matchRoles(experience) {
  return ROLES.filter((r) => expOverlap(r.experience, experience));
}

// ── PRIMITIVES ───────────────────────────────────
const Container = ({ children, style }) => <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>;
const Eyebrow = ({ children, color = PRIMARY }) => <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: 14, fontFamily: SANS }}>{children}</p>;
const H2 = ({ children, style }) => <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 3.6vw, 40px)", fontWeight: 500, color: INK, letterSpacing: "-0.01em", lineHeight: 1.12, margin: 0, ...style }}>{children}</h2>;
const Lead = ({ children, style }) => <p style={{ fontSize: 17, color: MUTE, lineHeight: 1.65, maxWidth: 560, fontFamily: SANS, ...style }}>{children}</p>;
const VerifyChip = ({ children }) => <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 500, color: TRUST, background: TRUST_BG, borderRadius: 100, padding: "5px 12px", fontFamily: SANS }}><Check size={13} strokeWidth={3} /> {children}</span>;
const PrimaryBtn = ({ children, onClick, full }) => <button onClick={onClick} className="btn-primary" style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "14px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SANS, width: full ? "100%" : "auto" }}>{children}</button>;
const GhostBtn = ({ children, onClick, full }) => <button onClick={onClick} className="btn-ghost" style={{ background: "transparent", color: INK, border: `1px solid ${BORDER_2}`, borderRadius: 8, padding: "14px 26px", fontSize: 15, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: SANS, width: full ? "100%" : "auto" }}>{children}</button>;
const TextLink = ({ children, onClick }) => <button onClick={onClick} className="text-link" style={{ background: "none", border: "none", color: PRIMARY, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SANS, padding: 0 }}>{children}</button>;

// ── NAV ──────────────────────────────────────────
function Nav({ page, go, apply, onBackToMain }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "Overview" },
    { id: "roles", label: "Open roles" },
    { id: "partnership", label: "Partnership" },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 60, background: `${BG}f2`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${BORDER}` }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBackToMain} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: `1px solid ${BORDER_2}`, borderRadius: 100, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 500, color: MUTE, fontFamily: SANS }} aria-label="Back to DevBroz">
            <ArrowLeft size={13} /> DevBroz
          </button>
          <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, color: INK }}>DevBroz</span>
            <span style={{ fontSize: 10.5, color: PRIMARY, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", background: PRIMARY_BG, borderRadius: 5, fontFamily: SANS }}>Careers</span>
          </button>
        </div>
        <div className="nav-desktop" style={{ alignItems: "center", gap: 28 }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} style={{ background: "none", border: "none", color: page === l.id ? INK : MUTE, fontWeight: page === l.id ? 600 : 500, fontSize: 14, cursor: "pointer", fontFamily: SANS }}>{l.label}</button>
          ))}
          <PrimaryBtn onClick={() => apply(null)}>Apply now</PrimaryBtn>
        </div>
        <button className="nav-burger" onClick={() => setOpen(!open)} style={{ background: "none", border: `1px solid ${BORDER_2}`, borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: INK, fontSize: 13, fontWeight: 600, fontFamily: SANS }}>Menu</button>
      </Container>
      {open && (
        <div className="nav-mobile" style={{ borderTop: `1px solid ${BORDER}`, background: BG, padding: "8px 0" }}>
          <Container style={{ display: "flex", flexDirection: "column" }}>
            {links.map((l) => <button key={l.id} onClick={() => { go(l.id); setOpen(false); }} style={{ background: "none", border: "none", textAlign: "left", padding: "12px 0", color: INK, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: SANS, borderBottom: `1px solid ${BORDER}` }}>{l.label}</button>)}
            <div style={{ padding: "14px 0" }}><PrimaryBtn full onClick={() => { apply(null); setOpen(false); }}>Apply now</PrimaryBtn></div>
          </Container>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────
function Hero({ go, apply }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${BORDER}`, background: PAPER }}>
      <div style={{ position: "absolute", top: -240, right: -160, width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${PRIMARY_BG}, transparent 68%)`, pointerEvents: "none" }} />
      <Container style={{ padding: "104px 24px 88px", position: "relative" }}>
        <Eyebrow>DevBroz Global Careers · in partnership with GTC</Eyebrow>
        <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(38px, 5.4vw, 60px)", fontWeight: 500, color: INK, lineHeight: 1.06, letterSpacing: "-0.02em", maxWidth: 760, margin: "0 0 22px" }}>
          Your skills, hired by Europe.<br /><span style={{ color: PRIMARY }}>Employed by us.</span>
        </h1>
        <Lead style={{ fontSize: 19, maxWidth: 580, marginBottom: 30 }}>
          Join DevBroz as a full-time employee and work remotely from India for companies across Germany and the EU. Real salary, real benefits, real careers — from a company you can actually verify.
        </Lead>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <PrimaryBtn onClick={() => apply(null)}>Apply in 5 minutes <ArrowRight size={16} /></PrimaryBtn>
          <GhostBtn onClick={() => go("roles")}>Browse open roles</GhostBtn>
        </div>
        <p style={{ fontSize: 13, color: FAINT, marginBottom: 30, fontFamily: SANS }}>
          Know your field already? Apply straight away — you can pick or skip a specific role.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <VerifyChip>Registered Indian company</VerifyChip>
          <VerifyChip>Zero candidate fees</VerifyChip>
          <VerifyChip>Real EU clients via GTC</VerifyChip>
          <VerifyChip>Written offers before you resign</VerifyChip>
        </div>
      </Container>
    </div>
  );
}

// ── MODEL ────────────────────────────────────────
function Model() {
  const yours = ["Full-time employee of DevBroz", "Industry-best salary", "Work from home, anywhere in India", "Managed and supported by DevBroz"];
  const client = ["A European company, usually in Germany", "Engages DevBroz as a service partner", "You join their team as a specialist", "Daily collaboration with their people"];
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
      <Container style={{ padding: "80px 24px" }}>
        <Eyebrow>How the arrangement works</Eyebrow>
        <H2 style={{ marginBottom: 14 }}>International work. Indian employment.</H2>
        <Lead style={{ marginBottom: 44 }}>The single question every candidate asks: who actually employs me? Here's the honest answer, side by side.</Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 30 }}>
            <p style={{ fontSize: 12, color: TRUST, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SANS }}>Your side</p>
            {yours.map((t, i) => <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 15 }}><CheckCircle2 size={17} color={TRUST} style={{ marginTop: 1, flexShrink: 0 }} /><p style={{ fontSize: 14.5, color: INK, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>{t}</p></div>)}
          </div>
          <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 30 }}>
            <p style={{ fontSize: 12, color: MUTE, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SANS }}>The client's side</p>
            {client.map((t, i) => <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 15 }}><div style={{ width: 17, height: 17, borderRadius: "50%", border: `1.5px solid ${FAINT}`, marginTop: 1, flexShrink: 0 }} /><p style={{ fontSize: 14.5, color: BODY, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>{t}</p></div>)}
          </div>
        </div>
        <p style={{ fontSize: 14, color: MUTE, lineHeight: 1.6, marginTop: 20, maxWidth: 620, fontFamily: SANS }}>You are never a freelancer, never a contractor, never on your own. DevBroz is your employer from your first day. The European client is simply where the work happens.</p>
      </Container>
    </div>
  );
}

// ── GTC ──────────────────────────────────────────
function GTCSection() {
  const pillars = [
    { icon: Landmark, title: "The contracting entity", desc: "European clients sign with GreenTech Consulting GmbH — a German company, under German law. The commercial relationship sits in Europe, exactly where clients expect it." },
    { icon: MapPin, title: "On the ground in Europe", desc: "Based in Wuppertal, Germany, GTC is our physical European presence — handling local relationships, contracts, and compliance. Nothing about this arrangement is offshore or opaque." },
    { icon: Building2, title: "The door to EU clients", desc: "GTC's established network across Germany and the EU is how European organisations discover DevBroz talent. They bring the demand; we bring the people." },
  ];
  return (
    <div id="gtc-anchor" style={{ borderBottom: `1px solid ${BORDER}`, background: PAPER }}>
      <Container style={{ padding: "80px 24px" }}>
        <Eyebrow>Our European partner</Eyebrow>
        <H2 style={{ marginBottom: 14, maxWidth: 660 }}>GreenTech Consulting GmbH — the European half of the partnership</H2>
        <Lead style={{ marginBottom: 10 }}>DevBroz brings the talent and delivery from India. GreenTech Consulting GmbH (GTC) brings the European entity, the client relationships, and the local trust. Two companies, each supplying what the other can't.</Lead>
        <a href="https://www.greentech-consulting.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: PRIMARY, fontWeight: 600, textDecoration: "none", fontFamily: SANS, marginBottom: 40 }}>Visit greentech-consulting.com <ArrowUpRight size={14} /></a>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: BORDER, borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
          {pillars.map((p, i) => <div key={i} style={{ background: PAPER, padding: 28 }}><div style={{ width: 40, height: 40, borderRadius: 9, background: PRIMARY_BG, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><p.icon size={18} color={PRIMARY} /></div><h3 style={{ fontSize: 15.5, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: SANS }}>{p.title}</h3><p style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{p.desc}</p></div>)}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 22px", maxWidth: 780 }}>
          <Sparkles size={17} color={TRUST} style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: BODY, lineHeight: 1.6, margin: 0, fontFamily: SANS }}><strong style={{ color: INK }}>An honest note:</strong> GreenTech Consulting GmbH's consulting roots are in sustainability and international development. The DevBroz × GTC talent business is a separate commercial arm of that partnership — connecting European organisations with skilled professionals across technology, data, enterprise, and business functions. Some of that work supports sustainability and impact-driven projects; much of it goes well beyond.</p>
        </div>
      </Container>
    </div>
  );
}

// ── CANDIDATE SAFETY NOTE ────────────────────────
function CandidateSafety() {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
      <Container style={{ padding: "44px 24px" }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: TRUST_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShieldCheck size={20} color={TRUST} /></div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 14.5, color: BODY, lineHeight: 1.65, margin: 0, maxWidth: 680, fontFamily: SANS }}>DevBroz is your employer — we pay you, not the other way around. There are no fees at any stage of this process. If anyone claiming to represent DevBroz or GTC asks you for payment, please let us know at <strong style={{ color: TRUST }}>careers@devbroz.com</strong>.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ── HOW IT WORKS ─────────────────────────────────
function HowItWorks() {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: PAPER }}>
      <Container style={{ padding: "80px 24px" }}>
        <Eyebrow>How it works</Eyebrow>
        <H2 style={{ marginBottom: 14 }}>Four steps, no black holes</H2>
        <Lead style={{ marginBottom: 44 }}>No months of silence, no vanishing after you apply. Here's exactly what happens — including our promise to respond either way.</Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 1, background: BORDER, borderRadius: 14, overflow: "hidden" }}>
          {STEPS.map((s) => <div key={s.n} style={{ background: PAPER, padding: 28 }}><div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 500, color: PRIMARY, lineHeight: 1, marginBottom: 16 }}>{String(s.n).padStart(2, "0")}</div><h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: SANS }}>{s.title}</h3><p style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{s.desc}</p></div>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, background: PRIMARY_BG, borderRadius: 10, padding: "16px 20px" }}>
          <Clock size={18} color={PRIMARY} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: INK, margin: 0, fontFamily: SANS, lineHeight: 1.5 }}><strong>Our response promise:</strong> we review new profiles weekly and send you a status update within two weeks — a match, a "not yet," or a clear next step. Never silence.</p>
        </div>
      </Container>
    </div>
  );
}

// ── BENEFITS ─────────────────────────────────────
function Benefits() {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: PAPER }}>
      <Container style={{ padding: "80px 24px" }}>
        <Eyebrow>What you get</Eyebrow>
        <H2 style={{ marginBottom: 44 }}>The full picture</H2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 1, background: BORDER, borderRadius: 14, overflow: "hidden" }}>
          {BENEFITS.map((b, i) => <div key={i} style={{ background: PAPER, padding: 28 }}><b.icon size={20} color={PRIMARY} style={{ marginBottom: 14 }} /><h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 8, fontFamily: SANS }}>{b.title}</h3><p style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>{b.desc}</p></div>)}
        </div>
      </Container>
    </div>
  );
}

// ── ROLE CARD ────────────────────────────────────
function RoleCard({ role, onClick }) {
  return (
    <button onClick={onClick} className="role-card" style={{ display: "block", width: "100%", textAlign: "left", background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, cursor: "pointer", fontFamily: SANS }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div><p style={{ fontSize: 11, color: PRIMARY, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{role.domain}</p><h3 style={{ fontSize: 18, fontWeight: 600, color: INK, margin: 0, fontFamily: SANS }}>{role.title}</h3></div>
        <ArrowUpRight size={18} color={FAINT} />
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: TRUST, background: TRUST_BG, borderRadius: 6, padding: "4px 10px", marginBottom: 14 }}><IndianRupee size={13} /> {role.salary}</div>
      <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, marginBottom: 16 }}>{role.desc.slice(0, 104)}…</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>{role.skills.slice(0, 4).map((s) => <span key={s} style={{ fontSize: 12, color: BODY, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px" }}>{s}</span>)}</div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: FAINT }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Briefcase size={12} /> {role.experience}</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> Remote — India</span><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {role.count} open</span></div>
    </button>
  );
}

// ── ROLE PREVIEW ─────────────────────────────────
function RolePreview({ go, pick }) {
  const preview = ROLES.slice(0, 4);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: PAPER }}>
      <Container style={{ padding: "80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div><Eyebrow>Open roles</Eyebrow><H2>Where we're hiring now</H2></div>
          <GhostBtn onClick={() => go("roles")}>View all roles <ArrowRight size={14} /></GhostBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>{preview.map((r) => <RoleCard key={r.id} role={r} onClick={() => pick(r)} />)}</div>
      </Container>
    </div>
  );
}

// ── MINI FAQ ─────────────────────────────────────
function MiniFAQ({ go }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG }}>
      <Container style={{ padding: "80px 24px" }}>
        <Eyebrow>Straight answers</Eyebrow>
        <H2 style={{ marginBottom: 40 }}>What candidates want to know</H2>
        <div style={{ maxWidth: 760 }}>
          {FAQS.slice(0, 4).map((f, i) => <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}><button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", cursor: "pointer", textAlign: "left", gap: 16, fontFamily: SANS }}><span style={{ fontSize: 15.5, fontWeight: 500, color: open === i ? INK : BODY, lineHeight: 1.4 }}>{f.q}</span><ChevronDown size={18} color={FAINT} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} /></button>{open === i && <p style={{ fontSize: 14.5, color: MUTE, lineHeight: 1.7, paddingBottom: 20, margin: 0, fontFamily: SANS }}>{f.a}</p>}</div>)}
        </div>
        <div style={{ marginTop: 24 }}><TextLink onClick={() => go("faq")}>Read all questions <ArrowRight size={14} /></TextLink></div>
      </Container>
    </div>
  );
}

// ── FINAL CTA ────────────────────────────────────
function FinalCTA({ go, apply }) {
  return (
    <div style={{ background: PAPER, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -160, left: "50%", transform: "translateX(-50%)", width: 760, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${PRIMARY_BG}, transparent 70%)`, pointerEvents: "none" }} />
      <Container style={{ textAlign: "center", padding: "96px 24px", position: "relative" }}>
        <Sparkles size={26} color={PRIMARY} style={{ marginBottom: 18 }} />
        <H2 style={{ marginBottom: 16 }}>Ready to work with Europe?</H2>
        <p style={{ color: MUTE, fontSize: 16, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.6, fontFamily: SANS }}>Five minutes to apply. No commitment until we find the right match — and no silence while we look.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <PrimaryBtn onClick={() => apply(null)}>Apply in 5 minutes <ArrowRight size={18} /></PrimaryBtn>
          <TextLink onClick={() => go("roles")}>or browse open roles</TextLink>
        </div>
      </Container>
    </div>
  );
}

// ── APPLY FLOW (aligned with Supabase schema) ────
function MatchPreview({ experience, role }) {
  const matches = matchRoles(experience).filter((r) => !role || r.id !== role.id);
  const idle = !experience;
  return (
    <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Target size={16} color={PRIMARY} />
        <span style={{ fontSize: 12, fontWeight: 600, color: MUTE, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: SANS }}>Your live matches</span>
      </div>
      {idle ? (
        <p style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>Tell us your experience level — we'll show the open roles you fit, in real time.</p>
      ) : matches.length === 0 ? (
        <p style={{ fontSize: 13.5, color: MUTE, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>No exact openings right now — but your profile stays active, and we'll reach out the moment a fit appears.</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span key={matches.length} className="count-pop" style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 500, color: PRIMARY, lineHeight: 1 }}>{matches.length}</span>
            <span style={{ fontSize: 14, color: BODY, fontFamily: SANS }}>{role ? "other roles also fit you" : matches.length === 1 ? "open role fits your profile" : "open roles fit your profile"}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {matches.slice(0, 3).map((m) => <span key={m.id} style={{ fontSize: 12, color: PRIMARY, background: PRIMARY_BG, borderRadius: 6, padding: "4px 10px", fontFamily: SANS, fontWeight: 500 }}>{m.title}</span>)}
            {matches.length > 3 && <span style={{ fontSize: 12, color: MUTE, padding: "4px 4px", fontFamily: SANS }}>+{matches.length - 3} more</span>}
          </div>
        </>
      )}
    </div>
  );
}

function ApplyFlow({ role, go, apply }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState("");
  const [experience, setExperience] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError("");
  };

  const handleExperienceChange = (e) => {
    const v = parseFloat(e.target.value);
    setForm((prev) => ({ ...prev, totalExperienceYrs: e.target.value }));
    if (Number.isNaN(v)) {
      setExperience("");
    } else if (v <= 2) setExperience("0–2 years");
    else if (v <= 4) setExperience("2–4 years");
    else if (v <= 6) setExperience("4–6 years");
    else if (v <= 8) setExperience("6–8 years");
    else if (v <= 10) setExperience("8–10 years");
    else setExperience("10+ years");
    setError("");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Resume must be a PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
    setError("");
  };

  const handleContinue = () => {
    const validationError = validateStep1(form, resumeFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    const validationError = validateStep2(form, consent);
    if (validationError) {
      setError(validationError);
      return;
    }

    let roleSlug;
    try {
      roleSlug = resolveRoleSlug(role, experience);
    } catch (err) {
      setError(err.message);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await submitCareersApplication(
        {
          ...form,
          resumeFile,
          source: role ? "careers_page" : "careers_page_general",
        },
        roleSlug,
      );
      setApplicationRef(result?.application_ref || "");
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container style={{ textAlign: "center", padding: "96px 24px", maxWidth: 560 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: TRUST_BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}><Check size={28} color={TRUST} strokeWidth={2.5} /></div>
        <H2 style={{ marginBottom: 14 }}>Application received</H2>
        {applicationRef && (
          <p style={{ color: INK, fontSize: 14, fontWeight: 600, fontFamily: MONO, marginBottom: 12 }}>
            Reference: {applicationRef}
          </p>
        )}
        <p style={{ color: MUTE, fontSize: 15.5, lineHeight: 1.7, marginBottom: 8, fontFamily: SANS }}>Your profile is in our talent network. Here's what happens next:</p>
        <div style={{ textAlign: "left", background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, margin: "20px 0 28px" }}>
          {["We review your profile within one week", "If it matches an active client requirement, a member of our talent team reaches out directly", "Either way, you'll receive a status update within two weeks", "Your profile stays active for future matches until you ask us to remove it"].map((t, i) => <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: i < 3 ? 13 : 0 }}><span style={{ width: 20, height: 20, borderRadius: "50%", background: PRIMARY_BG, color: PRIMARY, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS }}>{i + 1}</span><p style={{ fontSize: 14, color: BODY, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>{t}</p></div>)}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}><GhostBtn onClick={() => go("roles")}>Browse more roles</GhostBtn><TextLink onClick={() => go("home")}>Back to overview</TextLink></div>
      </Container>
    );
  }

  const pct = step === 1 ? 50 : 100;
  return (
    <Container style={{ padding: "40px 24px 96px" }}>
      <button onClick={() => (role ? apply(null) : go("home"))} style={{ background: "none", border: "none", color: MUTE, fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: SANS }}>← {role ? "Apply generally instead" : "Back to overview"}</button>

      <div style={{ maxWidth: 900, marginBottom: 8 }}>
        <Eyebrow>{role ? "Applying for a role" : "Join the talent network"}</Eyebrow>
        <H2 style={{ marginBottom: 10 }}>{role ? role.title : "Tell us about you"}</H2>
        {role ? (
          <p style={{ fontSize: 14, color: MUTE, fontFamily: SANS, marginBottom: 22 }}>
            <span style={{ color: TRUST, fontWeight: 600 }}>{role.salary}</span> · {role.experience} · Remote from India ·{" "}
            <button onClick={() => apply(null)} className="text-link" style={{ background: "none", border: "none", color: PRIMARY, fontWeight: 600, cursor: "pointer", fontFamily: SANS, fontSize: 14, padding: 0 }}>not this role?</button>
          </p>
        ) : (
          <Lead style={{ marginBottom: 22 }}>Not tied to one role — share your profile once and we'll match you to every opening you fit, now and in future.</Lead>
        )}
      </div>

      <div style={{ maxWidth: 900, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: step === 1 ? PRIMARY : MUTE, fontFamily: SANS }}>1 · Contact & background</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: step === 2 ? PRIMARY : FAINT, fontFamily: SANS }}>2 · Experience & expectations</span>
        </div>
        <div style={{ height: 5, background: BORDER, borderRadius: 100, overflow: "hidden" }}><div className="step-bar-fill" style={{ height: "100%", width: `${pct}%`, background: PRIMARY, borderRadius: 100 }} /></div>
        <p style={{ fontSize: 12, color: FAINT, marginTop: 8, fontFamily: SANS }}>{step === 1 ? "~2 minutes left" : "Almost done · ~1 minute left"}</p>
      </div>

      {error && (
        <div style={{ maxWidth: 900, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 14px" }}>
          <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 13.5, color: "#991B1B", lineHeight: 1.5, fontFamily: SANS }}>{error}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 40, alignItems: "start" }} className="apply-grid">
        {/* FORM */}
        <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32 }}>
          {/* STEP 1: Contact & background */}
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: INK, margin: "0 0 20px", fontFamily: SANS }}>Contact & background</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle}>Full name *</label><input style={inputStyle} placeholder="Priya Sharma" value={form.fullName} onChange={setField("fullName")} disabled={submitting} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" placeholder="you@email.com" value={form.email} onChange={setField("email")} disabled={submitting} /></div>
                <div><label style={labelStyle}>Phone (with country code) *</label><input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={setField("phone")} disabled={submitting} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>City *</label><input style={inputStyle} placeholder="Bengaluru" value={form.city} onChange={setField("city")} disabled={submitting} /></div>
                <div><label style={labelStyle}>LinkedIn profile URL *</label><input style={inputStyle} placeholder="linkedin.com/in/…" value={form.linkedinUrl} onChange={setField("linkedinUrl")} disabled={submitting} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Current employer *</label><input style={inputStyle} placeholder="e.g. Infosys" value={form.currentEmployer} onChange={setField("currentEmployer")} disabled={submitting} /></div>
                <div><label style={labelStyle}>Total years of experience *</label><input type="number" min="0" max="40" step="0.5" style={inputStyle} placeholder="e.g. 5" value={form.totalExperienceYrs} onChange={handleExperienceChange} disabled={submitting} /></div>
              </div>
              <div>
                <label style={labelStyle}>Resume (PDF) *</label>
                <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" onChange={handleResumeChange} style={{ display: "none" }} disabled={submitting} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={submitting} style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 8, color: resumeFile ? INK : FAINT, cursor: submitting ? "not-allowed" : "pointer", textAlign: "left" }}>
                  <Upload size={16} /> {resumeFile ? resumeFile.name : "Upload PDF (max 5 MB)"}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}><PrimaryBtn onClick={handleContinue}>Continue <ArrowRight size={16} /></PrimaryBtn></div>
          </div>

          {/* STEP 2: Experience & expectations */}
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: INK, margin: "0 0 20px", fontFamily: SANS }}>Experience & expectations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Current CTC (₹ per annum) *</label><input style={inputStyle} placeholder="e.g. 18,00,000" value={form.currentCtc} onChange={setField("currentCtc")} disabled={submitting} /></div>
                <div><label style={labelStyle}>Expected CTC (₹ per annum) *</label><input style={inputStyle} placeholder="e.g. 24,00,000" value={form.expectedCtc} onChange={setField("expectedCtc")} disabled={submitting} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Notice period *</label><select style={inputStyle} value={form.noticePeriod} onChange={setField("noticePeriod")} disabled={submitting}><option value="">Select</option>{NOTICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                <div><label style={labelStyle}>English proficiency (self-rated) *</label><select style={inputStyle} value={form.englishRating} onChange={setField("englishRating")} disabled={submitting}><option value="">Select</option>{ENGLISH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              </div>
              <div><label style={labelStyle}>Skills *</label><input style={inputStyle} placeholder="e.g. Python, PyTorch, Docker, REST APIs, PostgreSQL" value={form.skills} onChange={setField("skills")} disabled={submitting} /><p style={{ fontSize: 11.5, color: FAINT, marginTop: 4, fontFamily: SANS }}>List your key technical and professional skills, comma-separated.</p></div>
              <div><label style={labelStyle}>Most relevant project or achievement *</label><textarea style={{ ...inputStyle, minHeight: 88, resize: "vertical" }} placeholder="2–4 sentences — what you built or owned, the tech involved, and the outcome." value={form.pitch} onChange={setField("pitch")} disabled={submitting} /></div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", background: SURFACE, borderRadius: 8, padding: "12px 14px", cursor: submitting ? "not-allowed" : "pointer" }}>
                <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setError(""); }} disabled={submitting} style={{ accentColor: PRIMARY, marginTop: 2, width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: BODY, lineHeight: 1.5, fontFamily: SANS }}>I consent to DevBroz storing and sharing my details with prospective EU client employers for the purpose of this application, in line with applicable data protection requirements. *</span>
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
              <GhostBtn onClick={() => { setStep(1); setError(""); }}><ArrowLeft size={16} /> Back</GhostBtn>
              <PrimaryBtn onClick={handleSubmit}>
                {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : "Submit application"}
              </PrimaryBtn>
            </div>
          </div>
        </div>

        {/* ASIDE */}
        <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 16 }}>
          <MatchPreview experience={experience} role={role} />
          <div style={{ background: SURFACE, borderRadius: 14, padding: 22 }}>
            {[[ShieldCheck, "Zero candidate fees — we are your employer"], [Clock, "Under 5 minutes to complete"], [Mail, "You'll hear back within two weeks, either way"]].map(([Ic, t], i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 2 ? 14 : 0 }}><Ic size={16} color={TRUST} style={{ marginTop: 1, flexShrink: 0 }} /><p style={{ fontSize: 13, color: BODY, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>{t}</p></div>)}
          </div>
        </div>
      </div>
    </Container>
  );
}

// ── ROLES PAGE ───────────────────────────────────
function RolesPage({ pick, apply }) {
  const [domain, setDomain] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = ROLES.filter((r) => {
    const d = domain === "All" || r.domain === domain;
    const s = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.skills.some((k) => k.toLowerCase().includes(search.toLowerCase()));
    return d && s;
  });
  const total = filtered.reduce((a, r) => a + r.count, 0);
  return (
    <>
      <Container style={{ padding: "64px 24px 0" }}>
        <Eyebrow>Open roles</Eyebrow>
        <H2 style={{ marginBottom: 14 }}>Find your match</H2>
        <Lead style={{ marginBottom: 24 }}>{total} openings across {filtered.length} roles. Every position is remote from India, working with European clients, with salary shown up front.</Lead>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", background: PRIMARY_BG, borderRadius: 12, padding: "14px 18px", marginBottom: 32 }}>
          <Target size={17} color={PRIMARY} />
          <p style={{ fontSize: 13.5, color: INK, margin: 0, fontFamily: SANS, flex: 1, minWidth: 200 }}>Not sure which fits? Apply once to the network and we'll match you to every role you qualify for.</p>
          <TextLink onClick={() => apply(null)}>Apply generally <ArrowRight size={14} /></TextLink>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>{DOMAINS.map((d) => <button key={d} onClick={() => setDomain(d)} style={{ background: domain === d ? PRIMARY : "transparent", color: domain === d ? "#fff" : MUTE, border: `1px solid ${domain === d ? PRIMARY : BORDER_2}`, borderRadius: 7, padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: SANS }}>{d}</button>)}</div>
        <div style={{ position: "relative", marginBottom: 40, maxWidth: 360 }}><Search size={16} color={FAINT} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or skill…" style={{ ...inputStyle, paddingLeft: 36 }} /></div>
      </Container>
      <Container style={{ padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>{filtered.map((r) => <RoleCard key={r.id} role={r} onClick={() => pick(r)} />)}</div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}><p style={{ color: MUTE, fontSize: 15, marginBottom: 8, fontFamily: SANS }}>No roles match your filters.</p><TextLink onClick={() => apply(null)}>Apply to the network instead</TextLink></div>}
      </Container>
    </>
  );
}

// ── ROLE DETAIL ──────────────────────────────────
function RoleDetailPage({ role, go, apply }) {
  if (!role) return <Container style={{ padding: 80 }}><p style={{ fontFamily: SANS }}>Role not found.</p></Container>;
  return (
    <>
      <Container style={{ padding: "48px 24px 0" }}>
        <button onClick={() => go("roles")} style={{ background: "none", border: "none", color: MUTE, fontSize: 13, cursor: "pointer", marginBottom: 22, padding: 0, fontFamily: SANS }}>← All roles</button>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}><span style={{ fontSize: 11, color: PRIMARY, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: SANS }}>{role.domain}</span><span style={{ color: FAINT }}>·</span><span style={{ fontSize: 11, color: MUTE, fontFamily: SANS }}>{role.count} openings</span></div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 500, color: INK, letterSpacing: "-0.015em", margin: "0 0 16px" }}>{role.title}</h1>
        <div style={{ display: "flex", gap: 18, fontSize: 13.5, color: BODY, marginBottom: 32, flexWrap: "wrap", fontFamily: SANS }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600, color: TRUST }}><IndianRupee size={14} /> {role.salary}</span><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Briefcase size={14} /> {role.experience}</span><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> Remote — India</span><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Globe size={14} /> EU client engagement</span></div>
      </Container>
      <Container style={{ padding: "0 24px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 44, alignItems: "start" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 12, fontFamily: SANS }}>About the role</h3>
            <p style={{ fontSize: 14.5, color: BODY, lineHeight: 1.75, marginBottom: 30, fontFamily: SANS }}>{role.desc}</p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 12, fontFamily: SANS }}>Key skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 30 }}>{role.skills.map((s) => <span key={s} style={{ fontSize: 13, color: PRIMARY, background: PRIMARY_BG, borderRadius: 6, padding: "5px 12px", fontWeight: 500, fontFamily: SANS }}>{s}</span>)}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 12, fontFamily: SANS }}>What to expect</h3>
            {["You'll embed directly in a European client's team", "Daily standups and async collaboration across time zones", "DevBroz provides equipment, onboarding, and ongoing career management", "Partial overlap with Central European Time — typically IST afternoons", "Long-term engagement — most deployments run 12 months or more"].map((t, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 11 }}><CheckCircle2 size={15} color={PRIMARY} style={{ marginTop: 2, flexShrink: 0 }} /><p style={{ fontSize: 13.5, color: BODY, lineHeight: 1.5, margin: 0, fontFamily: SANS }}>{t}</p></div>)}
          </div>
          <div>
            <div style={{ background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, position: "sticky", top: 88 }}>
              <p style={{ fontSize: 12, color: MUTE, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 8, fontFamily: SANS }}>This role</p>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 500, color: INK, marginBottom: 4 }}>{role.salary}</div>
              <p style={{ fontSize: 13, color: MUTE, marginBottom: 20, fontFamily: SANS }}>{role.experience} · Remote from India</p>
              <PrimaryBtn full onClick={() => apply(role)}>Apply for this role <ArrowRight size={16} /></PrimaryBtn>
              <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center", marginTop: 14 }}><Clock size={13} color={FAINT} /><span style={{ fontSize: 12, color: FAINT, fontFamily: SANS }}>Takes under 5 minutes</span></div>
              <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 20, paddingTop: 18 }}>{[[ShieldCheck, "Full-time employment, not a contract"], [Lock, "Zero candidate fees"]].map(([Ic, t], i) => <div key={i} style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: i < 1 ? 10 : 0 }}><Ic size={15} color={TRUST} /><span style={{ fontSize: 13, color: BODY, fontFamily: SANS }}>{t}</span></div>)}</div>
            </div>
          </div>
        </div>
      </Container>
      <div className="mobile-apply-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 55, background: `${PAPER}f5`, backdropFilter: "blur(8px)", borderTop: `1px solid ${BORDER}`, padding: "12px 18px", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div><div style={{ fontSize: 15, fontWeight: 700, color: INK, fontFamily: SANS }}>{role.salary}</div><div style={{ fontSize: 11, color: MUTE, fontFamily: SANS }}>{role.title}</div></div>
        <PrimaryBtn onClick={() => apply(role)}>Apply <ArrowRight size={15} /></PrimaryBtn>
      </div>
    </>
  );
}

// ── FAQ PAGE ─────────────────────────────────────
function FAQPage() {
  const [open, setOpen] = useState(0);
  return (
    <Container style={{ padding: "64px 24px 80px" }}>
      <Eyebrow>FAQ</Eyebrow>
      <H2 style={{ marginBottom: 14 }}>Common questions, straight answers</H2>
      <Lead style={{ marginBottom: 44 }}>If you're wondering how this works, you're not the first. Here's what other candidates have asked.</Lead>
      <div style={{ maxWidth: 760 }}>{FAQS.map((f, i) => <div key={i} style={{ borderBottom: `1px solid ${BORDER}` }}><button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", cursor: "pointer", textAlign: "left", gap: 16, fontFamily: SANS }}><span style={{ fontSize: 15.5, fontWeight: 500, color: open === i ? INK : BODY, lineHeight: 1.4 }}>{f.q}</span><ChevronDown size={18} color={FAINT} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} /></button>{open === i && <p style={{ fontSize: 14.5, color: MUTE, lineHeight: 1.7, paddingBottom: 20, margin: 0, fontFamily: SANS }}>{f.a}</p>}</div>)}</div>
      <div style={{ marginTop: 56, background: PAPER, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 36, textAlign: "center", maxWidth: 760 }}><Mail size={22} color={PRIMARY} style={{ marginBottom: 12 }} /><h3 style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 500, color: INK, marginBottom: 8 }}>Still have questions?</h3><p style={{ color: MUTE, fontSize: 14, marginBottom: 4, fontFamily: SANS }}>Write to a real person on our team. We reply within a working day.</p><p style={{ color: PRIMARY, fontSize: 15, fontWeight: 600, fontFamily: SANS }}>careers@devbroz.com</p></div>
    </Container>
  );
}

// ── FOOTER ───────────────────────────────────────
function Footer({ go, apply }) {
  return (
    <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "56px 24px 40px", background: BG }}>
      <Container style={{ padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 40 }}>
        <div><span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, color: INK }}>DevBroz</span><p style={{ color: MUTE, fontSize: 13, lineHeight: 1.6, marginTop: 10, fontFamily: SANS }}>A technology company connecting exceptional Indian talent with European businesses. In partnership with GreenTech Consulting GmbH (GTC).</p><div style={{ display: "flex", gap: 10, marginTop: 14 }}><VerifyChip>Registered</VerifyChip><VerifyChip>No fees</VerifyChip></div></div>
        <div><p style={{ fontWeight: 600, color: MUTE, fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: SANS }}>Careers</p>{[["Overview", "home"], ["Open roles", "roles"], ["Partnership", "partnership"], ["FAQ", "faq"]].map(([l, id]) => <button key={id} onClick={() => go(id)} style={{ display: "block", background: "none", border: "none", color: BODY, fontSize: 13, cursor: "pointer", padding: "4px 0", textAlign: "left", fontFamily: SANS }}>{l}</button>)}</div>
        <div><p style={{ fontWeight: 600, color: MUTE, fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: SANS }}>Get started</p><button onClick={() => apply(null)} style={{ display: "block", background: "none", border: "none", color: PRIMARY, fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "4px 0", textAlign: "left", fontFamily: SANS }}>Apply now</button><p style={{ color: BODY, fontSize: 13, lineHeight: 2, fontFamily: SANS, marginTop: 4 }}>devbroz.com<br />careers@devbroz.com</p></div>
      </Container>
      <Container style={{ padding: 0, marginTop: 40, paddingTop: 22, borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}><p style={{ color: FAINT, fontSize: 12, fontFamily: SANS }}>© 2026 DevBroz Technologies Pvt. Ltd.</p><p style={{ color: FAINT, fontSize: 12, fontFamily: SANS }}>Privacy · Terms · Data deletion requests</p></Container>
    </footer>
  );
}

// ── CAREERS PAGE (main export) ───────────────────
export default function CareersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState("home");
  const [role, setRole] = useState(null);
  const [applyRole, setApplyRole] = useState(null);
  const [showTransition, setShowTransition] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const go = (p) => {
    if (p === "partnership") {
      setPage("home");
      setTimeout(() => document.getElementById("gtc-anchor")?.scrollIntoView({ behavior: "smooth" }), 60);
      return;
    }
    setPage(p);
    window.scrollTo(0, 0);
  };
  const pick = (r) => { setRole(r); setPage("detail"); window.scrollTo(0, 0); };
  const apply = (r) => { setApplyRole(r || null); setPage("apply"); window.scrollTo(0, 0); };

  const handleBackToMain = useCallback(() => {
    setShowTransition(true);
  }, []);

  const handleTransitionNavigate = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleTransitionComplete = useCallback(() => {
    setShowTransition(false);
  }, []);

  return (
    <div className="careers-page" style={{ background: BG, minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus-visible, input:focus-visible, select:focus-visible, a:focus-visible { outline: 2px solid ${PRIMARY}; outline-offset: 2px; }
        input::placeholder { color: ${FAINT}; }
        textarea::placeholder { color: ${FAINT}; }
        .btn-primary:hover { background: ${PRIMARY_DK}; }
        .btn-ghost:hover { border-color: ${INK}; }
        .text-link:hover { text-decoration: underline; }
        .role-card { transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s; }
        .role-card:hover { border-color: ${BORDER_2}; box-shadow: 0 6px 22px rgba(20,22,28,0.07); transform: translateY(-2px); }
        .step-bar-fill { transition: width 0.45s cubic-bezier(.4,0,.2,1); }
        .count-pop { display: inline-block; animation: countpop 0.38s cubic-bezier(.34,1.56,.64,1); }
        @keyframes countpop { from { transform: scale(0.6); opacity: 0.2; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-desktop { display: flex; }
        .nav-burger { display: none; }
        .mobile-apply-bar { display: none; }
        @media (max-width: 860px) { .apply-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 780px) {
          .nav-desktop { display: none; }
          .nav-burger { display: block; }
          .mobile-apply-bar { display: flex !important; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; scroll-behavior: auto !important; } }
      `}</style>

      <Nav page={page} go={go} apply={apply} onBackToMain={handleBackToMain} />
      {page === "home" && (<><Hero go={go} apply={apply} /><Model /><GTCSection /><CandidateSafety /><HowItWorks /><Benefits /><RolePreview go={go} pick={pick} /><MiniFAQ go={go} /><FinalCTA go={go} apply={apply} /></>)}
      {page === "roles" && <RolesPage pick={pick} apply={apply} />}
      {page === "detail" && <RoleDetailPage role={role} go={go} apply={apply} />}
      {page === "apply" && <ApplyFlow role={applyRole} go={go} apply={apply} />}
      {page === "faq" && <FAQPage />}
      <Footer go={go} apply={apply} />

      {showTransition && (
        <RouteTransition
          onNavigate={handleTransitionNavigate}
          onComplete={handleTransitionComplete}
        />
      )}
    </div>
  );
}
