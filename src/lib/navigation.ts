/**
 * Information architecture. Navigation is organized around visitor intent,
 * not internal departments. Existing high-value URLs (/physical-therapy,
 * /schedule-a-tour, /about-us, /contact-us …) are preserved to protect SEO.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  children?: NavLink[];
}

export const SERVICE_LINKS: NavLink[] = [
  {
    label: 'Developmental Classrooms',
    href: '/classrooms',
    description: 'Learning through play, with therapy built into the day.',
  },
  {
    label: 'Speech Therapy',
    href: '/speech-therapy',
    description: 'Communication, language, feeding and social connection.',
  },
  {
    label: 'Occupational Therapy',
    href: '/occupational-therapy',
    description: 'Sensory processing, self-care and fine-motor skills.',
  },
  {
    label: 'Physical Therapy',
    href: '/physical-therapy',
    description: 'Movement, strength, balance and mobility equipment.',
  },
  {
    label: 'Nursing Care',
    href: '/nursing',
    description: 'Licensed nurses on site for children with medical needs.',
  },
];

export const PRIMARY_NAV: NavGroup[] = [
  { label: 'Our Approach', href: '/approach' },
  {
    label: 'Services',
    href: '/services',
    children: [{ label: 'How our services fit together', href: '/services' }, ...SERVICE_LINKS],
  },
  { label: 'Getting Started', href: '/getting-started' },
  { label: 'For Referral Partners', href: '/referrals' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about-us' },
];

export const UTILITY_NAV: NavLink[] = [
  { label: 'Current Families', href: '/families' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact-us' },
];

export const PRIMARY_CTA: NavLink = { label: 'Schedule a Tour', href: '/schedule-a-tour' };

export const FOOTER_NAV: { heading: string; links: NavLink[] }[] = [
  {
    heading: 'For families',
    links: [
      { label: 'Is STARS right for my child?', href: '/getting-started' },
      { label: 'Schedule a tour', href: '/schedule-a-tour' },
      { label: 'Current families', href: '/families' },
      { label: 'Frequently asked questions', href: '/faq' },
    ],
  },
  {
    heading: 'Services',
    links: [{ label: 'All services', href: '/services' }, ...SERVICE_LINKS.map(({ label, href }) => ({ label, href }))],
  },
  {
    heading: 'Organization',
    links: [
      { label: 'Our approach', href: '/approach' },
      { label: 'About STARS', href: '/about-us' },
      { label: 'For referral partners', href: '/referrals' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
];

export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Nondiscrimination statement', href: '/nondiscrimination' },
];

/** Returns true when `href` is the current page or a parent section of it. */
export function isActive(href: string, pathname: string): boolean {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/$/, '').replace(/\.html$/, '') : p);
  const current = clean(pathname);
  const target = clean(href);
  if (target === '/') return current === '/';
  if (current === target) return true;
  if (target === '/services') return SERVICE_LINKS.some((s) => s.href === current);
  return current.startsWith(`${target}/`);
}
