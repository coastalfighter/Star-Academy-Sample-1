/**
 * URL migration map from the Wix site (mystarsacademy.org, Sept 2026).
 *
 * Strategy: keep every existing URL that still describes its content
 * (all service pages, /about-us, /contact-us, /schedule-a-tour) so their
 * search equity is untouched; 301 the rest to the page that now answers
 * the same need. Nothing from the old sitemap is left to 404.
 */

export interface Redirect {
  from: string;
  to: string;
  status: 301 | 302;
  reason: string;
}

/** Every URL listed in the legacy Wix pages-sitemap.xml. */
export const LEGACY_URLS = [
  '/',
  '/enroll-now',
  '/contact-us',
  '/apply-now',
  '/nursing',
  '/occupational-therapy',
  '/classrooms',
  '/schedule-a-tour',
  '/walk',
  '/what-we-do',
  '/general-8',
  '/speech-therapy',
  '/about-us',
  '/physical-therapy',
] as const;

export const REDIRECTS: Redirect[] = [
  { from: '/enroll-now', to: '/getting-started', status: 301, reason: 'Enrollment is now explained before asking families to commit.' },
  { from: '/what-we-do', to: '/services', status: 301, reason: 'Services hub replaces the old overview.' },
  { from: '/general-8', to: '/careers', status: 301, reason: 'Wix auto-generated slug; careers now has a real URL.' },
  { from: '/apply-now', to: '/careers/apply', status: 301, reason: 'Application lives with careers (avoids confusion with enrollment).' },
  { from: '/walk', to: '/families', status: 301, reason: 'Empty "Videos" page; family resources now live on /families.' },
  // Friendly aliases for print materials, voicemail and word of mouth.
  { from: '/contact', to: '/contact-us', status: 301, reason: 'Alias' },
  { from: '/about', to: '/about-us', status: 301, reason: 'Alias' },
  { from: '/tour', to: '/schedule-a-tour', status: 301, reason: 'Alias' },
  { from: '/enroll', to: '/getting-started', status: 301, reason: 'Alias' },
  { from: '/jobs', to: '/careers', status: 301, reason: 'Alias' },
  { from: '/refer', to: '/referrals', status: 301, reason: 'Alias' },
  { from: '/referral', to: '/referrals', status: 301, reason: 'Alias' },
  { from: '/speech', to: '/speech-therapy', status: 301, reason: 'Alias' },
];

/** Netlify `_redirects` file format. Each rule is emitted with and without a trailing slash. */
export function toNetlifyRedirects(rules: Redirect[] = REDIRECTS): string {
  const lines = ['# Generated at build time from src/lib/redirects.ts — edit that file, not this one.'];
  for (const r of rules) {
    lines.push(`${r.from}  ${r.to}  ${r.status}`);
    lines.push(`${r.from}/  ${r.to}  ${r.status}`);
  }
  return `${lines.join('\n')}\n`;
}
