import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES } from './pages';

test.describe('accessibility & page quality', () => {
  for (const path of PAGES) {
    test(`${path} passes axe (WCAG 2.2 A/AA) and has sound structure`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      // Audit the page at rest: transient mid-animation opacity is not a contrast failure.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      // Exactly one h1, a real title, a meta description and a canonical URL.
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/STARS Academy/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(50);
      expect(description?.length ?? 0).toBeLessThanOrEqual(160);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toMatch(/^https:\/\/www\.mystarsacademy\.org/);

      // Heading levels never skip (h2 → h4 etc.).
      const levels = await page.locator('main :is(h1,h2,h3,h4,h5,h6)').evaluateAll((els) =>
        els.filter((e) => e.getClientRects().length > 0 || e.classList.contains('visually-hidden')).map((e) => Number(e.tagName[1])),
      );
      for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);

      // Open every disclosure so hidden content is scanned too.
      await page.locator('details').evaluateAll((els) => els.forEach((d) => d.setAttribute('open', '')));

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`);
      expect(summary).toEqual([]);

      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('every image has alt text and explicit dimensions', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const bad = await page.locator('img').evaluateAll((imgs) =>
        imgs.filter((i) => !i.hasAttribute('alt') || !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.outerHTML),
      );
      expect(bad, path).toEqual([]);
    }
  });

  test('skip link moves focus to main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});
