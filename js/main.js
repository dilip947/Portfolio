// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    loadSkillsData();
    loadProjectsData();
    initAboutHighlights();
    
    // Load data and render components
    Promise.all([
        loadJSON('data/skills.json'),
        loadJSON('data/projects.json')
    ]).then(([skillsData, projectsData]) => {
        renderSkills(skillsData);
        renderProjects(projectsData);
    }).catch(error => {
        console.error('Error loading data:', error);
    });
});

// Utility function to load JSON data
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return null;
    }
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Update icon
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    function updateHeaderOnScroll() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', updateHeaderOnScroll);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .certification-card, .education-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Hide form and show success message
                contactForm.style.display = 'none';
                formSuccess.classList.remove('hidden');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    contactForm.style.display = 'flex';
                    formSuccess.classList.add('hidden');
                    contactForm.reset();
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Form submission error:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
}

// Load and render skills data
function loadSkillsData() {
    // This function is called after data is loaded
}

function renderSkills(data) {
    if (!data) return;
    
    const skillsGrid = document.getElementById('skills-grid');
    const achievementsContainer = document.getElementById('achievements');
    
    if (skillsGrid) {
        skillsGrid.innerHTML = '';
        
        data.categories.forEach(category => {
            const categoryElement = createSkillCategory(category);
            skillsGrid.appendChild(categoryElement);
        });
    }
    
    if (achievementsContainer && data.achievements) {
        achievementsContainer.innerHTML = `
            <h3>Key Achievements</h3>
            <div class="achievements-grid">
                ${data.achievements.map(achievement => `
                    <div class="achievement-item">
                        <div class="achievement-value">${achievement.value}</div>
                        <div class="achievement-label">${achievement.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function createSkillCategory(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';
    
    categoryDiv.innerHTML = `
        <div class="category-header">
            <div class="category-icon">
                <i data-lucide="${category.icon}"></i>
            </div>
            <h3 class="category-title">${category.title}</h3>
        </div>
        <div class="skills-list">
            ${category.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-level="${skill.level}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Animate skill bars when they come into view
    setTimeout(() => {
        const progressBars = categoryDiv.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = level + '%';
        });
    }, 100);
    
    return categoryDiv;
}

// Load and render projects data
function loadProjectsData() {
    // This function is called after data is loaded
}

function renderProjects(data) {
    if (!data) return;
    
    const projectsContainer = document.getElementById('projects-container');
    
    if (projectsContainer) {
        projectsContainer.innerHTML = '';
        
        data.projects.forEach(project => {
            const projectElement = createProjectCard(project);
            projectsContainer.appendChild(projectElement);
        });
    }
}

function createProjectCard(project) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-card';
    
    projectDiv.innerHTML = `
        <div class="project-content">
            <div class="project-info">
                <div class="project-header">
                    <div class="project-icon">
                        <i data-lucide="${getProjectIcon(project.category)}"></i>
                    </div>
                    <div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                    </div>
                </div>
                
                <div class="project-tools">
                    <h4 class="tools-title">Tools & Technologies</h4>
                    <div class="tools-list">
                        ${project.tools.map(tool => `
                            <span class="tool-tag">${tool}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-achievements">
                    <h4 class="achievements-title">Key Achievements</h4>
                    <ul class="achievements-list">
                        ${project.achievements.map(achievement => `
                            <li class="achievement-item">
                                <div class="achievement-bullet"></div>
                                <span class="achievement-text">${achievement}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="project-metrics">
                <h4 class="metrics-title">Project Impact</h4>
                <div class="metrics-grid">
                    ${Object.entries(project.metrics).map(([key, value]) => `
                        <div class="metric-item">
                            <div class="metric-value">${value}</div>
                            <div class="metric-label">${formatMetricLabel(key)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    return projectDiv;
}

function getProjectIcon(category) {
    const iconMap = {
        'Revenue Analytics': 'bar-chart-3',
        'E-Commerce Analytics': 'trending-up',
        'Financial Analytics': 'bitcoin'
    };
    return iconMap[category] || 'bar-chart-3';
}

function formatMetricLabel(key) {
    return key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
}

// Initialize about highlights
function initAboutHighlights() {
    const highlightsContainer = document.getElementById('about-highlights');
    
    if (highlightsContainer) {
        const highlights = [
            {
                icon: 'bar-chart-3',
                title: 'Data-Driven Insights',
                description: 'Delivered actionable insights from complex datasets, improving decision-making processes'
            },
            {
                icon: 'users',
                title: 'Stakeholder Management',
                description: 'Expert in coordinating UAT, gathering requirements, and managing cross-functional teams'
            },
            {
                icon: 'target',
                title: 'Process Optimization',
                description: 'Reduced manual work by 40% through KPI development and workflow improvements'
            },
            {
                icon: 'award',
                title: 'Quality Assurance',
                description: 'Achieved 100% UAT success rate through meticulous test case preparation'
            }
        ];
        
        highlightsContainer.innerHTML = highlights.map(highlight => `
            <div class="highlight-card">
                <div class="highlight-icon">
                    <i data-lucide="${highlight.icon}"></i>
                </div>
                <h4 class="highlight-title">${highlight.title}</h4>
                <p class="highlight-description">${highlight.description}</p>
            </div>
        `).join('');
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Re-initialize icons after dynamic content is added
function reinitializeIcons() {
    lucide.createIcons();
}

// Call this after adding dynamic content
window.addEventListener('load', () => {
    reinitializeIcons();
});
