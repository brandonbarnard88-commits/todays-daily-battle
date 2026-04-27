import { test, expect } from '@playwright/test';

/*
 * First-visit is gated by `tdb_welcome_calm_campus_v1` (see first-visit-welcome.js), not `tdbFirstVisitDismissed`.
 * Playwright uses baseURL from playwright.config (dist on :8080), not :3000.
 * Category cards sit inside a closed <details>; waiting for them in beforeEach would flake — Hope uses #tdbFeelQuickStrip.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('tdb-tour-seen', '1');
    } catch (e) {}
    try {
      sessionStorage.setItem('tdb_welcome_intro_seen_session', '1');
    } catch (e) {}
    /* Match first-visit-welcome.js + welcome.js so home e2e is not blocked by modals (see qa-smoke.mjs). */
    try {
      localStorage.setItem('tdb_welcome_calm_campus_v1', '1');
    } catch (e) {}
    try {
      localStorage.setItem('welcome-seen', '1');
    } catch (e) {}
    try {
      localStorage.setItem('tdb_first_visit_read_pref_v1', 'later');
    } catch (e) {}
  });
});

async function dismissFirstVisitIfPresent(page: import('@playwright/test').Page) {
  /* Modal from first-visit-welcome.js (not the #firstVisitHint strip). Blocks clicks if still open.
   * Use page.evaluate so pages without #tdbFirstVisitDialog do not wait on a missing locator. */
  const dialogOpen = await page.evaluate(() => {
    const el = document.getElementById('tdbFirstVisitDialog');
    return el instanceof HTMLDialogElement && el.open;
  });
  if (dialogOpen) {
    const notNow = page.locator('#tdbFirstVisitNotNow');
    if (await notNow.isVisible().catch(() => false)) {
      await notNow.click();
    } else {
      await page.evaluate(() => {
        try {
          localStorage.setItem('tdb_welcome_calm_campus_v1', '1');
        } catch (e) {
          /* ignore */
        }
        const d = document.getElementById('tdbFirstVisitDialog');
        if (d instanceof HTMLDialogElement) d.close();
      });
    }
    await page.waitForTimeout(250);
  }
  const btn = page.locator('#firstVisitDismiss');
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => {});
  }
  const welcomeIntroSkip = page.locator('#welcome-intro-skip');
  if (await welcomeIntroSkip.isVisible().catch(() => false)) {
    await welcomeIntroSkip.click().catch(() => {});
  }
  const tourSkip = page.getByRole('button', { name: /^skip$/i });
  if (await tourSkip.isVisible().catch(() => false)) {
    await tourSkip.click().catch(() => {});
  }
  const welcomeTourSkip = page.locator('.tdb-welcome-tour-skip');
  if (await welcomeTourSkip.isVisible().catch(() => false)) {
    await welcomeTourSkip.click().catch(() => {});
  }
}

test.describe('core smoke (dist)', () => {
  /* Match qa-smoke.mjs mobile viewport so progressive-disclosure Feel UI is exercised the same way. */
  test.use({ viewport: { width: 390, height: 844 } });

  test('home: daily battle card visible', async ({ page }) => {
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    await expect(page.locator('#verseCard')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('#heroVerse')).not.toHaveText('', { timeout: 15000 });
  });

  test('home: Hope topic shows verse cards', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('tdb_feel_category_auto_heavy_v1', '1');
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    /* Category cards live inside a closed <details>; the quick strip always exposes Hope. */
    const hopeBtn = page.locator('#tdbFeelQuickStrip .quick-topic[data-topic="hope"]');
    await hopeBtn.scrollIntoViewIfNeeded();
    await hopeBtn.click();
    /* Inline wireFeelSearch debounces (~300ms); homepage search may render calm cards or fallback smart cards. */
    await page.waitForTimeout(450);
    const result = page.locator(
      '#feel-results .home-search-card, #feel-results .smart-card, #feel-results .verse-card, #feelCards .feel-verse-card'
    ).first();
    await expect(result).toBeVisible({ timeout: 25000 });
    const breakdown = page.getByRole('button', { name: /read full breakdown/i }).first();
    if (await breakdown.isVisible().catch(() => false)) {
      await breakdown.click({ force: true });
      await expect(page.locator('.home-search-detail-panel')).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: /back to quiet place/i }).first()).toBeVisible();
    }
  });

  test('home: question search shows answer + verses', async ({ page }) => {
    await page.goto('/');
    await dismissFirstVisitIfPresent(page);
    const input = page.locator('#feel-search');
    await expect(input).toBeVisible();
    await input.fill('Who is Jesus?');
    await page.locator('#feel-search-btn').click();
    await expect(page.locator('#homeQaResult')).toBeVisible({ timeout: 25000 });
    await expect(page.locator('#homeQaAnswer')).not.toHaveText('', { timeout: 25000 });
    await expect(page.locator('#feel-results .home-search-card, #feel-results .verse-card, #feel-results .smart-card').first()).toBeVisible({ timeout: 25000 });
  });

  test('bible-tool.html loads lookup UI', async ({ page }) => {
    await page.goto('/bible-tool.html');
    await expect(page.getByRole('heading', { name: /bible tool/i })).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#daily-ref')).not.toHaveText('', { timeout: 15000 });
    await expect(page.locator('#book')).toBeVisible();
  });

  test('message board shell visible', async ({ page }) => {
    await page.goto('/prayer-wall.html');
    await dismissFirstVisitIfPresent(page);
    /* Same handler as the tab button; evaluate avoids Playwright “stable” waits while script.js loads. */
    await page.evaluate(() => {
      document.getElementById('prayer-tab-with-others')?.click();
    });
    await expect(page.locator('#prayer-panel-with-others')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#message-list-wrap')).toBeVisible({ timeout: 5000 });
  });
});
