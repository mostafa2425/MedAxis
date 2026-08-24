import { test, expect } from '@playwright/test';

const demoEmail = process.env.E2E_EMAIL;
const demoPassword = process.env.E2E_PASSWORD;

test.describe('Authentication smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!demoEmail || !demoPassword, 'Set E2E_EMAIL and E2E_PASSWORD to run authenticated tests.');
    await page.goto('/login');
  });

  test('demo doctor can sign in and reach the dashboard', async ({ page }) => {
    await page.getByLabel(/email/i).fill(demoEmail!);
    await page.getByLabel(/password/i).fill(demoPassword!);
    await page.getByRole('button', { name: /sign in|login/i }).click();

    await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 15000 });
    await expect(page).toHaveURL(/dashboard|patients/i, { timeout: 15000 });
  });

  test('invalid credentials are rejected', async ({ page }) => {
    await page.getByLabel(/email/i).fill(demoEmail!);
    await page.getByLabel(/password/i).fill(`${demoPassword}-invalid`);
    await page.getByRole('button', { name: /sign in|login/i }).click();

    await expect(page).toHaveURL(/\/login(?:\?|$)/, { timeout: 10000 });
    await expect(page.getByText(/invalid|incorrect|failed|credentials/i).first()).toBeVisible({ timeout: 10000 });
  });
});
