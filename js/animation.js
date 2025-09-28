class AnimationEngine {
    constructor() {
        this.scrollY = 0;
        this.lastScrollY = 0;
        this.scrollDirection = 0;
        this.autoDarkMode = true;
        this.manualThemeOverride = false;
        
        this.init();
    }
    
    init() {
        this.setupWelcomeAnimation();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
        this.setupIntersectionObserver();
    }
    
    // Welcome Screen Animation
    setupWelcomeAnimation() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chessboardBg = document.getElementById('chessboardBg');
        
        setTimeout(() => {
            welcomeScreen.classList.add('fade-out');
            
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                chessboardBg.classList.add('fade-out');
                
                // Start main animations
                this.startMainAnimations();
            }, 1500);
        }, 2000);
    }
    
    // Start Main Animations
    startMainAnimations() {
        const header = document.getElementById('header');
        const profileContainer = document.getElementById('profileImageContainer');
        const heroName = document.getElementById('heroName');
        const heroRoles = document.getElementById('heroRoles');
        const logoName = document.getElementById('logoName');
        
        // Show header with delay
        setTimeout(() => {
            header.classList.add('visible');
        }, 500);
        
        // Initial animations
        this.animateElements([
            { element: profileContainer, delay: 300 },
            { element: heroName, delay: 600 },
            { element: heroRoles, delay: 900 }
        ]);
    }
    
    // Scroll-triggered Animations
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            this.scrollY = window.scrollY;
            this.scrollDirection = this.scrollY > this.lastScrollY ? 1 : -1;
            
            this.updateHeroSection();
            this.updateThemeTransition();
            this.updateHeaderEffects();
            this.updateParallax();
            
            this.lastScrollY = this.scrollY;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Hero Section Scroll Animations
    updateHeroSection() {
        const hero = document.getElementById('home');
        const profileContainer = document.getElementById('profileImageContainer');
        const heroName = document.getElementById('heroName');
        const heroRoles = document.getElementById('heroRoles');
        const logoName = document.getElementById('logoName');
        
        if (!hero) return;
        
        const heroRect = hero.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
        
        // Profile image scaling
        if (profileContainer) {
            const scale = Math.max(0.3, 1 - scrollProgress * 0.7);
            profileContainer.style.transform = `scale(${scale})`;
            profileContainer.style.opacity = Math.max(0, 1 - scrollProgress * 1.5);
        }
        
        // Name text scaling and movement
        if (heroName) {
            const nameScale = Math.max(0.5, 1 + scrollProgress * 0.5);
            const nameTranslateX = scrollProgress * -100;
            
            heroName.style.transform = `scale(${nameScale}) translateX(${nameTranslateX}px)`;
            heroName.style.opacity = Math.max(0, 1 - scrollProgress * 2);
        }
        
        // Roles fade out
        if (heroRoles) {
            heroRoles.style.opacity = Math.max(0, 1 - scrollProgress * 3);
        }
        
        // Logo name appearance
        if (logoName && scrollProgress > 0.3) {
            logoName.style.opacity = Math.min(1, (scrollProgress - 0.3) * 3);
        }
    }
    
    // Auto Dark Mode Transition
    updateThemeTransition() {
        if (this.manualThemeOverride || !this.autoDarkMode) return;
        
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('home').offsetHeight;
        const transitionPoint = heroHeight * 0.6;
        
        if (scrollY > transitionPoint && !document.body.classList.contains('light-mode')) {
            document.body.classList.add('light-mode');
            this.updateThemeIcon();
        } else if (scrollY <= transitionPoint && document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            this.updateThemeIcon();
        }
    }
    
    // Update Theme Icon
    updateThemeIcon() {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            if (document.body.classList.contains('light-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
    
    // Header Effects
    updateHeaderEffects() {
        const header = document.getElementById('header');
        
        if (this.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Parallax Effects
    updateParallax() {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = (index % 3 + 1) * 0.5;
            const yPos = -(this.scrollY * speed * 0.1);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Smooth Element Animations
    animateElements(elements) {
        elements.forEach(({ element, delay = 0 }) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        });
    }
    
    // Intersection Observer for Scroll Animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Stagger children animations
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    }
    
    // Smooth Scrolling
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
                }
            });
        });
    }
    
    // Parallax Setup
    setupParallaxEffects() {
        this.createFloatingElements();
    }
    
    // Create Floating Background Elements
    createFloatingElements() {
        const container = document.getElementById('floatingElements');
        const elementCount = 12;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Random properties
            const size = Math.random() * 100 + 50;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 20 + 20;
            const opacity = Math.random() * 0.1 + 0.05;
            
            element.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${opacity};
            `;
            
            container.appendChild(element);
        }
    }
    
    // Manual Theme Toggle
    toggleManualTheme() {
        this.manualThemeOverride = true;
        this.autoDarkMode = false;
        
        document.body.classList.toggle('light-mode');
        this.updateThemeIcon();
        
        // Save preference
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        localStorage.setItem('autoDarkMode', 'false');
    }
    
    // Restore Theme Preferences
    restoreThemePreferences() {
        const savedTheme = localStorage.getItem('theme');
        const savedAutoDarkMode = localStorage.getItem('autoDarkMode');
        
        if (savedAutoDarkMode === 'false') {
            this.autoDarkMode = false;
            this.manualThemeOverride = true;
        }
        
        if (savedTheme === 'light' && !document.body.classList.contains('light-mode')) {
            document.body.classList.add('light-mode');
        }
        
        this.updateThemeIcon();
    }
}

// Initialize Animation Engine
let animationEngine;

document.addEventListener('DOMContentLoaded', () => {
    animationEngine = new AnimationEngine();
    animationEngine.restoreThemePreferences();
});
