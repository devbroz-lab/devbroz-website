import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Database,
  Brain,
  BarChart3,
  Zap,
  Code2,
  Sparkles,
} from 'lucide-react';

// =================================================================
// Service content, sourced from the DevBroz services doc.
// All em dashes scrubbed per brand voice.
// =================================================================
const SERVICES_DATA = {
  'data-engineering': {
    icon: Database,
    tagline: 'Data Engineering & Warehousing',
    hero: {
      title: 'The foundation every other technology investment stands on.',
      lede:
        'Before analytics, AI, or automation can work, your data needs a solid home. Clean, centralised, and structured data, ready to power dashboards, models, and decisions.',
    },
    intro:
      "Most businesses that want to use AI or analytics hit the same wall: their data lives in five different places and none of it connects. We build the foundation that makes every other technology investment possible.",
    capabilities: [
      {
        title: 'Building Your Central Data Foundation',
        overline: '01',
        subtitle:
          "Consolidate scattered data into one secure, organised hub your entire business can rely on.",
        what:
          "We design and build a central data warehouse: a single, structured place where all business data flows in, gets cleaned, and becomes ready to use. This isn't just storage; it's the foundation that makes every other technology investment possible. Without it, analytics gives you wrong answers and AI has nothing to learn from.",
        problem:
          "Data spread across a CRM, spreadsheets, an ERP, a billing system, and a shared drive, with no connection between them. Analytics produces wrong answers. AI projects stall before they begin.",
        result:
          "A single, centralised warehouse where all data flows in automatically, gets cleaned on arrival, and is immediately available for dashboards, models, and reporting. One source of truth for the entire business.",
        outcome:
          "AI demand forecasting model delivered accurate predictions within the first month, after we first built and cleaned their 3-year data foundation.",
      },
      {
        title: 'Data Cleaning & Quality Management',
        overline: '02',
        subtitle:
          "Decisions are only as good as the data behind them. We make sure yours is trustworthy.",
        what:
          "We audit your existing data, identify quality issues, and implement systematic cleaning and validation processes. Going forward, every new piece of data entering the warehouse is checked against defined rules before it's stored. The result is data your teams are actually willing to use, because they know it's accurate.",
        problem:
          "Duplicate records, inconsistent formats, missing fields, and outdated entries. Dirty data flows into reports and models, producing misleading results and bad decisions.",
        result:
          "A clean, validated dataset with systematic rules that check every new entry on arrival. Reports produce reliable numbers. Teams trust the data and act on it confidently.",
        outcome:
          "Packaging company: duplicate and outdated records removed, single accurate record per customer, order processing delays eliminated.",
      },
      {
        title: 'Cost-Optimised Cloud Data Infrastructure',
        overline: '03',
        subtitle:
          "Enterprise-grade data infrastructure, without the enterprise price tag.",
        what:
          "We design cloud data infrastructure that is right-sized for where you are today and built to scale efficiently as you grow. Every architecture decision is made with cost in mind. We have helped clients reduce their data infrastructure spend by $100 to $200 per month simply by rethinking how data is stored and queried, without losing any functionality.",
        problem:
          "Cloud data costs that keep climbing without any improvement in performance or insight. Businesses either overpay for storage and compute they don't need, or under-invest and hit bottlenecks as data volumes grow.",
        result:
          "A right-sized cloud architecture that reduces monthly infrastructure costs, improves query performance, and scales cleanly as data volumes grow, without emergency re-architecture later.",
        outcome:
          "SaaS startup reduced cloud data costs and improved reporting reliability after we reorganised how their data was stored and accessed.",
      },
      {
        title: 'Legacy Data Migration',
        overline: '04',
        subtitle:
          "Move from outdated systems to modern data infrastructure, without losing a single record.",
        what:
          "We manage the full migration from legacy data systems to modern, cloud-based infrastructure. Every record is mapped, validated, and carried over with full integrity checks. You get a modern, accessible data environment and none of the risk of a poorly managed transition.",
        problem:
          "Years of valuable data locked inside old databases, on-premise servers, or discontinued software. It holds historical insight but is inaccessible, insecure, and increasingly expensive to maintain.",
        result:
          "A complete, verified migration to modern infrastructure: every record accounted for, historical data preserved and accessible, compliance maintained throughout. The business moves forward without leaving its data history behind.",
        outcome:
          "Healthcare provider: 3 clinics' patient records consolidated into a single structured system, compliance maintained, unified reporting enabled across all sites.",
      },
    ],
    ctaLine: 'Ready to build the data foundation your business decisions deserve?',
    ctaLabel: 'Get in Touch',
  },

  'ai-ml': {
    icon: Brain,
    tagline: 'AI & Machine Learning',
    hero: {
      title: 'Intelligent systems that learn from your data and scale with your business.',
      lede:
        "AI is no longer just for enterprise. It's a practical tool for any business sitting on data it isn't fully using. We build intelligent systems that handle repetitive decisions, surface hidden patterns, and personalise every customer interaction.",
    },
    intro:
      "Not generic AI products. Custom-built models and assistants trained on your data, your context, your business.",
    capabilities: [
      {
        title: 'Intelligent Chatbots & Virtual Assistants',
        overline: '01',
        subtitle:
          "Your business, always available. Answering questions, qualifying leads, and handling requests 24/7.",
        what:
          "We build AI-powered assistants that hold natural conversations on your website, WhatsApp, or internal systems. These aren't basic FAQ bots. They understand context, escalate to a human when needed, and get smarter over time. The result is less staff time spent on repetitive enquiries and more consistent customer experiences at any scale, around the clock.",
        problem:
          "Leads go cold and customers get frustrated simply because no one is available to respond instantly. Teams burn hours every week on repetitive questions that could be answered automatically.",
        result:
          "An AI assistant that handles the majority of inbound enquiries instantly, 24/7, freeing your team to focus on complex cases and high-value conversations rather than fielding the same questions repeatedly.",
        outcome:
          "Property management firm: AI assistant now handles 80% of 200+ monthly enquiries, including availability questions, viewing bookings, and follow-up details.",
      },
      {
        title: 'Document Intelligence & Automated Processing',
        overline: '02',
        subtitle:
          "Turn paper-based and document-heavy processes into fast, accurate, automated workflows.",
        what:
          "We build systems that read documents the way a human would: understanding structure, extracting the right fields, flagging anomalies, and routing information to the right place. The result is faster processing, fewer errors, and staff time redirected to work that actually requires human judgement.",
        problem:
          "Finance, legal, logistics, and HR teams spending hours manually reading, extracting, and cross-referencing documents. Slow, error-prone, and impossible to scale.",
        result:
          "Automated document processing that reads, extracts, validates, and routes information without human intervention, with exceptions flagged for review only when genuinely needed.",
        outcome:
          "Logistics company: automated invoice-to-PO matching system saves the finance team 2 full working days every week.",
      },
      {
        title: 'Personalisation & Recommendation Engines',
        overline: '03',
        subtitle:
          "Show every customer exactly what they need, at the moment they need it.",
        what:
          "We build recommendation systems that learn from user behaviour: browsing history, purchase patterns, engagement signals. They personalise what each user sees. This directly impacts conversion rates, average order value, and customer loyalty. The same technology that powers Amazon's recommendations, made accessible for mid-market businesses.",
        problem:
          "Generic experiences that treat every customer the same: showing the same products, the same content, the same offers regardless of what each person actually wants. Customers disengage.",
        result:
          "A personalisation engine that adapts in real time to each customer's behaviour, surfacing the right product, offer, or content at the right moment, driving measurable increases in order value and retention.",
        outcome:
          "B2C wellness brand: personalised product bundles at checkout increased average order value by 27% with no additional ad spend.",
      },
      {
        title: 'Custom AI Model Development',
        overline: '04',
        subtitle:
          "When off-the-shelf AI tools don't fit your unique challenge, we build from the ground up.",
        what:
          "We work with you to understand the problem, identify the right data, and build a model tailored to your specific context. This could be a fraud detection system, a quality control model, a demand forecaster, or a risk scoring engine. The output is a proprietary AI asset that gives you a durable competitive advantage, not a generic tool your competitors also have access to.",
        problem:
          "Generic AI products that weren't built for your industry, your data, or your specific problem, producing mediocre results and requiring constant manual correction.",
        result:
          "A custom-trained model built on your data, optimised for your specific use case, significantly outperforming any off-the-shelf alternative and delivering a proprietary competitive edge.",
        outcome:
          "E-commerce company: custom churn prediction model achieved 89% accuracy, reducing churn by 35% through targeted retention interventions.",
      },
    ],
    ctaLine: 'Want to see what AI can actually do for your specific business?',
    ctaLabel: 'Book a Discovery Call',
  },

  'data-analytics': {
    icon: BarChart3,
    tagline: 'Data Analytics',
    hero: {
      title: 'Where your data starts earning its keep.',
      lede:
        "Once your data is organised, this is where it starts earning its keep. Data only becomes valuable when someone can act on it.",
    },
    intro:
      "We turn your centralised data into clear, visual, real-time intelligence: the kind that changes how you make decisions. No more Monday morning spreadsheet compilations. No more reacting to last week's numbers. Dashboards, forecasting models, and operational analytics that put decision-makers in control.",
    capabilities: [
      {
        title: 'Executive Dashboards & Business Intelligence',
        overline: '01',
        subtitle:
          "Give decision-makers one clear view of the business. No spreadsheets, no waiting.",
        what:
          "We build live dashboards that pull data from all your tools (sales, marketing, finance, operations) and display the metrics that matter in real time. No manual effort. No stale numbers. Decision-makers get a single, trusted view of the business and can act on it the moment something needs attention.",
        problem:
          "Leadership teams spending hours every week manually compiling KPIs from multiple systems into a spreadsheet, only to share data that's already out of date by the time it's read.",
        result:
          "A live, automated dashboard that refreshes in real time, giving leadership instant visibility into performance across every function, from one screen, with zero manual effort.",
        outcome:
          "D2C brand: 4 hours of Monday morning manual reporting eliminated. Leadership now walks into weekly meetings with live data already on screen.",
      },
      {
        title: 'Operational Performance Analytics',
        overline: '02',
        subtitle:
          "Identify where your operations are losing time and money, then fix it with evidence.",
        what:
          "We build operational analytics systems that surface hidden inefficiencies before they become costly. You get a clear, ongoing view of where your operations are performing well and where there is measurable room for improvement, backed by data, not opinion or gut feel.",
        problem:
          "Operational inefficiencies that are invisible until they become crises: processes running slow, teams overloaded, suppliers causing repeat delays, all hidden in data that nobody is looking at systematically.",
        result:
          "An operational analytics system that continuously monitors performance, surfaces bottlenecks before they escalate, and quantifies the impact of every constraint, so you can fix the right things in the right order.",
        outcome:
          "Manufacturing company: analytics traced delivery delays to a single quality check station running at 60% capacity. Addressing it reduced average lead time by 22%.",
      },
      {
        title: 'Trend Analysis & Business Forecasting',
        overline: '03',
        subtitle:
          "Anticipate what's coming, so businesses can prepare instead of react.",
        what:
          "We build trend analysis and forecasting models that help you anticipate demand shifts, seasonal patterns, market movements, and operational needs. Presented through clear, visual dashboards, these forecasts become a practical planning tool, giving leadership the confidence to make commitments ahead of time rather than scrambling to respond to what's already arrived.",
        problem:
          "Making inventory, staffing, and budget decisions based on last quarter's actuals, and repeatedly getting caught out by demand spikes, stockouts, or overstocking that historical data could have predicted.",
        result:
          "A forecasting model that predicts demand weeks ahead, surfaces seasonal patterns automatically, and gives leadership a reliable basis for forward planning, turning reactive management into proactive strategy.",
        outcome:
          "Retail chain: demand forecasting model predicted category-level demand 6 weeks out, reducing stockouts by 64% and cutting excess stock costs by 30% in the first season.",
      },
    ],
    ctaLine: 'Want to stop making decisions on last week\u2019s data?',
    ctaLabel: 'Talk to Us',
  },

  'business-automation': {
    icon: Zap,
    tagline: 'Business Automation',
    hero: {
      title: 'Automate the repetitive. Let your team focus on work that matters.',
      lede:
        "Every hour your team spends copying data between systems, following up manually, or reconciling spreadsheets is an hour not spent on actual business growth.",
    },
    intro:
      "We identify the processes that are stealing your team's time and automate them, so everything runs in the background, accurately, without anyone having to touch it.",
    capabilities: [
      {
        title: 'Business Tool Integration',
        overline: '01',
        subtitle:
          "Connect the tools your business already uses, so data flows automatically instead of manually.",
        what:
          "We connect your existing business tools so when something happens in one place, everything else updates automatically. No more manual data entry. No more information slipping through the cracks. Faster operations, fewer human errors, and your team doing real work instead of administrative busywork.",
        problem:
          "Staff spending hours every week copying information between systems that don't talk to each other (CRM, accounting, e-commerce, helpdesk, spreadsheets) with errors introduced at every handoff.",
        result:
          "Fully integrated systems where every action triggers automatic updates across all connected tools, in real time, without manual intervention. Data stays accurate everywhere, instantly.",
        outcome:
          "E-commerce brand: Shopify, inventory, and QuickBooks connected in real time. 12 hours of manual weekly reconciliation eliminated entirely.",
      },
      {
        title: 'Sales & Lead Nurturing Automation',
        overline: '02',
        subtitle:
          "Follow up with every lead, at exactly the right time, without adding headcount.",
        what:
          "We automate the entire lead journey from first touch to the sales conversation, so every prospect gets a timely, relevant, personalised response. Your sales team only gets involved when a lead is warm and ready to talk. Everything before that point runs on autopilot.",
        problem:
          "Warm leads going cold because follow-up is slow, inconsistent, or forgotten. Sales teams manually chasing prospects across a high volume of leads, a process that simply cannot scale.",
        result:
          "A fully automated lead nurturing sequence that sends the right message at the right moment: instantly acknowledging new leads, delivering value over days, and presenting a call invite when the moment is right.",
        outcome:
          "B2B consulting firm: automated 4-step sequence (instant reply, value email, case study, call invite) increased response rates within the first 10 to 15 days of going live.",
      },
    ],
    ctaLine: 'Ready to stop doing manually what a machine can do for you?',
    ctaLabel: 'See What We Can Automate',
  },

  'custom-software': {
    icon: Code2,
    tagline: 'Custom Software',
    hero: {
      title: 'Websites, web apps, and platforms built to represent your business at its best.',
      lede:
        "Generic templates do generic things. If your business has specific workflows, specific customers, or specific ambitions, you need something built for you.",
    },
    intro:
      "We design and build websites, web applications, and internal tools that are fast, purposeful, and designed to perform, not just exist.",
    capabilities: [
      {
        title: 'Business Websites & Brand Presence',
        overline: '01',
        subtitle:
          "Your website is your most visible business asset. We make sure it earns its keep.",
        what:
          "We design and build websites crafted to reflect what makes your business distinctive. Every decision (structure, copy, design, speed) is made with conversion in mind. You get a website that genuinely represents your business and gives prospects the confidence to get in touch. Not a template with your logo on it.",
        problem:
          "A website that's outdated, generic, or slow, actively losing business by failing to communicate credibility, trust, and clarity to visitors who make a judgement in the first few seconds.",
        result:
          "A conversion-focused website that represents your business at its best: clear, fast, credible, and designed to turn visiting prospects into inbound enquiries without any increase in marketing spend.",
        outcome:
          "B2B consulting firm: inbound enquiries increased by 55% in the first 60 days after redesign, with no increase in marketing budget.",
      },
      {
        title: 'Customer-Facing Web Applications',
        overline: '02',
        subtitle:
          "When a website isn't enough, we build the digital tools your customers actually use.",
        what:
          "We design and build web applications tailored to your specific workflows and customer needs: customer portals, booking platforms, order tracking tools, self-service products. Everything is built to be fast, reliable, and intuitive. Customers use it without needing a manual, and your team can manage it without needing a developer on call.",
        problem:
          "Customers having to call or email to do things they should be able to do themselves: check order status, request bookings, access invoices. Creating unnecessary load on the operations team.",
        result:
          "A self-service web application that handles customer requests 24/7, reducing inbound calls, improving customer satisfaction, and freeing your team to focus on delivery rather than admin.",
        outcome:
          "Logistics firm: client portal for shipment tracking, bookings, and invoices reduced inbound calls by 60%.",
      },
      {
        title: 'Internal Business Tools & Portals',
        overline: '03',
        subtitle:
          "Replace the spreadsheets and email threads your team relies on with tools built for how they actually work.",
        what:
          "We build internal tools and portals tailored to your team's real workflows: project management systems, approval workflows, inventory managers, reporting dashboards, staff portals. Simple enough that adoption is immediate. Powerful enough that teams don't want to go back.",
        problem:
          "Internal processes running on a patchwork of spreadsheets, shared documents, and email threads that work until they don't, creating bottlenecks, introducing errors, and slowing everyone down as the business grows.",
        result:
          "A purpose-built internal tool that gives every team member visibility, accountability, and the right information at the right time, replacing the chaos of manual workarounds with a single, reliable system.",
        outcome:
          "Media agency: internal project management portal replaced email-based brief and approval process; on-time delivery improved significantly within one quarter.",
      },
      {
        title: 'E-Commerce & Digital Sales Platforms',
        overline: '04',
        subtitle:
          "Build the digital storefront that converts browsers into buyers, and buyers into repeat customers.",
        what:
          "We build custom e-commerce platforms and digital sales experiences optimised for conversion and designed for scale. Whether you're launching your first online store or need a fully customised buying experience that a template platform can't deliver, we build it to perform, not just exist.",
        problem:
          "A generic e-commerce template with poor mobile performance, a slow checkout, and a browsing experience that doesn't match the brand. Haemorrhaging mobile traffic before it reaches the buy button.",
        result:
          "A custom-built store with a mobile-first design, optimised checkout, and fast load times, converting significantly more visitors into buyers and increasing revenue per visitor without any extra ad spend.",
        outcome:
          "Fashion brand: mobile conversion increased by 44%, cart abandonment dropped by 28% after custom rebuild.",
      },
      {
        title: 'Ongoing Support, Maintenance & Growth',
        overline: '05',
        subtitle:
          "We don't disappear after launch. We stay on to make sure your investment keeps performing.",
        what:
          "We offer ongoing maintenance that keeps your digital products healthy, secure, and evolving: technical maintenance, performance monitoring, regular updates, and continuous improvement based on real user engagement. You get a long-term technology partner, not a one-time vendor who disappears when the invoice is paid.",
        problem:
          "Agencies that build and walk away, leaving clients with a product they can't support, improve, or evolve without hiring a new team to reverse-engineer someone else's work.",
        result:
          "A long-term partnership where your digital product is actively maintained, kept secure, and continuously improved, with new features delivered quickly because the foundation was built right the first time.",
        outcome:
          "Professional services firm: new reporting feature requested 6 months post-launch and delivered in 3 weeks, because the original codebase was built properly.",
      },
    ],
    ctaLine: 'Want a digital product that performs, not just exists?',
    ctaLabel: 'Start the Conversation',
  },
};

// =================================================================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
  }),
};

const CapabilityCard = ({ cap, idx }) => (
  <motion.article
    data-testid={`service-capability-${idx}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    custom={idx}
    variants={fadeUp}
    className="relative rounded-2xl border border-white/[0.08] bg-[#111]/70 backdrop-blur-sm p-6 md:p-10 overflow-hidden group hover:border-[#ff1493]/25 transition-colors duration-500"
  >
    {/* Subtle glow on hover */}
    <div
      aria-hidden="true"
      className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.35) 0%, transparent 70%)' }}
    />

    <div className="relative">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 md:mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493] mb-3">
            Capability · {cap.overline}
          </p>
          <h3 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-[1.15] mb-3">
            {cap.title}
          </h3>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
            {cap.subtitle}
          </p>
        </div>
      </div>

      {/* What this means for you */}
      <p className="text-zinc-300 text-[15px] md:text-base leading-[1.75] mb-6 md:mb-8">
        {cap.what}
      </p>

      {/* Problem / Result side by side */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-6">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 mb-3">
            The Problem
          </p>
          <p className="text-zinc-300 text-sm leading-[1.7]">{cap.problem}</p>
        </div>
        <div className="rounded-xl border border-[#ff1493]/15 bg-[#ff1493]/[0.04] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff1493] mb-3">
            The Result
          </p>
          <p className="text-zinc-200 text-sm leading-[1.7]">{cap.result}</p>
        </div>
      </div>

      {/* Client outcome */}
      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-[#ff1493]/[0.06] via-[#8A2BE2]/[0.06] to-transparent border-l-2 border-[#ff1493]/60 pl-4 pr-5 py-4">
        <Sparkles size={16} className="text-[#ff1493] mt-0.5 flex-shrink-0" />
        <p className="text-[13px] md:text-sm text-zinc-200 leading-[1.7]">
          <span className="text-[#ff1493] font-semibold">Client outcome. </span>
          {cap.outcome}
        </p>
      </div>
    </div>
  </motion.article>
);

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = SERVICES_DATA[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Navigate to landing page and scroll to a section.
  // React Router restores scroll position on nav; we override it by repeatedly
  // scrolling into view until the target is actually at the top.
  const goToLandingSection = (sectionId) => {
    const scrollTo = (smooth = true) => {
      const el = document.getElementById(sectionId);
      if (!el) return false;
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      return true;
    };

    if (window.location.pathname === '/') {
      scrollTo(true);
      return;
    }
    navigate('/');
    // Attempt scroll repeatedly after nav so it beats any scroll restoration.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      // First attempt uses instant scroll to force the position past any
      // browser/router restoration. Later attempts keep it locked.
      const ok = scrollTo(attempts > 2);
      if ((ok && attempts > 6) || attempts > 40) {
        clearInterval(interval);
      }
    }, 60);
  };

  // Fallback for unknown slugs
  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 text-center">
        <h1 data-testid="service-page-title" className="text-3xl md:text-5xl font-bold mb-4">
          Service not found
        </h1>
        <p className="text-zinc-400 mb-8">We don't recognise that service URL.</p>
        <Link
          to="/"
          data-testid="back-home-btn"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div
      data-testid={`service-page-${slug}`}
      className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-30"
        style={{ background: 'radial-gradient(circle, #ff1493 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40vh] -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #4b0082 0%, transparent 70%)' }}
      />

      {/* Back link */}
      <Link
        to="/"
        data-testid="service-back-home"
        className="fixed top-6 left-4 md:top-8 md:left-8 z-50 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] px-3.5 md:px-4 py-2 md:py-2.5 rounded-full transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to DevBroz</span>
        <span className="sm:hidden">Back</span>
      </Link>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ff1493]/25 bg-[#ff1493]/10 mb-6 md:mb-8"
        >
          <Icon size={14} className="text-[#ff1493]" />
          <span
            data-testid="service-page-tagline"
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] text-[#ff1493]"
          >
            {data.tagline}
          </span>
        </motion.div>

        <motion.h1
          data-testid="service-page-title"
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="text-[34px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl mb-6 md:mb-8"
        >
          {data.hero.title.split('.').map((part, i, arr) =>
            part.trim() ? (
              <span key={i}>
                {i === 0 ? (
                  part
                ) : (
                  <span className="gradient-text">{part}</span>
                )}
                {i < arr.length - 1 ? '.' : ''}
              </span>
            ) : null
          )}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-zinc-400 text-base md:text-xl leading-relaxed max-w-2xl"
        >
          {data.hero.lede}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="mt-10 md:mt-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-5 md:p-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff1493] mb-3">
            Overview
          </p>
          <p className="text-zinc-200 text-[15px] md:text-lg leading-[1.75]">
            {data.intro}
          </p>
        </motion.div>
      </section>

      <div className="line-gradient" />

      {/* Capabilities */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493] mb-4">
            What we build
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            Capabilities in this practice.
          </h2>
        </div>

        <div className="space-y-5 md:space-y-6">
          {data.capabilities.map((cap, idx) => (
            <CapabilityCard key={cap.title} cap={cap} idx={idx} />
          ))}
        </div>
      </section>

      <div className="line-gradient" />

      {/* CTA */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#141414] to-[#0a0a0a] p-8 md:p-16 text-center relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.1]"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, #ff1493 0%, transparent 60%)',
            }}
          />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff1493] mb-4">
              {data.tagline}
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto mb-8 md:mb-10">
              {data.ctaLine}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <button
                type="button"
                data-testid="service-cta-contact"
                onClick={() => goToLandingSection('contact')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#ff1493] hover:bg-[#ff3ea3] px-6 py-3.5 rounded-full transition-colors w-full sm:w-auto justify-center"
              >
                {data.ctaLabel}
                <ArrowUpRight size={16} />
              </button>
              <button
                type="button"
                data-testid="service-cta-back"
                onClick={() => goToLandingSection('services')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/[0.12] hover:border-[#ff1493]/60 hover:text-[#ff1493] px-6 py-3.5 rounded-full transition-colors w-full sm:w-auto justify-center"
              >
                Explore other services
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mini footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 md:py-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="DevBroz" className="w-7 h-7" />
            <span className="text-white font-bold text-sm tracking-tight">
              Dev<span className="text-[#ff1493]">Broz</span>
            </span>
          </div>
          <p className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} DevBroz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServicePage;
