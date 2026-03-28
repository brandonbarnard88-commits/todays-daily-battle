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
    const nodes = page.locator('#mobius-universal-viz .mobius-node');
    await expect(nodes.first()).toBeVisible({ timeout: 10000 });
    const n = await nodes.count();
    expect(n).toBeGreaterThanOrEqual(6);
  });

  test('node click shows card with verse and prayer', async ({ page }) => {
    await page.goto('/mobius.html');
    const nodes = page.locator('#mobius-universal-viz .mobius-node');
    await expect(nodes.first()).toBeVisible({ timeout: 10000 });
    const firstNode = nodes.first();
    await firstNode.click();
    await expect(page.locator('.mobius-card-container.visible')).toBeVisible({ timeout: 8000 });
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

  test('Deep Walk section and two mode tabs (KJV only)', async ({ page }) => {
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-deep-walk')).toBeVisible();
    await expect(page.locator('#mobius-tab-explore')).toBeVisible();
    await expect(page.locator('#mobius-tab-text')).toBeVisible();
    await expect(page.locator('#mobius-tab-enoch')).toHaveCount(0);
  });

  test('Text mode shows calm path and Fear to Faith bridge', async ({ page }) => {
    await page.goto('/mobius.html');
    await page.getByRole('tab', { name: /Text mode/i }).click();
    await expect(page.locator('#mobius-v2-start')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#mobius-ff-bridge')).toContainText(/Fear to Faith/i);
  });

  test('Graph mode shows ribbon slot near viz', async ({ page }) => {
    await page.goto('/mobius.html');
    await expect(page.locator('#mobius-ribbon-slot')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#mobius-ribbon-slot svg')).toBeVisible({ timeout: 10000 });
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
