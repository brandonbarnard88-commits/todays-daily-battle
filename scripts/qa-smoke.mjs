import { waitForSearchOutput, waitForSearchReady } from './_lib/live-browser-utils.mjs';

if (
  typeof process.env.PLAYWRIGHT_BROWSERS_PATH === 'string' &&
  process.env.PLAYWRIGHT_BROWSERS_PATH.includes('cursor-sandbox-cache')
) {
  delete process.env.PLAYWRIGHT_BROWSERS_PATH;
}

const { chromium, firefox } = await import('playwright');

const url = process.env.QA_URL || 'https://todaysdailybattle.com/index.html';
const checks = [];

function mark(name, ok, evidence) {
  checks.push({
    check: name,
    status: ok ? 'PASS' : 'FAIL',
    evidence: evidence || ''
  });
}

function hasFailure() {
  return checks.some((c) => c.status === 'FAIL');
}

function step(label) {
  console.error('[qa-smoke]', label);
}

async function dismissCookieNotice(page) {
  const laterBtn = page.locator('#tdb-cookie-notice .tdb-cookie-notice__btn--secondary').first();
  if (await laterBtn.count()) {
    await laterBtn.click().catch(() => {});
    await page.waitForTimeout(200);
  }
  const banner = page.locator('#tdb-cookie-notice');
  if (await banner.count()) {
    await banner.evaluate((node) => {
      if (!node) return;
      node.setAttribute('hidden', '');
      node.setAttribute('aria-hidden', 'true');
      if (document && document.body && document.body.classList) {
        document.body.classList.remove('tdb-cookie-notice-visible');
      }
    }).catch(() => {});
  }
}

/** Prefer evaluate — Playwright locator.textContent auto-wait can hang 30s when a node is missing. */
async function textOf(page, selector) {
  return page
    .evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? String(el.textContent || '').trim() : '';
    }, selector)
    .catch(() => '');
}

async function countOf(page, selector) {
  return page
    .evaluate((sel) => document.querySelectorAll(sel).length, selector)
    .catch(() => 0);
}

/**
 * Chromium first: Firefox + python SimpleHTTPServer routinely stalls navigating
 * heavy Action Bible pages in GitHub Actions (pre-existing main flake).
 */
async function launchSmokeBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (_) {
    return firefox.launch({ headless: true });
  }
}

const browser = await launchSmokeBrowser();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

try {
  step('home');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const origin = new URL(url).origin;

  await page.evaluate(() => {
    localStorage.removeItem('welcome-seen');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await page
    .waitForResponse((r) => /\/verse-breakdown\.js/i.test(r.url()) && r.ok(), { timeout: 20000 })
    .catch(() => {});

  const welcomeOverlay = page.locator('#welcome-anointing-overlay');
  const welcomeExists = (await welcomeOverlay.count()) > 0;
  const welcomeVisible = welcomeExists &&
    !(await welcomeOverlay.evaluate((el) => el.classList.contains('hidden')));
  mark(
    'Welcome first-load overlay',
    !welcomeExists || welcomeVisible,
    !welcomeExists ? 'Overlay removed—skipped.' : (welcomeVisible ? 'Overlay visible on first load.' : 'Overlay hidden (welcome-seen).')
  );

  await page.evaluate(() => localStorage.setItem('welcome-seen', '1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);

  const optinClose = page.locator('.weekly-newsletter-optin-close');
  if (await optinClose.count()) {
    await optinClose.first().click();
    await page.waitForTimeout(200);
  }

  step('prayer-wall');
  await page.goto(origin + '/prayer-wall.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  const prayerInput = page.locator('#prayer-wall-input').first();
  const prayBtn = page.locator('#prayer-wall-add').first();
  if (await prayerInput.count() && await prayBtn.count()) {
    await page.waitForTimeout(300);
    const beforeState = await page.evaluate(() => ({
      label: ((document.querySelector('#prayerTodayLabel')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      deviceCount: ((document.querySelector('#prayer-count-today')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      success: ((document.querySelector('#prayer-wall-post-success')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      recentCount: document.querySelectorAll('#recent-prayers .recent-prayer-item').length
    }));
    await prayerInput.fill('Smoke test prayer ' + Date.now());
    await prayBtn.first().click();
    await page.waitForTimeout(1400);
    const afterState = await page.evaluate(() => ({
      label: ((document.querySelector('#prayerTodayLabel')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      deviceCount: ((document.querySelector('#prayer-count-today')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      success: ((document.querySelector('#prayer-wall-post-success')?.textContent) || '').replace(/\s+/g, ' ').trim(),
      recentCount: document.querySelectorAll('#recent-prayers .recent-prayer-item').length
    }));
    const ok =
      beforeState.label !== afterState.label ||
      beforeState.deviceCount !== afterState.deviceCount ||
      beforeState.success !== afterState.success ||
      beforeState.recentCount !== afterState.recentCount;
    mark(
      'Pray counter increments',
      ok,
      'before=' + JSON.stringify(beforeState) + ' | after=' + JSON.stringify(afterState)
    );
  } else {
    mark('Pray counter increments', false, 'Prayer input/button (#prayer-wall-input, #prayer-wall-add) not found on prayer wall.');
  }

  step('search');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);

  const battleTab = page.locator('#tab-battle');
  if (await battleTab.count()) {
    await battleTab.first().click();
    await page.waitForTimeout(250);
  }

  const searchInput = page.locator('#tdb-search, #feel-search');
  const quickHope = page.locator('#quickTopics .quick-topic[data-topic="hope"], #quick-actions-hero [data-topic="hope"], #quick-actions-hero a[href*="q=hope"]').first();
  const hasSearchInput = (await searchInput.count()) > 0;
  const hasQuickHope = (await quickHope.count()) > 0;
  const searchReady = await waitForSearchReady(page);

  const feelBack = page.locator('#feelBandBack');
  if (await feelBack.isVisible().catch(() => false)) {
    await feelBack.click().catch(() => {});
    await page.waitForTimeout(200);
  }
  const feelSteady = page.locator('#quickTopics .feel-category-card[data-feel-band="steady"]');
  if (await feelSteady.count() > 0) {
    await feelSteady.first().click().catch(() => {});
    await page.waitForTimeout(220);
  }

  if (hasSearchInput || hasQuickHope) {
    if (searchReady) {
      await page.evaluate(() => {
        if (typeof window.runSearchWithInput === 'function') window.runSearchWithInput('hope');
      });
    } else if (hasQuickHope) {
      await quickHope.click();
    }

    let { cards, emptyCount } = await waitForSearchOutput(page, 12000);
    if (cards === 0 && emptyCount === 0 && hasQuickHope && !searchReady) {
      await quickHope.click();
      await page.waitForTimeout(800);
      ({ cards, emptyCount } = await waitForSearchOutput(page, 10000));
    }
    if (cards === 0 && emptyCount === 0) {
      await page.goto(origin + '/index.html?q=hope#feel-section', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1500);
      ({ cards, emptyCount } = await waitForSearchOutput(page, 10000));
    }

    const searchOk = cards >= 1 || emptyCount >= 1;
    mark(
      'Search renders results',
      searchOk,
      'cards=' + cards + ', empty=' + emptyCount
    );

    if (cards > 0) {
      try {
        await page.waitForFunction(
          () =>
            typeof window.TDBVerseBreakdown === 'object' &&
            window.TDBVerseBreakdown &&
            typeof window.TDBVerseBreakdown.open === 'function',
          { timeout: 20000 }
        );
        await page.waitForTimeout(800);
        // Visible homepage results live in #feel-results; #output is sr-only — scope inline breakdown there.
        const scopedDetails = page.locator('#feel-results .tdb-verse-breakdown-inline').first();
        await scopedDetails.waitFor({ state: 'attached', timeout: 12000 }).catch(() => {});
        const trigger = scopedDetails.locator('.tdb-vb-inline-toggle').first();
        await trigger.scrollIntoViewIfNeeded().catch(() => {});
        await page.waitForTimeout(200);
        await trigger.click({ timeout: 8000 });
        await page.waitForTimeout(500);
        const actionsLoc = scopedDetails.locator('.tdb-vb-inline-actions [data-action]');
        await actionsLoc.first().waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
        const actions = (await actionsLoc.allTextContents()).join(' | ');
        const breakdownOk = /Pray it/i.test(actions) && /Save/i.test(actions) && /Share/i.test(actions);
        mark('Verse breakdown actions', breakdownOk, actions || 'No inline [data-action] buttons visible');
      } catch (clickErr) {
        mark('Verse breakdown actions', false, 'Breakdown open failed: ' + (clickErr.message || 'timeout'));
      }
    } else if (emptyCount > 0) {
      mark('Verse breakdown actions', true, 'Search returned empty state; no verse card available to open.');
    } else {
      mark('Verse breakdown actions', false, 'No verse cards to open.');
    }
  } else {
    mark('Search renders results', false, 'Search controls not found.');
    mark('Verse breakdown actions', false, 'Search controls not found.');
  }

  const footerCols = await page.locator('footer .footer-col').count();
  const footerNavLinks = await page.locator('footer .site-footer-nav a').count();
  const swipeHint = await page.locator('.swipe-hint').count();
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  const footerOk = (footerCols >= 3 || footerNavLinks >= 3) && swipeHint === 0;
  mark(
    'Footer columns + swipe hint removed',
    footerOk,
    'footerCols=' + footerCols + ', navLinks=' + footerNavLinks + ', swipeHint=' + swipeHint + ', viewport=' + (viewport || '')
  );

  // Action Bible archive runtime checks
  step('action-bible');
  try {
    try {
      await page.goto('about:blank');
    } catch (_) {}
    await page.goto(origin + '/action-bible.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page
      .waitForFunction(
        () => {
          const el = document.getElementById('ab-status');
          if (!el) return false;
          const t = String(el.textContent || '').trim();
          return /Loaded\s+\d+\s+entries/i.test(t) || /could not be loaded|failed|error/i.test(t);
        },
        { timeout: 25000 }
      )
      .catch(() => {});
    await dismissCookieNotice(page);
    const archiveStatus = await textOf(page, '#ab-status');
    const seasonOpts = await countOf(page, '#ab-season option');
    const archiveLoaded = /Loaded\s+\d+\s+entries/i.test(archiveStatus) && seasonOpts > 1;
    mark(
      'Action Bible archive loads data',
      archiveLoaded,
      'status=' + archiveStatus + ', seasonOptions=' + seasonOpts
    );

    const avatarProfileExists = await countOf(page, '#ab-avatar-gender');
    mark(
      'Action Bible witness profile control',
      avatarProfileExists > 0,
      'ab-avatar-gender count=' + avatarProfileExists
    );

    const readAlongBtn = page.locator('#ab-read-along');
    const listenBtn = page.locator('#ab-listen-entry');
    const stopAudioBtn = page.locator('#ab-stop-audio');
    if (await readAlongBtn.count()) {
      // Avoid scrollIntoViewIfNeeded here — CI can hit "stable" timeouts on long archive pages.
      await readAlongBtn.first().click({ force: true, timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(300);
      const readAlongText = await textOf(page, '#ab-readalong-text');
      const readAlongOk = /Entry\s+\d+/i.test(readAlongText) || /Verse anchor/i.test(readAlongText);
      mark(
        'Action Bible read-along mode',
        readAlongOk,
        readAlongText.slice(0, 180)
      );
    } else {
      mark('Action Bible read-along mode', false, 'Read Along button missing.');
    }
    const listenCount = await countOf(page, '#ab-listen-entry');
    const stopCount = await countOf(page, '#ab-stop-audio');
    mark(
      'Action Bible listen controls',
      listenCount > 0 && stopCount > 0,
      'listen=' + listenCount + ', stop=' + stopCount
    );
  } catch (abErr) {
    mark('Action Bible archive loads data', false, 'Action Bible step error: ' + (abErr.message || abErr));
    mark('Action Bible witness profile control', false, 'skipped after archive error');
    mark('Action Bible read-along mode', false, 'skipped after archive error');
    mark('Action Bible listen controls', false, 'skipped after archive error');
  }

  // Workshop runtime checks
  step('workshop');
  try {
    try {
      await page.goto('about:blank');
    } catch (_) {}
    await page.goto(origin + '/action-bible-workshop.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page
      .waitForFunction(
        () => {
          const el = document.getElementById('abw-status');
          if (!el) return false;
          const t = String(el.textContent || '').trim();
          return (
            /Loaded\s+\d+\s+entries\s+and\s+\d+\s+weekly packs/i.test(t) ||
            /could not be loaded/i.test(t)
          );
        },
        { timeout: 25000 }
      )
      .catch(() => {});
    const workshopStatus = await textOf(page, '#abw-status');
    const workshopLoaded = /Loaded\s+\d+\s+entries\s+and\s+\d+\s+weekly packs/i.test(workshopStatus);
    mark(
      'Workshop toolkit loads entries and packs',
      workshopLoaded,
      'status=' + workshopStatus
    );

    const loadWeekBtn = page.locator('#abw-load-week');
    if (await loadWeekBtn.count()) {
      await page.fill('#abw-week', '1');
      await loadWeekBtn.first().click();
      await page.waitForTimeout(450);
      const productionText = (await textOf(page, '#abw-production-output')).replace(/\s+/g, ' ').trim();
      const weekOk = /Weekly Pack 1/i.test(productionText) && /Leader objective/i.test(productionText);
      mark(
        'Workshop weekly pack preview',
        weekOk,
        productionText.slice(0, 180)
      );
    } else {
      mark('Workshop weekly pack preview', false, 'Load weekly pack button missing.');
    }
  } catch (wsErr) {
    mark('Workshop toolkit loads entries and packs', false, 'Workshop step error: ' + (wsErr.message || wsErr));
    mark('Workshop weekly pack preview', false, 'skipped after workshop error');
  }
} catch (err) {
  mark('Smoke harness', false, 'Uncaught: ' + (err && err.message ? err.message : String(err)));
} finally {
  await browser.close().catch(() => {});
}

console.log(JSON.stringify({ url, checks }, null, 2));

if (hasFailure()) {
  process.exit(1);
}
