/* js/animation.js
   Intro choreography + tile background + auto theme behavior
   - Very small, performant, and event-driven.
   - Emits 'intro:morph' when welcome overlay finishes or user scrolls.
*/

(function () {
  'use strict';

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const createWelcomeOverlay = () => {
    // If overlay already exists or was removed, do nothing
    if (document.getElementById('welcomeOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'welcomeOverlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: 0, zIndex: 5000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff',
      transition: 'opacity .38s ease', pointerEvents: 'auto'
    });

    const welcome = document.createElement('div');
    welcome.textContent = 'WELCOME';
    Object.assign(welcome.style, {
      fontSize: '6.4vw',
      fontWeight: 900,
      letterSpacing: '.16em',
      opacity: 0,
      transform: 'translateY(6px)',
      transition: 'opacity .25s ease, transform .25s ease'
    });

    overlay.appendChild(welcome);
    document.body.appendChild(overlay);

    // fade in then fade out quickly (0.5s total)
    requestAnimationFrame(() => {
      welcome.style.opacity = '1';
      welcome.style.transform = 'translateY(0)';
    });

    // total display ~0.5s: fade in 0.15, visible 0.2, fade out 0.15
    (async function sequence() {
      await sleep(120); // show
      welcome.style.opacity = '0';
      welcome.style.transform = 'translateY(-6px)';
      // small delay to let expression settle
      await sleep(280);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      window.dispatchEvent(new CustomEvent('intro:morph'));
    })();

    // allow early removal if user scrolls quickly
    const onUserScroll = (e) => {
      if (Math.abs(e.deltaY) > 4) {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        window.dispatchEvent(new CustomEvent('intro:morph'));
        window.removeEventListener('wheel', onUserScroll);
      }
    };
    window.addEventListener('wheel', onUserScroll, { passive: true });
  };

  const createTileBackground = () => {
    const existing = document.getElementById('bgTiles');
    if (!existing) return;
    // small subtle animation could be added but keep performance first
    existing.style.opacity = '1';
  };

  // When intro:morph occurs, ensure tile background fades then set theme to dark if not manual
  const onMorph = () => {
    const tiles = document.getElementById('bgTiles');
    if (tiles) {
      tiles.style.transition = 'opacity .6s ease';
      tiles.style.opacity = '0';
      setTimeout(() => tiles.remove(), 650);
    }
    // switch to dark mode if not manually chosen
    const manual = localStorage.getItem('themeManual') === '1';
    const stored = localStorage.getItem('theme');
    if (!manual && stored !== 'light') {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  // initialize at DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    createTileBackground();
    createWelcomeOverlay();
  });

  window.addEventListener('intro:morph', onMorph);
})();
