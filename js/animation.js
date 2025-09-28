// Ultra Smooth Animation Engine
class SmoothPortfolio {
    constructor() {
        this.scrollY = 0;
        this.lastScrollY = 0;
        this.heroElements = {};
        this.init();
    }

    init() {
        this.setupWelcomeAnimation();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupThemeToggle();
        this.setupIntersectionObserver();
        this.setupFormHandling();
        this.setupProjectHover();
    }

    setupWelcomeAnimation() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        
        // Ultra fast welcome - fade out in 0.8s total
        setTimeout(() => {
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
                this.startMainAnimations();
            }
        }, 800);
    }

    startMainAnimations() {
        this.heroElements = {
            profile: document.getElementById('profileImageContainer'),
            name: document.getElementById('heroName'),
            roles: document.getElementById('heroRoles'),
            header: document.getElementById('header'),
            logo: document.getElementById('logoName')
        };

        // Stagger animations with smooth delays
        setTimeout(() => {
            if (this.heroElements.profile) this.heroElements.profile.classList.add('visible');
        }, 100);
        
        setTimeout(() => {
            if (this.heroElements.name) this.heroElements.name.classList.add('visible');
        }, 400);
        
        setTimeout(() => {
            if (this.heroElements.roles) this.heroElements.roles.classList.add('visible');
        }, 700);
        
        setTimeout(() => {
            if (this.heroElements.header) {
                this.heroElements.header.classList.add('visible');
                this.heroElements.header.style.borderBottomColor = 'var(--glass-border)';
            }
        }, 1000);
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            this.scrollY = window.scrollY;
            this.updateHeroSection();
            this.updateHeaderLogo();
            this.lastScrollY = this.scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateHeroSection() {
        const hero = document.getElementById('home');
        if (!hero || !this.heroElements.profile) return;

        const heroRect = hero.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));

        // Ultra smooth profile image scaling
        if (this.heroElements.profile) {
            const scale = Math.max(0.3, 1 - scrollProgress * 0.7);
            const opacity = Math.max(0, 1 - scrollProgress * 1.5);
            
            this.heroElements.profile.style.transform = `scale(${scale})`;
            this.heroElements.profile.style.opacity = opacity;
        }

        // Name animation - shrink and move to left
        if (this.heroElements.name) {
            const nameScale = Math.max(0.4, 1 - scrollProgress * 0.6); // Shrink gradually
            const nameTranslateX = scrollProgress * -100; // Move left
            const nameOpacity = Math.max(0, 1 - scrollProgress * 2);
            
            this.heroElements.name.style.transform = `scale(${nameScale}) translateX(${nameTranslateX}px)`;
            this.heroElements.name.style.opacity = nameOpacity;
        }

        // Roles fade out
        if (this.heroElements.roles) {
            this.heroElements.roles.style.opacity = Math.max(0, 1 - scrollProgress * 3);
        }
    }

    updateHeaderLogo() {
        const hero = document.getElementById('home');
        if (!hero || !this.heroElements.logo) return;

        const heroRect = hero.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));

        // Show logo name when name is almost at top
        if (scrollProgress > 0.4) {
            this.heroElements.logo.classList.add('visible');
        } else {
            this.heroElements.logo.classList.remove('visible');
        }
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    anchor.classList.add('active');
                }
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const themeIcon = themeToggle.querySelector('i');

        // Check for saved theme
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animate-on-scroll elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        document.querySelectorAll('.section-title').forEach(el => observer.observe(el));
        document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
    }

    setupFormHandling() {
        const projectForm = document.getElementById('projectForm');
        if (!projectForm) return;
        
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('projectName').value,
                type: document.getElementById('projectType').value,
                description: document.getElementById('projectDescription').value
            };

            // Simple validation
            if (!formData.name || !formData.type || !formData.description) {
                alert('Please fill in all fields');
                return;
            }

            // Show success message
            alert('Thank you! Your project details have been submitted. I\'ll get back to you soon!');
            projectForm.reset();
        });
    }

    setupProjectHover() {
        // Add hover delay for smooth project preview
        let hoverTimeout;
        
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Clear any existing timeout
                clearTimeout(hoverTimeout);
                
                // Add slight delay for smooth feel
                hoverTimeout = setTimeout(() => {
                    card.classList.add('hover-active');
                }, 300);
            });
            
            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                card.classList.remove('hover-active');
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmoothPortfolio();
});

// Add active state to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
