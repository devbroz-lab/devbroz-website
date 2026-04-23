import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Interactive dotted grid with opening ripple
const DotGrid = ({ mousePos, rippleTrigger }) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const rippleRef = useRef([]);

  // Trigger ripple when rippleTrigger changes
  useEffect(() => {
    if (rippleTrigger > 0) {
      const now = performance.now();
      rippleRef.current = [
        { active: true, radius: 0, startTime: now, speed: 1400, band: 50, intensity: 0.75 },
        { active: true, radius: 0, startTime: now + 120, speed: 1100, band: 35, intensity: 0.4 },
      ];
    }
  }, [rippleTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Store layout size (ignores CSS transforms) so drawing isn't affected
    // by framer-motion layoutId transform animations.
    const sizeRef = { w: 0, h: 0 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      // Use the canvas's own visible (post-transform) rect so bitmap size
      // always matches what's on screen. This avoids a mismatch when the
      // modal is still mid-scale from its layoutId animation.
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 2 || h < 2) return;
      sizeRef.w = w;
      sizeRef.h = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    // Retry during the modal's layoutId animation (transforms don't trigger
    // ResizeObserver, so poll briefly until layout stabilises).
    const retries = [50, 150, 300, 500, 800];
    const timers = retries.map((ms) => setTimeout(resize, ms));
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const GAP = 14;
    const BASE_RADIUS = 0.6;
    const GLOW_RADIUS = 100;

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      const width = sizeRef.w;
      const height = sizeRef.h;
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const cx = width / 2;
      const cy = height / 2;

      // Update ripple
      const ripple = rippleRef.current;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      for (let r = 0; r < ripple.length; r++) {
        const rp = ripple[r];
        if (rp.active) {
          const elapsed = (performance.now() - rp.startTime) / 1000;
          // Ease-out: fast in center, slows toward edges
          const progress = Math.min(elapsed * rp.speed / maxDist, 1);
          const eased = 1 - Math.pow(1 - progress, 2); // quadratic ease-out
          rp.radius = eased * maxDist;
          if (progress >= 1) {
            rp.active = false;
          }
        }
      }

      for (let x = GAP; x < width; x += GAP) {
        for (let y = GAP; y < height; y += GAP) {
          // Mouse glow
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / GLOW_RADIUS);

          // Ripple glow — check all active ripples
          let rippleInfluence = 0;
          for (let r = 0; r < ripple.length; r++) {
            const rp = ripple[r];
            if (rp.active) {
              const rdx = x - cx;
              const rdy = y - cy;
              const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
              const diff = Math.abs(rDist - rp.radius);
              if (diff < rp.band) {
                rippleInfluence = Math.max(rippleInfluence, (1 - diff / rp.band) * rp.intensity);
              }
            }
          }

          const influence = Math.max(mouseInfluence, rippleInfluence);

          if (influence > 0.01) {
            const hue = 320 + (x / width) * 40;
            const glowAlpha = influence * 0.85;
            const radius = BASE_RADIUS + influence * 1.5;
            ctx.fillStyle = `hsla(${hue}, 90%, ${50 + influence * 20}%, ${glowAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.arc(x, y, BASE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [mousePos, rippleTrigger]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const ContactSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [form, setForm] = useState({ name: '', business: '', email: '', details: '' });
  // status: 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const modalRef = useRef(null);
  const leftPanelRef = useRef(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e) => {
    const rect = leftPanelRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current.x = -1000;
    mousePos.current.y = -1000;
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isExpanded]);

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setForm({ name: '', business: '', email: '', details: '' });
      setStatus('idle');
      setErrorMsg('');
    }, 400);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg('');
    try {
      await axios.post(`${API}/contact`, {
        name: form.name.trim(),
        business: form.business.trim(),
        email: form.email.trim(),
        details: form.details.trim(),
      });
      setStatus('success');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setErrorMsg(
        typeof detail === 'string'
          ? detail
          : "Couldn't send right now. Please email enquiry@devbroz.com directly."
      );
      setStatus('error');
    }
  };

  return (
    <section data-testid="contact-section" className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#ff1493] mb-4">
            Let&apos;s Talk
          </p>
          <h2 data-testid="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Got a Problem That Needs Fixing?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto mb-10">
            Tell us what is broken. We will show you exactly how we would fix it.
          </p>

          {/* Expandable Button */}
          <AnimatePresence initial={false}>
            {!isExpanded && (
              <motion.div className="inline-block relative mt-4">
                <motion.div
                  style={{ borderRadius: '100px' }}
                  layout
                  layoutId="contact-expand"
                  className="absolute inset-0 bg-gradient-to-r from-[#ff1493] to-[#4b0082]"
                />
                <motion.button
                  data-testid="contact-get-in-touch-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.15 }}
                  layout={false}
                  onClick={() => { setIsExpanded(true); setRippleTrigger(r => r + 1); }}
                  className="relative flex items-center gap-2 h-14 px-8 py-3 text-base font-semibold text-white tracking-wide hover:opacity-90 transition-opacity"
                >
                  Let&apos;s Talk
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Expanding card */}
            <motion.div
              ref={modalRef}
              layoutId="contact-expand"
              transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
              style={{ borderRadius: '16px' }}
              layout
              className="relative w-full max-w-4xl h-[85vh] md:h-[70vh] overflow-hidden bg-[#0e0e0e] border border-white/[0.1] shadow-2xl"
            >
              {/* Close */}
              <motion.button
                data-testid="contact-modal-close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={handleClose}
                className="absolute right-4 top-4 z-30 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <X size={16} />
              </motion.button>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="relative z-10 grid grid-cols-1 md:grid-cols-2 h-full"
              >
                {/* Left — Heading with dot grid + hover effect */}
                <div
                  ref={leftPanelRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="hidden md:flex flex-col items-center justify-center px-10 relative overflow-hidden"
                >
                  {/* Dot grid behind the quote only */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <DotGrid mousePos={mousePos} rippleTrigger={rippleTrigger} />
                  </div>

                  <div className="text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-white mb-3">
                      Got a Problem
                      <br />
                      <span className="gradient-text">That Needs Fixing?</span>
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      Tell us what is broken. We will
                      <br />get back to you within 24 hours.
                    </p>
                  </div>
                </div>

                {/* Right — Form (solid background, no dot grid) */}
                <div className="flex flex-col justify-center p-6 md:p-10 overflow-y-auto relative z-10 bg-[#0e0e0e]">
                  <div className="md:hidden mb-5">
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                      Got a problem <span className="gradient-text">that needs fixing?</span>
                    </h2>
                    <p className="text-zinc-500 text-sm">Tell us what is broken. We will get back to you within 24 hours.</p>
                  </div>

                  {status === 'success' ? (
                    <motion.div
                      data-testid="contact-form-success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col items-center text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff1493] to-[#4b0082] flex items-center justify-center mb-5 shadow-lg shadow-pink-500/25">
                        <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                        Message on its way.
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
                        Thanks {form.name ? form.name.split(' ')[0] : 'for reaching out'}. We'll get back to you at{' '}
                        <span className="text-zinc-200">{form.email}</span> within 24 hours.
                      </p>
                      <button
                        type="button"
                        data-testid="contact-form-close-success"
                        onClick={handleClose}
                        className="px-6 py-2.5 text-sm font-semibold text-white border border-white/[0.15] hover:border-[#ff1493]/60 hover:text-[#ff1493] rounded-full transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-7">
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2.5">
                          Name <span className="text-[#ff1493]">*</span>
                        </label>
                        <input data-testid="contact-form-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Please enter your full name" required disabled={status === 'submitting'} className="w-full bg-transparent border-b border-white/[0.15] pb-3 text-base text-white placeholder:text-zinc-600 focus:border-[#ff1493]/50 focus:outline-none transition-colors disabled:opacity-60" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2.5">
                          Business <span className="text-[#ff1493]">*</span>
                        </label>
                        <input data-testid="contact-form-business" type="text" name="business" value={form.business} onChange={handleChange} placeholder="Enter your company name" required disabled={status === 'submitting'} className="w-full bg-transparent border-b border-white/[0.15] pb-3 text-base text-white placeholder:text-zinc-600 focus:border-[#ff1493]/50 focus:outline-none transition-colors disabled:opacity-60" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2.5">
                          Email <span className="text-[#ff1493]">*</span>
                        </label>
                        <input data-testid="contact-form-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required disabled={status === 'submitting'} className="w-full bg-transparent border-b border-white/[0.15] pb-3 text-base text-white placeholder:text-zinc-600 focus:border-[#ff1493]/50 focus:outline-none transition-colors disabled:opacity-60" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-zinc-200 mb-2.5">
                          Project Details <span className="text-[#ff1493]">*</span>
                        </label>
                        <textarea data-testid="contact-form-details" name="details" value={form.details} onChange={handleChange} placeholder="Give an abstract idea of your business and requirements from us" required rows={3} disabled={status === 'submitting'} className="w-full bg-transparent border-b border-white/[0.15] pb-3 text-base text-white placeholder:text-zinc-600 focus:border-[#ff1493]/50 focus:outline-none transition-colors resize-none disabled:opacity-60" />
                      </div>

                      {status === 'error' && (
                        <div data-testid="contact-form-error" className="flex items-start gap-2.5 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-4 py-3">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          data-testid="contact-form-submit"
                          type="submit"
                          disabled={status === 'submitting'}
                          className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#ff1493] to-[#4b0082] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                          {status === 'submitting' ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
