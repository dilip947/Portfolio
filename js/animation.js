document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".hero-title", { y: -50, opacity: 0, duration: 1 });
  gsap.from(".hero-tagline", { y: 50, opacity: 0, delay: 0.3, duration: 1 });
  gsap.from(".floating-nav a", { opacity: 0, stagger: 0.2, delay: 0.5 });
});
