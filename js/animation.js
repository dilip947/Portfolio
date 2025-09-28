/* js/animation.js
   Intro + hero choreography + tile background + theme auto-switch behavior
   - Emits 'intro:morph' event when the user scrolls/swipes or timeout triggers
*/

(function () {
  const q = (s, ctx = document) => ctx.querySelector(s);
  const createTiles = () => {
    const hero = q('.hero');
    if (!hero || document.getElementById('tileWrap')) return;
    const tileWrap = document.createElement('div');
    tileWrap.id = 'tileWrap';
    tileWrap.style.position = 'absolute';
    tileWrap.style.inset = '0';
    tileWrap.style.display = 'grid';
    tileWrap.style.gridTemplateColumns = 'repeat(48, 1fr)';
    tileWrap.style.gridAutoRows = '12px';
    tileWrap.style.gap = '3px';
    tileWrap.style.pointerEvents = 'none';
    tileWrap.style.zIndex = '0';
    tileWrap.style.transition = 'opacity 0.6s ease';
    for (let i = 0; i < 48 * 18; i++) {
      const d = document.createElement('div');
      d.style.background = 'rgba(0,0,0,0.18)';
      d.style.borderRadius = '2px';
      tileWrap.appendChild(d);
    }
    hero.appendChild(tileWrap);
  };

  // create floating soft elements (already done in index; keep lightweight)
  function createFloatingParticles() {
    const container = document.getElementById('floatingElements');
    if (!container || container.dataset.inited) return;
    container.dataset.inited = '1';
    const count = 10;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floating-element';
      Object.assign(el.style, {
        position: 'absolute',
        width: `${Math.random() * 120 + 30}px`,
        height: `${Math.random() * 120 + 30}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.02), transparent 60%)',
        opacity: `${0.06 + Math.random() * 0.12}`,
        transform: `translate3d(0,0,0)`,
        transition: 'transform 12s linear, opacity 3s ease-in-out'
      });
      container.appendChild(el);
    }
  }

  // Intro Overlay sequence
  function createIntroOverlay() {
    if (document.getElementById('introOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'introOverlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 4000,
      background: '#000',
      color: '#fff',
      pointerEvents: 'auto'
    });

    // Big Welcome (white text)
    const welcome = document.createElement('div');
    welcome.textContent = 'WELCOME';
    Object.assign(welcome.style, {
      fontSize: '10vw',
      fontWeight: 900,
      letterSpacing: '0.18em',
      opacity: '0',
      transition: 'opacity 0.9s ease, transform 0.9s ease',
      transform: 'translateY(10px)'
    });

    // small spacer
    const spacer = document.createElement('div');
    spacer.style.height = '28px';

    // profile wrapper
    const profileWrap = document.createElement('div');
    profileWrap.style.display = 'flex';
    profileWrap.style.flexDirection = 'column';
    profileWrap.style.alignItems = 'center';
    profileWrap.style.gap = '12px';
    profileWrap.style.opacity = '0';
    profileWrap.style.transform = 'translateY(10px)';
    profileWrap.style.transition = 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s';

    const img = document.createElement('img');
    img.src = 'Image/Profile.JPG';
    img.alt = 'profile';
    img.style.width = '240px';
    img.style.height = '240px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px'; // square-ish with slight radius
    img.style.boxShadow = '0 30px 80px rgba(0,0,0,0.6)';
    img.style.border = '2px solid rgba(255,255,255,0.06)';

    const name = document.createElement('div');
    name.textContent = 'DILIP CHOUDHARY';
    name.style.fontWeight = '900';
    name.style.fontSize = '2.4rem';
    name.style.letterSpacing = '.06em';
    name.style.color = '#fff';

    profileWrap.appendChild(img);
    profileWrap.appendChild(name);

    overlay.appendChild(welcome);
    overlay.appendChild(spacer);
    overlay.appendChild(profileWrap);

    document.body.appendChild(overlay);

    // Sequence timings
    setTimeout(() => {
      welcome.style.opacity = '1';
      welcome.style.transform = 'translateY(0)';
    }, 60);

    // fade welcome out, show profile
    setTimeout(() => {
      welcome.style.opacity = '0';
      welcome.style.transform = 'translateY(-20px)';
      profileWrap.style.opacity = '1';
      profileWrap.style.transform = 'translateY(0)';
    }, 1100);

    // After profile is visible, wait then allow morph/scroll
    const startMorph = () => {
      // if already removed return
      if (!overlay.parentNode) return;
      // dispatch morph event
      window.dispatchEvent(new CustomEvent('intro:morph', { detail: {} }));
      // fade overlay out
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 850);
    };

    // user scroll / swipe detection to morph early
    let touchY = null;
    function onWheel(e) { if (e.deltaY > 8) startMorph(); }
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchMove(e) {
      if (!touchY) return;
      const dy = touchY - e.touches[0].clientY;
      if (dy > 30) startMorph();
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // fallback timeout auto morph after 5.2s of profile showing
    setTimeout(startMorph, 4200);
  }

  // Theme auto-switch: if user hasn't manually chosen, set to dark after intro morph
  function autoThemeOnMorph() {
    // Only set if user hasn't saved a manual theme
    const manual = localStorage.getItem('themeManual') === '1';
    const saved = localStorage.getItem('theme'); // 'light' or 'dark'
    if (!manual && saved !== 'light') {
      // force dark (remove light-mode)
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    createTiles();
    createFloatingParticles();
    createIntroOverlay();
  });

  // when morph happens, also ensure tiles fade and set theme
  window.addEventListener('intro:morph', () => {
    const tile = document.getElementById('tileWrap');
    if (tile) { tile.style.opacity = '0'; setTimeout(()=> tile.remove(), 700); }
    // switch to dark unless manual override
    autoThemeOnMorph();
  });

})();
