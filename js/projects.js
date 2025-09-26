class ProjectsGallery {
    constructor() {
        this.panels = document.querySelectorAll('.project-panel');
        this.currentExpanded = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
    }
    
    bindEvents() {
        this.panels.forEach(panel => {
            panel.addEventListener('click', () => this.togglePanel(panel));
            
            // Add hover effects
            panel.addEventListener('mouseenter', () => {
                if (panel !== this.currentExpanded) {
                    this.addHoverEffect(panel);
                }
            });
            
            panel.addEventListener('mouseleave', () => {
                if (panel !== this.currentExpanded) {
                    this.removeHoverEffect(panel);
                }
            });
        });
        
        // Close expanded panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.project-panel') && this.currentExpanded) {
                this.collapsePanel(this.currentExpanded);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentExpanded) {
                this.collapsePanel(this.currentExpanded);
            }
        });
    }
    
    togglePanel(panel) {
        if (panel === this.currentExpanded) {
            this.collapsePanel(panel);
        } else {
            if (this.currentExpanded) {
                this.collapsePanel(this.currentExpanded);
            }
            this.expandPanel(panel);
        }
    }
    
    expandPanel(panel) {
        this.currentExpanded = panel;
        panel.classList.add('expanded');
        
        // Smooth scroll to panel
        panel.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add entrance animation for details
        const details = panel.querySelector('.project-details');
        setTimeout(() => {
            details.style.opacity = '0';
            details.style.transform = 'translateY(20px)';
            details.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                details.style.opacity = '1';
                details.style.transform = 'translateY(0)';
            }, 100);
        }, 250);
        
        // Animate achievement cards
        const achievements = panel.querySelectorAll('.achievement');
        achievements.forEach((achievement, index) => {
            achievement.style.opacity = '0';
            achievement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                achievement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                achievement.style.opacity = '1';
                achievement.style.transform = 'scale(1)';
            }, 500 + index * 100);
        });
    }
    
    collapsePanel(panel) {
        panel.classList.remove('expanded');
        this.currentExpanded = null;
        
        // Reset animations
        const details = panel.querySelector('.project-details');
        details.style.opacity = '';
        details.style.transform = '';
        details.style.transition = '';
        
        const achievements = panel.querySelectorAll('.achievement');
        achievements.forEach(achievement => {
            achievement.style.opacity = '';
            achievement.style.transform = '';
            achievement.style.transition = '';
        });
    }
    
    addHoverEffect(panel) {
        const image = panel.querySelector('.project-image');
        const placeholder = panel.querySelector('.project-placeholder');
        
        if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.3s ease';
        }
        
        if (placeholder) {
            placeholder.style.transform = 'scale(1.2) rotate(5deg)';
            placeholder.style.transition = 'transform 0.3s ease';
        }
        
        // Add subtle glow to tags
        const tags = panel.querySelectorAll('.project-tags span');
        tags.forEach(tag => {
            tag.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)';
            tag.style.transition = 'box-shadow 0.3s ease';
        });
    }
    
    removeHoverEffect(panel) {
        const image = panel.querySelector('.project-image');
        const placeholder = panel.querySelector('.project-placeholder');
        
        if (image) {
            image.style.transform = '';
        }
        
        if (placeholder) {
            placeholder.style.transform = '';
        }
        
        const tags = panel.querySelectorAll('.project-tags span');
        tags.forEach(tag => {
            tag.style.boxShadow = '';
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.panels.forEach(panel => {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(50px)';
            panel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(panel);
        });
    }
}

// Initialize projects gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsGallery();
});
