import { test, expect, type Page } from '@playwright/test';

// Ensure clean state before each page load: no saved prayers, skip welcome overlay
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('tdb_prayers_v1');
    sessionStorage.setItem('tdb_welcome_intro_seen_session', '1');
  });
});

async function waitForPrayerWallSeeds(page: Page) {
  await page.goto('/#prayer-wall', { waitUntil: 'load' });
  const skipBtn = page.locator('#welcome-intro-skip');
  if (await skipBtn.isVisible().catch(() => false)) await skipBtn.click();
  // Wait for list container, then for seeds to render (script.js populates when localStorage empty)
  await page.waitForSelector('#prayer-wall-list', { state: 'attached', timeout: 10000 });
  await page.waitForFunction(
    () => document.querySelectorAll('#prayer-wall-list li.prayer-wall-item').length >= 7,
    { timeout: 25000 }
  );
}

test.describe('Prayer Wall seeds', () => {
  test('seeds render when localStorage is empty', async ({ page }) => {
    await waitForPrayerWallSeeds(page);
    const items = page.locator('#prayer-wall-list li.prayer-wall-item');
    await expect(items).toHaveCount(7);
    await expect(page.locator('#prayer-wall-list').getByText(/heal our land|Thank you for this day|Guide my steps/i)).toBeVisible();
    await expect(page.locator('#prayerTodayLabel')).toContainText('0 prayers today');
  });

  test('seeds persist offline after reload', async ({ page, context }) => {
    await waitForPrayerWallSeeds(page);
    await context.setOffline(true);
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(
      () => document.querySelectorAll('#prayer-wall-list li.prayer-wall-item').length >= 7,
      { timeout: 15000 }
    );
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(7);
  });

  test('posting a prayer adds it to the list', async ({ page }) => {
    await waitForPrayerWallSeeds(page);
    const uniqueText = `E2E test prayer ${Date.now()}`;
    await page.getByLabel(/Add a prayer to the wall/i).fill(uniqueText);
    await page.getByRole('button', { name: /Post prayer to wall/i }).click();
    // When user has items, seeds are replaced; list shows only user prayers
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(1);
    await expect(page.locator('#prayer-wall-list')).toContainText(uniqueText);
    // Input cleared after post
    await expect(page.getByLabel(/Add a prayer to the wall/i)).toHaveValue('');
  });
});
