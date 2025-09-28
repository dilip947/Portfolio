// Projects Data
const projectsData = [
    {
        id: "ecommerce-project",
        title: "E-Commerce Sales Insights",
        description: "Comprehensive analysis of e-commerce order data with insights into cancellation drivers and sales performance optimization.",
        images: [
            "Image/Projectec/1.png",
            "Image/Projectec/2.png",
            "Image/Projectec/3.png",
            "Image/Projectec/4.png"
        ],
        downloadLink: "https://drive.google.com/drive/folders/1ujHD_MZVCvIBBHDwB72kwxqbdRDrXSyg",
        category: "Data Analysis"
    },
    {
        id: "crypto-project",
        title: "Crypto Market Risk Dashboard",
        description: "Power BI dashboard analyzing cryptocurrency volatility and market sentiment to assess risk factors and investment opportunities.",
        images: [
            "Image/Projectcrypto/1.png",
            "Image/Projectcrypto/2.png",
            "Image/Projectcrypto/3.png"
        ],
        downloadLink: "https://drive.google.com/drive/folders/1cvIZ0nbRI022NNEHhLUcRlc6VFNQEGCo",
        category: "Risk Analysis"
    },
    {
        id: "abc-project",
        title: "ABC Analytics Platform",
        description: "Comprehensive analytics platform with sprint planning, UAT testing, and test case management capabilities.",
        images: [
            "Image/Projects/P3ABC/1.png",
            "Image/Projects/P3ABC/Sprint.png",
            "Image/Projects/P3ABC/UAT Results.png",
            "Image/Projects/P3ABC/UAT Scenario.png",
            "Image/Projects/P3ABC/UAT Signoff.png",
            "Image/Projects/P3ABC/UAT.png",
            "Image/Projects/P3ABC/test_case.png"
        ],
        downloadLink: "#",
        category: "Business Intelligence"
    }
];

// Skills Data
const skillsData = [
    {
        name: "Power BI",
        icon: "fas fa-chart-bar",
        description: "Interactive dashboard creation and business intelligence"
    },
    {
        name: "Tableau",
        icon: "fas fa-chart-pie",
        description: "Data visualization and analytics platform"
    },
    {
        name: "Excel",
        icon: "fas fa-table",
        description: "Advanced financial modeling and data analysis"
    },
    {
        name: "SQL",
        icon: "fas fa-database",
        description: "Database querying and management"
    },
    {
        name: "Financial Analysis",
        icon: "fas fa-chart-line",
        description: "Risk assessment and financial modeling"
    },
    {
        name: "Data Visualization",
        icon: "fas fa-eye",
        description: "Creating compelling data stories"
    }
];

// Timeline Data
const timelineData = [
    {
        year: "2023",
        title: "Beginning of Analytics Journey",
        description: "Started mastering data analysis tools and techniques, focusing on business intelligence and financial analytics."
    },
    {
        year: "2024",
        title: "Advanced Skill Development",
        description: "Developed expertise in Power BI, Tableau, and advanced Excel. Built comprehensive dashboards and financial models."
    },
    {
        year: "2025",
        title: "Project Portfolio & Publications",
        description: "Created multiple analytics projects, published insights, and established expertise in crypto market analysis and e-commerce analytics."
    }
];

// Initialize Data
function initializeData() {
    loadProjects();
    loadSkills();
    loadTimeline();
}

// Load Projects
function loadProjects() {
    const projectsContainer = document.getElementById('projectsShowcase');
    
    projectsData.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card glass-card`;
        projectCard.style.animationDelay = `${index * 0.2}s`;
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.images[0]}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        projectCard.addEventListener('mouseenter', () => showProjectPreview(project));
        projectCard.addEventListener('mouseleave', () => hideProjectPreview());
        projectCard.addEventListener('click', () => openProjectGallery(project));
        
        projectsContainer.appendChild(projectCard);
    });
}

// Load Skills
function loadSkills() {
    const skillsContainer = document.getElementById('skillsGrid');
    
    skillsData.forEach((skill, index) => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card glass-card';
        skillCard.style.animationDelay = `${index * 0.1}s`;
        
        skillCard.innerHTML = `
            <div class="skill-icon">
                <i class="${skill.icon}"></i>
            </div>
            <h3>${skill.name}</h3>
            <p>${skill.description}</p>
        `;
        
        skillsContainer.appendChild(skillCard);
    });
}

// Load Timeline
function loadTimeline() {
    const timelineContainer = document.getElementById('timeline');
    
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.animationDelay = `${index * 0.3}s`;
        
        timelineItem.innerHTML = `
            <div class="timeline-content glass-card">
                <div class="timeline-year">${item.year}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Show Project Preview
function showProjectPreview(project) {
    // Create preview element
    const preview = document.createElement('div');
    preview.className = 'project-preview glass-card';
    preview.id = 'projectPreview';
    preview.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        z-index: 1001;
        padding: 1rem;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    preview.innerHTML = `
        <div class="preview-images" style="display: flex; gap: 0.5rem; flex-wrap: wrap; max-width: 400px;">
            ${project.images.slice(0, 4).map(img => `
                <img src="${img}" alt="${project.title}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 8px;">
            `).join('')}
        </div>
    `;
    
    document.body.appendChild(preview);
    
    // Animate in
    setTimeout(() => {
        preview.style.opacity = '1';
        preview.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);
}

// Hide Project Preview
function hideProjectPreview() {
    const preview = document.getElementById('projectPreview');
    if (preview) {
        preview.style.opacity = '0';
        preview.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => preview.remove(), 500);
    }
}

// Open Project Gallery
function openProjectGallery(project) {
    const modal = document.getElementById('projectGalleryModal');
    const title = document.getElementById('galleryProjectTitle');
    const mainImage = document.getElementById('galleryMainImage');
    const thumbnails = document.getElementById('galleryThumbnails');
    
    title.textContent = project.title;
    mainImage.src = project.images[0];
    
    // Clear thumbnails
    thumbnails.innerHTML = '';
    
    // Create thumbnails
    project.images.forEach((image, index) => {
        const thumb = document.createElement('div');
        thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}">`;
        
        thumb.addEventListener('click', () => {
            mainImage.src = image;
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        
        thumbnails.appendChild(thumb);
    });
    
    // Navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    const navigateImages = (direction) => {
        const currentIndex = project.images.findIndex(img => img === mainImage.src);
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        
        if (newIndex < 0) newIndex = project.images.length - 1;
        if (newIndex >= project.images.length) newIndex = 0;
        
        mainImage.src = project.images[newIndex];
        document.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === newIndex);
        });
    };
    
    prevBtn.onclick = () => navigateImages('prev');
    nextBtn.onclick = () => navigateImages('next');
    
    modal.classList.add('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeData);
