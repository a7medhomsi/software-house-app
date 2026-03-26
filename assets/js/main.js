// Navbar scroll effect
const nav = document.querySelector('nav');
let navScrolled = false;
window.addEventListener('scroll', () => {
  const shouldBeScrolled = window.scrollY > 60;
  if (shouldBeScrolled === navScrolled) return;
  navScrolled = shouldBeScrolled;
  nav.style.background = shouldBeScrolled ? 'rgba(0,0,0,0.92)' : 'rgba(0,0,0,0.7)';
  nav.style.borderBottomColor = shouldBeScrolled ? '#ffffff12' : '#ffffff08';
}, { passive: true });

// Intersection observer for staggered reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.animDelay || 0;
      entry.target.style.animation = `fadeUp 0.5s ${delay}s ease both`;
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

// Spotlight border glow — card-relative coordinates
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
  });
});

['.service-card', '.process-step', '.stat-item', '.client-logo'].forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.animDelay = i * 0.05;
    observer.observe(el);
  });
});
