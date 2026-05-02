import React, { useEffect, useState } from 'react';

/**
 * LogoLoader — minimalist premium boot overlay.
 *
 * Visual:
 *   - Jet black full screen.
 *   - Small DevBroz mark (~56px) centered.
 *   - Subtle breathing glow behind the mark.
 *   - A single hairline progress bar beneath — an indeterminate sweep.
 *
 * Timing:
 *   - Waits for the hero to signal it has finished forming
 *     (`devbroz:hero-ready`). No enforced minimum — fades out the moment
 *     the landing section is visually ready.
 *   - 8s safety fallback in case the hero never signals.
 */

export const DEVBROZ_HERO_BOOT_STORAGE_KEY = "devbroz:hero-boot-complete";

const FADE_MS = 600;
const SAFETY_TIMEOUT_MS = 8000;

const LogoLoader = () => {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Lock body scroll only while overlay is meaningful; restoring on `removed`
  // avoids leaving `overflow: hidden` on document.body — the loader instance
  // often stays mounted (returns null after exit) until route changes.
  useEffect(() => {
    if (removed) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [removed]);

  // Fade out when the hero is ready.
  useEffect(() => {
    const onReady = () => setHidden(true);
    window.addEventListener('devbroz:hero-ready', onReady, { once: true });
    const safety = setTimeout(() => setHidden(true), SAFETY_TIMEOUT_MS);
    return () => {
      window.removeEventListener('devbroz:hero-ready', onReady);
      clearTimeout(safety);
    };
  }, []);

  // Remember boot so SPA navigations back to `/` do not replay the overlay.
  useEffect(() => {
    if (!hidden) return;
    try {
      sessionStorage.setItem(DEVBROZ_HERO_BOOT_STORAGE_KEY, "1");
    } catch (_) {
      /* private mode / quota */
    }
  }, [hidden]);

  // Unmount after fade.
  useEffect(() => {
    if (!hidden) return undefined;
    const t = setTimeout(() => setRemoved(true), FADE_MS + 50);
    return () => clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      data-testid="logo-loader"
      className={`logo-loader-root ${hidden ? 'logo-loader-exit' : ''}`}
      role="status"
      aria-label="Loading DevBroz"
      style={{
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      <div className="logo-loader-inner">
        <img
          src="/logo.png"
          alt="DevBroz"
          className="logo-loader-mark"
          draggable={false}
          decoding="sync"
          fetchPriority="high"
        />
        <div aria-hidden="true" className="logo-loader-bar">
          <span />
        </div>
      </div>
    </div>
  );
};

export default LogoLoader;
