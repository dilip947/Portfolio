// js/main.js
// Master behavior: data loading, skill tile color toggles, project interactions, lightboxes, theme, back-to-top.
// Works with GSAP animation engine (animation.js uses GSAP for timeline & ScrollTrigger).

(() => {
  'use strict';

  /* -------------------- Utilities -------------------- */
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const elById = id => document.getElementById(id);

  /* -------------------- Contrast utils -------------------- */
  // hex from rgb
  function rgbToHex(r,g,b) {
    return "#" + [r,g,b].map(x => {
      const hex = x.toString(16); return hex.length===1 ? '0'+hex : hex;
    }).join('');
  }
  // compute luminance per W3C; return true if light background
  function isLightColor(r,g,b) {
    // convert sRGB to linear
    const srgb = [r,g,b].map(v => v/255).map(c => (c<=0.03928) ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
    const L = 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
    return L > 0.65; // tuned threshold for contrast
  }
  // parse CSS color string like "rgb(r,g,b)" or hex
  function parseColorToRGB(str) {
    if (!str) return [255,255,255];
    str = str.trim();
    if (str.startsWith('#')) {
      const hex = str.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0]+hex[0],16), g = parseInt(hex[1]+hex[1],16), b = parseInt(hex[2]+hex[2],16);
        return [r,g,b];
      } else {
        const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
        return [r,g,b];
      }
    } else if (str.startsWith('rgb')) {
      const nums = str.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (nums) return [parseInt(nums[1]), parseInt(nums[2]), parseInt(nums[3])];
    }
    return [255,255,255];
  }

  /* -------------------- Theme toggle & persistence -------------------- */
  const themeBtn = $('#themeToggle');
  function setTheme(light, manual=false) {
    if (light) document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    if (manual) localStorage.setItem('themeManual', '1');
    // icon
    if (themeBtn) themeBtn.textContent = light ? '🌙' : '☀️';
  }
  (function initTheme() {
    const stored = localStorage.getItem('theme');
    const manual = localStorage.getItem('themeManual') === '1';
    if (stored === 'light') setTheme(true, manual);
    else if (stored === 'dark') setTheme(false, manual);
    else setTheme(false, false);
  })();
  themeBtn && themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(!isLight, true);
  });

  /* -------------------- Data loading (skills + projects) -------------------- */
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, {cache:'no-store'});
      if (!res.ok) throw new Error('failed ' + path);
      return await res.json();
    } catch (err) {
      console.warn('Could not fetch', path, err);
      return null;
    }
  }

  // skills
  (async function loadSkills() {
    const data = await fetchJSON('data/skills.json');
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const arr = data && Array.isArray(data.skills) ? data.skills : (data || []);

    // fallback sample
    if (!arr.length) {
      ['Power BI','Excel (Advanced)','SQL','Tableau','Python (Pandas)'].forEach(s => grid.appendChild(createSkillTile(s)));
      return;
    }

    arr.forEach(obj => {
      const label = (typeof obj === 'string') ? obj : (obj.name || obj);
      grid.appendChild(createSkillTile(label));
    });
  })();

  function createSkillTile(label) {
    const btn = document.createElement('button');
    btn.className = 'skill-tile';
    btn.type = 'button';
    btn.textContent = label;
    btn.dataset.defaultBg = ''; // tracks default state

    // each click toggles between colored random and default
    btn.addEventListener('click', () => {
      // if colored (data-color), revert
      if (btn.dataset.colored === '1') {
        btn.dataset.colored = '0';
        btn.style.background = btn.dataset.defaultBg || 'var(--panel)';
        btn.style.color = '';
        btn.style.borderColor = 'var(--glass-border)';
      } else {
        // pick a random vibrant color palette
        const colors = [
          '#ff4d6d','#ff7a59','#ffb86b','#ffd166','#6ee7b7','#5eead4','#60a5fa','#7c3aed','#ef6ff0'
        ];
        const c = colors[Math.floor(Math.random() * colors.length)];
        btn.dataset.colored = '1';
        btn.dataset.chosen = c;
        btn.style.background = c;
        // ensure text contrast
        const [r,g,b] = parseColorToRGB(c);
        if (isLightColor(r,g,b)) { btn.style.color = '#111'; } else { btn.style.color = '#fff'; }
        btn.style.borderColor = 'rgba(0,0,0,0.06)';
      }
    });

    // store the computed default background from CSS
    const computed = getComputedStyle(btn).backgroundColor;
    btn.dataset.defaultBg = computed;
    return btn;
  }

  /* -------------------- Projects rendering + interactions -------------------- */
  (async function loadProjects() {
    const data = await fetchJSON('data/projects.json');
    const root = document.getElementById('projectsGrid') || document.getElementById('projectsRow');
    if (!root) return;
    root.innerHTML = '';

    const list = (data && Array.isArray(data) && data.length >= 1) ? data.slice(0,3) : defaultProjects();

    list.forEach((p, i) => {
      const card = buildProjectCard(p, i);
      root.appendChild(card);
    });
  })();

  function defaultProjects() {
    return [
      { title:'E-Commerce Analytics', short:'Order cancellations & delivery insights', images:['Projects/Projectec/1.png','Projects/Projectec/2.png','Projects/Projectec/3.png'] },
      { title:'Crypto Risk Dashboard', short:'Volatility & sentiment', images:['Projects/Projectcrypto/1.png','Projects/Projectcrypto/2.png','Projects/Projectcrypto/3.png'] },
      { title:'Process Improvement', short:'UAT & sprint artifacts', images:['Projects/P3ABC/1.png','Projects/P3ABC/Sprint.png','Projects/P3ABC/UAT.png'] }
    ];
  }

  function buildProjectCard(p, idx) {
    const wrap = document.createElement('div');
    wrap.className = 'project-card';
    wrap.style.opacity = '1';
    wrap.dataset.idx = idx;

    // set initial transform for entrance (handled by animation.js GSAP)
    if (idx === 0) wrap.style.transform = 'translateX(-10px)';
    if (idx === 1) wrap.style.transform = 'translateY(0)';
    if (idx === 2) wrap.style.transform = 'translateX(10px)';

    // media
    const media = document.createElement('div'); media.className = 'project-media';
    const img = document.createElement('img'); img.src = (p.images && p.images[0])? p.images[0] : 'Image/Profile.JPG'; img.alt = p.title || 'Project';
    media.appendChild(img); wrap.appendChild(media);

    // body
    const body = document.createElement('div'); body.className = 'project-body';
    body.innerHTML = `<div class="project-title">${escapeHtml(p.title)}</div><div class="project-short">${escapeHtml(p.short || '')}</div>`;
    wrap.appendChild(body);

    // thumbs placeholder
    const thumbs = document.createElement('div'); thumbs.className = 'project-thumbs';
    if (Array.isArray(p.images)) {
      p.images.forEach(s => {
        const t = document.createElement('img'); t.src = s; t.alt = p.title || 'thumb';
        t.addEventListener('click', (ev) => { ev.stopPropagation(); openGallery(p.images, p.images.indexOf(s), p.title); });
        thumbs.appendChild(t);
      });
    }
    wrap.appendChild(thumbs);

    // hover/hold logic
    let holdTimer = null;
    const holdDelay = 350; // 0.35s as per user request (0.3-0.4s)
    let held = false;

    // blur overlay global for slide-out
    const blurOverlay = getOrCreateBlurOverlay();

    wrap.addEventListener('pointerenter', () => {
      wrap.style.transform = 'translateY(-8px)';
      wrap.style.boxShadow = '0 28px 60px rgba(0,0,0,0.36)';
      holdTimer = setTimeout(() => {
        held = true;
        // slide out animation: slide the image right and add overlap
        // apply transform to media to create overlap effect
        media.style.transition = 'transform .42s cubic-bezier(.16,.9,.28,1)';
        media.style.transform = 'translateX(22px) scale(1.02)';
        // bring thumbs if any
        thumbs.classList.add('show');
        // blur background
        blurOverlay.style.display = 'block';
        setTimeout(()=> blurOverlay.style.opacity = '1', 20);
      }, holdDelay);
    }, { passive: true });

    wrap.addEventListener('pointerleave', () => {
      wrap.style.transform = '';
      wrap.style.boxShadow = '';
      clearTimeout(holdTimer);
      if (held) {
        // revert
        media.style.transform = '';
        thumbs.classList.remove('show');
        blurOverlay.style.opacity = '0';
        setTimeout(()=> { if (blurOverlay) blurOverlay.style.display = 'none'; }, 360);
      }
      held = false;
    });

    // click to open gallery
    wrap.addEventListener('click', (e) => {
      if (p.images && p.images.length) openGallery(p.images, 0, p.title);
      e.stopPropagation();
    });

    return wrap;
  }

  // blur overlay creation
  function getOrCreateBlurOverlay() {
    let bl = document.querySelector('.global-blur-overlay');
    if (!bl) {
      bl = document.createElement('div');
      bl.className = 'global-blur-overlay';
      Object.assign(bl.style, { position:'fixed', inset:0, zIndex:2500, background:'rgba(0,0,0,0.24)', opacity:0, transition:'opacity .36s', display:'none', backdropFilter:'blur(8px)' });
      document.body.appendChild(bl);
    }
    return bl;
  }

  /* -------------------- Lightbox gallery -------------------- */
  let galleryState = { images:[], index:0, title:'' };

  function ensureGalleryShell() {
    let shell = document.getElementById('galleryShell');
    if (shell) return shell;
    shell = document.createElement('div');
    shell.id = 'galleryShell';
    shell.className = 'modal-overlay';
    shell.innerHTML = `<div class="modal-shell" role="dialog" aria-modal="true" style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div id="galleryTitle" style="font-weight:800"></div>
        <div style="display:flex;gap:8px">
          <button id="galleryPrev" class="btn btn-secondary">◀</button>
          <button id="galleryNext" class="btn btn-secondary">▶</button>
          <button id="galleryClose" class="btn btn-secondary">✕</button>
        </div>
      </div>
      <div id="galleryContent" style="display:flex;align-items:center;justify-content:center;min-height:360px;">
        <img id="galleryImage" src=\"\" alt=\"\" style="max-width:100%;max-height:74vh;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,0.6);transition:transform .36s,opacity .28s" />
      </div>
    </div>`;
    document.body.appendChild(shell);

    // handlers
    $('#galleryClose', shell).addEventListener('click', closeGallery);
    $('#galleryPrev', shell).addEventListener('click', () => showGalleryIndex(galleryState.index-1));
    $('#galleryNext', shell).addEventListener('click', () => showGalleryIndex(galleryState.index+1));
    shell.addEventListener('click', (e) => { if (e.target === shell) closeGallery(); });

    // keyboard
    window.addEventListener('keydown', (e) => {
      if (shell.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') showGalleryIndex(galleryState.index-1);
      if (e.key === 'ArrowRight') showGalleryIndex(galleryState.index+1);
      if (e.key === 'Escape') closeGallery();
    });

    // touch swipe
    const content = shell.querySelector('#galleryContent');
    let touchStartX = null;
    content.addEventListener('touchstart', (ev) => touchStartX = ev.touches[0].clientX, { passive:true });
    content.addEventListener('touchmove', (ev) => {
      if (touchStartX === null) return;
      const diff = touchStartX - ev.touches[0].clientX;
      if (Math.abs(diff) > 50) { if (diff>0) showGalleryIndex(galleryState.index+1); else showGalleryIndex(galleryState.index-1); touchStartX = null;}
    }, { passive:true });

    return shell;
  }

  function openGallery(images, startIdx = 0, title='') {
    const shell = ensureGalleryShell();
    galleryState.images = images.slice();
    galleryState.index = clamp(startIdx, 0, images.length-1);
    galleryState.title = title || '';
    $('#galleryTitle', shell).textContent = galleryState.title;
    showGalleryIndex(galleryState.index);
    shell.style.display = 'flex';
    shell.style.alignItems = 'center';
    shell.style.justifyContent = 'center';
    document.body.classList.add('modal-open');
  }

  function showGalleryIndex(i) {
    const shell = document.getElementById('galleryShell');
    if (!shell) return;
    const imgs = galleryState.images;
    if (!imgs || !imgs.length) return;
    if (i < 0) i = imgs.length - 1;
    if (i >= imgs.length) i = 0;
    galleryState.index = i;
    const imgEl = $('#galleryImage', shell);
    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(.98)';
    setTimeout(() => {
      imgEl.src = imgs[i];
      setTimeout(()=> { imgEl.style.opacity = '1'; imgEl.style.transform = 'scale(1)'; }, 30);
    }, 120);
  }

  function closeGallery() {
    const shell = document.getElementById('galleryShell');
    if (!shell) return;
    shell.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  /* -------------------- Resume modal -------------------- */
  function ensureResumeShell() {
    let s = document.getElementById('resumeShell');
    if (s) return s;
    s = document.createElement('div');
    s.id = 'resumeShell';
    s.className = 'modal-overlay';
    s.innerHTML = `<div class="modal-shell">
      <div style="display:flex;justify-content:flex-end;"><button id="resumeClose" class="btn btn-secondary">✕</button></div>
      <iframe src="Dilip_ch_resume.pdf" style="width:100%;height:80vh;border:0;border-radius:10px"></iframe>
    </div>`;
    document.body.appendChild(s);
    $('#resumeClose', s).addEventListener('click', closeResume);
    s.addEventListener('click', (e) => { if (e.target === s) closeResume(); });
    return s;
  }

  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) resumeBtn.addEventListener('click', (e) => { e.preventDefault(); const s = ensureResumeShell(); s.style.display='flex'; s.style.alignItems='center'; s.style.justifyContent='center'; document.body.classList.add('mo
