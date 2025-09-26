document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio Loaded Successfully');

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Contact form handling (placeholder)
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your message has been sent successfully!');
    contactForm.reset();
  });
});
