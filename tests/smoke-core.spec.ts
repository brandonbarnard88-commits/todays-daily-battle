import { test, expect } from '@playwright/test';

async function dismissFirstVisitIfPresent(page: import('@playwright/test').Page) {
  const btn = page.locator('#firstVisitDismiss');
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
  }
}

test.describe('core smoke (dist)', () => {
  test('home: daily battle card visible', async ({ page }) => {
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    await expect(page.locator('#verseCard')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('#heroVerse')).not.toHaveText('', { timeout: 15000 });
  });

  test('home: Hope topic shows verse cards', async ({ page }) => {
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    await page.getByRole('button', { name: 'Hope', exact: true }).click();
    /* Quick-topic “Hope” uses renderSmartResult → .smart-card; full search uses .verse-card */
    const result = page.locator('#feel-results .smart-card, #feel-results .verse-card').first();
    await expect(result).toBeVisible({ timeout: 25000 });
  });

  test('bible-tool.html loads lookup UI', async ({ page }) => {
    await page.goto('/bible-tool.html');
    await expect(page.getByRole('heading', { name: /bible tool/i })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#daily-ref')).not.toHaveText('', { timeout: 15000 });
    await expect(page.locator('#book')).toBeVisible();
  });

  test('message board shell visible', async ({ page }) => {
    await page.goto('/message.html');
    await expect(page.getByRole('heading', { name: /message board/i }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#message-list-wrap, #message-board').first()).toBeVisible();
  });
});
