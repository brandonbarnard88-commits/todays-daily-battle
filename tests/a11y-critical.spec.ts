import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * WCAG 2.0 A + AA automated scan on critical templates (built dist).
 * Includes color-contrast and meta-viewport (zoom-capable viewport, AA contrast).
 */
async function dismissFirstVisitIfPresent(page: import('@playwright/test').Page) {
  const btn = page.locator('#firstVisitDismiss');
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
  }
}

test.describe('axe — critical pages', () => {
  test('index.html', async ({ page }) => {
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('bible-tool.html', async ({ page }) => {
    await page.goto('/bible-tool.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('message.html', async ({ page }) => {
    await page.goto('/message.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('ansiedad.html (Spanish)', async ({ page }) => {
    await page.goto('/ansiedad.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('verse-cards/index.html', async ({ page }) => {
    await page.goto('/verse-cards/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('topic-anxiety.html', async ({ page }) => {
    await page.goto('/topic-anxiety.html');
    await dismissFirstVisitIfPresent(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('plans.html', async ({ page }) => {
    await page.goto('/plans.html');
    await dismissFirstVisitIfPresent(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('team-toolkit.html', async ({ page }) => {
    await page.goto('/team-toolkit.html');
    await dismissFirstVisitIfPresent(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
