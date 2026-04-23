import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';

const CASE_STUDIES = [
  {
    title: 'AI Property Assistant',
    category: 'AI & Machine Learning',
    description:
      "A property management firm was drowning in repetitive tenant queries. We built a conversational AI trained on their full property portfolio to handle them 24/7.",
    metric: '80% automated',
    image:
      'https://static.prod-images.emergentagent.com/jobs/eb20e0df-aab0-496f-a8ec-3d30f14aedce/images/4cc7c59bfe1337285835fa3debe0d7ba8f175c9b897cb8b734d28ed90e3444df.png',
    problem:
      "A property management firm was drowning in repetitive tenant inquiries: questions about lease terms, maintenance procedures, available units, and building policies. Their team was spending the majority of their working hours answering the same questions over and over, leaving little capacity for higher-value tasks. There was no centralised system, no consistent response quality, and no way to handle enquiries outside business hours.",
    solution:
      "We built a custom conversational AI trained on the client's full property portfolio: listings, lease templates, FAQs, maintenance policies, and building-specific rules. The assistant was deployed across their website and tenant portal, capable of handling natural language queries in real time, 24/7. We integrated it with their existing CRM so escalated queries were routed directly to the right team member, with full context preserved.",
    results: [
      { metric: 'Tenant queries handled by AI', before: '0%', after: '80%' },
      { metric: 'Average response time', before: '4 to 6 hours', after: 'Instant (24/7)' },
      { metric: 'Staff hours on FAQs / week', before: '~22 hrs', after: '~4 hrs' },
      { metric: 'Tenant satisfaction score', before: '67%', after: '91%' },
    ],
    impact:
      "By eliminating the manual bottleneck in tenant communications, the firm was able to scale their portfolio without adding headcount. The AI handles peak enquiry volumes (move-in season, month-end) with zero degradation in response quality. Estimated annual time savings equivalent to 1.5 FTE, redirected entirely toward growth and retention activities.",
  },
  {
    title: 'D2C Live Dashboard',
    category: 'Data Analytics',
    description:
      "A D2C brand's leadership was stitching KPIs from Shopify, Meta Ads, and Google Analytics every Monday. We built a live, auto-refreshing single source of truth.",
    metric: '4 hrs saved / week',
    image:
      'https://static.prod-images.emergentagent.com/jobs/eb20e0df-aab0-496f-a8ec-3d30f14aedce/images/81d656730a2e415aeb139894a8b17569e4733cb1ff66a804b7ec2b6eb4903806.png',
    problem:
      "A direct-to-consumer brand's leadership team had no single source of truth for performance data. Every Monday morning, the Head of Growth manually pulled KPIs from three separate platforms: their Shopify store, Meta Ads Manager, and Google Analytics, then compiled everything into a spreadsheet before the weekly team meeting. The process took over four hours, was error-prone, and meant decisions were always based on week-old data rather than live signals.",
    solution:
      "We built a fully automated live dashboard that pulls data from all three platforms via API, consolidates it into a single unified view, and refreshes in real time. The dashboard surfaces revenue, ROAS, CAC, conversion rate, and channel-level performance side by side, with trend indicators, period comparisons, and automated weekly email digests. No manual input required at any stage.",
    results: [
      { metric: 'Time on manual reporting / week', before: '4+ hours', after: '0 hours' },
      { metric: 'Data freshness', before: '7 days old', after: 'Real-time' },
      { metric: 'Platforms consolidated', before: '3 separate tabs', after: '1 dashboard' },
      { metric: 'Decision lag time', before: '5 to 7 days', after: 'Same day' },
    ],
    impact:
      "Beyond the time saved, the real impact was strategic. Within two months of launch, the team identified a consistently underperforming ad set that had been hidden in the noise of manual reporting. Pausing it freed up £6,400 per month in wasted ad spend. The dashboard paid for itself in the first six weeks.",
  },
  {
    title: 'E-Commerce Rebuild',
    category: 'Custom Software',
    description:
      "A fashion brand's store was slow, generic, and bleeding mobile traffic. We rebuilt it mobile-first with a streamlined three-step checkout.",
    metric: '+44% mobile conversion',
    image:
      'https://static.prod-images.emergentagent.com/jobs/eb20e0df-aab0-496f-a8ec-3d30f14aedce/images/0ac483b8729379379aa410f3c81533e1a52294030d5926ccbd5797bc3a74f7d2.png',
    problem:
      "A fashion brand's online store had been built on a generic template years earlier and never meaningfully updated. Page load speeds on mobile were poor, the checkout flow had multiple unnecessary steps, and the overall experience felt disconnected from the brand's premium positioning. Mobile traffic had grown to 71% of their total visits, but mobile conversion was nearly half their desktop rate. They were acquiring visitors but losing them before purchase.",
    solution:
      "We rebuilt the store from the ground up with a mobile-first custom design. Every interaction, layout, and loading sequence was designed around the mobile user journey. We streamlined the checkout to three steps, implemented lazy loading and image optimisation throughout, and created a product discovery experience that matched the brand's visual identity. We also introduced persistent cart functionality and trust signals at key drop-off points identified through heatmap analysis prior to the rebuild.",
    results: [
      { metric: 'Mobile conversion rate', before: '1.2%', after: '1.73%' },
      { metric: 'Mobile page load time', before: '6.4 seconds', after: '1.8 seconds' },
      { metric: 'Checkout abandonment', before: '74%', after: '51%' },
      { metric: 'Mobile revenue share', before: '38% of revenue', after: '56% of revenue' },
    ],
    impact:
      "The rebuild directly translated into measurable revenue growth without any increase in ad spend. At the client's existing traffic volume, the 44% uplift in mobile conversion represents an estimated additional £18,000 to £22,000 in monthly revenue. The improved experience also lifted average order value, as users were more likely to browse multiple categories before purchasing.",
  },
  {
    title: 'Churn Prediction Model',
    category: 'AI & Machine Learning',
    description:
      "An e-commerce company had no way of knowing which customers were about to leave. We built a predictive model that flags at-risk customers before they disengage.",
    metric: '89% accuracy',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
    problem:
      "An e-commerce company had a churn problem they couldn't see coming. By the time a customer stopped purchasing, it was already too late to intervene. Their retention team was running blanket discount campaigns to all lapsed customers: expensive, imprecise, and largely ineffective. They had no way of knowing which customers were drifting before they left, which customers were worth saving, or what signals preceded disengagement.",
    solution:
      "We built a machine learning churn prediction model trained on 18 months of customer transaction history, browsing behaviour, email engagement, and support interactions. The model assigns each active customer a real-time churn probability score, updated daily. High-risk customers are automatically flagged and fed into targeted retention workflows (personalised email sequences, loyalty incentives, and proactive outreach) triggered at the moment risk crosses a defined threshold, before the customer disengages.",
    results: [
      { metric: 'Churn prediction accuracy', before: 'No model', after: '89% accurate' },
      { metric: 'Retention targeting', before: 'Blanket (all lapsed)', after: 'Precision (at-risk only)' },
      { metric: 'Retention campaign ROI', before: '~1.8x', after: '~4.6x' },
      { metric: 'LTV (retained segment)', before: 'Baseline', after: '+31% avg LTV' },
    ],
    impact:
      "By shifting from reactive to predictive retention, the client reduced churn-related revenue loss by an estimated 28% in the first quarter post-deployment. Discount spend dropped because offers were only sent to genuinely at-risk customers, not served broadly as a margin-eroding habit. The model also surfaced a previously unnoticed pattern: customers who contacted support twice without resolution were 4x more likely to churn, prompting a process change in the support team.",
  },
  {
    title: 'B2B Website Redesign',
    category: 'Custom Software',
    description:
      "A consulting firm's website hadn't been updated since 2019. We rebuilt it around buyer intent so warm prospects actually convert.",
    metric: '+55% enquiries',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
    problem:
      "A consulting firm's website hadn't been updated since 2019. It didn't reflect the range of services they now offered, failed to communicate credibility to senior decision-makers, and had no clear conversion path. The homepage was text-heavy and generic, case studies were buried or absent, and there was no mechanism for capturing inbound interest beyond a basic contact form. The firm was generating enquiries almost entirely through referrals; their website was, at best, a digital business card that did nothing to convert warm prospects who looked them up.",
    solution:
      "We redesigned the website from scratch with a clear strategic objective: convert visiting decision-makers into qualified enquiries. This meant restructuring the information architecture around buyer intent, writing outcome-focused service pages, building a case study section that led with results, and designing a conversion flow that made it easy to take the next step. We also implemented lead capture across high-intent pages and integrated the form with their CRM for immediate follow-up triggers.",
    results: [
      { metric: 'Monthly inbound enquiries', before: '18 / month avg', after: '28 / month avg' },
      { metric: 'Enquiry to proposal conversion', before: '34%', after: '51%' },
      { metric: 'Avg time to first response', before: 'Manual (12 to 24 hrs)', after: 'CRM auto (< 5 mins)' },
      { metric: 'Qualified lead rate', before: '~40% qualified', after: '~68% qualified' },
    ],
    impact:
      "The website now functions as an active part of the firm's sales process rather than a passive brochure. Beyond the 55% lift in volume, the improvement in lead quality is arguably more valuable. The team spends less time on unqualified enquiries and more time closing. At the firm's average project value, the additional monthly enquiries represent a pipeline increase of approximately £85,000 to £110,000 per month.",
  },
];

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493] mb-3">
    {children}
  </p>
);

const ResultsTable = ({ rows }) => (
  <div
    data-testid="case-study-results-table"
    className="rounded-xl border border-white/[0.08] overflow-hidden"
  >
    {/* Header */}
    <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-0 bg-white/[0.02] border-b border-white/[0.06]">
      <div className="px-3 md:px-5 py-3 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] md:tracking-[0.2em] text-zinc-500">
        Metric
      </div>
      <div className="px-3 md:px-5 py-3 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] md:tracking-[0.2em] text-zinc-500 border-l border-white/[0.06]">
        Before
      </div>
      <div className="px-3 md:px-5 py-3 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] md:tracking-[0.2em] text-[#ff1493] border-l border-white/[0.06]">
        After
      </div>
    </div>

    {rows.map((row, i) => (
      <div
        key={i}
        className={`grid grid-cols-[1.3fr_1fr_1fr] gap-0 ${
          i === 0 ? '' : 'border-t border-white/[0.05]'
        }`}
      >
        <div className="px-3 md:px-5 py-3 md:py-3.5 text-[12px] md:text-[13px] font-medium text-zinc-200 leading-snug">
          {row.metric}
        </div>
        <div className="px-3 md:px-5 py-3 md:py-3.5 text-[12px] md:text-[13px] text-zinc-500 border-l border-white/[0.05] line-through decoration-zinc-700 decoration-1 leading-snug">
          {row.before}
        </div>
        <div className="px-3 md:px-5 py-3 md:py-3.5 text-[12px] md:text-[13px] font-semibold text-white border-l border-white/[0.05] leading-snug">
          {row.after}
        </div>
      </div>
    ))}
  </div>
);

const CaseStudyModal = ({ study, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      data-testid="case-study-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:py-10 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        data-testid="case-study-modal"
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/[0.08] shadow-2xl"
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close — pinned to card, stays visible while inner content scrolls */}
        <button
          data-testid="case-study-modal-close"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
        >
          <X size={16} />
        </button>

        {/* Scrollable content */}
        <div
          data-testid="case-study-modal-scroll"
          className="overflow-y-auto overscroll-contain"
        >
          {/* Hero */}
          <div className="relative">
            {study.image ? (
              <div className="h-48 md:h-60 overflow-hidden relative">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
              </div>
            ) : (
              <div
                className="h-28 md:h-36"
                style={{
                  background:
                    'radial-gradient(ellipse at 30% 50%, rgba(255,20,147,0.2), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(75,0,130,0.35), transparent 60%), #0f0f0f',
                }}
              />
            )}

            <div
              className={`px-5 md:px-10 ${
                study.image
                  ? '-mt-12 md:-mt-16 relative z-10 pb-6 md:pb-8'
                  : 'pt-6 md:pt-8 pb-6 md:pb-8'
              }`}
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493] mb-3">
                {study.category}
              </span>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-4">
                {study.title}
              </h3>
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#ff1493]/30 bg-[#ff1493]/10">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff1493]">
                  {study.metric}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 md:px-10 pb-8 md:pb-10 space-y-7 md:space-y-8">
            {/* Problem */}
            <div data-testid="case-study-problem">
              <SectionLabel>The Problem</SectionLabel>
              <p className="text-zinc-300 text-[15px] leading-[1.75]">
                {study.problem}
              </p>
            </div>

            <div className="line-gradient" />

            {/* Solution */}
            <div data-testid="case-study-solution">
              <SectionLabel>Our Solution</SectionLabel>
              <p className="text-zinc-300 text-[15px] leading-[1.75]">
                {study.solution}
              </p>
            </div>

            <div className="line-gradient" />

            {/* Results */}
            <div data-testid="case-study-results">
              <SectionLabel>Results at a glance</SectionLabel>
              <ResultsTable rows={study.results} />
            </div>

            <div className="line-gradient" />

            {/* Impact */}
            <div data-testid="case-study-impact">
              <SectionLabel>Business Impact</SectionLabel>
              <p className="text-zinc-300 text-[15px] leading-[1.75]">
                {study.impact}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CaseStudies = () => {
  const [selectedStudy, setSelectedStudy] = useState(null);

  return (
    <section data-testid="case-studies-section" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#ff1493] mb-4">
            Our Work
          </p>
          <h2
            data-testid="case-studies-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Case Studies
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
            Real projects. Real outcomes. No fluff.
          </p>
        </motion.div>

        {/* Grid, uniform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.title}
              data-testid={`case-study-card-${idx}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => setSelectedStudy(study)}
              className={`group relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#121212] hover:border-[#ff1493]/20 transition-colors duration-500 cursor-pointer ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image */}
              {study.image ? (
                <div className={`overflow-hidden ${idx === 0 ? 'h-52' : 'h-44'}`}>
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-x-0 top-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent ${
                      idx === 0 ? 'h-52' : 'h-44'
                    }`}
                  />
                </div>
              ) : (
                <div className="h-20 bg-gradient-to-br from-[#ff1493]/10 via-[#4b0082]/10 to-[#121212]" />
              )}

              {/* Content */}
              <div className={`p-5 ${study.image ? '-mt-10 relative z-10' : ''}`}>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#ff1493] mb-2">
                  {study.category}
                </span>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {study.title}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-zinc-600 group-hover:text-[#ff1493] transition-colors duration-300 flex-shrink-0 mt-1"
                  />
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {study.description}
                </p>

                <div className="inline-block px-2.5 py-1 rounded-full border border-[#ff1493]/20 bg-[#ff1493]/5">
                  <span className="text-xs font-bold text-[#ff1493]">{study.metric}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <CaseStudyModal
            study={selectedStudy}
            onClose={() => setSelectedStudy(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudies;
