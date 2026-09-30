/**
 * Header behavior: desktop disclosure menu, mobile menu dialog-like panel,
 * scroll state. Pure progressive enhancement — every nav destination is a
 * normal link that works without JavaScript (the Services trigger's panel
 * items are duplicated in the footer and the /services hub).
 */

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function initDisclosureMenus(): void {
  const menus = document.querySelectorAll<HTMLElement>('[data-menu]');
  menus.forEach((menu) => {
    const trigger = menu.querySelector<HTMLButtonElement>('[data-menu-trigger]');
    const panel = menu.querySelector<HTMLElement>('[data-menu-panel]');
    if (!trigger || !panel) return;

    const setOpen = (open: boolean) => {
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };

    trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        trigger.focus();
      }
    });

    menu.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && !menu.contains(next)) setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target as Node)) setOpen(false);
    });
  });
}

function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-panel]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  const label = document.querySelector<HTMLElement>('[data-mobile-label]');
  if (!toggle || !panel || !header) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open: boolean, returnFocus = true) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
    panel.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      panel.style.setProperty('--mobile-top', `${header.getBoundingClientRect().bottom}px`);
      panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    // Keep focus within the toggle + panel while the menu is open.
    const items = [toggle, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0]!;
    const last = items[items.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Close if the viewport grows into desktop layout while open.
  window.matchMedia('(min-width: 72em)').addEventListener('change', (e) => {
    if (e.matches && isOpen()) setOpen(false, false);
  });
}

function initScrollState(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const sentinel = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  sentinel();
  window.addEventListener('scroll', sentinel, { passive: true });
}

export function initNavigation(): void {
  initDisclosureMenus();
  initMobileMenu();
  initScrollState();
}
