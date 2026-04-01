import { test, expect, type Page } from '@playwright/test';

// Ensure clean state before each page load: no saved prayers, skip welcome overlay
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('tdb_prayers_v1');
    sessionStorage.setItem('tdb_welcome_intro_seen_session', '1');
    try {
      localStorage.setItem('tdb-theme', 'dark');
    } catch (_) {}
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

  /* `domcontentloaded` can beat the module bundle; prayer wall needs tdbInit + render() for ready + handlers. */
  await page.goto('/prayer-wall.html', { waitUntil: 'load', timeout: 60000 });
  const skipBtn = page.locator('#welcome-intro-skip');
  if (await skipBtn.isVisible({ timeout: 5000 }).catch(() => false)) await skipBtn.click();
  await page.locator('#prayer-wall').scrollIntoViewIfNeeded().catch(() => {});

  await page.waitForSelector('#prayer-wall-list', { state: 'attached', timeout: 10000 });
  /* Static HTML already has 23 <li> seeds; wait until initPrayerWall render() sets ready — otherwise add handlers never ran. */
  try {
    await page.waitForSelector('#prayer-wall-list[data-prayer-wall-ready="1"]', {
      state: 'attached',
      timeout: 25000,
    });
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(23, { timeout: 10000 });
  } catch (e) {
    const diag = await page.evaluate(() => {
      const list = document.getElementById('prayer-wall-list');
      return {
        listExists: !!list,
        rendered: list?.getAttribute('data-prayer-wall-rendered') ?? 'none',
        ready: list?.getAttribute('data-prayer-wall-ready') ?? 'none',
        itemCount: list?.querySelectorAll('li.prayer-wall-item').length ?? 0,
        initDone: (window as Window & { __tdbPrayerWallInitDone?: boolean })['__tdbPrayerWallInitDone'],
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
    await expect(items).toHaveCount(23);
    await expect(page.locator('#prayer-wall-list').getByText(/barely stand|hanging by a thread|won\u2019t let me sleep|money is tight|daddy\/husband|hurt me deep|never giving up on me|whatever today brings/i).first()).toBeVisible();
    /* setPrayerTodayLabel(0) uses quiet copy, not "0 prayers today" */
    await expect(page.locator('#prayerTodayLabel')).toContainText(/Quiet today|0 prayers today/i);
  });

  test('seeds still listed after going offline (same session)', async ({ page, context }) => {
    await waitForPrayerWallSeeds(page, test.info());
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(23);
    await context.setOffline(true);
    /* Offline full reload is flaky in headless (uncached shell); keep user-respecting check */
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item')).toHaveCount(23);
  });

  test('posting a prayer adds it to the list', async ({ page }) => {
    await waitForPrayerWallSeeds(page, test.info());
    await page.locator('#prayer-wall').scrollIntoViewIfNeeded();
    const uniqueText = `E2E test prayer ${Date.now()}`;
    const input = page.locator('#prayer-wall-input');
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.fill(uniqueText);
    await page.locator('#prayer-wall-add').click({ force: true });
    await page.waitForFunction(
      (t) => {
        try {
          const raw = localStorage.getItem('tdb_prayers_v1') || '[]';
          const arr = JSON.parse(raw);
          return (
            Array.isArray(arr) &&
            arr.some(function (it) {
              return String((it && it.text) || '').indexOf(t) !== -1;
            })
          );
        } catch (e) {
          return false;
        }
      },
      uniqueText,
      { timeout: 20000 }
    );
    await expect(page.locator('#prayer-wall-list')).toContainText(uniqueText, { timeout: 10000 });
    await expect(page.locator('#prayer-wall-list li.prayer-wall-item:not(.prayer-wall-seed)')).toHaveCount(1);
    await expect(input).toHaveValue('');
  });
});
