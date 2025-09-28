/* js/main.js
   Master interactive behavior for the site.
   - High-quality implementation with accessibility & performance in mind.
   - Uses vanilla JS only. No dependencies.
*/

(() => {
  'use strict';

  /* ---------------- Utilities ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const qId = id => document.getElementById(id);

  /* ---------------- Theme toggle & persistence ---------------- */
  const themeToggle = qId('themeToggle');
  const mobileTheme = qId('mobileTheme');

  function setTheme(light, manual = false) {
    if (light) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
    if (manual) localStorage.setItem('themeManual', '1');
    // Update icon
    const icon = themeToggle.querySelector('i');
    const micon = mobileTheme && mobileTheme.querySelector('i');
    if (light) {
      if (icon) icon.className = 'fa-regular fa-moon';
      if (micon) micon.className = 'fa-regular fa-moon';
    } else {
      if (icon) icon.className = 'fa-regular fa-sun';
      if (micon) micon.className = 'fa-regular fa-sun';
    }
  }

  (function initTheme() {
    const stored = localStorage.getItem('theme');
    const manual = localStorage.getItem('themeManual') === '1';
    if (stored === 'light') setTheme(true, manual);
    else if (stored === 'dark') setTheme(false, manual);
    else { /* default: leave as dark, intro will decide */ setTheme(false, false); }
  })();

  themeToggle && themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(!isLight, true);
  });
  mobileTheme && mobileTheme.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(!isLight, true);
  });

  /* ---------------- Mobile Nav ---------------- */
  const mobileBtn = qId('mobileMenuBtn');
  const mobileNav = qId('mobileNav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const open = mobileNav.style.right === '0px';
      mobileNav.style.right = open ? '-100%' : '0px';
      mobileNav.setAttribute('aria-hidden', open ? 'true' : 'false');
    });
    // Close on link click
    $$('a.mobile-link').forEach(a => a.addEventListener('click', () => {
      mobileNav.style.right = '-100%';
      mobileNav.setAttribute('aria-hidden', 'true');
    }));
  }

  /* ---------------- Hero morph logic ----------------
     The effect: as the user scrolls up through hero,
     - profile square shrinks and fades,
     - hero name scales/shrinks based on scroll progress,
     - when progress near 1, name snaps to header position
  --------------------------------------------------*/
  const heroEl = qId('home');
  const heroName = qId('heroName');
  const profileSquare = qId('profileSquare');
  const header = qId('siteHeader');
  const brandName = document.querySelector('.brand-name');

  // ensure uppercase
  if (heroName) heroName.textContent = heroName.textContent.toUpperCase();

  // Compute progress of transition:
  function heroProgress() {
    if (!heroEl) return 1;
    const rect = heroEl.getBoundingClientRect();
    // progress: 0 when hero bottom at viewport bottom; 1 when hero bottom has moved above a threshold
    const vh = window.innerHeight;
    const start = vh * 0.72;
    const end = vh * 0.20;
    const progress = clamp((start - rect.bottom) / (start - end), 0, 1);
    return progress;
  }

  function applyHeroTransform() {
    const p = heroProgress(); // 0..1
    // The user requested roughly 10% shrink per mm scrolled — we approximate with exponential scaling
    // Name scale: start 1, peak 1.18 (slightly larger), then settle down to header-size via hero-shrunk class
    const scale = 1 + (p * 0.18);
    // For an iOS-haptic feel, ease using cubic function
    const eased = Math.pow(p, 0.92);

    if (heroName) {
      // as p increases, we move name up and shrink; we simulate "every mm shrink by 10%" by mapping p to scale
      const nameTranslateY = - (eased * 46); // move up to ~46px
      heroName.style.transform = `translateY(${nameTranslateY}px) scale(${1 - eased * 0.16})`;
      heroName.style.opacity = `${1 - eased * 0.06}`;
    }

    if (profileSquare) {
      const sqScale = clamp(1 - eased * 0.66, 0.32, 1);
      profileSquare.style.transform = `scale(${sqScale}) translateY(${ - eased * 28}px)`;
      profileSquare.style.opacity = `${1 - eased * 1.05}`;
    }

    // Once largely scrolled, set body class to hero-shrunk to finalize header state
    if (p > 0.92) {
      document.body.classList.add('hero-shrunk');
      header.classList.add('scrolled');
      if (brandName) brandName.style.transform = 'translateX(6px)';
    } else {
      document.body.classList.remove('hero-shrunk');
      header.classList.remove('scrolled');
      if (brandName) brandName.style.transform = '';
    }

    // Automatic dark mode if not manual — dark after progress > 0.55
    if (localStorage.getItem('themeManual') !== '1') {
      if (p > 0.55) setTheme(false, false);
    }
  }

  // Bind scroll/resize events
  window.addEventListener('scroll', throttle(applyHeroTransform, 16), { passive: true });
  window.addEventListener('resize', throttle(applyHeroTransform, 60));

  // Also react to 'intro:morph' event to gently scroll
  window.addEventListener('intro:morph', () => {
    // tiny smooth nudge to trigger scroll transformations
    setTimeout(() => window.scrollTo({ top: 1, behavior: 'smooth' }), 260);
  });

  /* ---------------- IntersectionObserver for reveals ---------------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('visible');
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  document.addEventListener('DOMContentLoaded', () => {
    $$('.animate-on-scroll').forEach(el => io.observe(el));
  });

  /* ---------------- Load dynamic data (projects & skills) ---------------- */
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed ' + path);
      return res.json();
    } catch (err) {
      console.warn('Could not load', path, err);
      return null;
    }
  }

  // populate skills
  (async function loadSkills() {
    const skillsData = await fe
