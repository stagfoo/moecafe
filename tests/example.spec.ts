import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  await page.waitForSelector("#record-canvas")
  await page.waitForSelector("#download-snippet")
  // A single handle.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click()
  ]);
  const path = await download.suggestedFilename() as string;
  await download.saveAs(path)
  await testInfo.attach('canvas-video', {
    path
  }
  );
  await page.waitForTimeout(1000);
  await expect(page).toHaveTitle(/Moecafe/);
});
