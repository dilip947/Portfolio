document.addEventListener('DOMContentLoaded', () => {
    // --- Welcome Screen ---
    const welcomeScreen = document.getElementById('welcomeScreen');
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        document.getElementById('heroContent').classList.add('visible');
    }, 1200); // Total duration of the welcome animation

    // --- Hero Name & Header Scroll Animation ---
    const heroName = document.getElementById('heroName');
    const heroProfileImg = document.getElementById('heroProfileImg');
    const header = document.getElementById('header');
    const headerLogo = document.getElementById('headerLogo');

    let isDarkModeSetOnScroll = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header styling on scroll
        header.classList.toggle('scrolled', scrollY > 50);

        // Auto-switch to dark mode on first scroll, if not manually set
        if (scrollY > 100 && !isDarkModeSetOnScroll && localStorage.getItem('theme') !== 'light') {
             if (!document.body.classList.contains('light-mode')) {
                // This logic is for future use if you want a default light theme that switches
             }
            isDarkModeSetOnScroll = true; // Prevents this from running again
        }

        // Hero Name Animation Logic
        const heroRect = heroName.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.5;

        if (heroRect.top < triggerPoint && scrollY > 0) {
            const progress = 1 - Math.max(0, heroRect.top / triggerPoint);
            
            // Shrink name and image
            const scale = Math.max(0.2, 1 - progress * 0.8);
            heroName.style.transform = `scale(${scale})`;
            heroProfileImg.style.transform = `scale(${1 - progress})`;
            heroProfileImg.style.opacity = `${1 - progress}`;

            // Fade in header logo
            headerLogo.style.opacity = `${Math.min(1, progress * 2)}`;

        } else {
            // Reset styles when scrolling back up
            heroName.style.transform = 'scale(1)';
            heroProfileImg.style.transform = 'scale(1)';
            heroProfileImg.style.opacity = '1';
            headerLogo.style.opacity = '0';
        }
    });

    // --- General Scroll-Triggered Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll, .project-card').forEach(el => observer.observe(el));


    // --- Project Card Hover Preview Animation ---
    let hoverTimeout;
    projectsGrid.addEventListener('mouseover', async (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;

        hoverTimeout = setTimeout(async () => {
            const projectId = card.dataset.projectId;
            const previewContainer = card.querySelector('.project-gallery-preview');
            
            // Avoid re-fetching if images are already there
            if (previewContainer.children.length > 0) return;

            const response = await fetch('data/projects.json');
            const projects = await response.json();
            const project = projects.find(p => p.id === projectId);
            
            if (project && project.gallery.length > 1) {
                const imagesToShow = project.gallery.slice(1, 6); // Show up to 5 preview images
                
                imagesToShow.forEach((imgSrc, i) => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.className = 'preview-img';
                    previewContainer.appendChild(img);
                    
                    // Position images in an arc
                    const angle = (i - (imagesToShow.length - 1) / 2) * 30; // 30 degrees apart
                    const radius = 100; // pixels from center
                    const x = Math.sin(angle * Math.PI / 180) * radius;
                    const y = -Math.cos(angle * Math.PI / 180) * radius;

                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transform = `translate(${x}px, ${y}px) scale(1) rotate(${angle/5}deg)`;
                    }, 50 * i);
                });
            }
        }, 500); // 0.5-second delay before animation starts
    });

    projectsGrid.addEventListener('mouseout', (e) => {
        clearTimeout(hoverTimeout);
        const card = e.target.closest('.project-card');
        if (card) {
            const previewContainer = card.querySelector('.project-gallery-preview');
            previewContainer.innerHTML = ''; // Clear preview images on mouse out
        }
    });
});
