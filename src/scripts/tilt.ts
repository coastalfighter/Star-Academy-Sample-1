/**
 * Pointer-following 3D tilt for [data-tilt] cards and photos.
 * Writes --tilt-x / --tilt-y (degrees) and --gx / --gy (glare position);
 * CSS composes them with any scroll-driven transform, so the two effects
 * never overwrite each other. Mouse/trackpad only, never with reduced motion.
 */
const MAX = 7;

export function initTilt(): void {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduced.matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--tilt-x', `${((0.5 - y) * MAX).toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${((x - 0.5) * MAX).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      el.classList.remove('is-tilting');
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    });
  });
}
