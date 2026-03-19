import { test, expect } from '@playwright/test';

test.describe('calm.html', () => {
  test('loads verse on quick-tap', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Need peace' }).click();
    const verseContainer = page.locator('#verse-container');
    await expect(verseContainer).toBeVisible();
    await expect(page.locator('#verse-text')).not.toHaveText('');
    await expect(page.locator('#verse-ref')).not.toHaveText('');
  });

  test('shows categories and verse flow', async ({ page }) => {
    await page.goto('/calm.html');
    await expect(page.getByRole('group', { name: 'Choose a feeling' })).toBeVisible();
    await page.getByRole('button', { name: 'Anxious or afraid' }).click();
    await expect(page.locator('#verse-container')).toBeVisible();
    await page.getByRole('button', { name: 'Another in this category' }).click();
    await expect(page.locator('#verse-text')).not.toHaveText('');
  });

  test('copy button works', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Need peace' }).click();
    await expect(page.locator('#verse-container')).toBeVisible();
    await page.getByRole('button', { name: 'Copy verse to clipboard' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible({ timeout: 2000 });
  });

  test('Night Prayer shows Psalm 4:8 and copy works', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: 'Night prayer with Psalm 4:8' }).click();
    const container = page.locator('#night-prayer-container');
    await expect(container).toBeVisible();
    await expect(page.locator('#night-prayer-verse')).toContainText(/lay me down in peace/i);
    await expect(page.locator('#night-prayer-ref')).toContainText('Psalm 4:8');
    await page.getByRole('button', { name: 'Copy night prayer to clipboard' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible({ timeout: 2000 });
  });
});
