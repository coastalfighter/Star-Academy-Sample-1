/**
 * Gentle reveal-on-scroll. Elements with [data-reveal] fade up once.
 * Skipped entirely for users who prefer reduced motion (CSS never hides
 * them in that case) and when IntersectionObserver is unavailable.
 */
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => observer.observe(el));
}
