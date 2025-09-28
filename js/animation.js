// Sounds
const chimeSound = new Howl({
    src: ['https://freesound.org/data/previews/919/91926_7037-lq.mp3'] // Example free chime sound
});

// Custom Cursor and Trail
const cursor = document.getElementById('customCursor');
const trail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;

    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    trail.style.transform = `translate(${trailX - 7.5}px, ${trailY - 7.5}px)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Parallax
const parallaxLayers = document.querySelectorAll('.parallax-layer');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    parallaxLayers.forEach(layer => {
        const speed = layer.dataset.speed;
        layer.style.transform = `translateY(${scrollTop * speed}px)`;
    });
});

// 3D Skills Globe
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('skills-globe').appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 10;

function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    sphere.rotation.y += 0.005;
    renderer.render(scene, camera);
}
animateGlobe();

// Merge Animation
function mergeToCenter(items, centerElement) {
    items.forEach(el => {
        const clone = el.cloneNode(true);
        document.body.appendChild(clone);
        const rect = el.getBoundingClientRect();
        const centerRect = centerElement.getBoundingClientRect();
        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        el.style.opacity = 0;

        gsap.to(clone, {
            x: centerRect.left + centerRect.width / 2 - rect.left - rect.width / 2,
            y: centerRect.top + centerRect.height / 2 - rect.top - rect.height / 2,
            scale: 0.5,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                clone.remove();
                chimeSound.play();
            }
        });
    });
}

window.addEventListener('scroll', () => {
    const skillsSection = document.getElementById('skills');
    if (window.scrollY > skillsSection.offsetTop - window.innerHeight / 2) {
        const skillsItems = document.querySelectorAll('.skill.merge-item');
        const skillsCenter = skillsSection.querySelector('.section-title'); // Use title as center
        mergeToCenter(skillsItems, skillsCenter);
    }

    const projectsSection = document.getElementById('projects');
    if (window.scrollY > projectsSection.offsetTop - window.innerHeight / 2) {
        const projectItems = document.querySelectorAll('.project-card.merge-item');
        const projectsCenter = projectsSection.querySelector('.section-title');
        mergeToCenter(projectItems, projectsCenter);
    }
});

// More animations...
