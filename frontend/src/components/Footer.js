import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <footer data-testid="footer" className="border-t border-white/[0.08] py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 md:gap-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="DevBroz" className="w-8 h-8" />
              <span className="text-white font-bold text-lg tracking-tight">
                Dev<span className="text-[#ff1493]">Broz</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              We handle the tech. You run the business.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">
              Navigation
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Work', href: '#work' },
                { label: 'Services', href: '#services' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <button
                  key={link.label}
                  data-testid={`footer-link-${link.label.toLowerCase()}`}
                  onClick={() => scrollTo(link.href)}
                  className="text-zinc-400 hover:text-white text-sm transition-colors text-left w-fit"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/partners"
                data-testid="footer-link-partners"
                className="partners-gradient-link text-sm font-semibold text-left w-fit"
              >
                Global Partners
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">
              Connect
            </p>
            <div className="flex flex-col gap-2">
              <a
                data-testid="footer-social-instagram"
                href="https://www.instagram.com/dev.broz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff1493] text-sm transition-colors w-fit"
              >
                Instagram
              </a>
              <a
                data-testid="footer-social-linkedin"
                href="https://www.linkedin.com/company/devbroz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#ff1493] text-sm transition-colors w-fit"
              >
                LinkedIn
              </a>
              <a
                data-testid="footer-social-email"
                href="mailto:enquiry@devbroz.com"
                className="text-zinc-400 hover:text-[#ff1493] text-sm transition-colors w-fit"
              >
                enquiry@devbroz.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="line-gradient mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p data-testid="footer-copyright" className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} DevBroz. All rights reserved.
          </p>
          <p className="text-zinc-700 text-xs">
            Built with precision and purpose.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
