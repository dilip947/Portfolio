document.addEventListener('DOMContentLoaded', () => {
    // Preloader with nebula swirl
    const preloaderCanvas = document.getElementById('preloader-canvas');
    const ctx = preloaderCanvas.getContext('2d');
    preloaderCanvas.width = 200;
    preloaderCanvas.height = 200;
    // Simple swirl animation (from search inspiration)
    let angle = 0;
    function drawSwirl() {
        ctx.clearRect(0, 0, 200, 200);
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
            const x = 100 + Math.cos(angle + i * 0.1) * i * 0.2;
            const y = 100 + Math.sin(angle + i * 0.1) * i * 0.2;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
        ctx.stroke();
        angle += 0.05;
        requestAnimationFrame(drawSwirl);
    }
    drawSwirl();

    let progress = 0;
    const progressEl = document.getElementById('progress');
    const preloader = document.getElementById('preloader');
    const interval = setInterval(() => {
        progress += 10;
        progressEl.textContent = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            gsap.to(preloader, { opacity: 0, duration: 1, onComplete: () => preloader.style.display = 'none' });
        }
    }, 200);

    // Load skills.json
    fetch('data/skills.json')
        .then(res => res.json())
        .then(skills => {
            const skillsList = document.getElementById('skillsList');
            skills.forEach(skill => {
                const div = document.createElement('div');
                div.classList.add('skill-node');
                div.innerHTML = `<span>${skill.name}</span><div class="radial-progress" style="--progress: ${skill.proficiency}%"></div>`;
                div.addEventListener('click', () => {
                    // Open micro-case modal
                    const modal = document.createElement('div');
                    modal.classList.add('modal-overlay');
                    modal.innerHTML = `<div class="modal-content glass-card"><h3>${skill.name}</h3><p>Proficiency: ${skill.proficiency}%</p><button class="close-modal">Close</button></div>`;
                    document.body.appendChild(modal);
                    modal.style.display = 'flex';
                    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
                });
                skillsList.appendChild(div);
            });
        });

    // Load projects.json
    fetch('data/projects.json')
        .then(res => res.json())
        .then(projects => {
            const projectsArc = document.getElementById('projectsArc');
            projects.forEach((project, index) => {
                const card = document.createElement('div');
                card.classList.add('project-card', 'glass-card');
                card.style.transform = `rotate(${(index - 1) * 20}deg) translateY(50px)`;
                card.innerHTML = `
                    <img src="${project.images[0]}" alt="${project.title}" class="project-thumbnail">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                `;
                card.addEventListener('mouseover', () => {
                    const popup = document.createElement('div');
                    popup.classList.add('popup-carousel', 'glass-card');
                    popup.innerHTML = project.images.map(img => `<img src="${img}" alt="">`).join('');
                    card.appendChild(popup);
                    // Add carousel logic if needed
                });
                card.addEventListener('mouseleave', () => {
                    const popup = card.querySelector('.popup-carousel');
                    if (popup) popup.remove();
                });
                card.addEventListener('click', () => {
                    // Favorite toggle
                    card.classList.toggle('favorite');
                    localStorage.setItem(`favorite-${project.id}`, card.classList.contains('favorite'));
                    // Heart animation GSAP
                    gsap.fromTo(card, { scale: 1.1 }, { scale: 1, duration: 0.5 });
                });
                projectsArc.appendChild(card);
            });
        });

    // Theme time-based
    const hour = new Date().getHours();
    if (hour > 6 && hour < 18) {
        document.body.classList.add('dawn-mode'); // Define in CSS with warmer hues
    }

    // Mute toggle
    const muteToggle = document.getElementById('muteToggle');
    muteToggle.addEventListener('click', () => {
        // Toggle global sound
        Howler.mute(!Howler._muted);
        muteToggle.querySelector('i').classList.toggle('fa-volume-mute');
        muteToggle.querySelector('i').classList.toggle('fa-volume-up');
    });

    // Reduced motion
    const reducedMotionToggle = document.getElementById('reducedMotionToggle');
    reducedMotionToggle.addEventListener('click', () => {
        document.body.classList.toggle('reduced-motion');
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }

    // Back to top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Share URL
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        // Toast confirmation
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = 'URL Copied!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });

    // Keyboard help
    document.addEventListener('keydown', (e) => {
        if (e.key === '?') {
            document.getElementById('keyboardHelp').style.display = 'flex';
        }
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(modal => modal.style.display = 'none');
        }
    });

    // Contact plus
    const contactPlus = document.getElementById('contactPlus');
    const contactTray = document.getElementById('contactTray');
    contactPlus.addEventListener('click', () => {
        contactTray.style.display = contactTray.style.display === 'flex' ? 'none' : 'flex';
    });

    // Resume button
    const resumeButton = document.getElementById('resumeButton');
    resumeButton.addEventListener('click', () => {
        const modal = document.getElementById('resumePreviewModal');
        modal.style.display = 'flex';
        // Animate preview (placeholder)
        gsap.from(modal.querySelector('.modal-content'), { scale: 0, duration: 0.5 });
        setTimeout(() => window.location.href = 'resume.pdf', 2000); // Preview then download
    });

    // Form submit
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Particle explosion GSAP
        gsap.to(contactForm, { scale: 0, duration: 0.5, onComplete: () => alert('Message Sent!') });
    });

    // Header compact on scroll
    window.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('compact', window.scrollY > 50);
    });

    // Analytics opt-in
    if (localStorage.getItem('analytics') === 'yes') {
        // Placeholder local analytics
    } else {
        if (confirm('Opt-in to local analytics?')) localStorage.setItem('analytics', 'yes');
    }
});
