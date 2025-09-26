class PortfolioController {
    constructor() {
        this.scrollOffset = 0;
        this.isScrolling = false;
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
        this.setupNavigation();
        this.setupContactForm();
        this.setupIntersectionObserver();
        this.setupScrollIndicator();
        this.initializeAnimations();
    }
    
    setupSmoothScrolling() {
        // Custom smooth scrolling with easing
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });
    }
    
    smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        const targetPosition = target.offsetTop - 80; // Account for fixed nav
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let start = null;
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                requestAnimationFrame(() => {
                    this.handleParallax();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }
        });
    }
    
    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Update hero content based on scroll
        const hero = document.querySelector('.hero');
        const heroTitle = document.querySelector('.hero-title');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroTitle && heroContent) {
            const heroHeight = hero.offsetHeight;
            const scrollProgress = Math.min(scrolled / heroHeight, 1);
            
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - scrollProgress;
            heroTitle.style.transform = `scale(${1 - scrollProgress * 0.2})`;
        }
        
        // Update navigation background
        const nav = document.querySelector('.nav');
        if (nav) {
            if (scrolled > 100) {
                nav.style.background = 'rgba(10, 10, 15, 0.95)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(10, 10, 15, 0.8)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        }
    }
    
    setupNavigation() {
        // Active section highlighting
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
        
        // Add typing animation to form labels
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.color = '#00D4FF';
                    label.style.transform = 'translateY(-2px)';
                }
            });
            
            input.addEventListener('blur', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL' && !input.value) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        });
    }
    
    handleFormSubmission(form) {
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.querySelector('span').textContent;
        
        // Animate button
        submitButton.querySelector('span').textContent = 'Sending...';
        submitButton.style.background = 'linear-gradient(135deg, #00FF88, #00D4FF)';
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitButton.querySelector('span').textContent = 'Message Sent!';
            submitButton.style.background = 'linear-gradient(135deg, #00FF88, #00D4FF)';
            
            // Show success animation
            this.showSuccessMessage();
            
            setTimeout(() => {
                submitButton.querySelector('span').textContent = originalText;
                submitButton.style.background = 'linear-gradient(135deg, #00D4FF, #0066FF)';
                form.reset();
            }, 2000);
        }, 1500);
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <p>Thank you! I'll get back to you soon.</p>
            </div>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid #00FF88;
            border-radius: 20px;
            padding: 2rem;
            z-index: 10000;
            backdrop-filter: blur(20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
        
        setTimeout(() => {
            message.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for specific sections
                    if (entry.target.id === 'skills') {
                        this.animateSkillsSection();
                    } else if (entry.target.id === 'about') {
                        this.animateAboutSection();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    animateSkillsSection() {
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                category.style.opacity = '1';
                category.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
    
    animateAboutSection() {
        const stats = document.querySelectorAll('.stat-item');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0) scale(1)';
                
                // Animate numbers
                const number = stat.querySelector('.stat-number');
                if (number) {
                    this.animateNumber(number);
                }
            }, index * 150);
        });
    }
    
    animateNumber(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        let current = 0;
        const duration = 1500;
        const step = numericTarget / (duration / 16);
        
        const timer = setInterval(() => {
            current += step;
            if (current >= numericTarget) {
                current = numericTarget;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
        }, 16);
    }
    
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
        
        scrollIndicator.addEventListener('click', () => {
            this.smoothScrollTo('about');
        });
    }
    
    initializeAnimations() {
        // Set initial states for animations
        const skillCategories = document.querySelectorAll('.skill-category');
        skillCategories.forEach(category => {
            category.style.opacity = '0.3';
            category.style.transform = 'translateX(-20px)';
            category.style.transition = 'all 0.5s ease';
        });
        
        const stats = document.querySelectorAll('.stat-item');
        stats.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(30px) scale(0.9)';
            stat.style.transition = 'all 0.6s ease';
        });
        
        // Add CSS class for section animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: sectionFadeIn 1s ease-out forwards;
            }
            
            @keyframes sectionFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global utility functions
window.scrollToSection = function(sectionId) {
    const portfolioController = new PortfolioController();
    portfolioController.smoothScrollTo(sectionId);
};

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioController();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimizations
window.addEventListener('load', () => {
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Optimize images loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
