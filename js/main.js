// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create floating elements
    function createFloatingElements() {
        const container = document.getElementById('floatingElements');
        const elementCount = 15;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Random size and position
            const size = Math.random() * 150 + 50;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 30 + 20;
            
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.left = `${posX}%`;
            element.style.top = `${posY}%`;
            element.style.animationDelay = `${delay}s`;
            element.style.animationDuration = `${duration}s`;
            
            container.appendChild(element);
        }
    }
    
    createFloatingElements();
    
    // Animate hero title underline
    const heroTitle = document.getElementById('heroTitle');
    setTimeout(() => {
        heroTitle.classList.add('animate');
    }, 500);
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    if (localStorage.getItem('theme') === 'light' || 
        (window.matchMedia('(prefers-color-scheme: light)').matches && !localStorage.getItem('theme'))) {
        document.body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        
        if (mobileNav.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
        });
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = 'auto';
                }
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a server
        // For now, we'll just show an alert and reset the form
        alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
        contactForm.reset();
    });
    
    // Scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const fadeInOnScroll = () => {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // Check on load and scroll
    window.addEventListener('load', fadeInOnScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initialize scroll position for nav highlights
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Project gallery functionality
    const viewProjectButtons = document.querySelectorAll('.view-project-btn');
    const projectGalleries = document.querySelectorAll('.project-gallery');
    const closeGalleryButtons = document.querySelectorAll('.close-gallery');
    
    // Open project gallery
    viewProjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.getAttribute('data-project');
            const gallery = document.getElementById(`${projectId}-gallery`);
            
            if (gallery) {
                gallery.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });
    
    // Close project gallery
    closeGalleryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gallery = button.closest('.project-gallery');
            gallery.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    });
    
    // Close gallery when clicking outside
    projectGalleries.forEach(gallery => {
        gallery.addEventListener('click', (e) => {
            if (e.target === gallery) {
                gallery.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Mobile project navigation
    const projectsGrid = document.getElementById('projectsGrid');
    const projectNavButtons = document.querySelectorAll('.project-nav-btn');
    
    if (window.innerWidth <= 768) {
        // Initialize scroll position
        projectsGrid.scrollLeft = 0;
        
        // Update active nav button based on scroll position
        projectsGrid.addEventListener('scroll', () => {
            const scrollPos = projectsGrid.scrollLeft;
            const cardWidth = projectsGrid.querySelector('.project-card').offsetWidth + 16; // 16px gap
            const activeIndex = Math.round(scrollPos / cardWidth);
            
            projectNavButtons.forEach((btn, index) => {
                if (index === activeIndex) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
        
        // Navigate to specific project when clicking nav buttons
        projectNavButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const cardWidth = projectsGrid.querySelector('.project-card').offsetWidth + 16;
                projectsGrid.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            });
        });
        
        // Add swipe functionality for touch devices
        let startX = 0;
        let scrollLeft = 0;
        
        projectsGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - projectsGrid.offsetLeft;
            scrollLeft = projectsGrid.scrollLeft;
        });
        
        projectsGrid.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - projectsGrid.offsetLeft;
            const walk = (x - startX) * 2;
            projectsGrid.scrollLeft = scrollLeft - walk;
        });
    }
});
