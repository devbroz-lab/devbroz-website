import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// Vertex shader with simplex noise for organic deformation
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying float vDisplacement;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    float mouseDist = distance(position.xy, uMouse * 2.0);
    float displacement = snoise(position * 1.8 + uTime * 0.15) * 0.25;
    displacement += snoise(position * 3.5 + uTime * 0.1) * 0.08;
    displacement -= smoothstep(0.0, 2.0, mouseDist) * 0.3;
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader with pink/violet/indigo gradients
const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec3 vNormal;
  varying float vDisplacement;
  void main() {
    float fresnel = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 1.5);
    // Mix three colors based on normal direction for richer gradient
    vec3 color = mix(uColorA, uColorB, vNormal.y * 0.5 + 0.5);
    color = mix(color, uColorC, fresnel * 0.4);
    // Subtle glow at edges
    color += fresnel * 0.1;
    // Darken center slightly for depth
    float centerFade = smoothstep(0.0, 0.8, fresnel);
    color *= 0.55 + centerFade * 0.25;
    gl_FragColor = vec4(color, 0.85);
  }
`;

const LivingFluidBlob = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const frameRef = useRef(null);
  const sceneRef = useRef(null);

  const handleMouseMove = useCallback((event) => {
    targetMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Geometry + Material - smoother with more subdivisions
    const geometry = new THREE.IcosahedronGeometry(1.8, 80);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color("#ff1493") },  // Deep pink
        uColorB: { value: new THREE.Color("#4B0082") },  // Indigo
        uColorC: { value: new THREE.Color("#8A2BE2") },  // Violet
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse listener
    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.lerp(targetMouse.current, 0.05);

      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.copy(mouseRef.current);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
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
      style={{ pointerEvents: 'none', filter: 'blur(8px)' }}
    />
  );
};

export default LivingFluidBlob;
