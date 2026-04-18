import { test, expect } from '@playwright/test';

test.describe('Embeddable verse widgets', () => {
  test('demo page renders quiet widget previews and copy-ready code', async ({ page }) => {
    await page.goto('/embeddable-widgets.html', { waitUntil: 'domcontentloaded', timeout: 60000 });

    await expect(page.getByRole('heading', { level: 1, name: /Embeddable verse widgets/i })).toBeVisible();
    await expect(page.locator('#embed-code-output')).toContainText('embed-verse-widget.js');
    await expect(page.locator('#embed-preview [data-tdb-embed="verse-widget"]')).toHaveAttribute('data-tdb-widget-ready', 'true', { timeout: 20000 });
    await expect(page.locator('#embed-preview')).toContainText('Plain English');
    await expect(page.locator('#embed-preview')).toContainText('For your group');
    await expect(page.locator('#embed-preview')).toContainText('Real life today');

    await page.getByRole('button', { name: /Family bedtime/i }).click();
    await expect(page.locator('#embed-preview')).toContainText('Psalms 91:1');
    await expect(page.locator('#embed-code-output')).toContainText('data-audience="family"');

    await page.getByRole('button', { name: /Grief comfort/i }).click();
    await expect(page.locator('#embed-preview')).toContainText('Psalms 34:18');
    await expect(page.locator('#embed-code-output')).toContainText('data-layout="compact"');
  });
});
