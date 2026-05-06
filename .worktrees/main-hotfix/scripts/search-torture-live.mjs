#!/usr/bin/env node
/**
 * Live search torture test — runs 8 brutal queries in a real browser.
 * Run: node scripts/search-torture-live.mjs
 */

import { chromium, firefox } from 'playwright';

const URL = process.env.TORTURE_URL || 'https://todaysdailybattle.com/index.html';

const QUERIES = [
  'better off dead than this shit life',
  'why bother living when nobody cares',
  'cant keep going another day',
  'better if i wasnt here anymore',
  'i wish i was gone forever no one would miss me',
  'im a burden everyone would be happier if i died',
  'no reason to live kill myself tonight',
  'end my pain please make it stop',
  'die laughing at how pointless everything is',
  'kill time till i can end it all',
  // Weak-spot validation (Round 4)
  'feeling trapped no way out',
  'giving away my stuff before its too late',
  'unbearable pain i cant take it',
  'quiero morir tonight',
  'suicdal thoughts killing me',
];
/** Round 3: 1-8 trigger crisis note, 9-10 no. Round 4: 11-15 all trigger (weak-spot fixes). */
const CRISIS_NOTE_EXPECTED = [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true];

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

    await page.waitForTimeout(i === 0 ? 4000 : 2500);

    const result = await page.evaluate(() => {
      const out = document.querySelector('#feel-results') || document.querySelector('#output');
      if (!out) return { cards: 0, nothingFound: false, crisisNote: false };
      const cards = out.querySelectorAll('.verse-card, .smart-card, .result-card').length;
      const empty = out.querySelector('.empty');
      const nothingFound = empty && /Nothing found/i.test(empty.textContent || '');
      const crisisEl = out.querySelector('.crisis-resources-note');
      const crisisNote = !!(crisisEl && crisisEl.textContent && crisisEl.textContent.includes('988'));
      return { cards, nothingFound, crisisNote };
    });

    const expectCrisis = CRISIS_NOTE_EXPECTED[i];
    const crisisOk = result.crisisNote === expectCrisis;
    const versesOk = result.cards > 0;
    const pass = versesOk && crisisOk;

    let status = pass ? 'PASS' : 'FAIL';
    let detail = result.cards + ' verses';
    if (!crisisOk) detail += ', note ' + (result.crisisNote ? 'YES' : 'NO') + ' (expected ' + (expectCrisis ? 'YES' : 'NO') + ')';
    else detail += ', note ' + (result.crisisNote ? 'YES' : 'NO');

    if (pass) {
      console.log(status, (i + 1).toString().padStart(2), display.padEnd(48), '→', detail);
      passed++;
    } else {
      console.log(status, (i + 1).toString().padStart(2), display.padEnd(48), '→', detail);
      failed++;
    }
  }

  await browser.close();

  console.log('\n---');
  console.log('Passed:', passed, '/', QUERIES.length);
  if (failed > 0) process.exit(1);
  console.log('All torture queries passed (verses + crisis note triggers).');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
