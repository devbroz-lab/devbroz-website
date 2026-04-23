import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

const CobeGlobe = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const lastPointer = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const velocity = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x;
      const deltaY = e.clientY - pointerInteracting.current.y;
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 };
      const now = Date.now();
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1);
        velocity.current = {
          phi: Math.max(-0.15, Math.min(0.15, ((e.clientX - lastPointer.current.x) / dt) * 0.3)),
          theta: Math.max(-0.15, Math.min(0.15, ((e.clientY - lastPointer.current.y) / dt) * 0.08)),
        };
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
      lastPointer.current = null;
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null;
    let animationId;
    let phi = 0;

    const markers = [
      { location: [28.6139, 77.209], size: 0.05 },   // Delhi (India)
      { location: [19.076, 72.8777], size: 0.04 },    // Mumbai (India)
      { location: [52.52, 13.405], size: 0.05 },      // Berlin (Germany)
      { location: [40.7128, -74.006], size: 0.03 },   // NYC
      { location: [51.5074, -0.1278], size: 0.03 },   // London
      { location: [35.6762, 139.6503], size: 0.025 }, // Tokyo
      { location: [25.2048, 55.2708], size: 0.025 },  // Dubai
      { location: [1.3521, 103.8198], size: 0.025 },  // Singapore
      { location: [-23.5505, -46.6333], size: 0.025 },// Sao Paulo
      { location: [48.8566, 2.3522], size: 0.025 },   // Paris
    ];

    // India coords
    const india = [28.6139, 77.209];
    const germany = [52.52, 13.405];

    const arcs = [
      // From India
      { from: india, to: [40.7128, -74.006] },       // -> NYC
      { from: india, to: [51.5074, -0.1278] },       // -> London
      { from: india, to: [25.2048, 55.2708] },       // -> Dubai
      { from: india, to: [35.6762, 139.6503] },      // -> Tokyo
      { from: india, to: [1.3521, 103.8198] },       // -> Singapore
      // From Germany
      { from: germany, to: [40.7128, -74.006] },     // -> NYC
      { from: germany, to: [-23.5505, -46.6333] },   // -> Sao Paulo
      { from: germany, to: [48.8566, 2.3522] },      // -> Paris
      { from: germany, to: [25.2048, 55.2708] },     // -> Dubai
    ];

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.15, 0.05, 0.2],       // Dark purple base
        markerColor: [1, 0.08, 0.58],         // #ff1493 pink
        glowColor: [0.3, 0.05, 0.3],          // Dark purple glow
        markers,
        arcs: arcs.map(a => ({ from: a.from, to: a.to })),
        arcColor: [1, 0.08, 0.58],           // Pink arcs
        arcWidth: 0.4,
        arcHeight: 0.3,
        opacity: 0.85,
      });

      function animate() {
        if (!isPausedRef.current) {
          phi += 0.003;
          if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
            phiOffsetRef.current += velocity.current.phi;
            thetaOffsetRef.current += velocity.current.theta;
            velocity.current.phi *= 0.95;
            velocity.current.theta *= 0.95;
          }
          const thetaMin = -0.4, thetaMax = 0.4;
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1;
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1;
          }
        }
        globe.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = '1'));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, []);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          touchAction: 'none',
        }}
      />
    </div>
  );
};

export default CobeGlobe;
