import { test, expect } from '@playwright/test';

const demoEmail = process.env.E2E_EMAIL;
const demoPassword = process.env.E2E_PASSWORD;

test.describe('Authentication smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!demoEmail || !demoPassword, 'Set E2E_EMAIL and E2E_PASSWORD to run authenticated tests.');
    await page.goto('/login');
  });

  test('demo doctor can sign in and reach the dashboard', async ({ page }) => {
    await page.locator('#login-email').fill(demoEmail!);
    await page.locator('#login-password').fill(demoPassword!);
    await page.locator('button[type="submit"]').click();

    // LoginPage navigates to the protected dashboard route (/).
    await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
  });

  test('invalid credentials are rejected', async ({ page }) => {
    await page.locator('#login-email').fill(demoEmail!);
    await page.locator('#login-password').fill(`${demoPassword}-invalid`);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/login(?:\?|$)/, { timeout: 10000 });
  });
});
