import { test, expect } from '@playwright/test';

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only');

  test('services menu opens with keyboard and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Services' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const menu = page.locator('#menu-services');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link')).toHaveCount(6);
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('marks the current section', async ({ page }) => {
    await page.goto('/speech-therapy');
    await expect(page.getByRole('button', { name: 'Services' })).toHaveClass(/is-active/);
    await page.goto('/careers');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Careers' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile only');

  test('opens, traps focus, and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-mobile-toggle]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator('#mobile-menu');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('link', { name: 'Speech Therapy' })).toBeVisible();

    // Focus stays inside the menu when tabbing past the last item.
    for (let i = 0; i < 40; i++) await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      () => document.getElementById('mobile-menu')!.contains(document.activeElement) || document.activeElement?.hasAttribute('data-mobile-toggle'),
    );
    expect(inside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('navigates to a page from the menu', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-mobile-toggle]').click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Getting Started' }).click();
    await expect(page).toHaveURL(/\/getting-started/);
    await expect(page.locator('h1')).toContainText('Could STARS help your child?');
  });
});
