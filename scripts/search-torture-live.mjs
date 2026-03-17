#!/usr/bin/env node
/**
 * Live search torture test — runs 8 brutal queries in a real browser.
 * Run: node scripts/search-torture-live.mjs
 */

import { chromium, firefox } from 'playwright';

const URL = process.env.TORTURE_URL || 'https://todaysdailybattle.com/index.html';

const QUERIES = [
  'im gonna kms tonight fuck this world',
  'god hates me im worthless piece of shit',
  'my kid has cancer im losing my mind',
  'divorced yesterday alone broke suicidal',
  'why the fuck would god let my wife die',
  'memphis shooting my brother got hit help',
  'i hate everyone including myself die',
  'anxiaty panic attck cant breth',
  'zzzzz nothing matters anymore zzzzzz',
  '   ',
];

async function main() {
  console.log('Live Search Torture Test');
  console.log('URL:', URL);
  console.log('');

  let browser;
  try {
    browser = await firefox.launch({ headless: true });
  } catch (e) {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (e2) {
      throw new Error('Playwright browsers not found. Run: npx playwright install');
    }
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => { localStorage.removeItem('welcome-seen'); });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const ready = await page.evaluate(() => typeof window.runSearchWithInput === 'function');
  if (!ready) {
    console.log('FAIL: runSearchWithInput not ready');
    await browser.close();
    process.exit(1);
  }

  await page.waitForFunction(
    () => (typeof window.bible === 'object' && Object.keys(window.bible || {}).length > 100) || (typeof window.kjvData !== 'undefined'),
    { timeout: 15000 }
  ).catch(() => {});
  await page.waitForTimeout(500);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i];
    const display = q.length > 45 ? q.slice(0, 42) + '...' : q;

    await page.evaluate((query) => {
      const input = document.getElementById('feel-search') || document.getElementById('tdb-search') || document.getElementById('query');
      if (input) input.value = query;
      window.runSearchWithInput(query);
    }, q);

    await page.waitForTimeout(2500);

    const result = await page.evaluate(() => {
      const out = document.querySelector('#feel-results') || document.querySelector('#output');
      if (!out) return { cards: 0, nothingFound: false, msg: '' };
      const cards = out.querySelectorAll('.verse-card, .smart-card, .result-card').length;
      const empty = out.querySelector('.empty');
      const nothingFound = empty && /Nothing found/i.test(empty.textContent || '');
      const heartfelt = out.querySelector('.heartfelt-search-message');
      const fallback = out.querySelector('.topic-explain');
      return {
        cards,
        nothingFound,
        msg: heartfelt ? heartfelt.textContent?.slice(0, 60) + '...' : (fallback?.textContent?.slice(0, 60) || '') + '...'
      };
    });

    if (result.cards > 0) {
      console.log('PASS', (i + 1).toString().padStart(2), display.padEnd(48), '→', result.cards, 'verses');
      passed++;
    } else if (result.nothingFound) {
      console.log('FAIL', (i + 1).toString().padStart(2), display.padEnd(48), '→ Nothing found');
      failed++;
    } else {
      console.log('FAIL', (i + 1).toString().padStart(2), display.padEnd(48), '→ 0 verses');
      failed++;
    }
  }

  await browser.close();

  console.log('\n---');
  console.log('Passed:', passed, '/', QUERIES.length);
  if (failed > 0) process.exit(1);
  console.log('All torture queries returned verses.');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
