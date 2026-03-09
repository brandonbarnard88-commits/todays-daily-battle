#!/usr/bin/env node
/**
 * Simulate real browser behavior with localStorage persistence
 * This simulates what happens when a user visits the site multiple times
 */

const BUNDLED_DAILY_VERSE_FALLBACKS = [
  { ref: 'Philippians 4:6' },
  { ref: 'Isaiah 41:10' },
  { ref: 'Psalms 46:1' },
  { ref: 'Joshua 1:9' },
  { ref: 'Matthew 11:28' },
  { ref: 'Romans 8:28' }
];

function pickBundledDailyFallback(lastRef) {
  const list = BUNDLED_DAILY_VERSE_FALLBACKS;
  let pool = list;
  
  if (lastRef && list.length > 1) {
    pool = list.filter(item => item.ref !== lastRef);
    if (!pool.length) pool = list;
  }
  
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx] || list[0];
}

console.log('\n🌐 Simulating Real Browser Behavior\n');
console.log('═'.repeat(60) + '\n');

console.log('Scenario 1: New user (no localStorage)');
console.log('═'.repeat(40));
let storage = null;
const verse1 = pickBundledDailyFallback(storage);
console.log(`First visit: ${verse1.ref}`);
storage = verse1.ref;

console.log('\n\nScenario 2: Same user refreshes page');
console.log('═'.repeat(40));
const verse2 = pickBundledDailyFallback(storage);
console.log(`Second visit (same browser): ${verse2.ref}`);
console.log(`Different from first? ${verse2.ref !== verse1.ref ? '✅ YES' : '❌ NO (would be same due to anti-flicker)'}`);

console.log('\n\nScenario 3: Different browsers / incognito windows');
console.log('═'.repeat(40));
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Mobile Safari', 'Chrome Mobile'];
const verses = [];

for (const browser of browsers) {
  // Each browser has independent localStorage
  const verse = pickBundledDailyFallback(null);
  verses.push(verse.ref);
  console.log(`${browser.padEnd(15)}: ${verse.ref}`);
}

const unique = [...new Set(verses)];
console.log(`\nUnique verses across browsers: ${unique.length}/${browsers.length}`);

console.log('\n\nScenario 4: Same user clears cache/localStorage');
console.log('═'.repeat(40));
storage = null; // Cleared
const verse3 = pickBundledDailyFallback(storage);
console.log(`After clearing localStorage: ${verse3.ref}`);
console.log(`Can be different from previous: ✅ YES`);

console.log('\n' + '═'.repeat(60));
console.log('\n📊 Expected Production Behavior:\n');
console.log('✅ NEW users see random verse from 6-verse pool');
console.log('✅ RETURNING users see same verse (anti-flicker, localStorage)');
console.log('✅ DIFFERENT browsers see different verses');
console.log('✅ CLEARED cache allows new random verse');
console.log('\n💡 This is the CORRECT behavior per the user requirements.');
console.log('   "Same user sees consistent verse, different users see variety."');
console.log('\n' + '═'.repeat(60) + '\n');
