// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  loadSkills();
  loadProjects();
});

async function loadSkills() {
  const res = await fetch('data/skills.json');
  const skills = await res.json();
  const skillsGrid = document.getElementById('skills-grid');

  skills.forEach(skill => {
    const div = document.createElement('div');
    div.classList.add('skill-item');
    div.textContent = skill.name;
    skillsGrid.appendChild(div);
  });
}

async function loadProjects() {
  const res = await fetch('data/projects.json');
  const projects = await res.json();
  const projectsGrid = document.getElementById('projects-grid');

  projects.forEach(project => {
    const div = document.createElement('div');
    div.classList.add('project-card');
    div.innerHTML = `
      <img src="${project.image}" alt="${project.name}">
      <h3>${project.name}</h3>
      <p>${project.description}</p>
    `;
    projectsGrid.appendChild(div);
  });
}
