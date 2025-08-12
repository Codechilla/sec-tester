import { test, expect } from '@playwright/test';

test('App loads and displays core layout elements', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  // Verify header exists
  await expect(page.locator('header')).toBeVisible();
  // Verify left sidebar navigation
  await expect(page.locator('aside').first()).toBeVisible();
  // Verify secondary navigation bar exists and is visible
  const navBars = page.locator('nav');
  await expect(navBars).toHaveCount(2);
  await expect(navBars.nth(1)).toBeVisible();
  // Verify AI Assistant panel on the right
  const panels = page.locator('aside');
  await expect(panels.nth(1)).toBeVisible();
});
