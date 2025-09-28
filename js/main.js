/* js/main.js
   Main site JS: loads data, handles header morph, navigation, skills tile interactions,
   project placement animation, project hover -> thumbnails, theme toggle, responsive details.
*/

(async function () {
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from((ctx || document).querySelectorAll(s));

  /* ---------- Load JSON data ---------- */
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + path);
      return await res.json();
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  const projectsData = await fetchJSON('data/projects.json') || [];
  const skillsData = await fetchJSON('data/skills.json') || {};

  /* ---------- Theme toggle ---------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn?.querySelector('i');

  function setThemeLight(isLight) {
    if (isLight) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    }
  }
  // init
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    setThemeLight(true);
  } else {
    setThemeLight(false);
  }
  themeToggleBtn?.addEventListener('click', () => setThemeLight(!document.body.classList.contains('light-mode')));

  /* ---------- Header morph: when intro signals to morph, move name to header & shrink hero image ---------- */
  function morphHeroToHeader() {
    const hero = document.querySelector('.hero');
    const heroImgContainer = document.querySelector('.hero-img-container');
    const header = document.getElementById('header');
    const logo = document.querySelector('.logo span');
    const heroTitle = document.getElementById('heroTitle');

    // step 1: shrink profile image and animate heroTitle scale
    // animate hero image out
    if (heroImgContainer) {
      heroImgContainer.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
      heroImgContainer.style.transform = 'scale(0.4) translateY(-30px)';
      heroImgContainer.style.opacity = '0';
    }

    // step 2: make heroTitle grow and move to top-left - we add a class so CSS handles final placement
    heroTitle.style.transition = 'transform 0.9s cubic-bezier(.2,.9,.24,1), font-size 0.9s';
    heroTitle.style.transformOrigin = 'left center';
    heroTitle.style.transform = 'translateY(-30px) scale(1.16)';
    // after transition, make it small and left in header
    setTimeout(() => {
      // convert to header logo
      header.classList.add('scrolled'); // ensure header reduced padding
      // move text into left logo area: we'll add a small class to position logo span
      const logoSpan = document.querySelector('.logo span');
      if (logoSpan) {
        logoSpan.style.transition = 'transform 0.6s ease, color 0.6s ease';
        logoSpan.style.transform = 'translateX(6px)';
      }

      // make nav visible with fade-ins
      $$('.nav-link').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        el.style.transition = `opacity 0.5s ${0.15 * i + 0.2}s ease, transform 0.5s ${0.15 * i + 0.2}s ease`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });

      // set dark-mode fade (as user requested: the sequence slowly fades to dark)
      document.body.classList.remove('light-mode'); // ensure dark
    }, 900);

    // remove hero tiles if present
    const tileWrap = document.getElementById('tileWrap');
    if (tileWrap) {
      tileWrap.style.transition = 'opacity 0.6s ease';
      tileWrap.style.opacity = '0';
      setTimeout(() => tileWrap.remove(), 700);
    }
  }

  window.addEventListener('intro:morph', morphHeroToHeader);

  /* ---------- Populate Skills as glass tiles ---------- */
  function injectSkills(skills) {
    const skillsParent = document.querySelector('.about-skills');
    if (!skillsParent) return;

    const flat = [];
    ['tools','analysis','soft'].forEach(k => {
      if (Array.isArray(skills[k])) flat.push(...skills[k]);
    });
    // fallback: if JSON is object of skill groups
    if (flat.length === 0) {
      Object.values(skills).forEach(group => {
        if (Array.isArray(group)) flat.push(...group);
      });
    }

    skillsParent.innerHTML = '';
    flat.forEach(skill => {
      const s = document.createElement('button');
      s.className = 'skill glass-card';
      s.textContent = skill;
      s.style.cursor = 'pointer';
      s.setAttribute('aria-label', skill);
      // hover / touch glass cursor effect handled in CSS, but we enhance with a micro pop
      s.addEventListener('mouseenter', () => {
        s.style.transform = 'translateY(-6px) scale(1.02)';
        s.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      });
      s.addEventListener('mouseleave', () => {
        s.style.transform = '';
        s.style.boxShadow = '';
      });
      s.addEventListener('touchstart', () => {
        s.style.transform = 'translateY(-6px) scale(1.02)';
      }, {passive:true});
      s.addEventListener('touchend', () => {
        s.style.transform = '';
      });
      skillsParent.appendChild(s);
    });
  }
  injectSkills(skillsData);

  /* ---------- Projects: dynamic load and center/left/right animation ---------- */
  const projectsGrid = document.getElementById('projectsGrid');

  function createProjectCard(p, idx) {
    // base card (we will keep structure similar to your HTML but created dynamically)
    const card = document.createElement('div');
    card.id = p.id;
    card.className = 'project-card glass-card animate-on-scroll';
    card.style.opacity = '0';
    card.dataset.index = idx;

    const imageWrap = document.createElement('div');
    imageWrap.className = 'project-image';
    imageWrap.style.position = 'relative';
    imageWrap.style.height = '220px';
    imageWrap.style.overflow = 'hidden';

    const img = document.createElement('img');
    img.className = 'project-img';
    img.src = p.images && p.images[0] ? p.images[0] : 'Image/Profile.JPG';
    img.alt = p.title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    imageWrap.appendChild(img);

    // overlay with button
    const overlay = document.createElement('div');
    overlay.className = 'project-overlay';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.innerHTML = `<button class="btn btn-primary view-project-btn" data-project="${p.id}"><i class="fas fa-external-link-alt"></i> View Project</button>`;
    imageWrap.appendChild(overlay);

    const content = document.createElement('div');
    content.className = 'project-content';
    content.innerHTML = `<h3 class="project-title">${p.title}</h3>
                         <p class="project-description">${p.short || p.description}</p>
                         <div class="project-actions">
                           <button class="btn btn-primary view-project-btn" data-project="${p.id}"><i class="fas fa-eye"></i> View Project</button>
                           ${p.download ? `<a class="btn btn-secondary" href="${p.download}" target="_blank"><i class="fas fa-download"></i> Download</a>` : ''}
                         </div>`;

    // thumbnails bar placeholder (hidden)
    const thumbStrip = document.createElement('div');
    thumbStrip.className = 'project-thumbs';
    thumbStrip.style.display = 'none';
    thumbStrip.style.padding = '8px';
    thumbStrip.style.gap = '8px';
    thumbStrip.style.alignItems = 'center';
    thumbStrip.style.justifyContent = 'center';
    thumbStrip.style.position = 'absolute';
    thumbStrip.style.left = '0';
    thumbStrip.style.right = '0';
    thumbStrip.style.bottom = '-60px';
    thumbStrip.style.transition = 'bottom 0.35s ease, opacity 0.35s ease';
    thumbStrip.style.opacity = '0';
    thumbStrip.style.pointerEvents = 'none';
    thumbStrip.style.display = 'flex';

    if (Array.isArray(p.images)) {
      p.images.forEach(src => {
        const t = document.createElement('img');
        t.src = src;
        t.style.width = '78px';
        t.style.height = '50px';
        t.style.objectFit = 'cover';
        t.style.borderRadius = '8px';
        t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
        t.style.cursor = 'pointer';
        thumbStrip.appendChild(t);
      });
    }

    card.appendChild(imageWrap);
    card.appendChild(content);
    card.appendChild(thumbStrip);

    // hover behaviour
    let hoverTimer = null;
    card.addEventListener('mouseenter', () => {
      // micro haptic pop
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
      // show small thumbnail after 1s
      hoverTimer = setTimeout(() => {
        thumbStrip.style.display = 'flex';
        setTimeout(() => {
          thumbStrip.style.bottom = '12px';
          thumbStrip.style.opacity = '1';
          thumbStrip.style.pointerEvents = 'auto';
        }, 10);
      }, 1000);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      clearTimeout(hoverTimer);
      // hide thumbnails
      thumbStrip.style.bottom = '-60px';
      thumbStrip.style.opacity = '0';
      thumbStrip.style.pointerEvents = 'none';
      setTimeout(() => thumbStrip.style.display = 'none', 350);
    });

    return card;
  }

  // populate grid with 3 project cards arranged left-center-right animation
  function populateProjects(projects) {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    // take first three (or pad)
    const list = projects.slice(0, 3);
    while (list.length < 3) list.push({
      id: 'placeholder-' + list.length,
      title: 'Coming Soon',
      short: 'New project coming',
      images: ['Image/Profile.JPG'],
      download: ''
    });

    list.forEach((p, i) => {
      const card = createProjectCard(p, i);
      // set initial translate for animation: left, center, right
      card.style.transform = i === 0 ? 'translateX(-120%)' : (i === 1 ? 'translateY(40px) scale(0.98)' : 'translateX(120%)');
      card.style.opacity = '0';
      card.style.transition = 'transform 0.9s cubic-bezier(.2,.9,.24,1), opacity 0.9s';
      projectsGrid.appendChild(card);
      // final animate after small delay
      setTimeout(() => {
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
      }, 240 + i * 140);
    });
  }

  populateProjects(projectsData);

  /* ---------- Project View buttons open gallery modal (existing markup uses project-gallery divs)
       If your page has project gallery modals in HTML already, prefer toggling them.
       But we also add a lightweight in-page modal to show thumbs on view.
  ---------- */

  // lightweight gallery modal for dynamic projects
  function createLightbox() {
    if (document.getElementById('siteLightbox')) return;
    const modal = document.createElement('div');
    modal.id = 'siteLightbox';
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      display: 'none',
      zIndex: 4000,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)'
    });

    const box = document.createElement('div');
    box.style.maxWidth = '920px';
    box.style.width = '94%';
    box.style.maxHeight = '86vh';
    box.style.overflow = 'auto';
    box.style.borderRadius = '14px';
    box.style.padding = '18px';
    box.style.background = 'var(--card-bg)';
    box.style.backdropFilter = 'blur(12px)';
    box.style.boxShadow = '0 30px 80px rgba(0,0,0,0.6)';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.gap = '12px';
    header.innerHTML = '<h3 id="lightboxTitle" style="margin:0"></h3><button id="lightboxClose" class="close-gallery" style="font-size:20px;background:none;border:none;color:var(--text);cursor:pointer">&times;</button>';
    const gallery = document.createElement('div');
    gallery.id = 'lightboxGallery';
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(auto-fit,minmax(200px,1fr))';
    gallery.style.gap = '12px';
    gallery.style.marginTop = '12px';

    box.appendChild(header);
    box.appendChild(gallery);
    modal.appendChild(box);
    document.body.appendChild(modal);

    document.getElementById('lightboxClose').addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
  createLightbox();

  // delegate view project clicks
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-project-btn');
    if (!btn) return;
    const id = btn.dataset.project;
    const p = projectsData.find(x => x.id === id);
    if (!p) return;
    const modal = document.getElementById('siteLightbox');
    if (!modal) return;
    const gallery = document.getElementById('lightboxGallery');
    gallery.innerHTML = '';
    document.getElementById('lightboxTitle').textContent = p.title;
    (p.images || []).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.style.width = '100%';
      img.style.borderRadius = '10px';
      img.style.objectFit = 'cover';
      img.style.maxHeight = '420px';
      img.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
      gallery.appendChild(img);
    });
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  /* ---------- Scroll reveal (intersection observer) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.animate-on-scroll').forEach(el => io.observe(el));

  /* ---------- Mobile menu & nav link sticky highlight (already present) ---------- */
  // mobile menu button
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  mobileMenuBtn?.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    if (mobileNav.classList.contains('active')) {
      mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    }
  });

  /* ---------- Contact form lightweight handler ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name')?.value || '';
    alert(`Thanks ${name.trim() || 'there'} — message received. (This is a demo client-side handler.)`);
    contactForm.reset();
  });

  /* ---------- small UX polish: update resume link (if Resume.pdf present) ---------- */
  // nothing else

})();
