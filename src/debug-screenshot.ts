import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'http://localhost:3000';
  console.log(`Navigating to ${url}`);
  await page.goto(url);
  const screenshotPath = 'debug-screenshot.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to ${screenshotPath}`);
  await browser.close();
})();
