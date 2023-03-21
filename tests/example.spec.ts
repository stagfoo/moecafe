import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  // wait for 1 second
  await page.waitForTimeout(500);
  await page.click('#download-snippet')
  const [download] = await Promise.all([
    page.waitForEvent('download'), // wait for download to start
  ]);
  // wait for download to complete
  const path = await download.suggestedFilename() as string;
  await download.saveAs(path)
  console.log(path);
  await testInfo.attach('canvas-video', {
    path
  }
  );
  await page.waitForTimeout(60000);
  await expect(page).toHaveTitle(/Moecafe/);
});
