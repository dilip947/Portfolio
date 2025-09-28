// Advanced Animation Controller for Dilip Choudhary Portfolio
class AnimationController {
    constructor() {
        this.isInitialized = false;
        this.mousePosition = { x: 0, y: 0 };
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        this.setupMouseTracking();
        this.setupGlassEffects();
        this.setupProjectHoverEffects();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupHapticFeedback();
        
        this.isInitialized = true;
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            // Update cursor effects
            this.updateCursorEffects(e);
        });
    }
    
    updateCursorEffects(e) {
        // Create trailing cursor effect for interactive elements
        const interactiveElements = document.querySelectorAll('.glass-effect, .nav-link, .project-card');
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + 
                Math.pow(e.clientY - centerY, 2)
            );
            
            // Apply magnetic effect for close proximity
            if (distance < 100) {
                const magnetStrength = Math.max(0, (100 - distance) / 100);
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                
                element.style.transform = `
                    translateX(${Math.cos(angle) * magnetStrength * 5}px) 
                    translateY(${Math.sin(angle) * magnetStrength * 5}px) 
                    scale(${1 + magnetStrength * 0.05})
                `;
            } else {
                element.style.transform = '';
            }
        });
    }
    
    setupGlassEffects() {
        // Enhanced glass morphism effects
        const glassElements = document.querySelectorAll('.glass-effect');
        
        glassElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, element);
                this.enhanceGlassEffect(element, true);
            });
            
            element.addEventListener('mouseleave', (e) => {
                this.enhanceGlassEffect(element, false);
            });
            
            element.addEventListener('mousemove', (e) => {
                this.updateGlassReflection(e, element);
            });
        });
    }
    
   createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
    
    enhanceGlassEffect(element, enhance) {
        if (enhance) {
            element.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            element.style.backdropFilter = 'blur(30px)';
            element.style.webkitBackdropFilter = 'blur(30px)';
            element.style.transform = 'translateY(-5px) scale(1.02)';
        } else {
            element.style.boxShadow = '';
            element.style.backdropFilter = '';
            element.style.webkitBackdropFilter = '';
            element.style.transform = '';
        }
    }
    
    updateGlassReflection(event, element) {
        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        
        element.style.background = `
            radial-gradient(circle at ${x}% ${y}%, 
                rgba(255, 255, 255, 0.1) 0%, 
                transparent 50%),
            var(--glass-bg)
        `;
    }
    
    setupProjectHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', (e) => {
                this.animateProjectCard(card, 'enter');
                
                // Delayed popup effect
                hoverTimeout = setTimeout(() => {
                    this.showProjectPreview(card, index);
                }, 1000);
            });
            
            card.addEventListener('mouseleave', (e) => {
                clearTimeout(hoverTimeout);
                this.animateProjectCard(card, 'leave');
                this.hideProjectPreview();
            });
            
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                this.apply3DTilt(e, card);
            });
        });
    }
    
    animateProjectCard(card, action) {
        if (action === 'enter') {
            card.style.transform = 'translateY(-15px) scale(1.05)';
            card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3)';
            card.style.zIndex = '10';
            
            // Add subtle glow
            card.style.border = '2px solid rgba(255, 255, 255, 0.2)';
            
            // Haptic-like bounce
            card.classList.add('haptic-effect');
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.zIndex = '';
            card.style.border = '';
            
            card.classList.remove('haptic-effect');
        }
    }
    
    apply3DTilt(event, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (event.clientX - centerX) / (rect.width / 2);
        const deltaY = (event.clientY - centerY) / (rect.height / 2);
        
        const rotateX = deltaY * -10; // Max 10deg rotation
        const rotateY = deltaX * 10;
        
        element.style.transform = `
            translateY(-15px) 
            scale(1.05) 
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    }
    
    showProjectPreview(card, index) {
        // Create floating preview
        const preview = document.createElement('div');
        preview.className = 'project-preview';
        preview.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 1rem 2rem;
            border-radius: 15px;
            color: var(--text-primary);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
        `;
        
        preview.innerHTML = `
            <p>Click to explore project details</p>
            <small>Project ${index + 1} of ${document.querySelectorAll('.project-card').length}</small>
        `;
        
        document.body.appendChild(preview);
        
        // Animate in
        requestAnimationFrame(() => {
            preview.style.opacity = '1';
            preview.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        this.currentPreview = preview;
    }
    
    hideProjectPreview() {
        if (this.currentPreview) {
            this.currentPreview.style.opacity = '0';
            this.currentPreview.style.transform = 'translateX(-50%) translateY(100px)';
            
            setTimeout(() => {
                if (this.currentPreview && this.currentPreview.parentNode) {
                    this.currentPreview.remove();
                }
                this.currentPreview = null;
            }, 500);
        }
    }
    
    setupScrollAnimations() {
        // Advanced scroll-triggered animations
        this.setupScrollBasedParallax();
        this.setupScrollBasedReveals();
        this.setupScrollBasedMorphing();
    }
    
    setupScrollBasedParallax() {
        const parallaxElements = document.querySelectorAll('.skill-card, .timeline-item');
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const speed = 0.5 + (index * 0.1); // Varying speeds
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrollTop * speed);
                    element.style.transform = `translateY(${yPos * 0.1}px)`;
                }
            });
        };
        
        window.addEventListener('scroll', this.throttle(updateParallax, 16));
    }
    
    setupScrollBasedReveals() {
        const revealElements = document.querySelectorAll('.skill-card, .timeline-item, .project-card');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        this.animateElementReveal(entry.target);
                    }, index * 100); // Staggered animation
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
    
    animateElementReveal(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add sparkle effect
        this.addSparkleEffect(element);
    }
    
    addSparkleEffect(element) {
        const sparkles = [];
        const sparkleCount = 8;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #fff, transparent);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
            `;
            
            const rect = element.getBoundingClientRect();
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            element.style.position = 'relative';
            element.appendChild(sparkle);
            
            // Animate sparkle
            sparkle.animate([
                { opacity: 0, transform: 'scale(0) rotate(0deg)' },
                { opacity: 1, transform: 'scale(1) rotate(180deg)' },
                { opacity: 0, transform: 'scale(0) rotate(360deg)' }
            ], {
                duration: 1000,
                delay: i * 100,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => sparkle.remove();
        }
    }
    
    setupScrollBasedMorphing() {
        // Profile image morphing based on scroll
        const profileImage = document.getElementById('profileImage');
        
        const morphObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const scrollRatio = 1 - entry.intersectionRatio;
                
                if (profileImage) {
                    // Apply morphing effects
                    const borderRadius = 50 - (scrollRatio * 20); // 50% to 30%
                    const blur = scrollRatio * 5; // 0 to 5px blur
                    
                    profileImage.style.borderRadius = `${borderRadius}%`;
                    profileImage.style.filter = `blur(${blur}px)`;
                }
            });
        }, {
            threshold: Array.from({length: 101}, (_, i) => i / 100) // 0 to 1 in 0.01 steps
        });
        
        if (profileImage) {
            morphObserver.observe(profileImage);
        }
    }
    
    setupParallaxEffects() {
        // Chess background parallax
        const chessBackground = document.getElementById('chessBackground');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const speed = scrollTop * 0.5;
            
            if (chessBackground) {
                chessBackground.style.transform = `translateY(${speed}px)`;
            }
        }, 16));
    }
    
    setupHapticFeedback() {
        // Simulated haptic feedback for interactive elements
        const interactiveElements = document.querySelectorAll('button, .nav-link, .project-card, .glass-effect');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                this.triggerHapticFeedback(element);
            });
        });
    }
    
    triggerHapticFeedback(element) {
        // Visual haptic feedback
        element.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
        
        // Try to trigger device haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Utility functions
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
    
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Advanced animation methods
    createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--text-primary);
                border-radius: 50%;
                opacity: 0.1;
                animation: floatParticle ${10 + Math.random() * 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            particleContainer.appendChild(particle);
        }
    }
    
    animateTextReveal(element, text) {
        const letters = text.split('');
        element.innerHTML = letters.map(letter => 
            `<span class="letter" style="opacity: 0; transform: translateY(20px);">${letter === ' ' ? '&nbsp;' : letter}</span>`
        ).join('');
        
        const letterElements = element.querySelectorAll('.letter');
        letterElements.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = 'translateY(0)';
                letter.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, index * 50);
        });
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Add required CSS keyframes
const animationStyles = `
@keyframes rippleAnimation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes floatParticle {
    0% { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
}

.project-card.revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.sparkle {
    animation: sparkleFloat 1s ease-out forwards;
}

@keyframes sparkleFloat {
    0% {
        opacity: 0;
        transform: scale(0) translateY(0);
    }
    50% {
        opacity: 1;
        transform: scale(1) translateY(-10px);
    }
    100% {
        opacity: 0;
        transform: scale(0) translateY(-20px);
    }
}

.haptic-effect:active {
    animation: hapticPulse 0.3s ease;
}

@keyframes hapticPulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.98); }
    100% { transform: scale(1); }
}
`;

// Inject animation styles
const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);
