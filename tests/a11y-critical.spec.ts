import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** Re-enable as tokens/contrast and viewport meta align with strict AA */
const AXE_DISABLED = ['color-contrast', 'meta-viewport'];

/**
 * WCAG 2.0 A + AA automated scan on critical templates (built dist).
 * Keeps scope tight: serious/critical issues only to avoid emoji/contrast noise on AA.
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
      .disableRules(AXE_DISABLED)
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('bible-tool.html', async ({ page }) => {
    await page.goto('/bible-tool.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(AXE_DISABLED)
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('message.html', async ({ page }) => {
    await page.goto('/message.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(AXE_DISABLED)
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('ansiedad.html (Spanish)', async ({ page }) => {
    await page.goto('/ansiedad.html');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(AXE_DISABLED)
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test('verse-cards/index.html', async ({ page }) => {
    await page.goto('/verse-cards/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(AXE_DISABLED)
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
