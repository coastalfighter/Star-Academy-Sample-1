import { test, expect } from '@playwright/test';
import { PAGES } from './pages';

test.describe('links & SEO files', () => {
  test.skip(({ isMobile }) => isMobile, 'Runs once, in the desktop project.');

  test('every internal link on every page resolves', async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      hrefs.forEach((h) => seen.add(h.split('#')[0]!.split('?')[0]!));
    }
    const broken: string[] = [];
    for (const href of seen) {
      const res = await request.get(href || '/');
      if (res.status() !== 200) broken.push(`${href} → ${res.status()}`);
    }
    expect(broken).toEqual([]);
  });

  test('in-page anchors point at existing ids', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const missing = await page.locator('a[href*="#"]').evaluateAll((as) =>
        as
          .map((a) => new URL((a as HTMLAnchorElement).href))
          .filter((u) => u.pathname === location.pathname.replace(/\.html$/, '') || u.pathname === location.pathname)
          .map((u) => u.hash.slice(1))
          .filter((id) => id && !document.getElementById(id)),
      );
      expect(missing, path).toEqual([]);
    }
  });

  test('sitemap lists every indexable page and no utility pages', async ({ request }) => {
    const index = await (await request.get('/sitemap-index.xml')).text();
    const sitemapUrl = index.match(/<loc>([^<]+)<\/loc>/)![1]!;
    const xml = await (await request.get(new URL(sitemapUrl).pathname)).text();
    for (const p of PAGES) {
      expect(xml).toContain(`<loc>https://www.mystarsacademy.org${p === '/' ? '/' : p}</loc>`);
    }
    expect(xml).not.toContain('thank-you');
    expect(xml).not.toContain('404');
  });

  test('robots.txt references the sitemap and blocks the CMS', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://www.mystarsacademy.org/sitemap-index.xml');
    expect(robots).toContain('Disallow: /admin/');
  });

  test('utility pages are noindexed', async ({ page }) => {
    await page.goto('/thank-you');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
