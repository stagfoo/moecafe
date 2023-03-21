import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  await page.waitForSelector("#record-canvas")
  await page.waitForSelector("#download-snippet")
  page.on("console", (message) => {
      console.log(message);
  })
  page.getByRole('button', { name: 'Download' }).click()
  await page.waitForTimeout(6000*60*2);
  await testInfo.attach('canvas-video', {
    'canvas-made.webm'
  }
  await expect(page).toHaveTitle(/Moecafe/);
});
