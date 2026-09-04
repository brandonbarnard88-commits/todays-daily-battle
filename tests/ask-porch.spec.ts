import { test, expect } from '@playwright/test';

test.describe('Ask the Word porch', () => {
  test('first screen is title, search, and open feelings', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ask.html');
    await expect(page.getByRole('heading', { name: 'Ask the Word' })).toBeVisible();
    await expect(page.getByText('In your own words')).toBeVisible();
    await expect(page.locator('#feel-search')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restless' })).toBeVisible();
    await expect(page.locator('.quick-topic[data-topic="anxiety"] span[aria-hidden="true"]')).toHaveText('🌊');
    await expect(page.locator('.quick-topic[data-topic="prayer"] span[aria-hidden="true"]')).toHaveText('🙏');
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

  test('a Bible question returns an answer and verses', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ask.html');
    await page.locator('#feel-search').fill('who is jesus');
    await page.locator('#feel-search-btn').click();
    await expect(page.locator('#homeQaAnswer')).toContainText(/Jesus|Christ|Word was made flesh/i, { timeout: 20000 });
    await expect(page.locator('#feelCards.has-results')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('#feelCards .feel-verse-card, #feelCards [data-tdb-kiss-verse]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Restless' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Show feelings again' })).toBeVisible();
  });

  test('typing in the search bar does not jump the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ask.html');
    await page.locator('#feel-search').focus();
    const y0 = await page.evaluate(() => window.scrollY);
    await page.locator('#feel-search').pressSequentially('who is jesus', { delay: 40 });
    await page.waitForTimeout(700);
    const y1 = await page.evaluate(() => window.scrollY);
    expect(Math.abs(y1 - y0)).toBeLessThan(40);
    await expect(page.getByRole('button', { name: 'Restless' })).toBeVisible();
  });

  test('pressing Enter in the search bar still answers', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ask.html');
    await page.locator('#feel-search').fill('who is jesus');
    await page.locator('#feel-search').press('Enter');
    await expect(page.locator('#homeQaAnswer')).toContainText(/Jesus|Christ|Word was made flesh/i, { timeout: 20000 });
    await expect(page.locator('#feelCards.has-results')).toBeVisible({ timeout: 20000 });
  });

  test('desktop first screen keeps the same porch', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/ask.html');
    await expect(page.getByRole('heading', { name: 'Ask the Word' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Forgiveness' })).toBeVisible();
    await page.screenshot({ path: 'test-results/ask-porch-desktop.png', fullPage: false });
  });
});
