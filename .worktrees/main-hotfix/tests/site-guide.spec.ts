import { test, expect } from '@playwright/test';

test.describe('site-guide interactions', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__tdbShareCalls = [];
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async (data: unknown) => {
          (window as any).__tdbShareCalls.push(data);
        }
      });
      Object.defineProperty(navigator, 'canShare', {
        configurable: true,
        value: () => true
      });
    });
  });

  test('mobile nav flyout and share controls work', async ({ page }) => {
    await page.goto('/site-guide.html');

    const toggle = page.locator('#tdb-primary-nav-toggle-standalone');
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.locator('#tdb-primary-nav-panel-standalone');
    await expect(panel).toBeVisible();
    await expect(page.locator('#nav-site-guide')).toHaveAttribute('aria-current', 'page');

    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.waitForFunction(() => typeof (window as any).sharePage === 'function');
    await page.locator('#share-page').click();
    await expect.poll(async () => {
      return page.evaluate(() => (window as any).__tdbShareCalls.length);
    }).toBeGreaterThan(0);

    await page.getByRole('button', { name: /restart the five-minute site tour/i }).click();
    await expect(page.locator('#tdb-welcome-tour-dialog')).toBeVisible();
  });
});
