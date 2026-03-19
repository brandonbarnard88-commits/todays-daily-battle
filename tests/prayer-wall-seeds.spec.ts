import { test, expect } from '@playwright/test';

test.describe('Prayer Wall seeds', () => {
  test('seeds render when localStorage is empty', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('tdb_prayers_v1'));
    await page.reload({ waitUntil: 'load' });
    await page.locator('#prayer-wall').scrollIntoViewIfNeeded();
    await page.waitForSelector('#prayer-wall-list li.prayer-wall-item', { state: 'attached', timeout: 10000 });
    const items = page.locator('#prayer-wall-list li.prayer-wall-item');
    await expect(items).toHaveCount(7);
    await expect(page.locator('#prayer-wall-list').getByText(/heal our land|Thank you for this day|Guide my steps/i)).toBeVisible();
    await expect(page.locator('#prayerTodayLabel')).toContainText('0 prayers today');
  });

  test('seeds persist offline after reload', async ({ page, context }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('tdb_prayers_v1'));
    await page.reload({ waitUntil: 'load' });
    await page.locator('#prayer-wall').scrollIntoViewIfNeeded();
    await page.waitForSelector('#prayer-wall-list li.prayer-wall-item', { state: 'attached', timeout: 10000 });
    await context.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    await page.locator('#prayer-wall').scrollIntoViewIfNeeded();
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(7);
  });
});
