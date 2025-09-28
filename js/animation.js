// Ambient hum
const ambientHum = new Howl({
    src: ['https://freesound.org/data/previews/242/242501_2052072-lq.mp3'], // Placeholder hum sound
    loop: true,
    volume: 0.2
});
ambientHum.play();

// Chime sound
const chime = new Howl({
    src: ['https://freesound.org/data/previews/919/91926_7037-lq.mp3']
});

// Cosmic background nebula (inspired by DEV.to and CodePen)
const cosmicCanvas = document.getElementById('cosmic-background');
const ctx = cosmicCanvas.getContext('2d');
cosmicCanvas.width = window.innerWidth;
cosmicCanvas.height = window.innerHeight;
let particles = [];
for (let i = 0; i < 200; i++) {
    particles.push({
        x: Math.random() * cosmicCanvas.width,
        y: Math.random() * cosmicCanvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.random()*255}, ${Math.random()*255}, 255, 0.5)`,
        speed: Math.random() * 0.5 + 0.1
    });
}
function animateNebula() {
    ctx.clearRect(0, 0, cosmicCanvas.width, cosmicCanvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = cosmicCanvas.height;
    });
    requestAnimationFrame(animateNebula);
}
animateNebula();

// Parallax stars layer (simple div with background)
const starsLayer = document.querySelector('.stars-layer');
starsLayer.style.background = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJElEQVQoU2NkwA/6z8D/BwADeQESY3zZUQAAAABJRU5ErkJggg==) repeat'; // Tiny stars pattern

// Cursor glowing orb with particle trail (inspired by DEV.to)
const cursor = document.getElementById('customCursor');
const trailCanvas = document.getElementById('particle-trail');
const trailCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;
let trailParticles = [];
document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    trailParticles.push({x: e.clientX, y: e.clientY, life: 30, radius: 5});
});
function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    trailParticles = trailParticles.filter(p => p.life > 0);
    trailParticles.forEach(p => {
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(0, 191, 255, ${p.life / 30})`;
        trailCtx.fill();
        p.life--;
        p.radius *= 0.95;
    });
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Letter reveal for name (GSAP TextPlugin)
gsap.registerPlugin(TextPlugin);
gsap.from('#heroName', { duration: 2, text: '', stagger: 0.05, ease: 'power1.out' });

// 3D Grok model in about (placeholder sphere)
const aboutScene = new THREE.Scene();
const aboutCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
const aboutRenderer = new THREE.WebGLRenderer({ alpha: true });
aboutRenderer.setSize(window.innerWidth / 2, 400);
document.getElementById('about3dModel').appendChild(aboutRenderer.domElement);
const aboutGeometry = new THREE.SphereGeometry(5, 32, 32);
const aboutMaterial = new THREE.MeshBasicMaterial({ color: 0x00BFFF, wireframe: true });
const aboutSphere = new THREE.Mesh(aboutGeometry, aboutMaterial);
aboutScene.add(aboutSphere);
aboutCamera.position.z = 10;
function animateAboutModel() {
    requestAnimationFrame(animateAboutModel);
    aboutSphere.rotation.y += 0.005;
    aboutRenderer.render(aboutScene, aboutCamera);
}
animateAboutModel();

// Skills 3D globe with orbiting planets (inspired by GitHub solar-system)
const skillsScene = new THREE.Scene();
const skillsCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000);
const skillsRenderer = new THREE.WebGLRenderer({ alpha: true });
skillsRenderer.setSize(window.innerWidth, 600);
document.getElementById('skillsGlobe').appendChild(skillsRenderer.domElement);
const centralOrb = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFF4500 }));
skillsScene.add(centralOrb);
const orbits = [];
fetch('data/skills.json').then(res => res.json()).then(skills => {
    skills.forEach((skill, i) => {
        const planet = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00BFFF }));
        planet.position.x = Math.cos(i) * (3 + i);
        planet.position.z = Math.sin(i) * (3 + i);
        const label = new THREE.CSS2DObject(document.createElement('div'));
        label.element.textContent = skill.name;
        label.position.copy(planet.position);
        skillsScene.add(planet);
        skillsScene.add(label);
        orbits.push({ planet, label, angle: i * Math.PI / skills.length });
    });
});
skillsCamera.position.z = 20;
function animateSkillsGlobe() {
    requestAnimationFrame(animateSkillsGlobe);
    orbits.forEach(o => {
        o.angle += 0.01;
        o.planet.position.x = Math.cos(o.angle) * 5;
        o.planet.position.z = Math.sin(o.angle) * 5;
        o.label.position.copy(o.planet.position);
    });
    skillsRenderer.render(skillsScene, skillsCamera);
}
animateSkillsGlobe();

// Merge to center for skills/projects (GSAP)
function mergeToCenter(sectionId, itemsSelector, centerSelector) {
    const section = document.getElementById(sectionId);
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            const items = document.querySelectorAll(itemsSelector);
            const center = document.querySelector(centerSelector);
            items.forEach(item => {
                const clone = item.cloneNode(true);
                document.body.appendChild(clone);
                const rect = item.getBoundingClientRect();
                const centerRect = center.getBoundingClientRect();
                clone.style.position = 'fixed';
                clone.style.left = `${rect.left}px`;
                clone.style.top = `${rect.top}px`;
                item.style.opacity = 0;
                gsap.to(clone, {
                    x: centerRect.left + centerRect.width / 2 - rect.left - rect.width / 2,
                    y: centerRect.top + centerRect.height / 2 - rect.top - rect.height / 2,
                    scale: 0.2,
                    duration: 1,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        clone.remove();
                        chime.play();
                        center.classList.add('pulse');
                        setTimeout(() => center.classList.remove('pulse'), 1000);
                    }
                });
            });
            observer.disconnect();
        }
    }, { threshold: 0.5 });
    observer.observe(section);
}
mergeToCenter('skills', '.skill-node', '#fusionOrb');
mergeToCenter('projects', '.project-card', '.section-title'); // Adjust center

// Magnetic buttons (inspired by Medium)
const magneticButtons = document.querySelectorAll('.magnetic-button');
document.addEventListener('mousemove', (e) => {
    magneticButtons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x*x + y*y);
        if (dist < 100) {
            const force = (100 - dist) / 100;
            btn.style.transform = `translate(${x * force * 0.2}px, ${y * force * 0.2}px)`;
        } else {
            btn.style.transform = 'translate(0, 0)';
        }
    });
});

// Ripple click effect (canvas, inspired by CSS Script)
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
});

// Konami code (from StackOverflow)
const konami = [38,38,40,40,37,39,37,39,66,65];
let kIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[kIndex++]) {
        if (kIndex === konami.length) {
            document.getElementById('easterEggModal').style.display = 'flex';
            kIndex = 0;
        }
    } else {
        kIndex = 0;
    }
});

// Parallax
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        layer.style.transform = `translateY(${scroll * layer.dataset.speed}px)`;
    });
});

// Resize handling
window.addEventListener('resize', () => {
    cosmicCanvas.width = window.innerWidth;
    cosmicCanvas.height = window.innerHeight;
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
    // Adjust renderers
});

// Device tilt for 3D (optional, using DeviceOrientationEvent)
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
        const tiltX = e.beta / 90;
        const tiltY = e.gamma / 90;
        // Apply to avatars or models
        document.querySelectorAll('.tilt-3d').forEach(el => {
            el.style.transform = `rotateX(${tiltX * 10}deg) rotateY(${tiltY * 10}deg)`;
        });
    });
}
