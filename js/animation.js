/* js/animation.js
   Entrance choreography + hero-to-header transformations + tile background
   - Lightweight, vanilla JS
   - Touch & wheel-supported
*/

(function () {
  // small helpers
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Create a full-screen intro overlay that shows the big name then profile then allows scroll to shrink
  function createIntroOverlay() {
    if (document.getElementById('introOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'introOverlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      background: 'var(--background)',
      transition: 'opacity 0.8s ease',
      pointerEvents: 'auto'
    });

    // big name text
    const bigName = document.createElement('div');
    bigName.id = 'introBigName';
    bigName.textContent = 'Dilip Choudhary';
    Object.assign(bigName.style, {
      fontSize: '6.2vw',
      fontWeight: 900,
      color: 'var(--text)',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    });

    // profile container (hidden initially)
    const profileWrap = document.createElement('div');
    profileWrap.id = 'introProfile';
    Object.assign(profileWrap.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      opacity: '0',
      transform: 'scale(1.03)',
      transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s'
    });

    const profilePic = document.createElement('img');
    profilePic.src = 'Image/Profile.JPG';
    profilePic.alt = 'Dilip';
    Object.assign(profilePic.style, {
      width: '220px',
      height: '220px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '6px solid rgba(255,255,255,0.08)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.45)'
    });

    const nameSmall = document.createElement('div');
    nameSmall.textContent = 'Dilip Choudhary';
    Object.assign(nameSmall.style, {
      fontSize: '1.4rem',
      color: 'var(--text-light)',
      fontWeight: 700,
      letterSpacing: '0.4px'
    });

    profileWrap.appendChild(profilePic);
    profileWrap.appendChild(nameSmall);

    overlay.appendChild(bigName);
    overlay.appendChild(profileWrap);
    document.body.appendChild(overlay);

    // staged sequence
    setTimeout(() => {
      bigName.style.opacity = '1';
      bigName.style.transform = 'translateY(0)';
    }, 80);

    // after 1.1s fade big name, show profile
    setTimeout(() => {
      bigName.style.opacity = '0';
      bigName.style.transform = 'translateY(-10px)';
      profileWrap.style.opacity = '1';
      profileWrap.style.transform = 'scale(1)';
    }, 1200);

    // after 2.4s keep profile, but allow scroll/swipe to continue into page
    // We'll remove overlay when user scrolls or after timeout fallback
    function removeIntro() {
      if (!overlay) return;
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 700);
    }

    // if user scrolls or swipes up -> start morph sequence
    let handled = false;
    const startMorph = () => {
      if (handled) return;
      handled = true;
      // animate profile -> shrink + move name to header
      // we will trigger a custom event so main.js can handle header morph
      const ev = new CustomEvent('intro:morph');
      window.dispatchEvent(ev);
      // hide overlay gradually
      setTimeout(removeIntro, 900);
    };

    let wheelHandler = (e) => {
      if (e.deltaY > 5) startMorph();
    };
    let touchStartY = 0;
    let touchHandler = (e) => {
      if (e.type === 'touchstart') touchStartY = e.touches[0].clientY;
      if (e.type === 'touchmove') {
        let dy = touchStartY - e.touches[0].clientY;
        if (dy > 30) startMorph();
      }
    };

    window.addEventListener('wheel', wheelHandler, { passive: true });
    window.addEventListener('touchstart', touchHandler, { passive: true });
    window.addEventListener('touchmove', touchHandler, { passive: true });

    // Fallback auto dismiss after 6s with morph
    setTimeout(startMorph, 6000);

    // expose removeIntro for external calls
    return {
      removeIntro
    };
  }

  // tile background behind hero profile
  function createTileBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let tileWrap = document.createElement('div');
    tileWrap.id = 'tileWrap';
    tileWrap.style.position = 'absolute';
    tileWrap.style.inset = '0';
    tileWrap.style.display = 'grid';
    tileWrap.style.gridTemplateColumns = 'repeat(40, 1fr)';
    tileWrap.style.gridAutoRows = '16px';
    tileWrap.style.gap = '3px';
    tileWrap.style.pointerEvents = 'none';
    tileWrap.style.opacity = '1';
    tileWrap.style.transition = 'opacity 0.5s ease';
    tileWrap.style.zIndex = '0';

    // small black tiles
    for (let i = 0; i < 40 * 18; i++) {
      const t = document.createElement('div');
      t.style.background = 'rgba(0,0,0,0.18)';
      t.style.borderRadius = '2px';
      tileWrap.appendChild(t);
    }
    hero.appendChild(tileWrap);
  }

  // call creation at load
  document.addEventListener('DOMContentLoaded', () => {
    createTileBackground();
    createIntroOverlay();
  });

  // expose utilities for main.js
  window._siteAnimation = {
    createIntroOverlay // reference (if needed)
  };

})();
