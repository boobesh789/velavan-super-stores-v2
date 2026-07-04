/* ==========================================================================
   Velavan Super Stores — Hero Three.js Background
   Ambient drifting particle field (soft "fresh produce dust") behind the
   hero headline. Deliberately restrained: slow motion, low density, low
   opacity — texture, not spectacle. Respects prefers-reduced-motion.
   ========================================================================== */

(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');

  if (!canvas) {
    console.error('[hero-canvas] #heroCanvas element not found in DOM. Hero background cannot render.');
    return;
  }

  if (typeof THREE === 'undefined') {
    console.error(
      '[hero-canvas] THREE is undefined — the Three.js library failed to load ' +
      '(CDN blocked, offline, ad-blocker, or script load order issue). ' +
      'Check the Network tab for a failed request to cdnjs.cloudflare.com/.../three.min.js.'
    );
    canvas.style.display = 'none'; // avoid leaving a dead, oddly-sized element in layout
    return;
  }

  console.info('[hero-canvas] THREE loaded OK, initializing hero background.');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroSection = canvas.closest('.hero');

  // ROOT CAUSE FIX:
  // heroSection.clientWidth/clientHeight can legitimately read as 0 at the
  // moment this script executes — the .hero section uses `min-height: 100svh`,
  // and on first paint (before web fonts finish loading / before the browser
  // has committed a layout pass) that can resolve to 0 in some browsers,
  // especially on GitHub Pages' cold-cache first load. When that happens:
  //   - camera aspect = width / 0 = Infinity -> invalid projection matrix
  //   - renderer.setSize(width, 0) -> canvas is sized to zero height
  // No error is thrown and the render loop still runs every frame, so the
  // animation is simply invisible forever. getSafeSize() guards against this.
  function getSafeSize() {
    let w = heroSection.clientWidth || heroSection.getBoundingClientRect().width;
    let h = heroSection.clientHeight || heroSection.getBoundingClientRect().height;
    if (!w || !isFinite(w)) w = window.innerWidth;
    if (!h || !isFinite(h)) h = window.innerHeight;
    return { w, h };
  }

  let { w: width, h: height } = getSafeSize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 18;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch (err) {
    console.error('[hero-canvas] WebGLRenderer failed to initialize — WebGL may be unavailable in this browser/device.', err);
    canvas.style.display = 'none';
    return;
  }

  if (!renderer.getContext()) {
    console.error('[hero-canvas] No WebGL context available. Hero background disabled.');
    canvas.style.display = 'none';
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  // Particle field — two layers for depth, colors drawn from the palette
  const PARTICLE_COUNT = window.innerWidth < 700 ? 60 : 140;
  const colors = [
    new THREE.Color('#3FA654'), // leaf accent
    new THREE.Color('#1B5E3F'), // deep green
    new THREE.Color('#F5A623'), // amber
  ];

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const particleColors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const speeds = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 34;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 14;

    const c = colors[Math.floor(Math.random() * colors.length)];
    particleColors[i3] = c.r;
    particleColors[i3 + 1] = c.g;
    particleColors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 0.35 + 0.12;
    speeds.push(Math.random() * 0.15 + 0.04);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.38,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  function onPointerMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = (x / window.innerWidth - 0.5) * 2;
    mouseY = (y / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function onResize() {
    const size = getSafeSize();
    width = size.w;
    height = size.h;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener('resize', onResize);

  // Re-measure once web fonts finish loading and once again on full window
  // load, since either can change .hero's layout height after this script's
  // initial (possibly zero-size) measurement.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(onResize).catch(() => {});
  }
  window.addEventListener('load', onResize);
  // Belt-and-braces: one more measurement after the first paint settles.
  requestAnimationFrame(() => requestAnimationFrame(onResize));

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posAttr.array[i3 + 1] += speeds[i] * 0.012;
      if (posAttr.array[i3 + 1] > 11) {
        posAttr.array[i3 + 1] = -11;
      }
      posAttr.array[i3] += Math.sin(t * 0.3 + i) * 0.0015;
    }
    posAttr.needsUpdate = true;

    targetRotX += (mouseY * 0.08 - targetRotX) * 0.02;
    targetRotY += (mouseX * 0.1 - targetRotY) * 0.02;
    points.rotation.x = targetRotX;
    points.rotation.y = targetRotY;

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    // Render a single static frame instead of a continuous loop
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
/* ==========================================================================
   Velavan Super Stores — Hero Three.js Background
   Ambient drifting particle field (soft "fresh produce dust") behind the
   hero headline. Deliberately restrained: slow motion, low density, low
   opacity — texture, not spectacle. Respects prefers-reduced-motion.
   ========================================================================== */

(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroSection = canvas.closest('.hero');
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  // Particle field — two layers for depth, colors drawn from the palette
  const PARTICLE_COUNT = window.innerWidth < 700 ? 60 : 140;
  const colors = [
    new THREE.Color('#3FA654'), // leaf accent
    new THREE.Color('#1B5E3F'), // deep green
    new THREE.Color('#F5A623'), // amber
  ];

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const particleColors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const speeds = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 34;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 14;

    const c = colors[Math.floor(Math.random() * colors.length)];
    particleColors[i3] = c.r;
    particleColors[i3 + 1] = c.g;
    particleColors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 0.35 + 0.12;
    speeds.push(Math.random() * 0.15 + 0.04);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.38,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  function onPointerMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = (x / window.innerWidth - 0.5) * 2;
    mouseY = (y / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function onResize() {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posAttr.array[i3 + 1] += speeds[i] * 0.012;
      if (posAttr.array[i3 + 1] > 11) {
        posAttr.array[i3 + 1] = -11;
      }
      posAttr.array[i3] += Math.sin(t * 0.3 + i) * 0.0015;
    }
    posAttr.needsUpdate = true;

    targetRotX += (mouseY * 0.08 - targetRotX) * 0.02;
    targetRotY += (mouseX * 0.1 - targetRotY) * 0.02;
    points.rotation.x = targetRotX;
    points.rotation.y = targetRotY;

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    // Render a single static frame instead of a continuous loop
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
