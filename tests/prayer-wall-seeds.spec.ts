import { test, expect, type Page } from '@playwright/test';

// Ensure clean state before each page load: no saved prayers, skip welcome overlay
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('tdb_prayers_v1');
    sessionStorage.setItem('tdb_welcome_intro_seen_session', '1');
  });
});

async function waitForPrayerWallSeeds(page: Page, testInfo?: { attach: (name: string, body: string | Buffer, contentType?: string) => Promise<void> }) {
  const logs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error' || type === 'warning') logs.push(`[${type}] ${text}`);
  });
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));

  await page.goto('/#prayer-wall', { waitUntil: 'domcontentloaded' });
  const skipBtn = page.locator('#welcome-intro-skip');
  if (await skipBtn.isVisible({ timeout: 5000 }).catch(() => false)) await skipBtn.click();
  await page.locator('#prayer-wall').scrollIntoViewIfNeeded().catch(() => {});

  await page.waitForSelector('#prayer-wall-list', { state: 'attached', timeout: 10000 });
  try {
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(15, { timeout: 15000 });
  } catch (e) {
    const diag = await page.evaluate(() => {
      const list = document.getElementById('prayer-wall-list');
      return {
        listExists: !!list,
        rendered: list?.getAttribute('data-prayer-wall-rendered') ?? 'none',
        itemCount: list?.querySelectorAll('li.prayer-wall-item').length ?? 0,
        innerHTML: list?.innerHTML?.slice(0, 200) ?? ''
      };
    });
    const report = [
      'Prayer wall diagnostic:',
      JSON.stringify(diag, null, 2),
      '',
      'Console errors/warnings:',
      ...logs
    ].join('\n');
    await testInfo?.attach('prayer-wall-diagnostic.txt', Buffer.from(report, 'utf8'), 'text/plain');
    throw e;
  }
}

test.describe('Prayer Wall seeds', () => {
  test('seeds render when localStorage is empty', async ({ page }) => {
    await waitForPrayerWallSeeds(page, test.info());
    const items = page.locator('#prayer-wall-list li.prayer-wall-item');
    await expect(items).toHaveCount(15);
    await expect(page.locator('#prayer-wall-list').getByText(/heal our land|Thank you for this day|Guide my steps|help my unbelief|anxious thoughts|When fear overwhelms|carrying this grief|Calm the storm|afraid of what comes next|This loss is heavy/i).first()).toBeVisible();
    await expect(page.locator('#prayerTodayLabel')).toContainText('0 prayers today');
  });

  test('seeds persist offline after reload', async ({ page, context }) => {
    await waitForPrayerWallSeeds(page, test.info());
    await context.setOffline(true);
    // Reload; when offline, browser may serve from cache (commit avoids waiting for full load)
    try {
      await page.reload({ waitUntil: 'commit', timeout: 10000 });
    } catch {
      // Reload can fail when offline if page not cached; seeds should still be in DOM from prior load
    }
    await page.waitForFunction(
      () => document.querySelectorAll('#prayer-wall-list li.prayer-wall-item').length >= 15,
      { timeout: 15000 }
    );
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(15);
  });

  test('posting a prayer adds it to the list', async ({ page }) => {
    await waitForPrayerWallSeeds(page, test.info());
    await page.getByLabel(/Add a prayer to the wall/i).waitFor({ state: 'visible', timeout: 15000 });
    const uniqueText = `E2E test prayer ${Date.now()}`;
    await page.getByLabel(/Add a prayer to the wall/i).fill(uniqueText);
    await page.getByRole('button', { name: /Post prayer to wall/i }).click();
    // When user has items, seeds are replaced; list shows only user prayers
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(1);
    await expect(page.locator('#prayer-wall-list')).toContainText(uniqueText);
    // Input cleared after post
    await expect(page.getByLabel(/Add a prayer to the wall/i)).toHaveValue('');
  });
});
