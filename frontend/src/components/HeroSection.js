import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LivingFluidBlob from './LivingFluidBlob';

const SERVICES = [
  'Workflow Automations',
  'AI Services',
  'ML Models',
  'Analytics',
  'Custom Software',
  'Web Development',
  'Data Engineering',
  'IT Services',
];

const DOUBLED = [...SERVICES, ...SERVICES];

const Marquee = () => {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const speedRef = useRef(1); // 1 = normal, 0.3 = slow
  const targetSpeedRef = useRef(1);
  const rafRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      // Smoothly lerp speed toward target
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;

      posRef.current -= 0.5 * speedRef.current;

      // Reset when half the track has scrolled (seamless loop)
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(posRef.current) >= halfWidth) {
        posRef.current = 0;
      }

      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseEnter = useCallback(() => {
    targetSpeedRef.current = 0.3;
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetSpeedRef.current = 1;
  }, []);

  return (
    <div
      className="overflow-hidden py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-5 sm:gap-8 whitespace-nowrap w-max will-change-transform"
      >
        {DOUBLED.map((service, idx) => (
          <span
            key={idx}
            data-testid={`service-item-${idx}`}
            className="text-[11px] sm:text-sm md:text-base font-medium text-zinc-300 hover:text-[#ff69b4] transition-colors duration-300 cursor-default flex items-center gap-5 sm:gap-8"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
          >
            {service}
            <span className="text-zinc-500 text-base sm:text-lg">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const scrollToExpertise = () => {
    const el = document.querySelector('#services');
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* 3D Interactive Blob Background */}
      <LivingFluidBlob />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
        {/* Headline */}
        <motion.h1
          data-testid="hero-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[34px] sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-white mb-5 md:mb-6"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
        >
          Tech that <span className="gradient-text">thinks for itself.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          data-testid="hero-subtext"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-[13px] sm:text-base md:text-lg text-zinc-300 max-w-2xl mb-7 md:mb-10 leading-relaxed px-2"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
        >
          Tools built to do their job, so you can focus on yours.
        </motion.p>

        {/* Services Carousel */}
        <motion.div
          data-testid="services-carousel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-3xl relative mb-8 md:mb-10"
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-[#0a0a0a]/40 to-transparent z-10 pointer-events-none" />

          <Marquee />
        </motion.div>

        {/* Explore Now Button */}
        <motion.button
          data-testid="explore-now-btn"
          onClick={scrollToExpertise}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 text-zinc-300 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm font-semibold tracking-wide uppercase" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            Explore Now
          </span>
          <ChevronDown
            size={20}
            className="bounce-arrow group-hover:text-[#ff1493] transition-colors"
          />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
