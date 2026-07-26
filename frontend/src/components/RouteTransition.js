import React, { useEffect, useState } from 'react';

/**
 * RouteTransition — reuses the LogoLoader visual as a bridge
 * between dark ↔ light themed pages.
 *
 * Matches the main site LogoLoader exactly:
 *   1. Mount at full opacity (instant, no fade-in)
 *   2. Navigate immediately, hold for HOLD_MS (≈ 45 frames at 60fps)
 *   3. Fade out (FADE_MS — same 600ms as LogoLoader)
 *   4. Unmount
 *
 * Uses the same .logo-loader-* CSS classes from App.css.
 */

const HOLD_MS = 750;
const FADE_MS = 600;

const RouteTransition = ({ onNavigate, onComplete }) => {
  const [phase, setPhase] = useState('hold'); // hold → exit → done

  // Fire navigation immediately on mount, then hold
  useEffect(() => {
    if (onNavigate) onNavigate();
    const t = setTimeout(() => setPhase('exit'), HOLD_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => setPhase('done'), FADE_MS + 50);
      return () => clearTimeout(t);
    }
    if (phase === 'done' && onComplete) {
      onComplete();
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`logo-loader-root ${phase === 'exit' ? 'logo-loader-exit' : ''}`}
      aria-hidden="true"
      style={{
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: 'none',
      }}
    >
      <div className="logo-loader-inner">
        <img
          src="/logo.png"
          alt=""
          className="logo-loader-mark"
          draggable={false}
          decoding="sync"
        />
        <div aria-hidden="true" className="logo-loader-bar">
          <span />
        </div>
      </div>
    </div>
  );
};

export default RouteTransition;
