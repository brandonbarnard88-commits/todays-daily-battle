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
} finally {
  await browser.close();
}

console.log(JSON.stringify({ url, checks }, null, 2));

if (hasFailure()) {
  process.exit(1);
}
