#!/usr/bin/env node
/**
 * Production verification - Final report
 * Tests current state of todaysdailybattle.com
 */

import { fetchText } from './_lib/live-http-utils.mjs';

const SITE_URL = 'https://todaysdailybattle.com';

async function checkHTML() {
  const data = await fetchText(`${SITE_URL}/?cb=${Date.now()}`);
  const hasLoadingPlaceholder = /Loading today's verse/.test(data);
  const hasHardcodedVerse = /<strong>Philippians 4:6<\/strong>/.test(data);
  const hasVerseCardLoaded = /verse-card-loaded/.test(data);
  return { hasLoadingPlaceholder, hasHardcodedVerse, hasVerseCardLoaded };
}

async function checkScript() {
  const data = await fetchText(`${SITE_URL}/script.js?cb=${Date.now()}`);
  const hasPickFreshDailyVerseRef = /function pickFreshDailyVerseRef/.test(data);
  const hasBundledFallbacksArray = /var BUNDLED_DAILY_VERSE_FALLBACKS\s*=\s*\[/.test(data);
  const hasRenderDailyBattleCard = /async function renderDailyBattleCard/.test(data);
  return { hasPickFreshDailyVerseRef, hasBundledFallbacksArray, hasRenderDailyBattleCard };
}

async function main() {
  console.log('\n🔍 Production Verification Report\n');
  console.log('═'.repeat(60) + '\n');
  
  console.log('📄 HTML Check:\n');
  const html = await checkHTML();
  console.log(`   ${html.hasLoadingPlaceholder ? '✅' : '❌'} Has loading placeholder`);
  console.log(`   ${html.hasHardcodedVerse ? '❌' : '✅'} No hardcoded Philippians 4:6`);
  console.log(`   ${html.hasVerseCardLoaded ? '❌' : '✅'} No pre-loaded verse-card-loaded class`);
  
  console.log('\n📜 JavaScript Check:\n');
  const script = await checkScript();
  console.log(`   ${script.hasPickFreshDailyVerseRef ? '✅' : '❌'} pickFreshDailyVerseRef() present`);
  console.log(`   ${script.hasBundledFallbacksArray ? '✅' : '❌'} BUNDLED_DAILY_VERSE_FALLBACKS array present`);
  console.log(`   ${script.hasRenderDailyBattleCard ? '✅' : '❌'} renderDailyBattleCard() present`);
  
  console.log('\n' + '═'.repeat(60));
  
  const htmlOK = html.hasLoadingPlaceholder && !html.hasHardcodedVerse && !html.hasVerseCardLoaded;
  const scriptOK = script.hasPickFreshDailyVerseRef && script.hasBundledFallbacksArray && script.hasRenderDailyBattleCard;
  
  if (htmlOK && scriptOK) {
    console.log('\n✅ DEPLOYMENT VERIFIED');
    console.log('\nAll components are in place for verse rotation:');
    console.log('  • HTML: Clean loading placeholder (no hardcoded verse)');
    console.log('  • JS: Rotation logic deployed and ready');
    console.log('\n📱 Real-world test needed:');
    console.log('  Open https://todaysdailybattle.com in multiple browsers');
    console.log('  or clear localStorage between loads to see rotation.');
    console.log('\n💡 Note: Same browser will remember last verse in localStorage,');
    console.log('  which is intentional to avoid verse flicker on page reload.');
  } else {
    console.log('\n❌ DEPLOYMENT INCOMPLETE');
    if (!htmlOK) console.log('  • HTML still has hardcoded verse or wrong structure');
    if (!scriptOK) console.log('  • JavaScript rotation logic missing');
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
}

main().catch(console.error);
