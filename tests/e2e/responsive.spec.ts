import { test, expect } from '@playwright/test';
import { PAGES } from './pages';

const WIDTHS = [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920];

test.describe('responsive layout', () => {
  test.skip(({ isMobile }) => isMobile, 'Width sweep runs once, in the desktop project.');

  for (const width of WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const offenders: string[] = [];
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 0) offenders.push(`${path} (+${overflow}px)`);
      }
      expect(offenders).toEqual([]);
    });
  }

  test('touch targets in navigation and footer are at least 44px tall on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: /menu/i }).click();
    const small = await page
      // Inline links inside sentences are exempt (WCAG 2.5.8); standalone targets are not.
      .locator('#mobile-menu a, .site-footer nav a, .footer__contact a, .footer__legal a, .footer__social a, .btn, [data-mobile-toggle]')
      .evaluateAll((els) =>
        els
          .filter((e) => e.getClientRects().length > 0)
          .map((e) => ({ text: e.textContent?.trim().slice(0, 40), h: e.getBoundingClientRect().height }))
          .filter((r) => r.h < 44),
      );
    expect(small).toEqual([]);
  });
});
