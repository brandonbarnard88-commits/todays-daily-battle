import { chromium, firefox } from 'playwright';
import fs from 'fs';
import path from 'path';

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

async function launchBrowser() {
  try {
    return await firefox.launch({ headless: true });
  } catch (err) {
    const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '';
    const candidates = [
      path.join(root, 'chromium_headless_shell-1208', 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell'),
      path.join(root, 'chromium_headless_shell-1208', 'chrome-headless-shell-mac-x64', 'chrome-headless-shell')
    ];
    const executablePath = candidates.find((p) => p && fs.existsSync(p));
    if (executablePath) {
      return await chromium.launch({ headless: true, executablePath });
    }
    return await chromium.launch({ headless: true });
  }
}

const browser = await launchBrowser();
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

  const welcomeOverlay = page.locator('#welcome-anointing-overlay');
  const welcomeVisible = (await welcomeOverlay.count()) > 0 &&
    !(await welcomeOverlay.evaluate((el) => el.classList.contains('hidden')));
  mark(
    'Welcome first-load overlay',
    welcomeVisible,
    welcomeVisible ? 'Overlay visible on first load.' : 'Overlay missing or hidden.'
  );

  await page.evaluate(() => localStorage.setItem('welcome-seen', '1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  const optinClose = page.locator('.weekly-newsletter-optin-close');
  if (await optinClose.count()) {
    await optinClose.first().click();
    await page.waitForTimeout(200);
  }

  const quickPrayBtn = page.locator('#quick-pray-btn');
  if (await quickPrayBtn.count()) {
    const prayerBadge = page.locator('#prayer-history-badge');
    const before = ((await prayerBadge.textContent()) || '').replace(/\s+/g, ' ').trim();
    await quickPrayBtn.first().click();
    await page.waitForTimeout(3400);
    const after = ((await prayerBadge.textContent()) || '').replace(/\s+/g, ' ').trim();
    const ok = before !== after && /Prayers:\s*[1-9]/i.test(after);
    mark('Pray counter increments', ok, 'before=' + before + ' | after=' + after);
  } else {
    mark('Pray counter increments', false, 'Quick pray button not found.');
  }

  const battleTab = page.locator('#tab-battle');
  if (await battleTab.count()) {
    await battleTab.first().click();
    await page.waitForTimeout(250);
  }

  const searchInput = page.locator('#tdb-search');
  const searchBtn = page.locator('#search-btn');
  if (await searchInput.count() && await searchBtn.count()) {
    await searchInput.first().fill('anxiety');
    await searchBtn.first().click();
    await page.waitForTimeout(1700);

    const cards = await page.locator('#output .verse-card').count();
    const hidden = await page.locator('#output .verse-card.smart-hit-hidden').count();
    const showMore = await page.locator('#output .smart-show-more-btn').count();
    const searchOk = cards >= 1 && (cards <= 3 || (hidden > 0 && showMore > 0));
    mark(
      'Search cap + show more',
      searchOk,
      'cards=' + cards + ', hidden=' + hidden + ', showMore=' + showMore
    );

    if (cards > 0) {
      await page.locator('#output .verse-card').first().click();
      await page.waitForTimeout(700);
      const actions = (await page.locator('#tdb-verse-breakdown-modal [data-action]').allTextContents()).join(' | ');
      const breakdownOk = /Pray it/i.test(actions) && /Save/i.test(actions) && /Share/i.test(actions);
      mark('Verse breakdown actions', breakdownOk, actions || 'No actions found.');
    } else {
      mark('Verse breakdown actions', false, 'No verse cards to open.');
    }
  } else {
    mark('Search cap + show more', false, 'Search controls not found.');
    mark('Verse breakdown actions', false, 'Search controls not found.');
  }

  const footerCols = await page.locator('footer .footer-col').count();
  const swipeHint = await page.locator('.swipe-hint').count();
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  const footerOk = footerCols === 3 && swipeHint > 0;
  mark(
    'Footer columns + mobile hint',
    footerOk,
    'footerCols=' + footerCols + ', swipeHint=' + swipeHint + ', viewport=' + (viewport || '')
  );

  // Action Bible archive runtime checks
  await page.goto(origin + '/action-bible.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
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

  // Workshop runtime checks
  await page.goto(origin + '/action-bible-workshop.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
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
