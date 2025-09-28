// Main Application
class PortfolioApp {
    constructor() {
        this.animationEngine = null;
        this.currentProjectGallery = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupModals();
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupSmoothAnimations();
    }
    
    // Event Listeners
    setupEventListeners() {
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.animationEngine) {
                    window.animationEngine.toggleManualTheme();
                }
            });
        }
        
        // Mobile Menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');
        
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
                
                // Update menu icon
                const icon = mobileMenuBtn.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
        
        // Close mobile menu when clicking links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
        
        // Project hover effects
        this.setupProjectInteractions();
        
        // Swipe gestures for mobile
        this.setupSwipeGestures();
    }
    
    // Modal System
    setupModals() {
        // Resume Modal
        const resumeModal = document.getElementById('resumeModal');
        const resumeButtons = document.querySelectorAll('.resume-popup-btn');
        const closeModalButtons = document.querySelectorAll('.close-modal');
        
        // Open Resume Modal
        resumeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(resumeModal);
            });
        });
        
        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal(button.closest('.modal-overlay'));
            });
        });
        
        // Close modal on backdrop click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
        
        // Project Gallery Modal
        const projectGalleryModal = document.getElementById('projectGalleryModal');
        if (projectGalleryModal) {
            // Swipe to close
            this.setupModalSwipe(projectGalleryModal);
        }
    }
    
    // Open Modal with Animation
    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.4s ease';
    }
    
    // Close Modal with Animation
    closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideOut 0.3s ease';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 250);
    }
    
    // Mobile Menu
    setupMobileMenu() {
        // Handle window resize
        window.addEventListener('resize', () => {
            const mobileNav = document.getElementById('mobileNav');
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Form Handling
    setupFormHandling() {
        const projectForm = document.getElementById('projectForm');
        
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    name: document.getElementById('projectName').value,
                    type: document.getElementById('projectType').value,
                    description: document.getElementById('projectDescription').value
                };
                
                // Validate
                if (this.validateProjectForm(formData)) {
                    this.submitProjectForm(formData);
                }
            });
        }
    }
    
    // Validate Project Form
    validateProjectForm(data) {
        if (!data.name.trim()) {
            this.showMessage('Please enter a project name', 'error');
            return false;
        }
        
        if (!data.type) {
            this.showMessage('Please select a project type', 'error');
            return false;
        }
        
        if (!data.description.trim()) {
            this.showMessage('Please describe your project', 'error');
            return false;
        }
        
        return true;
    }
    
    // Submit Project Form
    submitProjectForm(data) {
        // Show loading state
        const submitBtn = document.querySelector('#projectForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            document.getElementById('projectForm').reset();
            
            // Show success message
            this.showMessage('Thank you! Your project details have been submitted. I\'ll get back to you soon!', 'success');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // Show Message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.message-toast');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `message-toast message-${type} glass-card`;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        messageEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
    
    // Project Interactions
    setupProjectInteractions() {
        let hoverTimeout;
        
        document.addEventListener('mouseover', (e) => {
            const projectCard = e.target.closest('.project-card');
            
            if (projectCard && !projectCard.hasAttribute('data-hover-handled')) {
                projectCard.setAttribute('data-hover-handled', 'true');
                
                // Clear existing timeout
                clearTimeout(hoverTimeout);
                
                // Add hover class with delay for smooth effect
                hoverTimeout = setTimeout(() => {
                    projectCard.classList.add('hover-active');
                }, 100);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const projectCard = e.target.closest('.project-card');
            
            if (projectCard && projectCard.hasAttribute('data-hover-handled')) {
                projectCard.removeAttribute('data-hover-handled');
                clearTimeout(hoverTimeout);
                projectCard.classList.remove('hover-active');
            }
        });
    }
    
    // Swipe Gestures for Mobile
    setupSwipeGestures() {
        let startY = 0;
        let currentY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!startY) return;
            
            currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            
            // Swipe down to close modals
            if (diff < -50) {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                    startY = 0;
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            startY = 0;
        });
    }
    
    // Modal Swipe Gestures
    setupModalSwipe(modal) {
        let startY = 0;
        let currentY = 0;
        let isSwiping = false;
        
        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });
        
        modal.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            if (diff > 0) {
                const modalContent = modal.querySelector('.modal-content');
                modalContent.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const diff = currentY - startY;
            const modalContent = modal.querySelector('.modal-content');
            
            if (diff > 100) {
                // Swipe down enough to close
                modalContent.style.transform = 'translateY(100vh)';
                setTimeout(() => this.closeModal(modal), 300);
            } else {
                // Return to position
                modalContent.style.transform = 'translateY(0)';
            }
            
            isSwiping = false;
            startY = 0;
            currentY = 0;
        });
    }
    
    // Smooth Animations Setup
    setupSmoothAnimations() {
        // Force hardware acceleration
        document.querySelectorAll('.glass-card, .project-card, .skill-card').forEach(el => {
            el.style.transform = 'translateZ(0)';
        });
        
        // Optimize scroll performance
        document.addEventListener('scroll', () => {
            // Use requestAnimationFrame for smooth scrolling
            requestAnimationFrame(() => {
                // Scroll effects are handled by animation engine
            });
        }, { passive: true });
    }
}

// CSS for modal swipe animation
const swipeStyles = `
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(50px);
        }
    }
    
    .project-card {
        transform: translateZ(0);
        will-change: transform;
    }
    
    .project-card.hover-active {
        transform: translateY(-10px) scale(1.02);
        z-index: 10;
    }
    
    .message-toast {
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
    }
    
    .message-success {
        background: rgba(46, 204, 113, 0.2);
        border-color: rgba(46, 204, 113, 0.3);
    }
    
    .message-error {
        background: rgba(231, 76, 60, 0.2);
        border-color: rgba(231, 76, 60, 0.3);
    }
`;

// Add swipe styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = swipeStyles;
document.head.appendChild(styleSheet);

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Export for global access
window.AnimationEngine = AnimationEngine;
window.PortfolioApp = PortfolioApp;
