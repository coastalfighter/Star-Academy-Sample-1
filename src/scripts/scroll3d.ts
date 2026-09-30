/**
 * Scroll-driven 3D engine.
 *
 * Elements with [data-3d] receive CSS custom properties describing how far
 * they are through the viewport; CSS turns those numbers into perspective
 * transforms. One passive scroll listener, one rAF per frame, and only
 * elements currently near the viewport are measured.
 *
 *   --pe  entry progress: 0 when the element's top reaches the bottom of the
 *         viewport, 1 once its top is 35% up the screen (settled).
 *   --p   pass-through progress: 0 entering at the bottom → 1 leaving the top.
 *   --px  exit progress (data-3d-track="exit"): 0 at rest → 1 scrolled away.
 *   --ps  sticky progress (data-3d-track="sticky"): 0 → 1 across a tall
 *         container whose child is position: sticky.
 *
 * Nothing runs for visitors who prefer reduced motion; without the
 * `has-3d` class every element renders in its final, static state.
 */

type Updater = (el: HTMLElement, rect: DOMRect, vh: number) => void;

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const active = new Set<HTMLElement>();
const custom = new Map<HTMLElement, Updater>();
let queued = false;

function measure(): void {
  queued = false;
  const vh = window.innerHeight;
  for (const el of active) {
    const r = el.getBoundingClientRect();
    const track = el.dataset['3dTrack'];
    if (track === 'sticky') {
      const span = Math.max(1, r.height - vh);
      el.style.setProperty('--ps', clamp(-r.top / span).toFixed(4));
    } else if (track === 'exit') {
      el.style.setProperty('--px', clamp(-r.top / Math.max(1, r.height * 0.9)).toFixed(4));
    } else {
      el.style.setProperty('--pe', clamp((vh - r.top) / (vh * 0.65)).toFixed(4));
      el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
    }
    custom.get(el)?.(el, r, vh);
  }
}

function schedule(): void {
  if (queued) return;
  queued = true;
  requestAnimationFrame(measure);
}

/** Register extra per-frame logic for an element (e.g. the 3D care ring). */
export function onScroll3d(el: HTMLElement, fn: Updater): void {
  custom.set(el, fn);
}

export function initScroll3d(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll<HTMLElement>('[data-3d]');
  if (!els.length) return;
  document.documentElement.classList.add('has-3d');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) active.add(el);
        else active.delete(el);
      }
      schedule();
    },
    { rootMargin: '25% 0px 25% 0px' },
  );
  els.forEach((el) => io.observe(el));

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  schedule();

  // Respect a mid-visit change to reduced motion immediately.
  reduced.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.remove('has-3d');
      window.removeEventListener('scroll', schedule);
      io.disconnect();
    }
  });
}
