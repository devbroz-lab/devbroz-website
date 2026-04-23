import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingPaths from './FloatingPaths';

const PRINCIPLES = [
  {
    index: '01',
    title: 'Business-first thinking',
    tag: 'Strategy',
    desc: "We don't start with the tech. We start with what you are actually trying to fix. Every build is mapped to a real business outcome, not a feature wishlist.",
  },
  {
    index: '02',
    title: 'Dedicated project manager',
    tag: 'People',
    desc: "One person. Owns the whole thing. You always know who to call and they always know what is happening. No ticket queues. No handoffs.",
  },
  {
    index: '03',
    title: 'Transparent pricing',
    tag: 'Trust',
    desc: "We scope it. We price it. We lock it. You know the number before we write a single line of code. No hidden fees. Ever.",
  },
  {
    index: '04',
    title: 'Built to work.',
    tag: 'Delivery',
    desc: "Launching is the easy part. We stay until it works in the real world, not just on a staging server.",
  },
];

const ArrowIcon = ({ active }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-[350ms]"
    style={{
      transform: active ? 'rotate(45deg)' : 'rotate(0deg)',
      transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
    }}
  >
    <path d="M2 7h10M7 2l5 5-5 5" />
  </svg>
);

const Principle = ({ data, isActive, onToggle, idx, isLast }) => {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isActive ? bodyRef.current.scrollHeight : 0);
    }
  }, [isActive]);

  return (
    <div
      data-testid={`principle-row-${idx}`}
      onClick={onToggle}
      className={`flex items-stretch ${
        idx === 0 ? '' : 'border-t border-white/[0.07]'
      } cursor-pointer transition-colors duration-[250ms] ${
        isActive ? 'bg-[#ff1493]/[0.04]' : 'bg-transparent hover:bg-white/[0.015]'
      }`}
    >
      {/* Index column */}
      <div
        className={`w-[52px] md:w-[80px] flex-shrink-0 flex items-start justify-end pr-3 md:pr-5 py-6 md:py-7 text-[11px] font-medium tracking-[1px] border-r border-white/[0.07] transition-colors duration-[250ms] ${
          isActive ? 'text-[#ff1493]' : 'text-white/15'
        }`}
      >
        {data.index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Row header */}
        <div className="flex items-center justify-between gap-3 md:gap-4 py-6 md:py-7 pl-4 pr-4 md:pl-6 md:pr-7">
          <p
            className={`text-[15px] sm:text-[17px] md:text-[21px] font-bold tracking-[-0.3px] transition-colors duration-[250ms] leading-snug ${
              isActive ? 'text-white' : 'text-zinc-200'
            }`}
          >
            {data.title}
          </p>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <span
              className="hidden sm:inline-block text-[10px] font-bold tracking-[2px] uppercase whitespace-nowrap px-3.5 py-[5px] rounded-full transition-all duration-300"
              style={{
                color: isActive ? '#ff69b4' : 'transparent',
                background: isActive ? 'rgba(255,105,180,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(255,105,180,0.25)' : 'transparent'}`,
              }}
            >
              {data.tag}
            </span>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${isActive ? 'rgba(255,20,147,0.35)' : 'rgba(255,255,255,0.08)'}`,
                background: isActive ? 'rgba(255,20,147,0.1)' : 'transparent',
                color: isActive ? '#ff1493' : '#555',
              }}
            >
              <ArrowIcon active={isActive} />
            </div>
          </div>
        </div>

        {/* Expandable body */}
        <div
          ref={bodyRef}
          className="overflow-hidden"
          style={{
            maxHeight: `${height}px`,
            transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start pt-1 pb-7 md:pb-8 pl-4 pr-4 md:pl-6 md:pr-7 border-t border-white/[0.04]">
            <p className="flex-1 text-[14px] font-light text-zinc-400 leading-[1.85] pt-5">
              {data.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowWeWork = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <section
      data-testid="how-we-work-section"
      className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Flowing background paths */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, transparent 45%, #0a0a0a 85%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Header, matches Case Studies heading format */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#ff1493] mb-4">
            How We Work
          </p>
          <h2
            data-testid="how-we-work-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            How We Work
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl">
            Fixed scope. Locked pricing. One point of contact you can always
            reach. A team that actually shows up.
          </p>
        </motion.div>

        {/* Principles list, wrapped in translucent rounded container */}
        <div
          data-testid="principles-container"
          className="rounded-2xl border border-white/[0.08] bg-[#121212]/70 backdrop-blur-md overflow-hidden"
        >
          {PRINCIPLES.map((p, i) => (
            <Principle
              key={p.index}
              idx={i}
              data={p}
              isActive={activeIndex === i}
              onToggle={() => handleToggle(i)}
              isLast={i === PRINCIPLES.length - 1}
            />
          ))}
        </div>

        {/* Footer bar, also in translucent rounded container */}
        <div
          data-testid="how-we-work-footer"
          className="mt-6 md:mt-8 rounded-2xl border border-white/[0.08] bg-[#121212]/70 backdrop-blur-md px-5 md:px-8 py-5 flex items-center justify-between flex-wrap gap-4 md:gap-5"
        >
          <p className="text-[13px] font-normal text-zinc-500 leading-snug">
            <span className="text-zinc-400">Not just another service provider.</span>{' '}
            Your technology partner.
          </p>

          <button
            data-testid="how-we-work-cta"
            onClick={scrollToContact}
            className="text-[13px] font-bold text-white bg-[#ff1493] hover:bg-[#ff3ea3] border-0 px-6 md:px-7 py-3 md:py-3.5 rounded-full cursor-pointer tracking-[0.3px] transition-colors duration-200"
          >
            Get in touch →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
