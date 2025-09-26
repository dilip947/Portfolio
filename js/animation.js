// js/animation.js
gsap.registerPlugin(ScrollTrigger);

// Hero animation
gsap.from(".profile-pic", { duration: 1, scale: 0, ease: "back" });
gsap.from(".hero-content h1", { duration: 1, y: 50, opacity: 0, delay: 0.5 });
gsap.from(".hero-content p", { duration: 1, y: 50, opacity: 0, delay: 0.7 });
gsap.from(".btn", { duration: 1, y: 20, opacity: 0, delay: 1 });

// Scroll animations
gsap.from("#skills h2", {
  scrollTrigger: "#skills",
  duration: 1,
  y: -50,
  opacity: 0
});

gsap.from(".skill-item", {
  scrollTrigger: "#skills",
  duration: 1,
  opacity: 0,
  y: 20,
  stagger: 0.2
});

gsap.from("#projects h2", {
  scrollTrigger: "#projects",
  duration: 1,
  y: -50,
  opacity: 0
});

gsap.from(".project-card", {
  scrollTrigger: "#projects",
  duration: 1,
  opacity: 0,
  y: 20,
  stagger: 0.3
});
