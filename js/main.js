/* js/main.js
   Main interactivity: name/header morph, projects dynamic util, lightbox, theme persistence
*/
(async function () {
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from((ctx||document).querySelectorAll(s));

  // ---- Theme toggle / persistence ----
  const themeToggle = $('#themeToggle');
  const mobileTheme = document.getElementById('mobileThemeToggle');

  function setLightMode(on, manual=false) {
    if (on) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
    if (manual) localStorage.setItem('themeManual','1');
  }
  // init theme from storage; if no stored -> leave as default (animation may set)
  const stored = localStorage.getItem('theme');
  if (stored === 'light') setLightMode(true);
  else if (stored === 'dark') setLightMode(false);

  themeToggle?.addEventListener('click', () => {
    const goingLight = !document.body.classList.contains('light-mode');
    setLightMode(goingLight, true);
  });
  mobileTheme?.addEventListener('click', () => {
    const goingLight = !document.body.classList.contains('light-mode');
    setLightMode(goingLight, true);
  });

  // ---- Header & hero morph behavior ----
  const heroTitle = $('#heroTitle');
  const heroImgWrap = $('#heroImageWrap');
  const header = $('#header');
  const logoSpan = document.querySelector('.logo span');

  // uppercase hero title immediately
  if (heroTitle) heroTitle.textContent = heroTitle.textContent.toUpperCase();

  // function that runs continuously on scroll to morph name to top-left and transform hero
  function onScrollMorph() {
    const hero = document.querySelector('.hero');
    if (!hero || !heroTitle) return;
    const rect = hero.getBoundingClientRect();
    // progress from 0 (fresh) to 1 (scrolled past)
    const start = window.innerHeight * 0.62; // when morph should start
    const end = window.innerHeight * 0.18;   // when morph completes
    // normalize value between 0..1 based on hero bottom to viewport
    const progress = clamp((start - rect.bottom) / (start - end), 0, 1);
    // transform: scale title slightly with progress and move up
    const scale = 1 + progress * 0.28; // name grows slightly then later shrinks & moves left
    heroTitle.style.transform = `translateY(${-progress * 36}px) scale(${scale})`;
    heroTitle.style.opacity = `${1 - progress*0.02}`;

    // shrink profile image progressively
    if (heroImgWrap) {
      const imgScale = clamp(1 - progress * 0.62, 0.36, 1);
      heroImgWrap.style.transform = `scale(${imgScale}) translateY(${-progress * 32}px)`;
      heroImgWrap.style.opacity = `${clamp(1 - progress*1.1, 0, 1)}`;
    }

    // once progress passes 0.92, settle into header small name
    if (progress > 0.92) {
      header.classList.add('scrolled');
      document.body.classList.add('hero-shrunk');
      // position the logo name slightly left (add small transform)
      if (logoSpan) logoSpan.style.transform = 'translateX(6px)';
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('hero-shrunk');
      if (logoSpan) logoSpan.style.transform = '';
    }

    // darken page gradually and if progress >0.9, auto apply dark mode if not manual
    const manual = localStorage.getItem('themeManual') === '1';
    if (!manual) {
      // smoothly fade to dark by removing light-mode when cross threshold
      if (progress > 0.55) document.body.classList.remove('light-mode');
    }
  }

  window.addEventListener('scroll', onScrollMorph, { passive: true });
  window.addEventListener('resize', onScrollMorph);

  // clamp
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Also run morph on custom event from animation overlay
  window.addEventListener('intro:morph', () => {
    // tiny delay to let overlay fade
    setTimeout(()=>{ window.scrollTo({top:1, behavior:'smooth'}); }, 260);
  });

  // ---- Projects dynamic + hover hold for thumbnails + click to open lightbox ----
  // load projects.json (if present), else rely on static markup
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, {cache:'no-store'});
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }
  const projectsData = await fetchJSON('data/projects.json') || [];

  // create cards if none present
  const projectsGrid = document.getElementById('projectsGrid');
  function createProjectCard(p, idx) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.id = p.id || `proj-${idx}`;
    card.innerHTML = `
      <div class="project-image">
        <img class="project-img" src="${(p.images && p.images[0]) || 'Image/Profile.JPG'}" alt="${p.title||''}">
        <div class="project-overlay"><button class="btn btn-primary view-project-btn" data-id="${p.id}"><i class="fas fa-eye"></i> View</button></div>
      </div>
      <div class="project-content">
        <div class="project-title">${p.title||'Untitled'}</div>
        <div class="project-description">${p.short || p.description || ''}</div>
      </div>
      <div class="project-thumbs" style="display:none"></div>
    `;
    // thumbs injection for hover reveal
    const thumbStrip = card.querySelector('.project-thumbs');
    if (p.images && p.images.length) {
      p.images.forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.style.width = '78px';
        t.style.height = '50px';
        t.style.objectFit = 'cover';
        t.style.borderRadius = '8px';
        t.style.cursor = 'pointer';
        t.style.boxShadow = '0 8px 28px rgba(0,0,0,0.35)';
        t.addEventListener('click', (e) => {
          e.stopPropagation();
          openImageLightbox(p.images, p.images.indexOf(src));
        });
        thumbStrip.appendChild(t);
      });
    }

    // hover hold behavior
    let hoverTimer = null;
    const holdDelay = 900; // ms
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.28s cubic-bezier(.2,.9,.24,1), box-shadow 0.28s';
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 26px 60px rgba(0,0,0,0.45)';
      hoverTimer = setTimeout(() => {
        thumbStrip.style.display = 'flex';
        thumbStrip.style.opacity = '0';
        thumbStrip.style.transform = 'translateY(8px)';
        setTimeout(() => { thumbStrip.style.opacity = '1'; thumbStrip.style.transform = 'translateY(0)'; }, 20);
      }, holdDelay);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      clearTimeout(hoverTimer);
      if (thumbStrip.style.display !== 'none') {
        thumbStrip.style.opacity = '0';
        thumbStrip.style.transform = 'translateY(6px)';
        setTimeout(()=> {thumbStrip.style.display = 'none';}, 260);
      }
    });

    // click to open project lightbox (all images)
    card.addEventListener('click', (e) => {
      const id = p.id;
      if (p.images && p.images.length) openImageLightbox(p.images, 0, p.title);
      e.stopPropagation();
    });

    return card;
  }

  if (projectsGrid && projectsData.length) {
    projectsGrid.innerHTML = '';
    // take first three as requested
    const list = projectsData.slice(0,3);
    while (list.length < 3) list.push({ title: 'Coming soon', short:'More soon', images:['Image/Profile.JPG'] });
    list.forEach((p,i) => {
      const card = createProjectCard(p,i);
      card.style.opacity = '0';
      card.style.transform = (i===0 ? 'translateX(-120%)' : (i===1 ? 'translateY(30px)':'translateX(120%)'));
      projectsGrid.appendChild(card);
      setTimeout(()=> {
        card.style.transition = 'transform 0.9s cubic-bezier(.2,.9,.24,1), opacity 0.9s';
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
      }, 220 + i*120);
    });
  }

  // ---- Lightbox for images (project gallery) ----
  // We'll create a single lightbox element and reuse it
  function createImageLightbox() {
    if ($('#imageLightbox')) return;
    const overlay = document.createElement('div');
    overlay.id = 'imageLightbox';
    Object.assign(overlay.style, {
      position:'fixed', inset:'0', display:'none', zIndex:6000, alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)'
    });

    const box = document.createElement('div');
    box.style.width='92%'; box.style.maxWidth='980px'; box.style.maxHeight='86vh'; box.style.background='var(--card-bg)';
    box.style.borderRadius='12px'; box.style.padding='10px'; box.style.position='relative'; box.style.display='flex'; box.style.flexDirection='column'; box.style.gap='10px';
    box.style.backdropFilter='blur(10px)';

    const header = document.createElement('div');
    header.style.display='flex'; header.style.justifyContent='space-between'; header.style.alignItems='center';
    header.innerHTML = `<div id="lightboxTitle" style="font-weight:800;color:var(--text)"></div><div style="display:flex;gap:8px;align-items:center;"><button id="lightboxPrev" class="btn btn-secondary"><i class="fas fa-chevron-left"></i></button><button id="lightboxNext" class="btn btn-secondary"><i class="fas fa-chevron-right"></i></button><button id="lightboxClose" class="close-gallery" style="background:none;border:none;font-size:20px;color:var(--text)">&times;</button></div>`;

    const gallery = document.createElement('div');
    gallery.id = 'lightboxGallery';
    gallery.style.display='flex';
    gallery.style.gap='12px';
    gallery.style.alignItems='center';
    gallery.style.justifyContent='center';
    gallery.style.overflow='hidden';
    gallery.style.flex='1';

    const imgWrap = document.createElement('div');
    imgWrap.id = 'lightboxImageWrap';
    imgWrap.style.display='flex';
    imgWrap.style.gap='12px';
    imgWrap.style.alignItems='center';
    imgWrap.style.justifyContent='center';
    imgWrap.style.flex='1';
    imgWrap.style.overflow='hidden';

    gallery.appendChild(imgWrap);
    box.appendChild(header);
    box.appendChild(gallery);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // close
    $('#lightboxClose').addEventListener('click', () => closeLightbox());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });

    // prev/next
    $('#lightboxPrev').addEventListener('click', () => showLightboxIndex(currentIndex-1));
    $('#lightboxNext').addEventListener('click', () => showLightboxIndex(currentIndex+1));

    // keyboard nav
    window.addEventListener('keydown', (e) => {
      if (overlay.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') showLightboxIndex(currentIndex-1);
      if (e.key === 'ArrowRight') showLightboxIndex(currentIndex+1);
      if (e.key === 'Escape') closeLightbox();
    });

    // swipe handling for touch devices inside imageWrap
    let touchStartX = null;
    imgWrap.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX, {passive:true});
    imgWrap.addEventListener('touchmove', (e) => {
      if (touchStartX === null) return;
      const diff = touchStartX - e.touches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) showLightboxIndex(currentIndex+1); else showLightboxIndex(currentIndex-1);
        touchStartX = null;
      }
    }, {passive:true});
  }
  createImageLightbox();

  let imageList = [], currentIndex = 0;
  function openImageLightbox(images, start=0, title='') {
    imageList = images || [];
    if (!imageList.length) return;
    const overlay = $('#imageLightbox');
    $('#lightboxTitle').textContent = title || '';
    overlay.style.display = 'flex';
    document.body.classList.add('modal-open'); // used for blurring background
    currentIndex = clamp(start, 0, imageList.length-1);
    renderLightboxImages();
  }

  function renderLightboxImages() {
    const wrap = $('#lightboxImageWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    // show single large image with subtle animation
    const img = document.createElement('img');
    img.src = imageList[currentIndex];
    img.style.maxWidth = '100%';
    img.style.maxHeight = '68vh';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 18px 60px rgba(0,0,0,0.6)';
    img.style.transform = 'scale(.98)';
    img.style.transition = 'transform 0.28s ease, opacity 0.28s';
    wrap.appendChild(img);
    setTimeout(()=> img.style.transform = 'scale(1)', 20);
    // also pre-load neighbors for speed
    const p = imageList[currentIndex-1]; if (p) (new Image()).src = p;
    const n = imageList[currentIndex+1]; if (n) (new Image()).src = n;
  }

  function showLightboxIndex(i) {
    if (!imageList.length) return;
    if (i < 0) i = imageList.length - 1;
    if (i >= imageList.length) i = 0;
    currentIndex = i;
    renderLightboxImages();
  }
  function closeLightbox() {
    const overlay = $('#imageLightbox');
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  // ---- Resume lightbox (embedded PDF) ----
  function createResumeLightbox() {
    if ($('#resumeLightbox')) return;
    const overlay = document.createElement('div');
    overlay.id = 'resumeLightbox';
    Object.assign(overlay.style, { position:'fixed', inset:'0', display:'none', zIndex:7000, alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)'});
    const box = document.createElement('div');
    box.style.width='90%'; box.style.maxWidth='1100px'; box.style.maxHeight='90vh'; box.style.borderRadius='12px'; box.style.overflow='hidden'; box.style.position='relative';
    box.style.background='var(--card-bg)'; box.style.backdropFilter='blur(10px)';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, { position:'absolute', top:'8px', right:'10px', background:'none', border:'none', color:'var(--text)', fontSize:'24px', zIndex:10, cursor:'pointer' });
    const iframe = document.createElement('iframe');
    iframe.id = 'resumeFrame';
    iframe.src = 'Dilip_ch_resume.pdf';
    iframe.style.width='100%'; iframe.style.height='88vh'; iframe.style.border='0';
    box.appendChild(closeBtn);
    box.appendChild(iframe);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    closeBtn.addEventListener('click', ()=> { overlay.style.display='none'; document.body.classList.remove('modal-open'); });
    overlay.addEventListener('click', (e)=> { if (e.target === overlay) { overlay.style.display='none'; document.body.classList.remove('modal-open'); } });
  }
  createResumeLightbox();

  // Wire resume open buttons
  $$('.resume-download').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const overlay = $('#resumeLightbox');
      if (!overlay) return;
      overlay.style.display = 'flex';
      document.body.classList.add('modal-open');
    });
  });

  // Wire contact quick icons
  const mailLinks = $$('a[href^="mailto:"]');
  mailLinks.forEach(a => a.addEventListener('click', ()=>{})); // default mailto will open

  // phone link behavior
  const phoneLinks = $$('a[href^="tel:"]');
  phoneLinks.forEach(a => a.addEventListener('click', ()=>{}));

  // linkedin action (make sure link exists in HTML)
  // resume icon opening handled above

  // small utility clamp
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  // ensure lightbox / resume ready
  createImageLightbox();
  createResumeLightbox();

  // modal-open class: add css blur in style (see CSS snippet below)

})();
