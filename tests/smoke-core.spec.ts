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
    await page.addInitScript(() => {
      try {
        localStorage.setItem('tdb_feel_category_auto_heavy_v1', '1');
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    /* Progressive disclosure: open steadiness band, then tap Hope (second hope chip is the labeled Hope). */
    const steadyCard = page.locator('#quickTopics .feel-category-card[data-feel-band="steady"]');
    if (await steadyCard.count()) {
      await steadyCard.first().scrollIntoViewIfNeeded();
      await steadyCard.first().click();
      await page.waitForTimeout(200);
    }
    const hopeBtn = page.locator('#quickTopics .quick-topic[data-topic="hope"]').last();
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
