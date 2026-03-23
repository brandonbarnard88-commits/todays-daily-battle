import { test, expect } from '@playwright/test';

test.describe('Möbius Loop', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.clear();
    });
  });

  test('loads graph mode with nodes', async ({ page }) => {
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-universal-viz')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.mobius-node')).toHaveCount(6, { timeout: 10000 });
  });

  test('node click shows card with verse and prayer', async ({ page }) => {
    await page.goto('/mobius.html');
    await expect(page.locator('.mobius-node')).toHaveCount(6, { timeout: 10000 });
    const firstNode = page.locator('.mobius-node').first();
    await firstNode.click();
    await expect(page.locator('.mobius-card-container.visible')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.mobius-node-card')).toBeVisible();
    await expect(page.locator('.mobius-node-card')).toContainText(/Pray:/i);
  });

  test('streak bump updates display', async ({ page }) => {
    await page.addInitScript(() => {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('mobiusLoops_'));
      keys.forEach((k) => localStorage.removeItem(k));
    });
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-streak-display')).toContainText(/0 loops this week/i);
    await page.evaluate(() => {
      if (typeof (window as unknown as { bumpMobiusLoopStreak?: () => number }).bumpMobiusLoopStreak === 'function') {
        (window as unknown as { bumpMobiusLoopStreak: () => number }).bumpMobiusLoopStreak();
      }
    });
    await expect(page.locator('#mobius-streak-display')).toContainText(/1 loop this week/i);
  });

  test('streak display shows on load', async ({ page }) => {
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-streak-display')).toContainText(/loops this week/i);
  });

  test('Canon Only toggle hides Hidden Scrolls tab', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('mobiusCanonOnly'));
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-tab-enoch')).toBeVisible();
    await page.locator('#mobius-canon-only').click();
    await expect(page.locator('#mobius-tab-enoch')).toHaveClass(/canon-hidden/);
  });

  test('calm anxiety flow shows Möbius link', async ({ page }) => {
    await page.goto('/calm.html');
    await page.getByRole('button', { name: /Anxious or afraid/i }).click();
    /* Desktop (Playwright default viewport) updates #desktop-mobius-cta; narrow viewports use #calm-mobius-cta. */
    const mobiusLink = page.getByRole('link', { name: /Walk the Möbius Loop/i });
    await expect(mobiusLink).toBeVisible();
    await expect(mobiusLink).toHaveAttribute('href', /mobius\.html\?mood=fear/);
  });
});
