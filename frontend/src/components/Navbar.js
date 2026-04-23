import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '#home', type: 'scroll' },
  { label: 'About', href: '#about', type: 'scroll' },
  { label: 'Work', href: '#work', type: 'scroll' },
  { label: 'Services', href: '#services', type: 'scroll' },
  { label: 'Partners', to: '/partners', type: 'route' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  const handleNavClick = (link) => {
    if (link.type === 'route') {
      setMobileOpen(false);
      navigate(link.to);
    } else {
      scrollTo(link.href);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav
        data-testid="navbar"
        className={`transition-all duration-500 rounded-full px-3 py-2 flex items-center gap-1 ${
          scrolled
            ? 'bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/30'
            : 'bg-[#1a1a1a]/70 backdrop-blur-lg border border-white/[0.05]'
        }`}
      >
        {/* Logo */}
        <button
          data-testid="navbar-logo"
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2 pl-3 pr-4 group"
        >
          <img
            src="/logo.png"
            alt="DevBroz"
            className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-white font-bold text-sm tracking-tight hidden sm:inline">
            Dev<span className="text-[#ff1493]">Broz</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              onClick={() => handleNavClick(link)}
              className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          data-testid="nav-contact-btn"
          onClick={() => scrollTo('#contact')}
          className="hidden md:flex items-center gap-1.5 ml-1 px-4 py-1.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#ff1493] to-[#4b0082] hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
        >
          Get in Touch
        </button>

        {/* Mobile Hamburger */}
        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2 ml-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full mt-2 left-4 right-4 bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl shadow-black/40"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => handleNavClick(link)}
                  className="text-zinc-300 hover:text-white text-sm font-medium transition-colors text-left px-3 py-2 rounded-lg hover:bg-white/[0.06]"
                >
                  {link.label}
                </button>
              ))}
              <button
                data-testid="mobile-contact-btn"
                onClick={() => scrollTo('#contact')}
                className="mt-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#ff1493] to-[#4b0082] w-fit"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
