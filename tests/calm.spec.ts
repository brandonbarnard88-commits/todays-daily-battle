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
    const firstText = (await page.locator('#verse-text').textContent()) || '';
    /* Accessible name is aria-label (“Show another…”); random verse may repeat—retry clicks */
    for (let i = 0; i < 8; i++) {
      await page.locator('#another-btn').click();
      const next = (await page.locator('#verse-text').textContent()) || '';
      if (next && next !== firstText) break;
    }
    await expect(page.locator('#verse-text')).not.toHaveText(firstText);
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
    const container = page.locator('#night-prayer-container');
    await expect(container).toBeVisible();
    await expect(page.locator('#night-prayer-verse')).toContainText(/lay me down in peace/i);
    await expect(page.locator('#night-prayer-ref')).toContainText('Psalm 4:8');
    await page.getByRole('button', { name: 'Copy night prayer to clipboard' }).click();
    await expect(page.locator('#night-prayer-copy')).toHaveText('Copied', { timeout: 3000 });
  });
});
