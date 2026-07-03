/* ==========================================================================
   Velavan Super Stores — GSAP Animations
   Hero entrance sequence + scroll-triggered reveals for sections.
   Falls back gracefully if GSAP/ScrollTrigger fail to load.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') {
    // No GSAP available — reveal everything immediately
    document.querySelectorAll('.reveal-up, .stagger-item').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-up, .stagger-item').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero entrance sequence ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, 0.22)
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.7 }, 0.4)
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, 0.55);

  /* ---------- Generic scroll reveals ---------- */
  document.querySelectorAll('.section .reveal-up').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-revealed'),
    });
  });

  // Sections whose inner content is injected by main.js after DOMContentLoaded
  // need their reveal triggers set up slightly later, and the stagger groups
  // (categories, offers, products, gallery, reviews) revealed as a batch.
  function setupStaggerReveal(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    ScrollTrigger.create({
      trigger: container,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const items = container.querySelectorAll('.stagger-item');
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
        });
      },
    });
  }

  // Slight delay to ensure main.js has injected DOM content first
  window.requestAnimationFrame(() => {
    setupStaggerReveal('#categoriesScroll');
    setupStaggerReveal('#offersGrid');
    setupStaggerReveal('#productsGrid');
    setupStaggerReveal('#galleryGrid');
    setupStaggerReveal('#reviewsTrack');
    ScrollTrigger.refresh();
  });
});
