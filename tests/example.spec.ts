import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(10000);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
  ]);
  const path = await download.suggestedFilename() as string;
  await download.saveAs(path)
  await testInfo.attach('canvas-video', {
    path
  }
  );
  await page.waitForTimeout(60000);
  await expect(page).toHaveTitle(/Moecafe/);
});
