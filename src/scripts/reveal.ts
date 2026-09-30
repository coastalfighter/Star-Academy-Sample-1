/**
 * Scroll-triggered motion. Elements with [data-reveal] ease in once; italic
 * accents in h2 headings draw their highlight; [data-count] numbers count
 * up from zero. Skipped entirely when the visitor prefers reduced motion or
 * IntersectionObserver is unavailable — everything is simply shown.
 */

function countUp(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const duration = 1400;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initReveal(): void {
  document.documentElement.setAttribute('data-motion', 'ready');
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const accents = document.querySelectorAll<HTMLElement>('h2 em');
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduced) {
    items.forEach((el) => el.classList.add('is-visible'));
    accents.forEach((el) => el.classList.add('is-drawn'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.matches('h2 em')) el.classList.add('is-drawn');
        else if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );

  items.forEach((el) => observer.observe(el));
  accents.forEach((el) => observer.observe(el));
  counters.forEach((el) => {
    el.textContent = '0';
    observer.observe(el);
  });
}
