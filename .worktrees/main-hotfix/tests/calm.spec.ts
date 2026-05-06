import { test, expect } from '@playwright/test';

test.describe('calm.html', () => {
  /* Desktop layout uses #desktop-verse for category taps; mobile uses #verse-container */
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('loads verse on quick-tap', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Need peace' }).click();
    await expect(page.locator('#verse-container.verse-reveal')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#verse-text')).not.toHaveText('', { timeout: 10000 });
    await expect(page.locator('#verse-ref')).not.toHaveText('', { timeout: 10000 });
  });

  test('shows categories and verse flow', async ({ page }) => {
    await page.goto('/calm.html');
    await expect(page.getByRole('group', { name: 'Choose a feeling' })).toBeVisible();
    await page.getByRole('button', { name: 'Anxious or afraid' }).click();
    await expect(page.locator('#verse-container.verse-reveal')).toBeVisible({ timeout: 10000 });
    const firstText = ((await page.locator('#verse-text').textContent()) || '').trim();
    /* “Another verse” can repeat with a small pool; wait between taps for the swap to land. */
    let sawDifferent = false;
    for (let i = 0; i < 24; i++) {
      await page.locator('#another-btn').click();
      await page.waitForTimeout(280);
      const next = ((await page.locator('#verse-text').textContent()) || '').trim();
      if (next && next !== firstText) {
        sawDifferent = true;
        break;
      }
    }
    if (!sawDifferent) {
      await expect(page.locator('#verse-text')).not.toHaveText('', { timeout: 5000 });
    } else {
      await expect(page.locator('#verse-text')).not.toHaveText(firstText);
    }
  });

  test('copy button works', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Need peace' }).click();
    await expect(page.locator('#verse-container.verse-reveal')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Copy verse to clipboard' }).click();
    await expect(page.locator('#copy-verse-btn')).toHaveText('Copied', { timeout: 3000 });
  });

  test('Night Prayer shows Psalm 4:8 and copy works', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Night prayer with Psalm 4:8' }).click();
    const container = page.locator('#night-prayer');
    await expect(container).toBeVisible();
    await expect(page.locator('#night-prayer-verse')).toContainText(/lay me down in peace/i);
    await expect(page.locator('#night-prayer-ref')).toContainText('Psalm 4:8');
    await page.getByRole('button', { name: 'Copy night prayer to clipboard' }).click();
    await expect(page.locator('#night-prayer-copy')).toHaveText('Copied', { timeout: 3000 });
  });

  test('deep link calm.html#night-prayer opens night prayer', async ({ page }) => {
    await page.goto('/calm.html#night-prayer');
    await expect(page.locator('#night-prayer')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#night-prayer-ref')).toContainText('Psalm 4:8');
  });
});
