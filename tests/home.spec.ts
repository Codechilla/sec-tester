import { test, expect } from '@playwright/test';

test('Homepage layout sanity check', async ({ page }) => {
  await page.goto('/');
  // Header should contain platform title
  await expect(page.locator('h1')).toContainText('SEC-TESTER');
  // Sidebar should show COMMAND CENTER button
  await expect(page.getByRole('button', { name: 'COMMAND CENTER' })).toBeVisible();
  // AI Assistant panel title
  await expect(page.locator('aside').last()).toContainText('AI Assistant');
});
