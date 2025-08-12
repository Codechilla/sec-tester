import { test, expect } from '@playwright/test';

test('homepage loads and shows command center header', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('SEC-TESTER: CYBERPUNK SECURITY ASSESSMENT PLATFORM');
});
