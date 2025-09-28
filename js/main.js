document.addEventListener('DOMContentLoaded', function() {
    // Preloader simulation
    let progress = 0;
    const progressEl = document.getElementById('progress');
    const preloader = document.getElementById('preloader');
    const interval = setInterval(() => {
        progress += 10;
        progressEl.textContent = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            preloader.style.display = 'none';
        }
    }, 200);

    // Load skills.json and render
    fetch('data/skills.json')
        .then(response => response.json())
        .then(skills => {
            const skillsList = document.getElementById('skillsList');
            skills.forEach(skill => {
                const span = document.createElement('span');
                span.classList.add('skill', 'merge-item');
                span.textContent = skill.name;
                span.dataset.proficiency = skill.proficiency;
                skillsList.appendChild(span);
            });
        });

    // Load projects.json and render
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const projectsGrid = document.getElementById('projectsGrid');
            projects.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('project-card', 'glass-card', 'animate-on-scroll', 'merge-item');
                card.id = project.id;
                card.innerHTML = `
                    <div class="project-image">
                        <img src="${project.images[0]}" alt="${project.title}" class="project-img">
                        <div class="project-overlay">
                            <button class="btn btn-primary view-project-btn" data-project="${project.id}">
                                <i class="fas fa-external-link-alt"></i> View Project
                            </button>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-actions">
                            <button class="btn btn-primary view-project-btn" data-project="${project.id}">
                                <i class="fas fa-eye"></i> View Project
                            </button>
                            ${project.download ? `<a href="${project.download}" class="btn btn-secondary" target="_blank">
                                <i class="fas fa-download"></i> Download
                            </a>` : ''}
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(card);

                // Create gallery modal
                const gallery = document.createElement('div');
                gallery.id = `${project.id}-gallery`;
                gallery.classList.add('project-gallery');
                gallery.innerHTML = `
                    <div class="gallery-content glass-card">
                        <div class="gallery-header">
                            <h3>${project.title}</h3>
                            <button class="close-gallery">&times;</button>
                        </div>
                        <div class="gallery-body">
                            <div class="gallery-images">
                                ${project.images.map(img => `<img src="${img}" alt="${project.title}" class="gallery-img">`).join('')}
                            </div>
                            <div class="gallery-details">
                                <h4>Project Details</h4>
                                <p>${project.description}</p>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(gallery);
            });

            // Add gallery functionality
            document.querySelectorAll('.view-project-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const projectId = button.dataset.project;
                    const gallery = document.getElementById(`${projectId}-gallery`);
                    gallery.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            });

            document.querySelectorAll('.close-gallery').forEach(button => {
                button.addEventListener('click', () => {
                    button.closest('.project-gallery').style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            });
        });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Other main functionalities like mobile menu, scroll animations, etc.
    // (From previous script)
});
