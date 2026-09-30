import { describe, expect, it } from 'vitest';
import { LEGACY_URLS, REDIRECTS, toNetlifyRedirects } from '@/lib/redirects';
import { builtRoutes } from './helpers';

const routes = builtRoutes();

describe('URL migration', () => {
  it('leaves no legacy URL without a destination', () => {
    const redirected = new Set(REDIRECTS.map((r) => r.from));
    const orphans = LEGACY_URLS.filter((u) => !routes.has(u) && !redirected.has(u));
    expect(orphans).toEqual([]);
  });

  it('never redirects a URL that is still a real page', () => {
    expect(REDIRECTS.filter((r) => routes.has(r.from)).map((r) => r.from)).toEqual([]);
  });

  it('points every redirect at a page that exists', () => {
    expect(REDIRECTS.filter((r) => !routes.has(r.to)).map((r) => r.to)).toEqual([]);
  });

  it('uses permanent redirects and has no duplicates or chains', () => {
    const froms = REDIRECTS.map((r) => r.from);
    expect(new Set(froms).size).toBe(froms.length);
    expect(REDIRECTS.every((r) => r.status === 301)).toBe(true);
    expect(REDIRECTS.filter((r) => froms.includes(r.to))).toEqual([]);
  });

  it('keeps high-value legacy URLs unchanged', () => {
    for (const u of ['/speech-therapy', '/physical-therapy', '/occupational-therapy', '/nursing', '/classrooms', '/schedule-a-tour', '/about-us', '/contact-us']) {
      expect(routes.has(u)).toBe(true);
    }
  });

  it('emits Netlify rules with and without trailing slashes', () => {
    const out = toNetlifyRedirects([{ from: '/a', to: '/b', status: 301, reason: '' }]);
    expect(out).toContain('/a  /b  301');
    expect(out).toContain('/a/  /b  301');
  });
});
