import { test, expect, type Page } from '@playwright/test';

async function mockEndpoint(page: Page, status = 200) {
  const posts: string[] = [];
  await page.route('**/', async (route) => {
    if (route.request().method() === 'POST') {
      posts.push(route.request().postData() ?? '');
      await route.fulfill({ status, body: 'ok' });
    } else {
      await route.continue();
    }
  });
  return posts;
}

test.describe('forms', () => {
  test('tour form: shows an error summary, links to fields, then succeeds', async ({ page }) => {
    const posts = await mockEndpoint(page);
    await page.goto('/schedule-a-tour');
    const form = page.locator('form[name="tour"]');

    await form.getByRole('button', { name: 'Request my tour' }).click();
    const summary = form.locator('[data-summary]');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Please fix 3 problems');
    await expect(form.getByLabel('Your name')).toHaveAttribute('aria-invalid', 'true');

    await summary.getByRole('link', { name: /email/i }).click();
    await expect(form.getByLabel('Email')).toBeFocused();

    await form.getByLabel('Your name').fill('Jordan Parent');
    await form.getByLabel('Phone').fill('(870) 555 0100');
    await form.getByLabel('Email').fill('jordan@example.com');
    await page.waitForTimeout(2600); // realistic fill time (spam heuristic)
    await form.getByRole('button', { name: 'Request my tour' }).click();

    const success = page.locator('[data-success]').first();
    await expect(success).toBeVisible();
    await expect(success).toBeFocused();
    await expect(success).toContainText('your tour request is in');
    expect(posts).toHaveLength(1);
    expect(posts[0]).toContain('form-name=tour');
    expect(posts[0]).toContain('phone=870-555-0100');
  });

  test('inline validation explains how to fix invalid input', async ({ page }) => {
    await page.goto('/contact-us');
    const email = page.locator('form[name="contact"]').getByLabel('Email');
    await email.fill('not-an-email');
    await email.blur();
    await expect(page.locator('#contact-email-error')).toHaveText(/name@example\.com/);
    await email.fill('ok@example.com');
    await expect(page.locator('#contact-email-error')).toBeHidden();
  });

  test('honeypot submissions are silently discarded', async ({ page }) => {
    const posts = await mockEndpoint(page);
    await page.goto('/contact-us');
    const form = page.locator('form[name="contact"]');
    await form.getByLabel('Your name').fill('Bot');
    await form.getByLabel('Email').fill('bot@example.com');
    await form.getByLabel('What is this about?').selectOption({ index: 1 });
    await form.getByRole('textbox', { name: 'Message' }).fill('spam');
    await form.locator('input[name="company_website"]').evaluate((el: HTMLInputElement) => (el.value = 'http://spam'));
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-success]')).toBeVisible();
    expect(posts).toHaveLength(0);
  });

  test('network failure keeps the form and offers the phone number', async ({ page }) => {
    await mockEndpoint(page, 500);
    await page.goto('/contact-us');
    const form = page.locator('form[name="contact"]');
    await form.getByLabel('Your name').fill('Sam');
    await form.getByLabel('Email').fill('sam@example.com');
    await form.getByLabel('What is this about?').selectOption({ index: 1 });
    await form.getByRole('textbox', { name: 'Message' }).fill('Hello');
    await page.waitForTimeout(2600);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.locator('[data-status]')).toContainText('870-793-3200');
    await expect(form).toBeVisible();
  });

  test('referral form warns against sending protected health information', async ({ page }) => {
    await page.goto('/referrals');
    await expect(page.locator('form[name="referral-contact"]')).toContainText('Do not include patient names');
    await expect(page.locator('form[name="referral-contact"] [name*="patient"], form[name="referral-contact"] [name*="dob"]')).toHaveCount(0);
  });

  test('career form preselects the position from a job listing', async ({ page }) => {
    await page.goto('/careers');
    await page.getByRole('link', { name: 'Apply for Van Driver' }).click();
    await expect(page.locator('select[name="position"]')).toHaveValue('Van Driver');
  });

  test('every form is registered for the form host with a honeypot', async ({ page }) => {
    for (const path of ['/schedule-a-tour', '/getting-started', '/referrals', '/contact-us', '/careers/apply']) {
      await page.goto(path);
      const forms = page.locator('form[data-stars-form]');
      await expect(forms).toHaveCount(1);
      await expect(forms).toHaveAttribute('data-netlify', 'true');
      await expect(forms).toHaveAttribute('netlify-honeypot', 'company_website');
      await expect(forms.locator('input[name="form-name"]')).toHaveCount(1);
    }
  });
});
