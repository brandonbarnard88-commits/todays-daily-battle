import { test, expect } from '@playwright/test';

test.describe('Ask the Word porch', () => {
  test('first screen is title, search, and open feelings', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ask.html');
    await expect(page.getByRole('heading', { name: 'Ask the Word' })).toBeVisible();
    await expect(page.getByText('In your own words')).toBeVisible();
    await expect(page.locator('#feel-search')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restless' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'When it feels heavy' })).toBeVisible();
    await expect(page.getByText('Example questions')).toHaveCount(0);
    await page.screenshot({ path: 'test-results/ask-porch-mobile.png', fullPage: false });
  });

  test('tapping a feeling still searches', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ask.html');
    await page.getByRole('button', { name: 'Restless' }).click();
    await expect(page.locator('#feelCards.has-results')).toBeVisible({ timeout: 15000 });
  });

  test('desktop first screen keeps the same porch', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ask.html');
    await expect(page.getByRole('heading', { name: 'Ask the Word' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Forgiveness' })).toBeVisible();
    await page.screenshot({ path: 'test-results/ask-porch-desktop.png', fullPage: false });
  });
});
