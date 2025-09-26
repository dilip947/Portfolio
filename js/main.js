/* main.js
   - Dynamic project loader (reads data/projects.json)
   - Project modal
   - Contact form handling (mailto fallback + localStorage store)
   - Accessibility helpers & small UI utilities
*/

(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const container = el => document.createElement(el);

  // small safe fetch with fallback
  async function fetchJSON(path) {
    try {
      const res = await fetch(path, {cache: "no-cache"});
      if (!res.ok) throw new Error("Fetch error " + res.status);
      return await res.json();
    } catch (err) {
      console.error("fetchJSON failed:", path, err);
      return null;
    }
  }

  /* ---------- Projects: build grid from data/projects.json ---------- */
  async function buildProjects() {
    const data = await fetchJSON('data/projects.json');
    if (!data || !data.projects) {
      console.warn("No projects found in data/projects.json");
      return;
    }
    const grid = $('#projectGrid');
    grid.innerHTML = '';

    data.projects.forEach((p, index) => {
      const item = container('article');
      item.className = 'project-item';
      item.tabIndex = 0;
      item.setAttribute('data-id', p.id || `proj-${index}`);

      // background thumb (first available image)
      const thumb = container('div');
      thumb.className = 'thumb';
      thumb.style.backgroundImage = `url('${(p.images && p.images[0]) || 'images/profile.jpg'}')`;
      item.appendChild(thumb);

      const meta = container('div');
      meta.className = 'project-meta';
      meta.innerHTML = `<h3>${escapeHtml(p.title)}</h3>
                        <p>${escapeHtml(p.subtitle || p.description || '')}</p>
                        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
                          ${(p.tags || []).map(t => `<span class="skill-pill">${escapeHtml(t)}</span>`).join('')}
                        </div>
                        <div style="margin-top:12px">
                          <button class="btn primary-btn open-project" data-id="${p.id}">Open Case Study</button>
                        </div>`;
      item.appendChild(meta);
      grid.appendChild(item);
    });

    // event binding
    $$('.open-project').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      openProjectModal(id);
    }));

    // keyboard accessibility: open modal on Enter when focused on project-item
    $$('.project-item').forEach(pi => {
      pi.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          const id = pi.getAttribute('data-id');
          openProjectModal(id);
        }
      });
    });
  }

  /* ---------- Project Modal ---------- */
  function openProjectModal(id) {
    fetchJSON('data/projects.json').then(data => {
      if (!data) return;
      const p = data.projects.find(x => x.id === id);
      if (!p) { console.warn('Project not found', id); return; }

      // build modal content
      const modal = document.createElement('div');
      modal.className = 'modal open';
      modal.setAttribute('role', 'dialog');
      modal.innerHTML = `
        <div class="modal-card" role="document" aria-label="${escapeHtml(p.title)}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div>
              <h3 style="margin:0">${escapeHtml(p.title)}</h3>
              <div style="color:var(--muted);font-size:13px">${escapeHtml(p.subtitle || '')}</div>
            </div>
            <div>
              <button class="btn ghost modal-close" aria-label="Close">Close</button>
            </div>
          </div>
          <div style="height:12px"></div>
          <div class="modal-grid">
            <div id="modalGallery"></div>
            <aside style="padding-left:8px">
              <h4>Summary</h4>
              <p style="color:var(--muted)">${escapeHtml(p.description || '')}</p>
              <h4>Impact</h4>
              <p style="color:var(--muted)">${escapeHtml(p.impact || 'Implemented insights and validated approach.')}</p>
              <div style="height:12px"></div>
              <a class="btn primary-btn" href="${escapeAttr(p.folder || './')}" target="_blank" rel="noopener">Open Folder</a>
            </aside>
          </div>
        </div>
      `;

      // insert images
      const gallery = modal.querySelector('#modalGallery');
      (p.images || []).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${p.title} - ${src.split('/').pop()}`;
        img.loading = 'lazy';
        img.style.marginBottom = '10px';
        img.onerror = () => img.style.display = 'none';
        gallery.appendChild(img);
      });

      // append & bind close
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
      modal.addEventListener('click', (ev) => { if (ev.target === modal) closeModal(modal); });

      // focus trap-ish (simple)
      const focusable = modal.querySelectorAll('button, a, input, textarea');
      if (focusable.length) focusable[0].focus();
    });
  }

  function closeModal(modal) {
    try {
      document.body.style.overflow = '';
      modal.classList.remove('open');
      modal.remove();
    } catch (e) { console.warn('closeModal', e); }
  }

  /* ---------- Contact: mailto fallback & local archive ---------- */
  function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fm = new FormData(form);
      const name = fm.get('name') || 'Unknown';
      const email = fm.get('email') || '';
      const message = fm.get('message') || '';

      // save to local archive in localStorage
      try {
        const key = 'portfolio_contacts';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.unshift({name, email, message, ts: new Date().toISOString()});
        localStorage.setItem(key, JSON.stringify(arr.slice(0, 200))); // keep last 200
      } catch (e) { console.warn('localStorage fail', e); }

      // mailto fallback — opens user email client prefilled
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n— Sent from portfolio`);
      const mailto = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
      // use a small delay to show UI feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening mail client...';
      }
      setTimeout(() => {
        window.location.href = mailto;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
        form.reset();
        showToast('Your message is ready in your mail client. You can also find a local copy in browser storage.');
      }, 700);
    });
  }

  /* ---------- Simple toast ---------- */
  function showToast(text, time = 3500) {
    let t = document.getElementById('siteToast');
    if (!t) {
      t = container('div');
      t.id = 'siteToast';
      t.style.position = 'fixed';
      t.style.right = '20px';
      t.style.bottom = '24px';
      t.style.background = 'linear-gradient(90deg,var(--accent-a),var(--accent-b))';
      t.style.color = '#00121a';
      t.style.padding = '10px 14px';
      t.style.borderRadius = '12px';
      t.style.boxShadow = '0 20px 60px rgba(0,0,0,0.6)';
      t.style.fontWeight = '700';
      t.style.zIndex = 99999;
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, time);
  }

  /* ---------- Lazy load: image fallback (degrades gracefully) ---------- */
  function lazyLoadImages() {
    const lazy = $$('img[loading="lazy"], img');
    lazy.forEach(img => {
      if (img.dataset.src && !img.src) img.src = img.dataset.src;
    });
  }

  /* ---------- Escape helpers ---------- */
  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function escapeAttr(s){ if(!s) return ''; return String(s).replace(/"/g,'&quot;'); }

  /* ---------- Init ---------- */
  function init() {
    buildProjects();
    bindContactForm();
    lazyLoadImages();

    // set year
    const y = new Date().getFullYear();
    const sp = document.getElementById('year');
    if (sp) sp.textContent = y;
  }

  // DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
