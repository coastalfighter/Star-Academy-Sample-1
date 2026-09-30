import { test, expect } from '@playwright/test';
import { PAGES } from './pages';

test.describe('content security policy', () => {
  test.skip(({ isMobile }) => isMobile, 'Runs once, in the desktop project.');

  test('every page ships a hashed CSP and nothing violates it', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (m) => {
      if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
    });
    for (const path of PAGES) {
      await page.goto(path);
      const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
      expect(csp, path).toContain("script-src 'self' 'sha256-");
      expect(csp, path).not.toMatch(/script-src[^;]*unsafe-inline/);
      // Interactive scripts still work under the policy.
      await expect(page.locator('html')).toHaveClass(/js/);
    }
    expect(violations).toEqual([]);
  });

  test('external links that open new tabs are safe and announced', async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const unsafe = await page.locator('a[target="_blank"]').evaluateAll((as) =>
        as
          .filter((a) => !(a.getAttribute('rel') ?? '').includes('noopener') || !/new tab/i.test(a.textContent + (a.querySelector('svg')?.getAttribute('aria-label') ?? '')))
          .map((a) => a.outerHTML.slice(0, 120)),
      );
      expect(unsafe, path).toEqual([]);
    }
  });
});
