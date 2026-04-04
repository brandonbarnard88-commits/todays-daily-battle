import { test, expect } from '@playwright/test';

test.describe('Spanish pages + footer (dist)', () => {
  for (const path of ['/ansiedad.html', '/fuerza.html', '/paz.html']) {
    test(`${path}: “Más ayuda en el sitio” section and cross-links`, async ({ page }) => {
      await page.goto(path);
      const masSection = page.locator('section.glass').filter({
        has: page.getByRole('heading', { name: /Más ayuda en el sitio/i }),
      });
      await expect(masSection).toBeVisible({ timeout: 15000 });
      await expect(masSection.getByRole('link', { name: 'Verso del día' })).toBeVisible();
      await expect(masSection.getByRole('link', { name: 'Calm' })).toBeVisible();
      await expect(masSection.getByRole('link', { name: 'Biblia' })).toBeVisible();
    });
  }

  test('footer at 320px: ES topics details replaces inline gloss', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    /* ansiedad ships the same bottom-nav pattern as synced footers; dist always includes it. */
    await page.goto('/ansiedad.html');
    const inline = page.locator('footer.site-footer .bottom-nav-es-inline');
    const details = page.locator('footer.site-footer details.bottom-nav-es-more');
    await expect(inline).toBeHidden();
    await expect(details).toBeVisible();
    await expect(details.locator('summary .bottom-nav-es-more-label')).toHaveText(/ES topics/i);
    await details.locator('summary').click();
    /* Accessible name is the aria-label (“Spanish topic: …”), not the visible text alone. */
    await expect(details.locator('a[href="/ansiedad.html"]')).toBeVisible();
    await expect(details.locator('a[href="/fuerza.html"]')).toBeVisible();
    await expect(details.locator('a[href="/paz.html"]')).toBeVisible();
  });
});

