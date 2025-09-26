class SkillsSphere {
    constructor() {
        this.sphere = document.getElementById('skillsSphere');
        this.skills = [
            { name: 'Power BI', category: 'tools', importance: 5 },
            { name: 'Excel', category: 'tools', importance: 5 },
            { name: 'SQL', category: 'tools', importance: 4 },
            { name: 'Tableau', category: 'tools', importance: 3 },
            { name: 'Requirements', category: 'business', importance: 5 },
            { name: 'UAT', category: 'business', importance: 4 },
            { name: 'Stakeholder Mgmt', category: 'business', importance: 4 },
            { name: 'Process Optimization', category: 'business', importance: 4 },
            { name: 'Agile', category: 'project', importance: 4 },
            { name: 'Sprint Planning', category: 'project', importance: 3 },
            { name: 'Documentation', category: 'project', importance: 3 },
            { name: 'Financial Modeling', category: 'data', importance: 4 },
            { name: 'Risk Assessment', category: 'data', importance: 4 },
            { name: 'KPI Development', category: 'data', importance: 5 },
            { name: 'Trend Analysis', category: 'data', importance: 3 },
            { name: 'DAX', category: 'tools', importance: 4 },
            { name: 'Power Query', category: 'tools', importance: 4 }
        ];
        this.radius = 150;
        this.angleStep = (Math.PI * 2) / this.skills.length;
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        this.createSkillPoints();
    }
    
    createSkillPoints() {
        this.skills.forEach((skill, index) => {
            const point = document.createElement('div');
            point.className = 'skill-point';
            point.setAttribute('data-skill', skill.name);
            point.setAttribute('data-category', skill.category);
            
            // Calculate 3D position on sphere
            const phi = Math.acos(-1 + (2 * index) / this.skills.length);
            const theta = Math.sqrt(this.skills.length * Math.PI) * phi;
            
            const x = this.radius * Math.cos(theta) * Math.sin(phi);
            const y = this.radius * Math.sin(theta) * Math.sin(phi);
            const z = this.radius * Math.cos(phi);
            
            // Convert 3D to 2D for initial positioning
            const scale = 200 / (200 + z);
            const x2d = x * scale;
            const y2d = y * scale;
            
            point.style.left = `calc(50% + ${x2d}px - 6px)`;
            point.style.top = `calc(50% + ${y2d}px - 6px)`;
            point.style.transform = `scale(${scale})`;
            point.style.zIndex = Math.floor(z + 150);
            
            // Size based on importance
            const size = 8 + skill.importance * 2;
            point.style.width = `${size}px`;
            point.style.height = `${size}px`;
            
            this.sphere.appendChild(point);
            
            // Add click event
            point.addEventListener('click', () => this.highlightCategory(skill.category));
        });
    }
    
    highlightCategory(category) {
        const categories = document.querySelectorAll('.skill-category');
        const skillPoints = document.querySelectorAll('.skill-point');
        
        // Reset all categories
        categories.forEach(cat => cat.classList.remove('active'));
        
        // Activate selected category
        const targetCategory = document.querySelector(`[data-category="${category}"]`);
        if (targetCategory) {
            targetCategory.classList.add('active');
        }
        
        // Highlight relevant skill points
        skillPoints.forEach(point => {
            if (point.getAttribute('data-category') === category) {
                point.style.background = '#FF0066';
                point.style.boxShadow = '0 0 30px rgba(255, 0, 102, 1)';
                setTimeout(() => {
                    point.style.background = '#00D4FF';
                    point.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
                }, 1000);
            }
        });
    }
    
    bindEvents() {
        let isRotating = true;
        
        // Pause rotation on hover
        this.sphere.addEventListener('mouseenter', () => {
            isRotating = false;
            this.sphere.style.animationPlayState = 'paused';
        });
        
        this.sphere.addEventListener('mouseleave', () => {
            isRotating = true;
            this.sphere.style.animationPlayState = 'running';
        });
        
        // Manual rotation with mouse
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        
        this.sphere.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.sphere.style.animationPlayState = 'paused';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const rotateX = deltaY * 0.5;
            const rotateY = deltaX * 0.5;
            
            this.sphere.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    this.sphere.style.transform = '';
                    this.sphere.style.animationPlayState = 'running';
                }, 2000);
            }
        });
    }
}

// Initialize skills sphere when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsSphere();
});
