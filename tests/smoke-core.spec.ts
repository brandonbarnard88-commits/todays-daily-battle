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
    /* Chip can sit below the fold on mobile viewports — scroll before click so the tap hits Hope, not chrome. */
    const hopeBtn = page.locator('#quickTopics .quick-topic[data-topic="hope"]');
    await hopeBtn.scrollIntoViewIfNeeded();
    await hopeBtn.click();
    /* Inline wireFeelSearch debounces (~300ms) into #feelCards .feel-verse-card; script.js may also use #feel-results .smart-card */
    await page.waitForTimeout(450);
    const result = page.locator(
      '#feel-results .smart-card, #feel-results .verse-card, #feelCards .feel-verse-card'
    ).first();
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
