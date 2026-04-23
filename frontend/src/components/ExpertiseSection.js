import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Database, Brain, BarChart3, Zap, Code2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EXPERTISE_ASSETS = {
  dataEngineering: '/expertise/data-flow.svg',
  aiMl: '/expertise/ai-ml.svg',
  dataAnalytics: '/expertise/data-analytics.svg',
  businessAutomation: '/expertise/business-automation.svg',
  customSoftware: '/expertise/custom-software.svg',
};

const SERVICES = [
  {
    icon: Database,
    kicker: 'Foundation',
    title: 'Data Engineering & Warehousing',
    slug: 'data-engineering',
    description:
      "Your data is scattered across tools, spreadsheets, and forgotten tabs. We pull it into one place, clean it up, and make it actually usable. Think of it as giving your business a spine.",
    bullets: [
      'Centralise scattered data into one secure hub',
      'Cleaning, de-duping, and quality checks',
      'Cost-optimised cloud data infrastructure',
      'Painless migration off legacy systems',
    ],
    image: EXPERTISE_ASSETS.dataEngineering,
  },
  {
    icon: Brain,
    kicker: 'Intelligence',
    title: 'AI & Machine Learning',
    slug: 'ai-ml',
    description:
      "We build AI that does specific things really well. Answering customers, predicting churn, processing documents. Not AI for the sake of AI. AI that earns its keep.",
    bullets: [
      'Chatbots that actually understand context',
      'Document processing and data extraction',
      'Churn and recommendation models',
      'Custom ML built around your business',
    ],
    image: EXPERTISE_ASSETS.aiMl,
  },
  {
    icon: BarChart3,
    kicker: 'Visibility',
    title: 'Data Analytics',
    slug: 'data-analytics',
    description:
      "Data without context is just noise. We turn yours into dashboards and reports that tell you what is actually happening, and what to do about it.",
    bullets: [
      'Live executive dashboards',
      'Operational performance analytics',
      'Trend analysis and demand forecasting',
      'Real-time KPIs across every tool you use',
    ],
    image: EXPERTISE_ASSETS.dataAnalytics,
  },
  {
    icon: Zap,
    kicker: 'Leverage',
    title: 'Business Automation',
    slug: 'business-automation',
    description:
      "If someone on your team does the same thing more than ten times a week, it probably shouldn't be a person doing it. We automate the repetitive so your team can focus on the work that actually matters.",
    bullets: [
      'Cross-tool integrations and data sync',
      'Lead, sales, and follow-up automations',
      'Workflow design and cleanup',
      'Inventory, billing, and ops automations',
    ],
    image: EXPERTISE_ASSETS.businessAutomation,
  },
  {
    icon: Code2,
    kicker: 'Product',
    title: 'Custom Software',
    slug: 'custom-software',
    description:
      "Your website and internal tools should work as hard as you do. We build them so they do.",
    bullets: [
      'Conversion-focused business websites',
      'Customer-facing portals and web apps',
      'Internal tools that replace spreadsheets',
      'E-commerce that actually converts on mobile',
    ],
    image: EXPERTISE_ASSETS.customSoftware,
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const ExpertiseSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c === 0 ? SERVICES.length - 1 : c - 1));
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c === SERVICES.length - 1 ? 0 : c + 1));
  };

  const service = SERVICES[current];
  const Icon = service.icon;
  const numberLabel = String(current + 1).padStart(2, '0');

  return (
    <section data-testid="expertise-section" className="relative py-24 md:py-36 px-4 md:px-6 overflow-hidden">
      {/* Ultra-subtle ambient glow behind the whole section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(255,20,147,0.06) 0%, rgba(75,0,130,0.04) 35%, transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-24 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-8 h-[1px] bg-[#ff1493]" />
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold text-[#ff1493]">
              What We Do
            </p>
          </div>
          <h2
            data-testid="expertise-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-5 md:mb-6"
          >
            Our <span className="gradient-text">Expertise</span>.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl">
            Five things we&apos;re very good at. Probably at least one of them is your problem right now.
          </p>
        </motion.div>

        {/* Slide area */}
        <div className="relative">
          {/* Desktop arrows */}
          <button
            data-testid="expertise-prev-btn"
            onClick={prev}
            aria-label="Previous"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-11 h-11 rounded-full border border-white/[0.08] bg-black/30 backdrop-blur-sm items-center justify-center text-zinc-400 hover:text-white hover:border-[#ff1493]/40 hover:bg-[#ff1493]/5 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            data-testid="expertise-next-btn"
            onClick={next}
            aria-label="Next"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-11 h-11 rounded-full border border-white/[0.08] bg-black/30 backdrop-blur-sm items-center justify-center text-zinc-400 hover:text-white hover:border-[#ff1493]/40 hover:bg-[#ff1493]/5 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>

          <div className="md:mx-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                {/* LEFT — consistent sized panel, thin grey border, rounded */}
                <div className="md:col-span-7">
                  <div className="relative h-[280px] sm:h-[340px] md:h-[440px] rounded-2xl border border-white/[0.07] bg-black overflow-hidden flex items-center justify-center p-4 md:p-8">
                    <img
                      src={service.image}
                      alt={service.title}
                      data-testid={`expertise-slide-img-${current}`}
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                </div>

                {/* RIGHT — content */}
                <div className="md:col-span-5 flex flex-col">
                  {/* Meta row: number · kicker */}
                  <div className="flex items-center gap-3 mb-5 text-[11px] uppercase tracking-[0.28em] font-semibold">
                    <span className="text-[#ff1493]">{numberLabel}</span>
                    <span className="w-6 h-[1px] bg-white/15" />
                    <span className="text-zinc-500">{service.kicker}</span>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="mt-1 w-9 h-9 rounded-md border border-[#ff1493]/20 bg-[#ff1493]/[0.06] flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#ff1493]" />
                    </div>
                    <h3
                      data-testid={`expertise-slide-title-${current}`}
                      className="text-2xl md:text-[32px] font-bold text-white tracking-tight leading-[1.15]"
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-[15px] md:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2.5 mb-8">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-sm md:text-[15px] text-zinc-300 leading-relaxed">
                        <span className="mt-[9px] w-1 h-1 rounded-full bg-[#ff1493] flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to={`/service/${service.slug}`}
                    data-testid={`expertise-slide-cta-${current}`}
                    className="group inline-flex items-center gap-2 self-start px-6 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#ff1493] to-[#4b0082] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                  >
                    Learn more
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom controls — mobile arrows + dots (desktop: dots only) */}
          <div className="flex items-center justify-center gap-4 mt-10 md:mt-14">
            <button
              onClick={prev}
              aria-label="Previous slide"
              data-testid="expertise-prev-btn-mobile"
              className="md:hidden w-10 h-10 rounded-full border border-white/[0.1] bg-black/30 flex items-center justify-center text-zinc-400 active:text-white active:border-[#ff1493]/40 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center justify-center gap-2.5">
              {SERVICES.map((_, idx) => (
                <button
                  key={idx}
                  data-testid={`expertise-dot-${idx}`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'bg-[#ff1493] w-8'
                      : 'bg-zinc-700 hover:bg-zinc-500 w-1.5'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next slide"
              data-testid="expertise-next-btn-mobile"
              className="md:hidden w-10 h-10 rounded-full border border-white/[0.1] bg-black/30 flex items-center justify-center text-zinc-400 active:text-white active:border-[#ff1493]/40 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
