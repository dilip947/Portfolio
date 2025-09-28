// Main JavaScript for Dilip Choudhary Portfolio
class Portfolio {
    constructor() {
        this.scrollPosition = 0;
        this.isLoading = true;
        this.darkModeProgress = 0;
        this.projects = [];
        this.skills = [];
        this.timeline = [];
        
        this.init();
    }
    
    async init() {
        // Load data
        await this.loadData();
        
        // Initialize components
        this.setupWelcomeSequence();
        this.setupScrollEffects();
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupProjectModal();
        this.setupForm();
        
        // Populate content
        this.populateProjects();
        this.populateSkills();
        this.populateTimeline();
        this.populateProjectsDropdown();
        
        // Setup intersection observers
        this.setupIntersectionObservers();
        
        // Hide loading overlay
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            this.isLoading = false;
        }, 1000);
    }
    
    async loadData() {
        try {
            // Load projects data
            const projectsResponse = await fetch('data/projects.json');
            this.projects = await projectsResponse.json();
            
            // Load skills data
            const skillsResponse = await fetch('data/skills.json');
            this.skills = await skillsResponse.json();
            
            // Timeline data (embedded for now)
            this.timeline = [
                {
                    year: '2023',
                    title: 'Started Business Analytics Journey',
                    description: 'Enrolled in Bachelor of Business Analytics with Finance Specialization at Avinash College of Commerce. Discovered passion for data-driven decision making.'
                },
                {
                    year: '2024',
                    title: 'Skill Development & First Projects',
                    description: 'Mastered Power BI, Excel, and financial modeling. Completed first major project analyzing customer payment insights with 100% UAT success rate.'
                },
                {
                    year: '2025',
                    title: 'Portfolio Expansion & Recognition',
                    description: 'Developed comprehensive analytics dashboards, earned multiple certifications, and established online presence. Ready to make impact in business analytics field.'
                }
            ];
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback data if fetch fails
            this.setFallbackData();
        }
    }
    
    setFallbackData() {
        this.projects = [
            {
                id: 'project1',
                title: 'Customer Payment & Revenue Insights',
                description: 'Comprehensive Power BI dashboard analyzing customer payments and revenue streams with advanced DAX formulas.',
                images: ['Projects/P3ABC/1.png', 'Projects/P3ABC/Sprint.png', 'Projects/P3ABC/UAT Results.png'],
                technologies: ['Power BI', 'Excel', 'DAX', 'Power Query'],
                folder: 'P3ABC'
            },
            {
                id: 'project2',
                title: 'E-Commerce Sales Insights',
                description: 'Analysis of 128,000+ orders identifying cancellation patterns and optimization opportunities.',
                images: ['Projects/Projectec/1.png', 'Projects/Projectec/2.png', 'Projects/Projectec/3.png', 'Projects/Projectec/4.png'],
                technologies: ['Power BI', 'Power Query', 'Excel', 'DAX'],
                folder: 'Projectec'
            },
            {
                id: 'project3',
                title: 'Crypto Market Risk Dashboard',
                description: 'Advanced cryptocurrency market analysis with volatility tracking and risk assessment metrics.',
                images: ['Projects/Projectcrypto/1.png', 'Projects/Projectcrypto/2.png', 'Projects/Projectcrypto/3.png'],
                technologies: ['Power BI', 'Financial Modeling', 'Risk Analysis'],
                folder: 'Projectcrypto'
            }
        ];
        
        this.skills = [
            {
                category: 'Business Analysis',
                icon: 'fas fa-chart-line',
                skills: ['Requirements Gathering', 'Stakeholder Management', 'UAT Coordination', 'Process Optimization'],
                description: 'Expert in translating business needs into actionable insights'
            },
            {
                category: 'Data Analysis',
                icon: 'fas fa-database',
                skills: ['Financial Modeling', 'Risk Assessment', 'KPI Development', 'Trend Analysis'],
                description: 'Advanced analytical skills for complex data interpretation'
            },
            {
                category: 'Visualization Tools',
                icon: 'fas fa-chart-pie',
                skills: ['Power BI', 'Tableau', 'Excel Advanced', 'DAX Formulas'],
                description: 'Creating compelling visual stories from raw data'
            },
            {
                category: 'Project Management',
                icon: 'fas fa-tasks',
                skills: ['Agile Methodologies', 'Sprint Planning', 'Documentation', 'Quality Assurance'],
                description: 'Efficient project delivery with stakeholder satisfaction'
            }
        ];
    }
    
    setupWelcomeSequence() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chessBackground = document.getElementById('chessBackground');
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileRoles = document.getElementById('profileRoles');
        const mainContent = document.getElementById('mainContent');
        
        // Welcome sequence timeline
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
        }, 3000);
        
        setTimeout(() => {
            mainContent.classList.add('visible');
            profileImage.classList.add('visible');
        }, 4000);
        
        setTimeout(() => {
            profileName.classList.add('visible');
        }, 4500);
        
        setTimeout(() => {
            profileRoles.classList.add('visible');
        }, 5000);
        
        setTimeout(() => {
            chessBackground.classList.add('hidden');
        }, 6000);
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            this.scrollPosition = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Calculate dark mode progress based on scroll
            this.darkModeProgress = Math.min(this.scrollPosition / (windowHeight * 0.5), 1);
            
            // Progressive dark mode transition
            this.updateThemeTransition();
            
            // Profile image and name transformations
            this.updateProfileTransform();
            
            // Navigation visibility
            this.updateNavigationVisibility();
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    updateThemeTransition() {
        const body = document.body;
        
        if (this.darkModeProgress > 0.3 && !body.classList.contains('dark-mode')) {
            body.classList.add('theme-transitioning', 'dark-mode');
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 2000);
        }
    }
    
    updateProfileTransform() {
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileContainer = document.getElementById('profileContainer');
        
        const maxScroll = window.innerHeight * 0.8;
        const scrollRatio = Math.min(this.scrollPosition / maxScroll, 1);
        
        if (profileImage && profileName && profileContainer) {
            // Image shrinking and fading
            const imageScale = 1 - (scrollRatio * 0.7);
            const imageOpacity = 1 - (scrollRatio * 1);
            
            profileImage.style.transform = `scale(${Math.max(imageScale, 0.3)})`;
            profileImage.style.opacity = Math.max(imageOpacity, 0);
            
            // Name scaling and positioning
            const nameScale = 1 + (scrollRatio * 1.5);
            const translateY = -(scrollRatio * 200);
            const translateX = -(scrollRatio * 300);
            
            profileName.style.transform = `translate(${translateX}px, ${translateY}px) scale(${nameScale})`;
            
            // When name reaches top, position it in navbar
            if (scrollRatio > 0.8) {
                profileName.style.position = 'fixed';
                profileName.style.top = '20px';
                profileName.style.left = '20px';
                profileName.style.zIndex = '1001';
                profileName.style.fontSize = '1.5rem';
                profileName.style.transform = 'none';
            } else {
                profileName.style.position = 'relative';
                profileName.style.top = 'auto';
                profileName.style.left = 'auto';
                profileName.style.zIndex = 'auto';
                profileName.style.fontSize = '';
            }
        }
    }
    
    updateNavigationVisibility() {
        const navbar = document.getElementById('navbar');
        const scrollThreshold = window.innerHeight * 0.8;
        
        if (this.scrollPosition > scrollThreshold) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    setupNavigation() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation
                    this.updateActiveNavigation(targetId);
                }
            });
        });
        
        // Update active navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigationOnScroll();
        });
    }
    
    updateActiveNavigation(activeId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (this.scrollPosition >= sectionTop && this.scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            this.updateActiveNavigation(currentSection);
        }
    }
    
    setupProjectModal() {
        const modal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        
        modalClose.addEventListener('click', () => {
            this.closeProjectModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                this.closeProjectModal();
            }
        });
    }
    
    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalImages = document.getElementById('modalImages');
        const modalDetails = document.getElementById('modalDetails');
        
        modalTitle.textContent = project.title;
        
        // Populate images
        modalImages.innerHTML = project.images.map(img => 
            `<img src="${img}" alt="${project.title}" onclick="this.requestFullscreen()">`
        ).join('');
        
        // Populate details
        modalDetails.innerHTML = `
            <h4>Project Overview</h4>
            <p>${project.description}</p>
            <h4>Technologies Used</h4>
            <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        `;
        
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
    
    setupForm() {
        const form = document.getElementById('projectForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission
            this.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            form.reset();
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    populateProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        const projectElements = this.projects.map((project, index) => {
            const animationClass = index === 0 ? 'from-left' : 
                                 index === 1 ? 'from-center' : 'from-right';
            
            return `
                <div class="project-card glass-effect haptic-effect ${animationClass}" 
                     onclick="portfolio.openProjectModal('${project.id}')"
                     onmouseenter="this.style.cursor='pointer'">
                    <img src="${project.images[0]}" alt="${project.title}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = projectElements;
    }
    
    populateSkills() {
        const container = document.getElementById('skillsGrid');
        if (!container) return;
        
        const skillElements = this.skills.map(skill => `
            <div class="skill-card glass-effect fade-in-up">
                <div class="skill-icon">
                    <i class="${skill.icon}"></i>
                </div>
                <h3 class="skill-title">${skill.category}</h3>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-list">
                    ${skill.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skillElements;
    }
    
    populateTimeline() {
        const container = document.getElementById('timelineContainer');
        if (!container) return;
        
        const timelineElements = this.timeline.map((item, index) => `
            <div class="timeline-item glass-effect fade-in-left" style="animation-delay: ${index * 0.3}s">
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = timelineElements;
    }
    
    populateProjectsDropdown() {
        const dropdown = document.getElementById('projectsDropdown');
        if (!dropdown) return;
        
        const dropdownItems = this.projects.map(project => `
            <a href="#projects" class="dropdown-item" onclick="portfolio.scrollToProject('${project.id}')">
                ${project.title}
            </a>
        `).join('');
        
        dropdown.innerHTML = dropdownItems;
    }
    
    scrollToProject(projectId) {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.openProjectModal(projectId);
            }, 800);
        }
    }
    
    setupIntersectionObservers() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Special handling for project cards
                    if (entry.target.classList.contains('project-card')) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, 200);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .skill-card, .timeline-item, .project-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Resume button handler
document.addEventListener('DOMContentLoaded', () => {
    const resumeBtn = document.getElementById('viewResumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            window.open('resume.pdf', '_blank');
        });
    }
});

// Add CSS for notification system
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 10px;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur));
    -webkit-backdrop-filter: blur(var(--blur));
    color: var(--text-primary);
    box-shadow: 0 10px 30px var(--shadow);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: slideInFromRight 0.5s ease;
}

.notification button {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    cursor: pointer;
}

.notification-success {
    border-left: 4px solid #4CAF50;
}

.notification-error {
    border-left: 4px solid #f44336;
}

@keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.tech-tag, .skill-tag {
    background: var(--glass-bg);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    color: var(--text-secondary);
    border: 1px solid var(--glass-bg);
}

.skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
