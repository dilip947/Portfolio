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
    const skillsData = await fetchJSON('data/skills.json');
    const container = qId('skillsGrid');
    if (!container) return;
    container.innerHTML = '';
    let arr = [];
    if (skillsData && Array.isArray(skillsData.skills)) arr = skillsData.skills;
    else if (skillsData && Array.isArray(skillsData)) arr = skillsData;

    if (!arr.length) {
      // fallback tiles
      const sample = ['Power BI', 'Excel (Advanced)', 'SQL', 'Tableau', 'Python (Pandas)'];
      sample.forEach(s => container.appendChild(createSkillTile(s)));
      return;
    }

    arr.forEach(obj => {
      const label = (typeof obj === 'string') ? obj : obj.name || obj;
      container.appendChild(createSkillTile(label));
    });
  })();

  function createSkillTile(label) {
    const btn = document.createElement('button');
    btn.className = 'skill-tile';
    btn.setAttribute('aria-label', label);
    btn.textContent = label;
    // subtle hover handled by CSS, add micro haptic motion
    btn.addEventListener('pointerenter', () => {
      btn.style.transform = 'translateY(-8px) scale(1.02)';
      btn.style.boxShadow = '0 18px 48px rgba(0,0,0,0.32)';
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
    return btn;
  }

  // populate projects
  (async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    const row = qId('projectsRow');
    if (!row) return;
    row.innerHTML = '';

    const list = (data && Array.isArray(data) && data.length >= 1) ? data.slice(0, 3) : defaultProjects();

    // Create card elements in order: left, center, right
    list.forEach((p, idx) => {
      const card = createProjectCard(p, idx);
      row.appendChild(card);
      // initial entry animation: left slides from left, right from right, center fades up
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'transform .9s cubic-bezier(.16,.9,.28,1), opacity .9s';
          card.style.transform = 'translateX(0) translateY(0) scale(1)';
          card.style.opacity = '1';
        }, 180 + idx * 120);
      });
    });
  })();

  function defaultProjects() {
    return [
      { id: 'p1', title: 'E-Commerce Analytics', short: 'Sales & delivery insights', images: ['Projects/Projectec/1.png','Projects/Projectec/2.png','Projects/Projectec/3.png'] },
      { id: 'p2', title: 'Crypto Dashboard', short: 'Volatility & sentiment', images: ['Projects/Projectcrypto/1.png','Projects/Projectcrypto/2.png','Projects/Projectcrypto/3.png'] },
      { id: 'p3', title: 'Process Improvement', short: 'UAT & sprint artifacts', images: ['Projects/P3ABC/1.png','Projects/P3ABC/Sprint.png','Projects/P3ABC/UAT.png'] },
    ];
  }

  function createProjectCard(p, idx) {
    const wrapper = document.createElement('div');
    wrapper.className = 'project-card';
    wrapper.setAttribute('data-id', p.id || `proj-${idx}`);
    wrapper.style.opacity = '0';
    wrapper.style.transform = (idx === 0 ? 'translateX(-120%)' : (idx === 1 ? 'translateY(30px)' : 'translateX(120%)'));
    wrapper.style.transition = 'transform .9s cubic-bezier(.16,.9,.28,1), opacity .9s';

    // media
    const media = document.createElement('div');
    media.className = 'project-media';
    const img = document.createElement('img');
    img.src = (p.images && p.images[0]) ? p.images[0] : 'Image/Profile.JPG';
    img.alt = p.title || 'Project';
    media.appendChild(img);
    wrapper.appendChild(media);

    // body
    const body = document.createElement('div');
    body.className = 'project-body';
    body.innerHTML = `<div class="project-title">${escapeHtml(p.title || 'Untitled')}</div>
                      <div class="project-short">${escapeHtml(p.short || '')}</div>`;
    wrapper.appendChild(body);

    // thumbs strip
    const thumbs = document.createElement('div');
    thumbs.className = 'project-thumbs';
    wrapper.appendChild(thumbs);

    // prepare thumbnails (but keep hidden)
    if (Array.isArray(p.images)) {
      p.images.forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.dataset.src = src;
        t.alt = p.title || 'thumb';
        t.addEventListener('click', (ev) => {
          ev.stopPropagation();
          openGallery(p.images, p.images.indexOf(src), p.title);
        });
        thumbs.appendChild(t);
      });
    }

    // hover + hold behaviour
    let holdTimer = null;
    wrapper.addEventListener('pointerenter', () => {
      wrapper.style.transform = 'translateY(-10px)';
      wrapper.style.boxShadow = '0 28px 60px rgba(0,0,0,0.45)';
      // start hold timer
      holdTimer = setTimeout(() => {
        // reveal thumbs with tailored animation based on idx (left/center/right)
        showThumbs(thumbs, idx);
        // subtle scale/pop
        wrapper.style.transform = 'translateY(-12px) scale(1.02)';
      }, 1000);
    }, { passive: true });

    wrapper.addEventListener('pointerleave', () => {
      wrapper.style.transform = '';
      wrapper.style.boxShadow = '';
      clearTimeout(holdTimer);
      hideThumbs(thumbs);
    });

    // click opens gallery lightbox
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      if (p.images && p.images.length) openGallery(p.images, 0, p.title);
    });

    return wrapper;
  }

  function showThumbs(thumbsElem, positionIndex) {
    // produce different layout behavior per requested spec:
    // left: thumbs slide left->center
    // center: two left, rest right
    // right: thumbs slide right->center
    if (!thumbsElem) return;
    const imgs = Array.from(thumbsElem.querySelectorAll('img'));
    if (!imgs.length) return;
    // reset
    thumbsElem.classList.add('show');
    imgs.forEach((img, i) => {
      img.style.transform = 'translateY(10px) scale(.98)';
      img.style.opacity = '0';
      img.style.transition = `transform .48s cubic-bezier(.16,.9,.28,1) ${i*40}ms, opacity .48s ${i*40}ms`;
      setTimeout(()=>{ img.style.transform='translateY(0) scale(1)'; img.style.opacity='1'; }, 20 + i*40);
    });
    // position based tweaks (visual only: could add offsets)
    if (positionIndex === 0) thumbsElem.style.justifyContent = 'flex-start';
    else if (positionIndex === 1) thumbsElem.style.justifyContent = 'center';
    else thumbsElem.style.justifyContent = 'flex-end';
  }

  function hideThumbs(thumbsElem) {
    if (!thumbsElem) return;
    const imgs = Array.from(thumbsElem.querySelectorAll('img'));
    imgs.forEach((img, i) => {
      img.style.opacity = '0';
      img.style.transform = 'translateY(8px) scale(.98)';
      img.style.transition = `transform .32s ease, opacity .32s ${i*16}ms`;
    });
    setTimeout(()=> thumbsElem.classList.remove('show'), 360);
  }

  /* ---------------- Lightbox (image gallery) ---------------- */
  // Create overlay elements once
  let galleryState = { images: [], index: 0 };
  const overlay = document.getElementById('lightboxOverlay');
  const resumeModal = document.getElementById('resumeModal');

  function ensureLightboxStructure() {
    if (!overlay) return;
    if (overlay.dataset.inited) return;
    overlay.dataset.inited = '1';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="lb-shell" role="dialog" aria-modal="true" aria-label="Image viewer" style="max-width:1100px;width:94%;max-height:88vh;">
        <div class="lb-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div id="lbTitle" style="font-weight:800;color:var(--text)"></div>
          <div style="display:flex;gap:8px;align-items:center">
            <button id="lbPrev" class="btn btn-secondary" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
            <button id="lbNext" class="btn btn-secondary" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
            <button id="lbClose" class="btn btn-secondary" aria-label="Close"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div id="lbContent" style="background:var(--card-bg);border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:center;max-height:80vh;overflow:hidden;backdrop-filter:blur(var(--glass-blur));">
          <img id="lbImage" src="" alt="" style="max-width:100%;max-height:76vh;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,0.6);transition:transform .36s var(--transition-global), opacity .28s">
        </div>
      </div>
    `;
    // wire controls
    $('#lbClose', overlay).addEventListener('click', closeLightbox);
    $('#lbPrev', overlay).addEventListener('click', () => showLightboxIndex(galleryState.index - 1));
    $('#lbNext', overlay).addEventListener('click', () => showLightboxIndex(galleryState.index + 1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
    window.addEventListener('keydown', (e) => {
      if (overlay.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') showLightboxIndex(galleryState.index - 1);
      if (e.key === 'ArrowRight') showLightboxIndex(galleryState.index + 1);
      if (e.key === 'Escape') closeLightbox();
    });

    // touch swipe
    let touchStartX = null;
    $('#lbContent', overlay).addEventListener('touchstart', (ev) => { touchStartX = ev.touches[0].clientX; }, { passive: true });
    $('#lbContent', overlay).addEventListener('touchmove', (ev) => {
      if (touchStartX === null) return;
      const diff = touchStartX - ev.touches[0].clientX;
      if (Math.abs(diff) > 50) { if (diff > 0) showLightboxIndex(galleryState.index + 1); else showLightboxIndex(galleryState.index - 1); touchStartX = null; }
    }, { passive: true });
  }

  function openGallery(images = [], startIndex = 0, title = '') {
    if (!overlay) return;
    ensureLightboxStructure();
    galleryState.images = images.slice();
    galleryState.index = clamp(startIndex, 0, images.length - 1);

    $('#lbTitle', overlay).textContent = title || '';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    document.body.classList.add('modal-open');
    showLightboxIndex(galleryState.index);
  }

  function showLightboxIndex(i) {
    if (!overlay) return;
    const imgs = galleryState.images;
    if (!imgs || !imgs.length) return;
    if (i < 0) i = imgs.length - 1;
    if (i >= imgs.length) i = 0;
    galleryState.index = i;
    const img = $('#lbImage', overlay);
    img.style.opacity = '0';
    img.style.transform = 'scale(.98)';
    setTimeout(() => {
      img.src = imgs[i];
      img.alt = `Image ${i+1} of ${imgs.length}`;
      setTimeout(()=> { img.style.opacity = '1'; img.style.transform = 'scale(1)'; }, 20);
    }, 120);
  }

  function closeLightbox() {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  /* ---------------- Resume modal ---------------- */
  function ensureResumeModal() {
    if (!resumeModal) return;
    if (resumeModal.dataset.inited) return;
    resumeModal.dataset.inited = '1';
    resumeModal.style.display = 'none';
    resumeModal.innerHTML = `
      <div class="resume-shell" role="dialog" aria-modal="true" aria-label="Resume" style="max-width:1100px;width:94%;max-height:88vh;">
        <div style="display:flex;justify-content:flex-end;padding:8px"><button id="resumeClose" class="btn btn-secondary"><i class="fas fa-times"></i></button></div>
        <iframe id="resumeIframe" src="Dilip_ch_resume.pdf" style="width:100%;height:80vh;border-radius:10px;border:0;box-shadow:0 40px 120px rgba(0,0,0,0.6)"></iframe>
      </div>
    `;
    $('#resumeClose', resumeModal).addEventListener('click', closeResume);
    resumeModal.addEventListener('click', (e) => { if (e.target === resumeModal) closeResume(); });
  }

  function openResume() {
    ensureResumeModal();
    if (!resumeModal) return;
    resumeModal.style.display = 'flex';
    resumeModal.style.alignItems = 'center';
    resumeModal.style.justifyContent = 'center';
    document.body.classList.add('modal-open');
  }
  function closeResume() { if (!resumeModal) return; resumeModal.style.display = 'none'; document.body.classList.remove('modal-open'); }

  // wire resume button
  const openResumeBtn = qId('openResumeBtn');
  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);

  /* ---------------- Contact Form handler ---------------- */
  const discussForm = qId('discussForm');
  if (discussForm) {
    discussForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = {
        name: discussForm.querySelector('#d_name')?.value || '',
        email: discussForm.querySelector('#d_email')?.value || '',
        type: discussForm.querySelector('#d_type')?.value || '',
        budget: discussForm.querySelector('#d_budget')?.value || '',
        message: discussForm.querySelector('#d_message')?.value || ''
      };
      // Demo behavior: show alert and reset
      alert(`Thanks ${data.name || 'there'}! Your request has been received. (Demo: data is not sent anywhere in this client-only build.)`);
      discussForm.reset();
    });
    qId('clearDiscuss')?.addEventListener('click', () => discussForm.reset());
  }

  /* ---------------- Footer year ---------------- */
  (function setYear() { const y = new Date().getFullYear(); const el = qId('year'); if (el) el.textContent = y; })();

  /* ---------------- Helpers ---------------- */
  function escapeHtml(s) { if (!s) return ''; return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  /* ---------------- Throttle helper ---------------- */
  function throttle(fn, wait) {
    let last = 0, t = null;
    return function (...args) {
      const now = Date.now();
      if (now - last >= (wait || 16)) { last = now; fn.apply(this, args); }
      else { clearTimeout(t); t = setTimeout(()=> { last = Date.now(); fn.apply(this, args); }, wait - (now - last)); }
    };
  }

  /* ---------------- Init lightbox/resume structures on load ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    ensureLightboxStructure();
    ensureResumeModal();
  });

  /* ---------------- Ready: attach global click to close modals on Escape etc (already handled) ---------------- */

})();
