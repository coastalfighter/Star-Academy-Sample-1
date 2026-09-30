import { describe, expect, it } from 'vitest';
import { FOOTER_NAV, LEGAL_NAV, PRIMARY_NAV, PRIMARY_CTA, SERVICE_LINKS, UTILITY_NAV, isActive } from '@/lib/navigation';
import { SITE } from '@/lib/site';
import { findConfirmNotes } from '@/lib/confirm';
import { builtRoutes, listFiles, readRepoFile, servicePaths } from './helpers';

const routes = builtRoutes();
const strip = (href: string) => href.split('#')[0]!.split('?')[0]!;

describe('navigation integrity', () => {
  const all = [
    ...PRIMARY_NAV.flatMap((g) => [g.href, ...(g.children ?? []).map((c) => c.href)]),
    ...UTILITY_NAV.map((l) => l.href),
    ...FOOTER_NAV.flatMap((g) => g.links.map((l) => l.href)),
    ...LEGAL_NAV.map((l) => l.href),
    PRIMARY_CTA.href,
  ];
  it.each(all)('%s resolves to a built page', (href) => {
    expect(routes.has(strip(href))).toBe(true);
  });
  it('lists every service in the services menu', () => {
    expect(SERVICE_LINKS.map((s) => s.href).sort()).toEqual(servicePaths().sort());
  });
  it('marks sections active correctly', () => {
    expect(isActive('/services', '/speech-therapy')).toBe(true);
    expect(isActive('/careers', '/careers/apply')).toBe(true);
    expect(isActive('/', '/careers')).toBe(false);
    expect(isActive('/careers', '/careers.html')).toBe(true);
  });
});

describe('content integrity', () => {
  it('only links services to services that exist', () => {
    const paths = servicePaths();
    for (const file of listFiles('src/content/services', '.md')) {
      const connects = [...readRepoFile(file).matchAll(/- path: (\S+)/g)].map((m) => m[1]!);
      expect(connects.length).toBeGreaterThan(0);
      for (const p of connects) expect(paths).toContain(p);
    }
  });

  it('keeps every internal link in page source pointing at a real page', () => {
    const broken: string[] = [];
    for (const file of [...listFiles('src/pages', '.astro'), ...listFiles('src/components', '.astro')]) {
      for (const m of readRepoFile(file).matchAll(/href="(\/[^"#?]*)/g)) {
        const href = m[1]!;
        if (href.startsWith('/brand') || href.startsWith('/og') || href.startsWith('/_')) continue;
        if (!routes.has(href.replace(/\/$/, '') || '/')) broken.push(`${file}: ${href}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('uses the verified main phone number everywhere', () => {
    const phones = new Set<string>();
    for (const file of [...listFiles('src', '.astro'), ...listFiles('src/content', '.json'), ...listFiles('src/content', '.md')]) {
      for (const m of readRepoFile(file).matchAll(/\b\d{3}-\d{3}-\d{4}\b/g)) phones.add(m[0]);
    }
    phones.delete('870-555-0123'); // example format in validation hint text
    expect([...phones].every((p) => p === SITE.phone)).toBe(true);
  });

  it('tracks client-to-confirm placeholders so nothing unverified ships unnoticed', () => {
    const notes = [...listFiles('src', '.astro'), ...listFiles('src/content', '.md'), ...listFiles('src/content', '.json')].flatMap(
      (f) => [
        ...findConfirmNotes(readRepoFile(f)),
        ...[...readRepoFile(f).matchAll(/<Confirm note="([^"]+)"/g)].map((m) => m[1]!),
      ],
    );
    // Placeholders are expected pre-launch; this guards against them silently disappearing
    // from the checklist in docs/05-client-input-needed.md.
    expect(notes.length).toBeGreaterThan(0);
  });
});
