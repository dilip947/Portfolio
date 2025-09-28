// js/animation.js
// GSAP-powered hero intro + hero-to-header morph timeline
// Requirements: GSAP and ScrollTrigger loaded in index.html
// This file only handles animation timelines and ScrollTrigger setup.

(() => {
  'use strict';

  if (!window.gsap) {
    console.warn('GSAP not found — include GSAP before animation.js');
    return;
  }

  const { gsap } = window;
  const { ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // Tiny helper to safely select elements
  const $ = (s, ctx = document) => (ctx || document).querySelector(s);

  // Elements
  const introOverlay = $('#introOverlay');
  const heroTitle = $('.hero-title');
  const heroSub = $('.hero-sub');
  const profileSquare = $('.profile-square');
  const header = $('#header');
  const logoName = document.querySelector('.logo .brand-name');

  // Intro: very fast (0.5s total) fade in/out
  function playIntro() {
    if (!introOverlay) return;
    // timeline: fade in 0.15, show 0.2, fade out 0.15 (total ~0.5s)
    const tl = gsap.timeline({
      onComplete() {
        introOverlay.style.display = 'none';
        // dispatch event so main.js reacts (like auto scroll nudge)
        window.dispatchEvent(new CustomEvent('intro:morph'));
      }
    });
    tl.set(introOverlay, { autoAlpha: 1 });
    tl.fromTo(introOverlay, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power1.out' });
    tl.to(introOverlay, { autoAlpha: 0, y: -6, duration: 0.12, delay: 0.18, ease: 'power1.in' });
    return tl;
  }

  // Hero -> header morph using ScrollTrigger
  function setupHeroMorph() {
    if (!heroTitle || !profileSquare) return;
    // Create a GSAP timeline controlled by ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',       // start when top of home hits top of viewport
        end: 'bottom+=200 top', // animate until the bottom moves well above
        scrub: 0.8,
        // markers: true,
        onUpdate(self) {
          // optional: can use self.progress for debug
        }
      }
    });

    // initial values
    gsap.set(heroTitle, { transformOrigin: 'left center' });
    gsap.set(profileSquare, { transformOrigin: 'center center' });

    // Sequence:
    // 1) Slight scale bump on title (very subtle)
    // 2) Profile scales down and fades out
    // 3) Title translates upward and reduces to header-size
    // 4) Subtitle fades out earlier than title

    tl.to(heroTitle, { scale: 1.08, duration: 0.8, ease: 'power1.out' }, 0);
    tl.to(profileSquare, { scale: 0.42, y: -28, autoAlpha: 0, duration: 0.9, ease: 'power3.inOut' }, 0.05);
    tl.to(heroSub, { autoAlpha: 0, y: -18, duration: 0.65, ease: 'power1.out' }, 0.12);
    // move title up and shrink to header-like size
    tl.to(heroTitle, { y: -40, scale: 0.86, duration: 0.9, ease: 'power3.inOut' }, 0.3);

    // finalize: when progress nearly complete, set body class for small header state
    ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        if (self.progress > 0.92) {
          document.body.classList.add('hero-shrunk');
          header.classList.add('scrolled');
          if (logoName) logoName.style.transform = 'translateX(6px)';
        } else {
          document.body.classList.remove('hero-shrunk');
          header.classList.remove('scrolled');
          if (logoName) logoName.style.transform = '';
        }
      }
    });
  }

  // Section reveal stagger using GSAP
  function setupSectionReveals() {
    // about section: left slides from left, right slides from right
    const aboutLeft = document.querySelector('.about-text');
    const aboutRight = document.querySelector('.about-story');
    if (aboutLeft && aboutRight) {
      gsap.from(aboutLeft, {
        scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
        x: -44, autoAlpha: 0, duration: 0.9, ease: 'power3.out'
      });
      gsap.from(aboutRight, {
        scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
        x: 44, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.08
      });
    }

    // skills: pop up tiles with stagger bottom->top
    const skillTiles = gsap.utils.toArray('.skill-tile');
    if (skillTiles.length) {
      gsap.from(skillTiles, {
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 82%'
        },
        y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.66, ease: 'back.out(1.1)'
      });
    }

    // projects: left, center, right different entrances
    const cards = gsap.utils.toArray('.project-card');
    if (cards.length) {
      cards.forEach((el, i) => {
        const from = i === 0 ? { x: -160 } : (i === 1 ? { y: 36 } : { x: 160 });
        gsap.from(el, {
          scrollTrigger: { trigger: '.projects-section', start: 'top 78%' },
          ...from, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.12
        });
      });
    }
  }

  // Kick it off when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    playIntro();
    setupHeroMorph();
    setupSectionReveals();
  });

})();
