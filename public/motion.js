(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.getElementById('motion-toggle');
  let enabled = !reduced.matches;
  const animations = new Set();
  function sync() {
    root.dataset.motion = enabled && !document.hidden ? 'on' : 'off';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', enabled ? 'Pause all site motion' : 'Enable site motion');
    toggle.innerHTML = `<span class="motion-dot"></span> MOTION ${enabled ? 'ON' : 'OFF'}`;
    if (!enabled) animations.forEach(animation => animation.cancel());
    document.dispatchEvent(new CustomEvent('site-motion-change', { detail: { enabled } }));
  }
  toggle.addEventListener('click', () => { enabled = !enabled; sync(); });
  reduced.addEventListener('change', () => { enabled = !reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  sync();

  function reveal(element, delay = 0) {
    if (!enabled || reduced.matches || document.hidden) return;
    const animation = element.animate([
      { opacity: .15, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 700, delay, easing: 'cubic-bezier(.2,.7,.2,1)' });
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  }
  // Content is readable by default; observation adds motion, never a hidden state.
  const entrances = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target, Number(entry.target.dataset.revealDelay || 0));
      entrances.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.hero h1,.hero-copy,.artwork,.section-heading,.section-title,.topic-list,.topic-panels,.publication-intro,.publication-controls,.publication-entry,.about-layout,.footer-top,.footer-bottom').forEach((element, index) => {
    element.dataset.revealDelay = String(index < 3 ? index * 110 : 0);
    entrances.observe(element);
  });
  const loops = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.dataset.motionActive = String(entry.isIntersecting);
  }), { threshold: 0 });
  document.querySelectorAll('.ribbon,.research-figure,.about-symbol').forEach(element => loops.observe(element));

  document.addEventListener('site-content-change', event => {
    event.detail.elements.forEach((element, index) => {
      entrances.unobserve(element);
      reveal(element, Math.min(index * 35, 175));
    });
  });
  const progress = document.querySelector('.reading-progress');
  const sections = [...document.querySelectorAll('#research,#publications,#about')];
  const nav = [...document.querySelectorAll('.header nav a')];
  let frame = 0;
  function updateScroll() {
    frame = 0;
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    const current = sections.filter(section => section.getBoundingClientRect().top <= innerHeight * .4).at(-1);
    nav.forEach(link => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function queueScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll);
  new ResizeObserver(queueScroll).observe(document.body);
  updateScroll();
})();
