    updateProfileTransform() {
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const navLogo = document.getElementById('navLogo');
        
        const maxScroll = window.innerHeight * 0.9;
        const scrollRatio = Math.min(this.scrollPosition / maxScroll, 1);
        
        if (profileImage && profileName) {
            // Ultra-smooth image shrinking (shrinks 10% per scroll millimeter equivalent)
            const imageScale = Math.max(1 - (scrollRatio * 0.85), 0.1);
            const imageOpacity = Math.max(1 - (scrollRatio * 1.2), 0);
            
            profileImage.style.transform = `scale(${imageScale})`;
            profileImage.style.opacity = imageOpacity;
            
            // Ultra-smooth name transition with precise control
            if (scrollRatio < 0.4) {
                // Phase 1: Name stays centered, slight growth
                const centerScale = 1 + (scrollRatio * 0.1);
                profileName.style.backdropFilter = 'none';
                profileName.style.webkitBackdropFilter = 'none';
                
                // Hide nav logo
                if (navLogo) {
                    navLogo.style.opacity = '0';
                }
            } else if (scrollRatio < 0.7) {
                // Phase 2: Smooth upward movement with gradual shrinking
                const moveProgress = (scrollRatio - 0.4) / 0.3; // 0 to 1
                const translateY = -moveProgress * 200; // Move up 200px
                const scale = 1.1 - (moveProgress * 0.3); // Scale from 1.1 to 0.8
                
                profileName.style.position = 'relative';
                profileName.style.transform = `translateY(${translateY}px) scale(${scale})`;
                profileName.style.textAlign = 'center';
                profileName.style.transition = 'all 0.1s linear'; // Ultra-smooth per-pixel animation
                
                // Gradually reduce size
                const fontSize = 6 - (moveProgress * 2.5); // From 6rem to 3.5rem
                profileName.style.fontSize = `${fontSize}rem`;
                
                // Hide nav logo during transition
                if (navLogo) {
                    navLogo.style.opacity = '0';
                }
            } else {
                // Phase 3: Final position in navbar
                profileName.style.position = 'fixed';
                profileName.style.top = '25px';
                profileName.style.left = '3rem';
                profileName.style.zIndex = '1001';
                profileName.style.fontSize = '1.8rem';
                profileName.style.transform = 'none';
                profileName.style.textAlign = 'left';
                profileName.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                // Glass effect in navbar
                profileName.style.background = 'rgba(255, 255, 255, 0.1)';
                profileName.style.backdropFilter = 'blur(30px)';
                profileName.style.webkitBackdropFilter = 'blur(30px)';
                profileName.style.padding = '0.8rem 1.5rem';
                profileName.style.borderRadius = '15px';
                profileName.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                profileName.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                
                // Show nav logo with name
                if (navLogo) {
                    navLogo.classList.add('visible');
                }
            }
        }
    }
    
    setupProjectHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            const gallery = card.querySelector('.project-hover-gallery');
            const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
            let hoverTimeout;
            let isHovering = false;
            
            card.addEventListener('mouseenter', () => {
                isHovering = true;
                
                // Start hover timer for gallery popup
                hoverTimeout = setTimeout(() => {
                    if (isHovering) {
                        gallery.classList.add('visible');
                        
                        // Animate thumbnails based on project position
                        thumbnails.forEach((thumb, thumbIndex) => {
                            setTimeout(() => {
                                thumb.style.animationDelay = `${thumbIndex * 0.1}s`;
                                if (index === 0) {
                                    // Left project - slide from left
                                    thumb.style.animation = 'slideFromLeft 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                                } else if (index === 1) {
                                    // Center project - expand from center
                                    thumb.style.animation = 'expandFromCenter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                                } else {
                                    // Right project - slide from right
                                    thumb.style.animation = 'slideFromRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                                }
                            }, thumbIndex * 100);
                        });
                    }
                }, 1000);
            });
            
            card.addEventListener('mouseleave', () => {
                isHovering = false;
                clearTimeout(hoverTimeout);
                
                // Hide gallery with smooth animation
                gallery.classList.remove('visible');
                
                // Reset thumbnail animations
                thumbnails.forEach(thumb => {
                    thumb.style.animation = '';
                    thumb.style.opacity = '0';
                    thumb.style.transform = index === 0 ? 'translateX(-30px)' : 
                                           index === 1 ? 'scale(0.8)' : 
                                           'translateX(30px)';
                });
            });
            
            // Add click handlers for gallery thumbnails
            thumbnails.forEach((thumb, thumbIndex) => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectImages = JSON.parse(card.dataset.projectImages);
                    this.openImageViewer(projectImages, thumbIndex);
                });
            });
        });
    }.position = 'relative';
                profileName.style.transform = `scale(${centerScale})`;
                profileName.style.top = 'auto';
                profileName.style.left = 'auto';
                profileName.style.fontSize = '';
                profileName.style.textAlign = 'center';
                profileName.style.zIndex = '10';
                profileName.style.background = 'none';
                profileName.style.padding = '0';
                profileName.style.borderRadius = '0';
                profileName.style.border = 'none';
                profileName.style    populateProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        const projectElements = this.projects.map((project, index) => {
            const animationClass = index === 0 ? 'from-left' : 
                                 index === 1 ? 'from-center' : 'from-right';
            
            return `
                <div class="project-card glass-effect haptic-effect ${animationClass}" 
                     data-project-id="${project.id}"
                     data-project-images='${JSON.stringify(project.images)}'
                     onmouseenter="this.style.cursor='pointer'">
                    <img src="${project.images[0]}" alt="${project.title}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                    </div>
                    <div class="project-hover-gallery">
                        <div class="gallery-grid">
                            ${project.images.slice(0, 6).map(img => 
                                `<img src="${img}" alt="${project.title}" class="gallery-thumbnail">`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = projectElements;
        
        // Add event listeners for project interactions
        this.setupProjectHoverEffects();
    }
    
    setupProjectHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const gallery = card.querySelector('.project-hover-gallery');
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                // Show gallery after delay
                hoverTimeout = setTimeout(() => {
                    gallery.classList.add('visible');
                }, 1000);
            });
            
            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                gallery.classList.remove('visible');
            });
            
            // Add click handlers for gallery thumbnails
            const thumbnails = card.querySelectorAll('.gallery-thumbnail');
            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectImages = JSON.parse(card.dataset.projectImages);
                    this.openImageViewer(projectImages, index);
                });
            });
        });
    }
    
    openImageViewer(images, startIndex = 0) {
        this.currentProjectImages = images;
        this.currentImageIndex = startIndex;
        
        // Create viewer if it doesn't exist
        if (!document.getElementById('imageViewer')) {
            this.createImageViewer();
        }
        
        const viewer = document.getElementById('imageViewer');
        const viewerImage = document.getElementById('viewerImage');
        
        viewerImage.src = images[startIndex];
        viewer.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    createImageViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'imageViewer';
        viewer.className = 'project-image-viewer';
        viewer.innerHTML = `
            <div class="viewer-content">
                <button class="viewer-close" onclick="portfolio.closeImageViewer()">&times;</button>
                <button class="viewer-nav prev" onclick="portfolio.previousImage()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <img id="viewerImage" class="viewer-image" alt="Project Image">
                <button class="viewer-nav next" onclick="portfolio.nextImage()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(viewer);
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (viewer.classList.contains('visible')) {
                if (e.key === 'Escape') this.closeImageViewer();
                if (e.key === 'ArrowLeft') this.previousImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
        
        // Close on background click
        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) {
                this.closeImageViewer();
            }
        });
    }
    
    closeImageViewer() {
        const viewer = document.getElementById('imageViewer');
        if (viewer) {
            viewer.classList.remove('visible');
            document.body.style.overflow = 'auto';
        }
    }
    
    nextImage() {
        if (this.currentProjectImages.length > 1) {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProjectImages.length;
            const viewerImage = document.getElementById('viewerImage');
            viewerImage.src = this.currentProjectImages[this.currentImageIndex];
        }
    }
    
    previousImage() {
        if (this.currentProjectImages.length > 1) {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProjectImages.length) % this.currentProjectImages.length;
            const viewerImage = document.getElementById('viewerImage');
            viewerImage.src = this.currentProjectImages[this.currentImageIndex];
        }
    }
    
    // Resume popup functionality
    openResumePopup() {
        // Create resume popup if it doesn't exist
        if (!document.getElementById('resumePopup')) {
            this.createResumePopup();
        }
        
        const popup = document.getElementById('resumePopup');
        popup.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
    
    createResumePopup() {
        const popup = document.createElement('div');
        popup.id = 'resumePopup';
        popup.className = 'resume-popup';
        popup.innerHTML = `
            <div class="resume-container">
                <div class="resume-header">
                    <h3 class="resume-title">Dilip Choudhary - Resume</h3>
                    <button class="resume-close" onclick="portfolio.closeResumePopup()">&times;</button>
                </div>
                <div class="resume-content">
                    <iframe src="resume.pdf" class="resume-iframe"></iframe>
                </div>
                <div class="resume-actions">
                    <a href="resume.pdf" class="resume-btn" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Open in New Tab
                    </a>
                    <a href="resume.pdf" class="resume-btn" download>
                        <i class="fas fa-download"></i>
                        Download
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeResumePopup();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('visible')) {
                this.closeResumePopup();
            }
        });
    }
    
    closeResumePopup() {
        const popup = document.getElementById('resumePopup');
        if (popup) {
            popup.classList.remove('visible');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Enhanced form with project type dropdown
    setupForm() {
        const form = document.getElementById('projectForm');
        if (!form) return;
        
        // Add project type dropdown
        const projectTypeGroup = document.createElement('div');
        projectTypeGroup.className = 'form-group';
        projectTypeGroup.innerHTML = `
            <label for="projectType">Type of Project</label>
            <select id="projectType" name="projectType" class="form-input glass-effect" required>
                <option value="">Select project type...</option>
                <option value="dashboard">Dashboard Development</option>
                <option value="analytics">Data Analytics</option>
                <option value="financial">Financial Modeling</option>
                <option value="powerbi">Power BI Solutions</option>
                <option value="excel">Advanced Excel Projects</option>
                <option value="visualization">Data Visualization</option>
                <option value="automation">Process Automation</option>
                <option value="consulting">Business Analytics Consulting</option>
                <option value="other">Other</option>
            </select>
        `;
        
        // Insert after project name field
        const projectNameGroup = form.querySelector('.form-group');
        projectNameGroup.insertAdjacentElement('afterend', projectTypeGroup);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Create mailto link with form data
            const subject = encodeURIComponent(`Project Inquiry: ${data.projectName}`);
            const body = encodeURIComponent(`
Project Name: ${data.projectName}
Project Type: ${data.projectType}
Email: ${data.email}

Requirements:
${data.requirements}

---
Sent from Dilip Choudhary's Portfolio Website
            `);
            
            const mailtoLink = `mailto:choudharydilip947@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            this.showNotification('Opening email client with your message...', 'success');
            form.reset();
        });
    }
    
    // Enhanced contact functionality
    setupContactLinks() {
        // LinkedIn
        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => {
            link.href = 'https://linkedin.com/in/dilip-choudhary-analytics';
            link.target = '_blank';
        });
        
        // Email
        const emailLinks = document.querySelectorAll('a[href*="mailto"]');
        emailLinks.forEach(link => {
            link.href = 'mailto:choudharydilip947@gmail.com';
        });
        
        // Phone
        const phoneLinks = document.querySelectorAll('a[href*="tel"]');
        phoneLinks.forEach(link => {
            link.href = 'tel:+919346053750';
        });
        
        // Resume buttons
        const resumeButtons = document.querySelectorAll('.view-resume-btn, a[href*="resume"]');
        resumeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openResumePopup();
            });
        });
    }// Main JavaScript for Dilip Choudhary Portfolio
class Portfolio {
    constructor() {
        this.scrollPosition = 0;
        this.isLoading = true;
        this.darkModeProgress = 0;
        this.projects = [];
        this.skills = [];
        this.timeline = [];
        this.manualThemeOverride = false; // Track manual theme changes
        this.currentProjectGallery = null;
        this.currentImageIndex = 0;
        this.currentProjectImages = [];
        
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
        
        // Setup contact links functionality
        this.setupContactLinks();
        
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
        const profileImage = document.getElementById('profileImage');
        const profileName = document.getElementById('profileName');
        const profileRoles = document.getElementById('profileRoles');
        const mainContent = document.getElementById('mainContent');
        const navLogo = document.getElementById('navLogo');
        
        // Ultra-fast welcome sequence (0.5 seconds total)
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
        }, 500);
        
        setTimeout(() => {
            mainContent.classList.add('visible');
            profileImage.classList.add('visible');
        }, 700);
        
        setTimeout(() => {
            profileName.classList.add('visible');
        }, 1200);
        
        setTimeout(() => {
            profileRoles.classList.add('visible');
        }, 1800);
        
        // Remove chess background (no longer needed)
        const chessBackground = document.getElementById('chessBackground');
        if (chessBackground) {
            chessBackground.remove();
        }
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
            
            // Name animation - smooth transition from center to top-left
            if (scrollRatio < 0.3) {
                // Initial phase - name in center, growing slightly
                const centerScale = 1 + (scrollRatio * 0.2);
                profileName.style.transform = `scale(${centerScale})`;
                profileName.style.position = 'relative';
                profileName.style.top = 'auto';
                profileName.style.left = 'auto';
                profileName.style.fontSize = '';
                profileName.style.textAlign = 'center';
            } else if (scrollRatio < 0.7) {
                // Transition phase - moving upward
                const moveProgress = (scrollRatio - 0.3) / 0.4; // 0 to 1
                const translateY = -moveProgress * 300; // Move up 300px
                const scale = 1.2 - (moveProgress * 0.2); // Scale from 1.2 to 1
                
                profileName.style.transform = `translateY(${translateY}px) scale(${scale})`;
                profileName.style.position = 'relative';
                profileName.style.textAlign = 'center';
            } else {
                // Final phase - settled in top-left
                profileName.style.position = 'fixed';
                profileName.style.top = '20px';
                profileName.style.left = '20px';
                profileName.style.zIndex = '1001';
                profileName.style.fontSize = '1.8rem';
                profileName.style.transform = 'none';
                profileName.style.textAlign = 'left';
                profileName.style.color = 'var(--text-primary)';
                profileName.style.fontWeight = '700';
                profileName.style.letterSpacing = '0.1em';
                profileName.style.textTransform = 'uppercase';
                
                // Add glass effect to name when fixed
                profileName.style.background = 'rgba(255, 255, 255, 0.1)';
                profileName.style.backdropFilter = 'blur(20px)';
                profileName.style.webkitBackdropFilter = 'blur(20px)';
                profileName.style.padding = '0.5rem 1rem';
                profileName.style.borderRadius = '10px';
                profileName.style.border = '1px solid rgba(255, 255, 255, 0.2)';
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
