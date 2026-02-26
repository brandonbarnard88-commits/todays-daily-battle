#!/usr/bin/env node
/**
 * Hard test of the static site: pages load, critical content present, search logic.
 * Run: node test-site.js
 * Requires: server running at http://127.0.0.1:8765 (python3 -m http.server 8765)
 */

const http = require('http');

const BASE = 'http://127.0.0.1:8765';
const pages = [
  { path: '/', name: 'Home', mustInclude: ['id="query"', 'id="search-btn"', 'Today\'s Daily Battle', 'id="prayer-counter"', 'Total prayers'] },
  { path: '/terms.html', name: 'Terms', mustInclude: ['Terms of Service', 'Acceptance'] },
  { path: '/pricing.html', name: 'Pricing', mustInclude: ['Pricing', 'Subscribe', 'terms.html'] },
  { path: '/privacy.html', name: 'Privacy', mustInclude: ['Privacy', 'terms.html'] },
  { path: '/study.html', name: 'Study', mustInclude: ['Study', 'notes'] },
  { path: '/verse.html', name: 'Verse of the Day', mustInclude: ['Verse'] },
  { path: '/church.html', name: 'Church', mustInclude: ['Church'] },
  { path: '/sermon.html', name: 'Sermon', mustInclude: ['Sermon'] },
  { path: '/reading-plan.html', name: 'Reading plan', mustInclude: ['Reading'] },
  { path: '/faq.html', name: 'FAQ', mustInclude: ['FAQ'] },
  { path: '/contact.html', name: 'Contact', mustInclude: ['Contact'] },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    http.get({ hostname: u.hostname, port: u.port || 80, path: u.pathname + u.search }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

function run() {
  let failed = 0;
  (async () => {
    console.log('Testing site at', BASE, '\n');
    for (const p of pages) {
      const url = BASE + p.path;
      try {
        const { statusCode, body } = await fetch(url);
        if (statusCode !== 200) {
          console.log('FAIL', p.name, p.path, '→', statusCode);
          failed++;
          continue;
        }
        const missing = p.mustInclude.filter(s => !body.includes(s));
        if (missing.length) {
          console.log('FAIL', p.name, 'missing:', missing.join(', '));
          failed++;
        } else {
          console.log('OK  ', p.name);
        }
      } catch (e) {
        console.log('FAIL', p.name, e.message);
        failed++;
      }
    }
    // Search logic check (selfless -> love)
    const fs = require('fs');
    const script = fs.readFileSync(__dirname + '/script.js', 'utf8');
    const hasSelflessSynonym = script.includes("'selfless'") && script.includes('love');
    const hasSingleWordSynonym = script.includes('singleWord') && script.includes("syn === singleWord");
    const hasFallback = script.includes('results.fallback') && script.includes('hope');
    if (!hasSelflessSynonym || !hasSingleWordSynonym || !hasFallback) {
      console.log('\nFAIL search logic: selfless/love synonym or fallback verses missing in script.js');
      failed++;
    } else {
      console.log('\nOK  search logic (selfless→love, fallback verses)');
    }
    // Prayer counter: element present on home, script wires it and formats numbers
    let homeBody = '';
    try {
      const homeRes = await fetch(BASE + '/');
      homeBody = homeRes.body || '';
    } catch (e) { homeBody = ''; }
    const hasCounterEl = homeBody.indexOf('id="prayer-counter"') !== -1 && homeBody.indexOf('Total prayers') !== -1;
    const hasWireCounter = script.includes('prayer-counter') && script.includes('wireRealPrayerCounter');
    const hasFormatCount = script.includes('toLocaleString()') && script.includes('formatCount');
    const hasRefresh = script.includes('__fetchPrayerCount');
    if (!hasCounterEl || !hasWireCounter || !hasFormatCount || !hasRefresh) {
      console.log('\nFAIL prayer counter: missing element, wire, formatCount, or refresh');
      if (!hasCounterEl) console.log('  - Home page must include id="prayer-counter" and "Total prayers"');
      if (!hasWireCounter) console.log('  - script.js must wire prayer-counter in wireRealPrayerCounter');
      if (!hasFormatCount) console.log('  - script.js must use formatCount with toLocaleString');
      if (!hasRefresh) console.log('  - script.js must expose __fetchPrayerCount for refresh');
      failed++;
    } else {
      console.log('\nOK  prayer counter (element, wire, formatCount, refresh)');
    }
    console.log('\n' + (failed ? failed + ' failure(s).' : 'All checks passed.'));
    process.exit(failed ? 1 : 0);
  })();
}
run();
