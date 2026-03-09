#!/usr/bin/env node
/**
 * Production verse-rotation verifier (JS-render architecture aware)
 * Validates that production no longer hardcodes the hero verse in HTML
 * and that runtime rotation hooks are deployed.
 */

import https from 'https';
import { JSDOM } from 'jsdom';

const SITE_URL = 'https://todaysdailybattle.com';
const LOAD_COUNT = 6;

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (verify-verse-rotation)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        resolve(data);
      });
    }).on('error', reject);
  });
}

function inspectHtml(html, url) {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;
  const card = document.querySelector('#daily-battle-card');
  const hardcodedStrong = document.querySelector('#daily-battle-card strong');
  const loadingLine = card ? card.querySelector('.daily-battle-loading') : null;
  const hasSearchInput = !!document.querySelector('#tdb-search');
  const hasResultsContainer = !!document.querySelector('#output');

  return {
    hasCard: !!card,
    hasHardcodedVerse: !!hardcodedStrong,
    hasLoadingPlaceholder: !!loadingLine,
    hasSearchInput,
    hasResultsContainer
  };
}

function inspectScript(script) {
  return {
    hasPickFreshDailyVerseRef: /function pickFreshDailyVerseRef/.test(script),
    hasBundledFallbacks: /var BUNDLED_DAILY_VERSE_FALLBACKS\s*=\s*\[/.test(script),
    hasRenderDailyBattleCard: /async function renderDailyBattleCard/.test(script),
    hasPreRotatedHook: /window\.__tdbPreRotatedDailyBattle/.test(script)
  };
}

async function main() {
  console.log(`\n🔍 Verifying production (JS-render model): ${SITE_URL}\n`);
  const timestamp = Date.now();
  const loads = [];

  console.log(`📖 Test 1: Homepage structure across ${LOAD_COUNT} cache-busted loads\n`);
  for (let i = 1; i <= LOAD_COUNT; i += 1) {
    const url = `${SITE_URL}/?cb=${timestamp + i * 1000}`;
    process.stdout.write(`Load ${i}: ${url} ... `);
    try {
      const html = await fetchPage(url);
      const check = inspectHtml(html, url);
      loads.push(check);
      const ok = check.hasCard && check.hasLoadingPlaceholder && !check.hasHardcodedVerse;
      console.log(ok ? '✅' : '❌');
      console.log(`   card=${check.hasCard} loading=${check.hasLoadingPlaceholder} hardcodedStrong=${check.hasHardcodedVerse}`);
    } catch (err) {
      console.log(`❌ (${err.message})`);
      loads.push({ hasCard: false, hasLoadingPlaceholder: false, hasHardcodedVerse: true, hasSearchInput: false, hasResultsContainer: false });
    }
  }

  console.log(`\n📜 Test 2: Runtime hook deployment (script.js)\n`);
  const scriptUrl = `${SITE_URL}/script.js?cb=${Date.now()}`;
  const script = await fetchPage(scriptUrl);
  const scriptChecks = inspectScript(script);
  console.log(`pickFreshDailyVerseRef(): ${scriptChecks.hasPickFreshDailyVerseRef ? '✅' : '❌'}`);
  console.log(`BUNDLED_DAILY_VERSE_FALLBACKS: ${scriptChecks.hasBundledFallbacks ? '✅' : '❌'}`);
  console.log(`renderDailyBattleCard(): ${scriptChecks.hasRenderDailyBattleCard ? '✅' : '❌'}`);
  console.log(`__tdbPreRotatedDailyBattle hook: ${scriptChecks.hasPreRotatedHook ? '✅' : '❌'}`);

  const goodLoads = loads.filter((l) => l.hasCard && l.hasLoadingPlaceholder && !l.hasHardcodedVerse);
  const searchSurfaces = loads.filter((l) => l.hasSearchInput && l.hasResultsContainer);
  const scriptOk = scriptChecks.hasPickFreshDailyVerseRef && scriptChecks.hasBundledFallbacks && scriptChecks.hasRenderDailyBattleCard;

  console.log(`\n📊 Summary`);
  console.log(`Good homepage loads: ${goodLoads.length}/${LOAD_COUNT}`);
  console.log(`Search surface present: ${searchSurfaces.length}/${LOAD_COUNT}`);
  console.log(`Runtime hooks deployed: ${scriptOk ? 'yes' : 'no'}`);

  console.log(`\n═══════════════════════════════════════════════════\n`);
  if (goodLoads.length === LOAD_COUNT && scriptOk) {
    console.log('✅ PASS: Production is aligned with JS-rendered verse rotation architecture.');
    console.log('ℹ️  For runtime rotation behavior per browser/session, rely on `npm run qa:smoke` and `npm run test:mobile`.');
    process.exit(0);
  } else {
    console.log('❌ FAIL: Production structure/hooks are incomplete or inconsistent.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`❌ Fatal: ${err.message}`);
  process.exit(1);
});
