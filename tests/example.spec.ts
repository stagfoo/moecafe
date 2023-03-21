import { test, expect } from '@playwright/test';

test('download canvas', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.goto('http://localhost:3000');
  await page.waitForSelector("#record-canvas")
  await page.waitForSelector("#download-snippet")
  function logRequest(interceptedRequest) {
    console.log('A request was made:', interceptedRequest.url()),
    console.log('A request was made:', interceptedRequest)
  }
  page.on('request', logRequest);
  // A single handle.
  await page.getByRole('button', { name: 'Download' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
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
