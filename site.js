// Content stays visible without JavaScript; entering the viewport only adds motion.
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-reveal');
      reveals.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .benefit, .reason, .portfolio-grid figure, .studio-statement > *, .quote-copy').forEach(element => reveals.observe(element));
}
