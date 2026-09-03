import { test, expect } from '@playwright/test';

/**
 * Cold first load: empty storage. The three-door gate must paint.
 * Other specs seed tdb-tour-seen, which is the returning skip path.
 */
test.describe('cold first visit', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Home shows How much room do you have? with empty storage', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e2) {}
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-tdb-home-experience', 'first', { timeout: 20000 });
    const door = page.locator('#tdbCapacityDoor');
    await expect(door).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'How much room do you have?' })).toBeVisible();
    await expect(page.locator('#tdbCapacityTooMuch')).toBeVisible();
    await expect(page.locator('#tdbCapacityOneVerse')).toBeVisible();
    await expect(page.locator('#tdbCapacityLittleMore')).toBeVisible();
    const returning = await page.evaluate(() => {
      try {
        return localStorage.getItem('has_visited_porch') === '1';
      } catch (e) {
        return false;
      }
    });
    expect(returning).toBe(false);
  });

  test('Plans first paint has no privacy cookie bar', async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e2) {}
    });
    await page.goto('/plans.html');
    await expect(page.getByRole('heading', { name: 'What are you carrying?' })).toBeVisible({ timeout: 20000 });
    const cookie = page.locator('#tdb-cookie-notice');
    if (await cookie.count()) {
      await expect(cookie).toBeHidden();
    }
  });
});
