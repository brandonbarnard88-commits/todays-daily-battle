import { launchBestBrowser, waitForSearchOutput, waitForSearchReady } from './_lib/live-browser-utils.mjs';

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

const browser = await launchBestBrowser();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const origin = new URL(url).origin;

  await page.evaluate(() => {
    localStorage.removeItem('welcome-seen');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await page
    .waitForResponse((r) => /\/verse-breakdown\.js/i.test(r.url()) && r.ok(), { timeout: 35000 })
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

    const cardSel = '#output .verse-card, #output .smart-card, #feel-results .verse-card, #feel-results .smart-card, #feelCards .verse-card, #feelCards .smart-card, .feel-verse-card';
    if (cards > 0) {
      let breakdownOk = false;
      try {
        await page.waitForFunction(
          () =>
            typeof window.TDBVerseBreakdown === 'object' &&
            window.TDBVerseBreakdown &&
            typeof window.TDBVerseBreakdown.open === 'function',
          { timeout: 30000 }
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
        breakdownOk = /Pray it/i.test(actions) && /Save/i.test(actions) && /Share/i.test(actions);
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
  await page.goto(origin + '/action-bible.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  await dismissCookieNotice(page);
  const archiveStatus = ((await page.locator('#ab-status').textContent()) || '').trim();
  const seasonOpts = await page.locator('#ab-season option').count();
  const archiveLoaded = /Loaded\s+\d+\s+entries/i.test(archiveStatus) && seasonOpts > 1;
  mark(
    'Action Bible archive loads data',
    archiveLoaded,
    'status=' + archiveStatus + ', seasonOptions=' + seasonOpts
  );

  const avatarProfileExists = await page.locator('#ab-avatar-gender').count();
  mark(
    'Action Bible witness profile control',
    avatarProfileExists > 0,
    'ab-avatar-gender count=' + avatarProfileExists
  );

  const readAlongBtn = page.locator('#ab-read-along');
  const listenBtn = page.locator('#ab-listen-entry');
  const stopAudioBtn = page.locator('#ab-stop-audio');
  if (await readAlongBtn.count()) {
    await readAlongBtn.first().click();
    await page.waitForTimeout(300);
    const readAlongText = ((await page.locator('#ab-readalong-text').textContent()) || '').trim();
    const readAlongOk = /Entry\s+\d+/i.test(readAlongText) || /Verse anchor/i.test(readAlongText);
    mark(
      'Action Bible read-along mode',
      readAlongOk,
      readAlongText.slice(0, 180)
    );
  } else {
    mark('Action Bible read-along mode', false, 'Read Along button missing.');
  }
  const audioControlsOk = (await listenBtn.count()) > 0 && (await stopAudioBtn.count()) > 0;
  mark(
    'Action Bible listen controls',
    audioControlsOk,
    'listen=' + (await listenBtn.count()) + ', stop=' + (await stopAudioBtn.count())
  );

  // Workshop runtime checks (dual JSON fetch can exceed a short sleep on CI)
  await page.goto(origin + '/action-bible-workshop.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
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
      { timeout: 45000 }
    )
    .catch(() => {});
  const workshopStatus = ((await page.locator('#abw-status').textContent()) || '').trim();
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
    const productionText = ((await page.locator('#abw-production-output').textContent()) || '').replace(/\s+/g, ' ').trim();
    const weekOk = /Weekly Pack 1/i.test(productionText) && /Leader objective/i.test(productionText);
    mark(
      'Workshop weekly pack preview',
      weekOk,
      productionText.slice(0, 180)
    );
  } else {
    mark('Workshop weekly pack preview', false, 'Load weekly pack button missing.');
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ url, checks }, null, 2));

if (hasFailure()) {
  process.exit(1);
}
