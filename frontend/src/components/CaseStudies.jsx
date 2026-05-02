import { useState } from "react";

const CASES = [
  {
    id: 1,
    cat: "ai",
    name: "AI Property Assistant",
    client: "UK property management firm",
    tag: "AI & ML",
    outcome: "80% queries automated",
    problem:
      "Tenant teams spent most working hours repeating answers about leases, maintenance, and availability, with uneven quality after hours.",
    solution:
      "We delivered a conversational assistant trained on their portfolio and policies, routed into their CRM so only edge cases escalate to humans.",
    stack: ["RAG pipeline", "LLM APIs", "Vector DB", "CRM webhook"],
    metrics: [
      { label: "Queries handled by assistant", value: "80%" },
      { label: "Avg response (live channel)", value: "< 3s" },
      { label: "FAQ manual hours / week", value: "~18 hrs saved" },
    ],
  },
  {
    id: 2,
    cat: "data",
    name: "D2C Live Dashboard",
    client: "D2C lifestyle brand",
    tag: "Data Analytics",
    outcome: "4+ hrs reporting → 0",
    problem:
      "Growth leads stitched Shopify, Meta Ads, and GA into a spreadsheet every Monday—four-plus hours late, error-prone data.",
    solution:
      "We pipelined all three APIs into one live view with refreshed KPIs (revenue, ROAS, CAC) plus weekly email digests—no spreadsheets.",
    stack: ["BigQuery", "dbt", "Shopify API", "Looker Studio"],
    metrics: [
      { label: "Weekly manual reporting", value: "0 hrs" },
      { label: "Data freshness", value: "Near real-time" },
      { label: "Sources unified", value: "3 → 1" },
    ],
  },
  {
    id: 3,
    cat: "software",
    name: "E-Commerce Rebuild",
    client: "Premium fashion brand",
    tag: "Custom Software",
    outcome: "+44% mobile conversion",
    problem:
      "A legacy theme was slow on mobile (~71% of traffic); checkout dragged through seven friction-heavy steps.",
    solution:
      "Mobile-first storefront: lean checkout (three steps), lazy-loaded imagery, cart and trust fixes where heatmaps showed drop-off.",
    stack: ["Shopify", "Liquid", "Performance tuning", "Analytics"],
    metrics: [
      { label: "Mobile conversion uplift", value: "+44%" },
      { label: "Mobile LCP-style load", value: "~1.8s" },
      { label: "Checkout steps", value: "7 → 3" },
    ],
  },
  {
    id: 4,
    cat: "ai",
    name: "Churn Prediction Model",
    client: "SaaS e-commerce retailer",
    tag: "AI & ML",
    outcome: "89% prediction accuracy",
    problem:
      "Retention was reactive: blanket win-back sends after customers had already disengaged, with weak ROI visibility.",
    solution:
      "Daily churn-propensity scoring on behaviour and transactional history feeds targeted saves before lapse—wired into ESP and CS queues.",
    stack: ["Python", "Snowflake", "XGBoost", "Airflow"],
    metrics: [
      { label: "Model precision (holdout)", value: "89%" },
      { label: "Retention campaign ROI", value: "~4.6x" },
      { label: "LTV (saved cohort)", value: "+31%" },
    ],
  },
  {
    id: 5,
    cat: "software",
    name: "B2B Website Redesign",
    client: "Management consulting firm",
    tag: "Custom Software",
    outcome: "~55% more enquiries",
    problem:
      "An ageing site buried proof and lacked a conversion path—referrals dominated while warm web visitors bounced.",
    solution:
      "Buyer-intent IA, outcome-led service pages, visible proof, CRM-backed forms with SLA automation on first response.",
    stack: ["Next.js", "Headless CMS", "HubSpot", "Vercel"],
    metrics: [
      { label: "Inbound enquiries / month", value: "18 → 28" },
      { label: "Enquiry → proposal rate", value: "34% → 51%" },
      { label: "Qualified lead mix", value: "~40% → ~68%" },
    ],
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI & ML" },
  { key: "data", label: "Data & Analytics" },
  { key: "software", label: "Custom Software" },
];

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered =
    activeFilter === "all"
      ? CASES
      : CASES.filter((c) => c.cat === activeFilter);

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <section
      id="work"
      data-testid="case-studies-section"
      className="cs-section"
    >
      <div className="cs-container">
      {/* Header */}
      <div className="cs-header">
        <div className="cs-eyebrow">
          <span className="cs-eyebrow-line" />
          Our work
        </div>
        <h2 className="cs-title" data-testid="case-studies-heading">
          Real projects.
          <br />
          <span className="cs-title-gradient">Real outcomes.</span>
        </h2>
        <p className="cs-subtitle">
          No stock photos of brains. Just what we built and what it moved.
        </p>
      </div>

      {/* Filters */}
      <div className="cs-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`cs-filter ${activeFilter === f.key ? "cs-filter--active" : ""}`}
            onClick={() => {
              setActiveFilter(f.key);
              setExpandedId(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div className="cs-col-headers">
        <span>Project</span>
        <span>Category</span>
        <span>Key result</span>
        <span />
      </div>

      {/* Case list — full bleed inside container (no horizontal padding on this box) */}
      <div className="cs-list">
        {filtered.map((c, i) => {
          const isOpen = expandedId === c.id;
          return (
            <div key={c.id}>
              {i > 0 && <div className="cs-divider" />}
              <div
                role="button"
                tabIndex={0}
                className={`cs-row ${isOpen ? "cs-row--open" : ""}`}
                onClick={() => toggle(c.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(c.id);
                  }
                }}
              >
                {/* Always-visible row */}
                <div className="cs-row-main">
                  <div
                    className="cs-col-project"
                    data-outcome={c.outcome}
                  >
                    <span className="cs-project-name">{c.name}</span>
                    <span className="cs-project-client">{c.client}</span>
                  </div>
                  <div className="cs-col-tag">{c.tag}</div>
                  <div className="cs-col-outcome">{c.outcome}</div>
                  <div className="cs-col-action">
                    View
                    <span className={`cs-chevron ${isOpen ? "cs-chevron--open" : ""}`}>
                      ↓
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="cs-detail">
                    <div className="cs-detail-left">
                      <p className="cs-problem">{c.problem}</p>
                      <p className="cs-solution">{c.solution}</p>
                      <div className="cs-stack">
                        {c.stack.map((t) => (
                          <span key={t} className="cs-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="cs-detail-right">
                      <div className="cs-metrics">
                        {c.metrics.map((m) => (
                          <div key={m.label} className="cs-metric">
                            <span className="cs-metric-label">{m.label}</span>
                            <span className="cs-metric-value">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <style>{`
        .cs-section {
          background: #080808;
          padding: 80px 0 100px;
          font-family: inherit;
        }

        .cs-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 40px;
          padding-right: 40px;
        }

        .cs-header {
          margin-bottom: 48px;
        }

        .cs-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e040a0;
          margin-bottom: 16px;
        }

        .cs-eyebrow-line {
          display: block;
          width: 24px;
          height: 1.5px;
          background: #e040a0;
        }

        .cs-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 12px;
        }

        .cs-title-gradient {
          background: linear-gradient(90deg, #e040a0, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cs-subtitle {
          font-size: 15px;
          color: #555;
          max-width: 400px;
          line-height: 1.6;
        }

        /* Filters */
        .cs-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .cs-filter {
          padding: 7px 18px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 0.5px solid #222;
          background: #111;
          color: #777;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          font-family: inherit;
        }

        .cs-filter:hover {
          border-color: #444;
          color: #ccc;
        }

        .cs-filter--active {
          background: linear-gradient(90deg, #e040a0, #7c3aed);
          border-color: transparent;
          color: #fff;
        }

        /* Column headers */
        .cs-col-headers {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 100px;
          padding-left: 28px;
          padding-right: 28px;
          margin-bottom: 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2e2e2e;
        }

        /* List */
        .cs-list {
          background: #111;
          border-radius: 16px;
          overflow: hidden;
          border: 0.5px solid #1a1a1a;
          width: 100%;
          box-sizing: border-box;
        }

        .cs-divider {
          height: 0.5px;
          background: #1a1a1a;
        }

        /* Row */
        .cs-row {
          background: #0d0d0d;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.15s;
          padding: 0 28px;
        }

        .cs-row:focus-visible {
          outline: 2px solid #e040a0;
          outline-offset: -2px;
          z-index: 1;
        }

        .cs-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(224, 64, 160, 0.1), transparent);
          transition: width 0.25s;
          pointer-events: none;
        }

        .cs-row:hover,
        .cs-row--open {
          background: #111;
        }

        .cs-row:hover::before,
        .cs-row--open::before {
          width: 100%;
        }

        .cs-row-main {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) 100px;
          align-items: center;
          height: 72px;
          column-gap: 12px;
        }

        .cs-col-project {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cs-project-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .cs-project-client {
          font-size: 12px;
          color: #444;
        }

        .cs-col-tag {
          font-size: 12px;
          color: #555;
        }

        .cs-col-outcome {
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(90deg, #e040a0, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cs-col-action {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #444;
          user-select: none;
        }

        .cs-chevron {
          display: inline-block;
          transition: transform 0.2s;
          font-size: 14px;
          color: #555;
        }

        .cs-chevron--open {
          transform: rotate(180deg);
        }

        /* Expanded detail */
        .cs-detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          border-top: 0.5px solid #1f1f1f;
          padding: 24px 0 28px;
        }

        .cs-problem {
          font-size: 13px;
          color: #666;
          line-height: 1.75;
          margin-bottom: 14px;
        }

        .cs-solution {
          font-size: 13px;
          color: #999;
          line-height: 1.75;
        }

        .cs-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 18px;
        }

        .cs-tag {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 4px;
          background: #161616;
          border: 0.5px solid #252525;
          color: #555;
        }

        .cs-metrics {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .cs-metric {
          background: #161616;
          border: 0.5px solid #202020;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
        }

        .cs-metric-label {
          font-size: 12px;
          color: #444;
          min-width: 0;
        }

        .cs-metric-value {
          flex-shrink: 0;
          text-align: right;
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(90deg, #e040a0, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .cs-section {
            padding: 60px 0 80px;
          }

          .cs-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          .cs-col-headers {
            display: none;
          }

          .cs-row-main {
            grid-template-columns: 1fr auto;
            height: auto;
            padding: 18px 0;
            gap: 12px;
          }

          .cs-col-tag,
          .cs-col-outcome {
            display: none;
          }

          .cs-col-project {
            gap: 4px;
          }

          .cs-project-client {
            color: #555;
          }

          /* Show outcome under name on mobile */
          .cs-col-project::after {
            content: attr(data-outcome);
            font-size: 12px;
            font-weight: 700;
            background: linear-gradient(90deg, #e040a0, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: 2px;
          }

          .cs-detail {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .cs-row {
            padding: 0 20px;
          }

          .cs-list {
            border-radius: 12px;
          }
        }
      `}</style>
    </section>
  );
}
