document.addEventListener("DOMContentLoaded", () => {
  loadSkills();
  loadProjects();
  initContactForm();
});

// Load Skills
async function loadSkills() {
  const res = await fetch('data/skills.json');
  const skills = await res.json();

  const skillsList = document.getElementById('skills-list');
  skills.forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill-badge';
    div.textContent = `${skill.name} (${skill.level})`;
    skillsList.appendChild(div);
  });
}

// Load Projects
async function loadProjects() {
  const res = await fetch('data/projects.json');
  const projects = await res.json();

  const gallery = document.getElementById('projects-gallery');

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = project.title;

    const title = document.createElement('h3');
    title.textContent = project.title;

    const desc = document.createElement('p');
    desc.textContent = project.description;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    gallery.appendChild(card);
  });
}

// Contact Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = "Message sent successfully!";
    status.style.color = "#00f5d4";
    form.reset();
  });
}
