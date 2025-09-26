// Advanced animations and interactions
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupTypewriterEffect();
    }
    
    setupIntersectionObservers() {
        // Fade in animation observer
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target, 'fadeInUp');
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Slide in animation observer
        const slideInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    const direction = entry.target.dataset.slideDirection || 'left';
                    this.animateElement(entry.target, `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        });
        
        // Counter animation observer
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slideIn', slideInObserver);
        this.observers.set('counter', counterObserver);
        
        this.observeElements();
    }
    
    observeElements() {
        // Elements to fade in
        const fadeElements = document.querySelectorAll('.skill-category, .project-card, .certification-card, .highlight-card');
        fadeElements.forEach(el => {
            this.observers.get('fadeIn').observe(el);
        });
        
        // Elements to slide in
        const slideElements = document.querySelectorAll('.education-item');
        slideElements.forEach((el, index) => {
            el.dataset.slideDirection = index % 2 === 0 ? 'left' : 'right';
            this.observers.get('slideIn').observe(el);
        });
        
        // Counter elements
        const counterElements = document.querySelectorAll('.achievement-value, .metric-value, .stat-value');
        counterElements.forEach(el => {
            this.observers.get('counter').observe(el);
        });
    }
    
    animateElement(element, animationType) {
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(animationType);
        element.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
        });
    }
    
    getInitialTransform(animationType) {
        const transforms = {
            fadeInUp: 'translateY(40px)',
            slideInLeft: 'translateX(-40px)',
            slideInRight: 'translateX(40px)',
            scaleIn: 'scale(0.9)'
        };
        return transforms[animationType] || 'translateY(40px)';
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasRupee = text.includes('₹');
        const hasK = text.includes('K');
        const hasL = text.includes('L');
        
        let numericValue = parseFloat(text.replace(/[^\d.]/g, ''));
        if (isNaN(numericValue)) return;
        
        let suffix = '';
        if (hasPercent) suffix = '%';
        if (hasRupee) suffix = hasL ? 'L' : hasK ? 'K+' : '';
        if (hasK && !hasRupee) suffix = 'K+';
        if (hasL && !hasRupee) suffix = 'L';
        
        const prefix = hasRupee ? '₹' : '';
        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = current;
            if (numericValue >= 10) {
                displayValue = Math.floor(current);
            } else {
                displayValue = current.toFixed(1);
            }
            
            element.textContent = `${prefix}${displayValue}${suffix}`;
        }, duration / steps);
    }
    
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero background
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
            
            // Update header opacity based on scroll
            const header = document.querySelector('.header');
            if (header) {
                const opacity = Math.min(0.95, 0.8 + (scrolled / 200) * 0.15);
                header.style.background = `rgba(255, 255, 255, ${opacity})`;
            }
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    setupHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.project-card, .certification-card, .skill-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-8px) scale(1.02)';
                e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '';
            });
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                e.target.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Skill bar hover effects
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.style.background = 'linear-gradient(90deg, var(--primary-500), var(--secondary-500))';
                bar.style.transform = 'scaleY(1.2)';
            });
            
            bar.addEventListener('mouseleave', () => {
                bar.style.background = 'linear-gradient(90deg, var(--primary-600), var(--primary-500))';
                bar.style.transform = 'scaleY(1)';
            });
        });
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * (element.dataset.parallax || -0.5);
                element.style.transform = `translateY(${rate}px)`;
            });
        };
        
        window.addEventListener('scroll', this.throttle(updateParallax, 16));
    }
    
    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 100;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-600)';
            element.style.animation = 'blink 1s infinite';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }
            };
            
            // Start typewriter effect when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Public methods for manual animation triggers
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
                bar.style.transition = 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, index * 100);
        });
    }
    
    resetAnimations() {
        this.animatedElements.clear();
        const elements = document.querySelectorAll('[style*="opacity"]');
        elements.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
        });
    }
}

// Particle system for hero section
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.3';
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
    }
    
    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    window.animationController = new AnimationController();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.particleSystem = new ParticleSystem(heroSection);
    }
    
    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: var(--primary-600); }
            51%, 100% { border-color: transparent; }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .skill-progress {
            transition: all 0.3s ease;
        }
        
        .project-card,
        .certification-card,
        .skill-category {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    `;
    document.head.appendChild(style);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});
