document.addEventListener('DOMContentLoaded', () => {
    const skillsGrid = document.getElementById('skillsGrid');
    const projectsGrid = document.getElementById('projectsGrid');

    // --- Dynamic Content Loading ---
    async function loadSkills() {
        try {
            const response = await fetch('data/skills.json');
            const skills = await response.json();
            skillsGrid.innerHTML = skills.map(skill => `
                <div class="skill-card glass-card">${skill}</div>
            `).join('');
        } catch (error) {
            console.error('Error loading skills:', error);
            skillsGrid.innerHTML = '<p>Could not load skills.</p>';
        }
    }

    async function loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const projects = await response.json();
            projectsGrid.innerHTML = projects.map((project, index) => {
                 // Determine animation class based on position
                let animationClass = 'animate-fade';
                if (index % 3 === 0) animationClass = 'animate-left';
                if (index % 3 === 2) animationClass = 'animate-right';

                return `
                <div class="project-card glass-card ${animationClass}" data-project-id="${project.id}">
                    <img src="${project.thumbnail}" alt="${project.title}" class="project-card-thumbnail">
                    <div class="project-card-content">
                        <h3 class="project-card-title">${project.title}</h3>
                    </div>
                    <div class="project-gallery-preview"></div>
                </div>
            `}).join('');
            
            // Re-initialize project event listeners after loading
            initializeProjectListeners();

        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = '<p>Could not load projects.</p>';
        }
    }
    
    // Initial Load
    loadSkills();
    loadProjects();

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        themeIcon.classList.toggle('fa-sun', !isLight);
        themeIcon.classList.toggle('fa-moon', isLight);
    });
    
    // --- Resume Modal ---
    const resumeBtn = document.getElementById('resumeBtn');
    const resumeModal = document.getElementById('resumeModal');
    const closeResumeBtn = document.getElementById('closeResumeBtn');

    resumeBtn.addEventListener('click', () => resumeModal.classList.add('visible'));
    closeResumeBtn.addEventListener('click', () => resumeModal.classList.remove('visible'));
    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) resumeModal.classList.remove('visible');
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = document.getElementById('projectName').value;
        const projectType = document.getElementById('projectType').value;
        const description = document.getElementById('projectDescription').value;

        const subject = `Project Inquiry: ${projectName} (${projectType})`;
        const body = `Project Name: ${projectName}\nProject Type: ${projectType}\n\nDescription:\n${description}`;
        
        window.location.href = `mailto:choudharydilip947@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // --- Project Gallery Modal ---
    const galleryModal = document.getElementById('galleryModal');
    const galleryContent = document.getElementById('galleryContent');
    let currentProject = null;
    let currentImageIndex = 0;

    async function openGallery(projectId) {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        currentProject = projects.find(p => p.id === projectId);
        if (!currentProject) return;

        currentImageIndex = 0;
        updateGalleryView();
        galleryModal.classList.add('visible');
    }

    function updateGalleryView() {
        galleryContent.innerHTML = `
            <button class="close-modal-btn" id="closeGalleryBtn">&times;</button>
            <img src="${currentProject.gallery[currentImageIndex]}" alt="Project Image" class="gallery-main-image">
            ${currentProject.gallery.length > 1 ? `
                <button class="gallery-nav prev"><i class="fas fa-chevron-left"></i></button>
                <button class="gallery-nav next"><i class="fas fa-chevron-right"></i></button>
            ` : ''}
        `;
    }
    
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal || e.target.closest('#closeGalleryBtn')) {
            galleryModal.classList.remove('visible');
        }
        if (e.target.closest('.gallery-nav.next')) {
            currentImageIndex = (currentImageIndex + 1) % currentProject.gallery.length;
            updateGalleryView();
        }
        if (e.target.closest('.gallery-nav.prev')) {
            currentImageIndex = (currentImageIndex - 1 + currentProject.gallery.length) % currentProject.gallery.length;
            updateGalleryView();
        }
    });

    // This function is separate so it can be called after projects are loaded
    function initializeProjectListeners() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                openGallery(card.dataset.projectId);
            });
        });
    }
});
