import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

const LivingFluidBlob = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const frameRef = useRef(null);
  const frameCountRef = useRef(0);

  const handleMouseMove = useCallback((event) => {
    targetMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Mobile-tuned parameters: fewer particles + smaller sphere for clarity.
    const mobile = isMobile();
    const PARTICLE_COUNT = mobile ? 8000 : 10000;
    const TETRA_SIZE = mobile ? 0.14 : 0.2;
    const SHAPE_SCALE = mobile ? 42 : 65;
    const SHAPE_TENSION = mobile ? 14 : 22;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 100);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Post processing - bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.strength = 1.6;
    bloomPass.radius = 0.5;
    bloomPass.threshold = 0;
    composer.addPass(bloomPass);

    // Instanced mesh - tetrahedrons
    const geometry = new THREE.TetrahedronGeometry(TETRA_SIZE);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    // Initialize particle positions
    const positions = [];
    const color = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      );
      mesh.setColorAt(i, color.setHSL(0.9, 0.8, 0.3));
    }

    const dummy = new THREE.Object3D();
    const target = new THREE.Vector3();
    const pColor = new THREE.Color();
    const clock = new THREE.Clock();

    // Mouse listener
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Params
    const PARAMS = { scale: SHAPE_SCALE, flow: 0.5, complexity: 3, tension: SHAPE_TENSION };

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouseRef.current.lerp(targetMouse.current, 0.05);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const time = clock.getElapsedTime() * 0.8;
      const { scale, flow, complexity, tension } = PARAMS;
      const t = time * flow;
      const q = Math.floor(complexity) + 0.01;
      const p = 3;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const normalized = i / PARTICLE_COUNT;
        const phi = normalized * Math.PI * 2 * 60;

        const r = scale + tension * Math.cos(q * phi + t * 0.5);

        let x = r * Math.cos(p * phi) * (1 + 0.05 * Math.sin(t + normalized * 50));
        let y = r * Math.sin(p * phi) * (1 + 0.05 * Math.cos(t + normalized * 50));
        let z = tension * Math.sin(q * phi + t * 0.5) + Math.sin(phi * 8) * 8;

        // Mouse-driven rotation only (no auto-rotation)
        const rotY = mx * 0.25;
        const finalX = x * Math.cos(rotY) - z * Math.sin(rotY);
        const finalZ = x * Math.sin(rotY) + z * Math.cos(rotY);

        // Mouse tilt (subtle)
        const tilt = 0.3 + my * 0.15;
        const tiltY = y * Math.cos(tilt) - finalZ * Math.sin(tilt);
        const tiltZ = y * Math.sin(tilt) + finalZ * Math.cos(tilt);

        target.set(finalX, tiltY, tiltZ);

        // Color: pink / violet / indigo palette
        const dataPacket = Math.pow(Math.abs(Math.sin(phi * 4 - t * 2)), 20);
        // Hue: 0.83 = pink, 0.75 = violet, 0.72 = indigo — cycle between them
        const hue = 0.83 + Math.sin(normalized * Math.PI * 4) * 0.08;
        const saturation = 0.85 + dataPacket * 0.15;
        const lightness = 0.2 + dataPacket * 0.55;

        pColor.setHSL(hue, saturation, lightness);

        // Smooth lerp to target
        positions[i].lerp(target, 0.08);
        dummy.position.copy(positions[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, pColor);
      }

      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;

      composer.render();

      // Fire once when the particles have had enough frames to settle into
      // their torus-knot formation (~750ms at 60fps). This lets the boot
      // loader fade out only after the hero looks "ready", not on frame 1.
      frameCountRef.current += 1;
      if (frameCountRef.current === 45) {
        window.dispatchEvent(new Event('devbroz:hero-ready'));
      }
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      composer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={mountRef}
      data-testid="3d-blob"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default LivingFluidBlob;
