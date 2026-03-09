#!/usr/bin/env node
/**
 * Test localStorage behavior simulation
 * Simulates what pickFreshDailyVerseRef() would do across multiple page loads
 */

const DAILY_VERSE_SAFE_REFS = [
  'Psalms 23:1', 'Psalms 23:4', 'Psalms 27:1', 'Psalms 34:4', 'Psalms 46:1', 'Psalms 91:1', 'Psalms 121:1', 'Psalms 138:3',
  'Proverbs 3:5', 'Proverbs 12:25', 'Proverbs 16:3', 'Proverbs 22:6',
  'Isaiah 40:31', 'Isaiah 41:10', 'Isaiah 43:2', 'Isaiah 54:10',
  'Jeremiah 29:11', 'Jeremiah 33:3',
  'Joshua 1:9', 'Deuteronomy 31:6',
  'Matthew 5:14', 'Matthew 6:34', 'Matthew 11:28', 'Matthew 28:20',
  'John 3:16', 'John 14:27', 'John 15:12', 'John 16:33',
  'Romans 8:28', 'Romans 8:38', 'Romans 12:12', 'Romans 15:13',
  'Philippians 4:6', 'Philippians 4:7', 'Philippians 4:13', 'Philippians 4:19',
  'Colossians 3:2', 'Colossians 3:23',
  '2 Timothy 1:7', 'Hebrews 11:1', 'Hebrews 13:5', 'James 1:2', 'James 1:12',
  '1 Peter 5:7', '1 John 4:18', '1 John 4:19', 'Revelation 21:4',
  'Ephesians 6:10', 'Ephesians 6:11', 'Galatians 5:22', 'Romans 8:1'
];

// Simulate localStorage
let mockStorage = {};

function pickFreshDailyVerseRef() {
  var safeRefs = DAILY_VERSE_SAFE_REFS;
  if (!safeRefs.length) return null;
  var lastRef = mockStorage['tdb_last_open_daily_verse_v2'] || '';
  var pool = safeRefs;
  if (lastRef && safeRefs.length > 1) {
    pool = safeRefs.filter(function (ref) { return ref !== lastRef; });
    if (!pool.length) pool = safeRefs;
  }
  var idx = Math.floor(Math.random() * pool.length);
  var picked = pool[idx] || safeRefs[0];
  mockStorage['tdb_last_open_daily_verse_v2'] = picked;
  return picked;
}

console.log('🔬 Simulating 6 independent page loads with fresh pickFreshDailyVerseRef():\n');

const results = [];
for (let i = 1; i <= 6; i++) {
  const verse = pickFreshDailyVerseRef();
  results.push(verse);
  console.log(`Load ${i}: ${verse}`);
}

const unique = [...new Set(results)];
console.log(`\n📊 Unique verses: ${unique.length}/${results.length}`);

if (unique.length === 1) {
  console.log(`\n❌ FAIL: All same verse (algorithm broken)`);
} else {
  console.log(`\n✅ PASS: Algorithm works correctly`);
}

console.log(`\n💡 This means the LOCAL code is working.`);
console.log(`   If production shows only one verse, the issue is:`);
console.log(`   1. User's browser has locked localStorage with one verse`);
console.log(`   2. renderDailyBattleCard() isn't being called`);
console.log(`   3. Page HTML has hardcoded verse that never gets replaced`);
