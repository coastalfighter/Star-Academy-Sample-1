import { test, expect } from '@playwright/test';

test.describe('scroll-driven 3D', () => {
  test.skip(({ isMobile }) => isMobile, 'Runs once, in the desktop project.');

  test('enables 3D and turns the care wheel with scroll', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/has-3d/);

    const ring = page.locator('[data-ring]');
    const { top, height } = await ring.evaluate((el) => ({
      top: el.getBoundingClientRect().top + window.scrollY,
      height: (el as HTMLElement).offsetHeight,
    }));
    expect(height).toBeGreaterThan(await page.evaluate(() => window.innerHeight * 2));

    await page.evaluate((y) => window.scrollTo(0, y), top + 10);
    await expect(page.locator('[data-ring-card].is-front')).toContainText('Developmental Classrooms');

    await page.evaluate(([y, h]) => window.scrollTo(0, y + (h - window.innerHeight) * 0.97), [top, height]);
    await expect(page.locator('[data-ring-card].is-front')).toContainText('Nursing Care');
    // Every service remains a real, reachable link.
    await expect(ring.locator('[data-ring-card] a')).toHaveCount(5);
  });

  test('cards settle to their final state once scrolled into view', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const card = page.locator('.what__part').first();
    await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 250));
    await expect
      .poll(async () => Number(await card.evaluate((el) => getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.95);
  });

  test('hero pins and plays its scroll story on desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const track = page.locator('.hero-track');
    const height = await track.evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(height).toBeGreaterThan(900 * 1.5);

    const chip = page.locator('.hero .orbit li').first();
    await page.evaluate((h) => window.scrollTo(0, (h - window.innerHeight) * 0.9), height);
    await expect
      .poll(async () => Number(await chip.evaluate((el) => getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.9);
    // Headline stays readable (not faded to look disabled) at the end of the story.
    const text = page.locator('.hero .depth-text');
    expect(Number(await text.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.65);
  });

  test('cards tilt toward the pointer on hover', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/getting-started');
    const card = page.locator('.criteria [data-tilt]').first();
    await card.scrollIntoViewIfNeeded();
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2);
    await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.1);
    await expect(card).toHaveClass(/is-tilting/);
    await expect
      .poll(async () => card.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--tilt-y')))
      .not.toBe('');
  });

  test('reduced motion gets a calm static layout with nothing hidden', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/has-3d/);
    const ringHeight = await page.locator('[data-ring]').evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(ringHeight).toBeLessThan(await page.evaluate(() => window.innerHeight * 2));
    const faded = await page.locator('[data-3d]').evaluateAll((els) =>
      els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length,
    );
    expect(faded).toBe(0);
  });
});
