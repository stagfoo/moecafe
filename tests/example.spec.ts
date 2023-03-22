import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  page.on("console", (message) => {
    console.log(message);
  })
  await page.waitForSelector("#record-canvas")
  await page.waitForSelector("#download-snippet")
  await page.evaluate(token => {
    await fetchPosts()
    console.log(posts)
  })
  await page.waitForLoadState('networkidle')
  await page.evaluate(token => {
    startVideo()
  })
  await page.waitForTimeout(6000*60*2);
  await expect(page).toHaveTitle(/Moecafe/);
});
