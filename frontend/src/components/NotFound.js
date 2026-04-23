import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = '404 — Page Not Found · DevBroz';
  }, []);

  return (
    <div
      data-testid="not-found-page"
      className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative flex flex-col items-center justify-center px-4"
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-30"
        style={{ background: 'radial-gradient(circle, #ff1493 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #4b0082 0%, transparent 70%)' }}
      />

      {/* Top brand */}
      <Link
        to="/"
        data-testid="not-found-brand"
        className="fixed top-6 left-4 md:top-8 md:left-8 z-50 inline-flex items-center gap-2"
      >
        <img src="/logo.png" alt="DevBroz" className="w-7 h-7" />
        <span className="text-white font-bold text-sm tracking-tight">
          Dev<span className="text-[#ff1493]">Broz</span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl text-center"
      >
        <p
          data-testid="not-found-code"
          className="text-[120px] sm:text-[160px] md:text-[200px] font-bold tracking-tighter leading-none gradient-text"
          style={{ lineHeight: 0.9 }}
        >
          404
        </p>

        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.28em] text-[#ff1493] mt-2 mb-5">
          Off the map
        </p>

        <h1
          data-testid="not-found-title"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          This page is{' '}
          <span className="gradient-text">out of scope</span>.
        </h1>

        <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10">
          The URL you followed doesn&apos;t point to anything on our site. It may have moved, been renamed, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            data-testid="not-found-home-btn"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#ff1493] to-[#4b0082] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <Home size={16} />
            Take me home
          </Link>
          <a
            data-testid="not-found-email-btn"
            href="mailto:enquiry@devbroz.com"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-white/[0.12] hover:border-[#ff1493]/60 hover:text-[#ff1493] rounded-full transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={16} />
            Email the team
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
