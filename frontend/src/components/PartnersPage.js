import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Users,
  Zap,
  Droplets,
  Briefcase,
  Globe2,
} from 'lucide-react';

const PARTNER = {
  name: 'GreenTech Consulting GmbH',
  shortName: 'GreenTech Consulting',
  logo: 'https://customer-assets.emergentagent.com/job_features-1007/artifacts/ibc6qo6g_logo-removebg.png',
  website: 'https://www.greentech-consulting.com/',
  tagline:
    'Empowering clients with sustainable solutions, built by seasoned experts from Europe.',
  about:
    "GreenTech Consulting GmbH, proudly established by seasoned experts from Europe, is all about empowering clients with sustainable solutions. They're passionate about achieving impactful results and making a real difference through every project, blending the science and art of management with tailored, holistic models.",
};

const VALUES = [
  {
    icon: Leaf,
    title: 'Sustainable',
    desc: 'Embedding sustainable principles across every engagement, from strategy to execution, creating meaningful environmental and social impact through responsible, future-focused practices.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative',
    desc: 'Fostering a culture of creativity and forward thinking. Challenging conventions and embracing change to help clients navigate complexity with bold strategies that drive real outcomes.',
  },
  {
    icon: ShieldCheck,
    title: 'Ethical',
    desc: 'Upholding the highest standards of ethics in every client and stakeholder interaction, transparency, accountability, and integrity at the forefront of every decision.',
  },
  {
    icon: Users,
    title: 'Collaborative',
    desc: 'Believing in the power of partnership. Working closely with clients, communities, governments, and stakeholders to co-create sustainable, long-lasting solutions.',
  },
];

const SERVICES = [
  {
    icon: Zap,
    title: 'Energy',
    desc: 'Engineering, planning, and consulting for renewable energy, utility management, climate finance, and policy advisory.',
  },
  {
    icon: Droplets,
    title: 'Water & Environment',
    desc: 'Technical studies, regulatory support, institutional development, and sustainable water resource management.',
  },
  {
    icon: Briefcase,
    title: 'Sustainable Business Services',
    desc: 'Training, capacity building, market entry support, ESG facilitation, and strategic consulting for public and private sectors.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const PartnersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      data-testid="partners-page"
      className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative"
    >
      {/* Soft ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-30"
        style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40vh] -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #ff1493 0%, transparent 70%)' }}
      />

      {/* Back link, always visible */}
      <Link
        to="/"
        data-testid="partners-back-home"
        className="fixed top-6 left-6 md:top-8 md:left-8 z-50 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] px-4 py-2.5 rounded-full transition-all group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to DevBroz
      </Link>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-28">
        <motion.p
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="text-xs uppercase tracking-[0.3em] font-semibold text-[#ff1493] mb-5"
          data-testid="partners-overline"
        >
          DevBroz · Global Partners
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          data-testid="partners-hero-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl"
        >
          Tech that scales.{' '}
          <span className="bg-gradient-to-r from-[#ff1493] via-[#8A2BE2] to-[#22c55e] bg-clip-text text-transparent">
            Impact that lasts.
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-zinc-400 text-base md:text-xl mt-6 md:mt-8 max-w-2xl leading-relaxed"
        >
          DevBroz partners with firms whose values align with ours, expanding
          what we can deliver to clients. Meet our global partner.
        </motion.p>

        {/* Partner card */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          data-testid="partner-card"
          className="mt-12 md:mt-20 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-6 md:p-12 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ff1493 0%, transparent 50%)',
            }}
          />
          <div className="relative grid md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr] gap-8 md:gap-10 lg:gap-12 items-center">
            <a
              href={PARTNER.website}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="partner-logo-link"
              className="block group"
            >
              <div className="aspect-square w-full max-w-[180px] md:max-w-[220px] mx-auto md:mx-0 rounded-2xl bg-black/40 border border-white/[0.06] p-5 md:p-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={PARTNER.logo}
                  alt={PARTNER.name}
                  className="w-full h-full object-contain"
                  data-testid="partner-logo-img"
                />
              </div>
            </a>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe2 size={14} className="text-[#22c55e]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400">
                  Germany
                </span>
              </div>
              <h2
                data-testid="partner-name"
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight"
              >
                {PARTNER.name}
              </h2>
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6">
                {PARTNER.tagline}
              </p>
              <a
                href={PARTNER.website}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="partner-website-cta"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#ff1493] hover:bg-[#ff3ea3] px-5 py-3 rounded-full transition-colors"
              >
                Visit greentech-consulting.com
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="line-gradient" />

      {/* About */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="max-w-3xl"
        >
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-zinc-500 mb-5">
            About the partnership
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]">
            Sustainable impact,{' '}
            <span className="text-[#22c55e]">shared expertise.</span>
          </h3>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            {PARTNER.about}
          </p>
        </motion.div>
      </section>

      <div className="line-gradient" />

      {/* Core values */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28">
        <div className="max-w-3xl mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[#ff1493] mb-5">
            Core values
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            The principles that guide{' '}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#8A2BE2] bg-clip-text text-transparent">
              every engagement.
            </span>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                variants={fadeUp}
                data-testid={`partner-value-${v.title.toLowerCase()}`}
                className="bg-[#0a0a0a] p-6 md:p-10 group hover:bg-white/[0.015] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5 md:mb-6 group-hover:border-[#22c55e]/40 transition-colors">
                  <Icon size={20} className="text-[#22c55e]" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  {v.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="line-gradient" />

      {/* Services */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28">
        <div className="max-w-3xl mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-zinc-500 mb-5">
            Services portfolio
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            What GreenTech delivers.
          </h3>
          <p className="text-zinc-400 text-base md:text-lg mt-5 md:mt-6 max-w-2xl leading-relaxed">
            Tailored, holistic solutions that engage stakeholders proactively,
            blending the science and art of management.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                variants={fadeUp}
                data-testid={`partner-service-${s.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')}`}
                className="relative p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-[#22c55e]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mb-5 md:mb-6">
                  <Icon size={22} className="text-[#22c55e]" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold tracking-tight mb-3">
                  {s.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="line-gradient" />

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121212] to-[#0a0a0a] p-8 md:p-16 text-center relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, #22c55e 0%, transparent 60%)',
            }}
          />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto mb-5 md:mb-6">
              Ready to turn vision into{' '}
              <span className="bg-gradient-to-r from-[#ff1493] to-[#22c55e] bg-clip-text text-transparent">
                sustainable impact?
              </span>
            </h3>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
              Together, DevBroz and GreenTech Consulting bring engineering,
              data, and sustainability under one roof. Let's build what matters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link
                to="/#contact"
                data-testid="partners-cta-contact"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/#contact';
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#ff1493] hover:bg-[#ff3ea3] px-6 py-3.5 rounded-full transition-colors w-full sm:w-auto justify-center"
              >
                Talk to DevBroz
                <ArrowUpRight size={16} />
              </Link>
              <a
                href={PARTNER.website}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="partners-cta-partner-site"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/[0.12] hover:border-[#22c55e]/60 hover:text-[#22c55e] px-6 py-3.5 rounded-full transition-colors w-full sm:w-auto justify-center"
              >
                Visit GreenTech Consulting
                <ArrowUpRight size={16} />
              </a>
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
              <span className="text-zinc-500 font-normal">
                <span className="mx-2">×</span>
                <span className="text-[#22c55e] font-semibold">GreenTech Consulting</span>
              </span>
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

export default PartnersPage;
