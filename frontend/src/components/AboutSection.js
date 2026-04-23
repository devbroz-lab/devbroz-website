import React from 'react';
import { motion } from 'framer-motion';
import CobeGlobe from './RotatingGlobe';

const AboutSection = () => {
  return (
    <section data-testid="about-section" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#ff1493] mb-4">
              About Us
            </p>
            <h2
              data-testid="about-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
            >
              We Handle the Tech.{' '}
              <span className="gradient-text">You Handle the Business.</span>
            </h2>
            <div className="space-y-4 text-zinc-400 text-base leading-relaxed">
              <p>
                Most businesses don&apos;t need more people. They need their
                existing team to stop losing hours to work that should be
                automated, systematised, or just built properly the first time.
              </p>
              <p>
                We work across data engineering, AI, analytics, automation,
                and custom software. We get in, figure out what is actually
                broken, build the fix, and stick around to make sure it keeps
                working.
              </p>
              <p>
                We have delivered across e-commerce, logistics, healthcare,
                finance, and professional services. 50+ projects in. We are
                not here to impress you with jargon. We are here to get things
                done.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-start gap-10 md:gap-14 mt-10">
              {[
                { value: '50+', label: 'Projects Delivered' },
                { value: '5+', label: 'Industries Served' },
              ].map((stat) => (
                <div key={stat.label} data-testid={`about-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Globe */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center order-first lg:order-none"
          >
            <CobeGlobe className="w-full max-w-[360px] md:max-w-[420px] lg:max-w-[450px] mx-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
