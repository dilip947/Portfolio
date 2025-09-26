// Additional animation functions
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Intersection Observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.init();
    }

    init() {
        if (!this.heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            this.heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Typewriter effect for hero title
class Typewriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.init();
    }

    init() {
        setTimeout(() => this.type(), 1000);
    }

    type() {
        const current = this.textIndex % this.texts.length;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Particle system for background
class ParticleSystem {
    constructor(containerId, particleCount = 30) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.particles = [];
        this.init();
    }

    init() {
        if (!this.container) return;

        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }

        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        // Particles are animated via CSS
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Initialize particle system for floating elements
    new ParticleSystem('floatingElements');
    
    // Add typewriter effect to hero title if needed
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const texts = ['Dilip Choudhary', 'Business Analytics', 'Data Specialist'];
        new Typewriter(heroTitle, texts, 100);
    }
});

// Export classes for global access
window.ScrollAnimations = ScrollAnimations;
window.ParallaxEffect = ParallaxEffect;
window.Typewriter = Typewriter;
window.ParticleSystem = ParticleSystem;
