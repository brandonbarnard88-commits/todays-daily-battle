import { test, expect } from '@playwright/test';

test.describe('site-guide alias → Explore start-here', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('stub points at Explore start-here', async ({ page }) => {
    await page.goto('/site-guide.html');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://todaysdailybattle.com/explore.html#start-here'
    );
    await expect(page.getByRole('heading', { name: /start here moved/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /explore — start here/i })).toHaveAttribute(
      'href',
      '/explore.html#start-here'
    );
  });

  test('Explore start-here keeps Start here nav landmark', async ({ page }) => {
    await page.goto('/explore.html#start-here');

    const toggle = page.locator('#tdb-primary-nav-toggle-standalone');
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.locator('#tdb-primary-nav-panel-standalone');
    await expect(panel).toBeVisible();
    await expect(page.locator('#nav-site-guide')).toHaveAttribute('href', '/explore.html#start-here');
  });
});
