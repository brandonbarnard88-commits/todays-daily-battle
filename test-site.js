#!/usr/bin/env node
/**
 * Hard test of the static site: pages load, critical content present, search logic.
 * Run: node test-site.js
 *   With server: python3 -m http.server 8765 (in dist/), then node test-site.js
 *   Offline: node test-site.js --offline (reads from dist/)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const OFFLINE = process.argv.includes('--offline');
const BASE = 'http://127.0.0.1:8765';
const DIST = path.join(__dirname, 'dist');
const pages = [
  { path: '/', name: 'Home', mustInclude: ['id="search-btn"', 'Today\'s Daily Battle', 'id="prayer-counter"', 'Total prayers', 'What battle are you facing today?', 'V2 Command Deck', 'Search by what you feel right now', 'Verse image generator'], mustIncludeOneOf: [['id="query"', 'id="tdb-search"']] },
  { path: '/terms.html', name: 'Terms', mustInclude: ['Terms of Service', 'Acceptance'] },
  { path: '/pricing.html', name: 'Pricing', mustInclude: ['Pricing', 'Subscribe', 'terms.html'] },
  { path: '/privacy.html', name: 'Privacy', mustInclude: ['Privacy', 'terms.html'] },
  { path: '/study.html', name: 'Study', mustInclude: ['Study', 'notes'] },
  { path: '/verse.html', name: 'Verse of the Day', mustInclude: ['Verse'] },
  { path: '/calm.html', name: 'Need a verse now', mustInclude: ['God', 'Another verse', 'Back to home'] },
  { path: '/church.html', name: 'Church', mustInclude: ['Church'] },
  { path: '/sermon.html', name: 'Sermon', mustInclude: ['Sermon'] },
  { path: '/reading-plan.html', name: 'Reading plan', mustInclude: ['Reading', 'assets/share/verse-share.jpg'] },
  { path: '/faq.html', name: 'FAQ', mustInclude: ['FAQ'] },
  { path: '/why-not-ai.html', name: 'Why not AI', mustInclude: ['Why not AI?', 'Honest comparison', 'What real readers say', 'privacy.html', 'plans.html', 'message.html'] },
  { path: '/contact.html', name: 'Contact', mustInclude: ['Contact'] },
  { path: '/message.html', name: 'Message / Prayer Wall', mustInclude: ['message', 'Prayer', 'Encouragement'] },
  { path: '/wins-report.html', name: 'Wins Report', mustInclude: ['Wins', 'Report'] },
  { path: '/explore.html', name: 'Explore', mustInclude: ['Explore the site', 'explore-link-list', 'topic-anxiety.html', 'verse-image.html'] },
  { path: '/about.html', name: 'About', mustInclude: ['About', 'Daily Battle'] },
  { path: '/testimonials.html', name: 'Reader stories', mustInclude: ['Words from the field', 'Share yours', 'support@todaysdailybattle.com'] },
  { path: '/profile.html', name: 'Profile', mustInclude: ['Family', 'Account', 'Your Kids'] },
  { path: '/bible-tool.html', name: 'Bible Tool', mustInclude: ['Bible Tool', 'Bible stories', 'bible-story-tool-index.js', 'Featured this week', 'corner.html?story=davidGoliath', 'Read full chapter', 'assets/share/verse-share.jpg', 'verse-image.html'] },
  { path: '/verse-image.html', name: 'Verse image generator', mustInclude: ['Verse image generator', 'verse-image.js', 'assets/share/verse-share.jpg', 'recent-gens', 'verse-image-tweet', 'data-verse-store="verseGens"', 'verse-image-text-color', 'value="cross"', 'Quiet field'] },
  { path: '/bible-study.html', name: 'Bible Studies', mustInclude: ['Bible', 'Study'] },
  { path: '/pastor-toolkit.html', name: 'Pastor Toolkit', mustInclude: ['Pastor'] },
  { path: '/team-toolkit.html', name: 'Team Toolkit', mustInclude: ['Team'] },
  { path: '/coloring.html', name: 'Kids Coloring', mustInclude: ['Coloring', 'Kids'] },
  { path: '/kids-corner.html', name: 'Kids Corner', mustInclude: ['Bible Loop', 'Story Stars', 'loop-grid', 'kids-loop-og.jpg', 'summary_large_image', 'Download loop progress (PDF)', 'loop-pdf-export', 'aria-describedby="loop-pdf-export-count-hint loop-pdf-export-hint"', '20260324loops-v7', 'kids-corner.css?v=7'] },
  { path: '/kids/corner.html', name: 'Bible Story Library', mustInclude: ['kids-story-library-og.jpg', 'summary_large_image', 'Download Story Library List (PDF)', 'pdf-export', 'aria-describedby="pdf-export-count-hint pdf-export-hint"', 'story-library-fonts.css?v=1', 'kids-corner.js?v=78', 'kids-battle.js?v=78', 'TDB_PANEL_RASTER', 'nunito-latin.woff2', 'panel-david-1.svg', 'Bible Story Library'] },
  { path: '/resources.html', name: 'Pastor Resources', mustInclude: ['Resources'] },
  { path: '/reader.html', name: 'Chapter Reader', mustInclude: ['Reader', 'Chapter'] },
  { path: '/topic-anxiety.html', name: 'Topic Anxiety', mustInclude: ['anxiety', 'Anxiety'] },
  { path: '/topic-hope.html', name: 'Topic Hope', mustInclude: ['Hope'] },
  { path: '/topic-strength.html', name: 'Topic Strength', mustInclude: ['Strength'] },
  { path: '/verse-cards/index.html', name: 'Verse cards gallery', mustInclude: ['KJV verse cards', 'Philippians 4:13', 'verse-strength-philippians-4-13.png', 'Daily Battle'] },
  { path: '/action-bible.html', name: 'Action Bible Archive', mustInclude: ['Action Bible Documentary Archive', 'Documentary Controls', 'My witness profile', 'Play Selected Season', 'Continue Watching'] },
  { path: '/action-bible-workshop.html', name: 'Action Bible Workshop Toolkit', mustInclude: ['Worksheet + Class Toolkit', 'Generate Worksheet', 'Build Leader Dashboard Plan', 'Load Weekly Pack', 'Download Weekly JSON'] },
  { path: '/action-bible-weekly-packs.json', name: 'Action Bible Weekly Packs', mustInclude: ['"totalWeeks"', '"weeks"'] },
  { path: '/manifest.json', name: 'Manifest (PWA)', mustInclude: ['name', 'short_name'] },
  { path: '/shop.html', name: 'Shop', mustInclude: ['Equip Your Battle', 'Battle Mug', 'Coming Soon'] },
  { path: '/progress.html', name: 'Progress', mustInclude: ['Progress', 'Current Streak'] },
  { path: '/wins.html', name: 'Wins', mustInclude: ['Battle Wins', 'Copy My Wins', 'Generate Share Graphic'] },
  { path: '/ansiedad.html', name: 'Topic Ansiedad (ES)', mustInclude: ['Ansiedad', 'preocupación'] },
  { path: '/fuerza.html', name: 'Topic Fuerza (ES)', mustInclude: ['Fuerza'] },
  { path: '/paz.html', name: 'Topic Paz (ES)', mustInclude: ['Paz'] },
  { path: '/church/index.html', name: 'Church Join Hub', mustInclude: ['Church Join Hub', 'Join Hub'] },
];

function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    http.get({ hostname: u.hostname, port: u.port || 80, path: u.pathname + u.search }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

function readLocal(filePath) {
  const p = (filePath === '/' ? '/index.html' : filePath).replace(/^\//, '');
  const full = path.join(DIST, p);
  try {
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return { statusCode: 200, body: fs.readFileSync(full, 'utf8') };
    }
  } catch (e) {}
  return { statusCode: 404, body: '' };
}

function run() {
  let failed = 0;
  (async () => {
    if (OFFLINE) {
      console.log('Testing site (OFFLINE — reading from dist/)\n');
    } else {
      console.log('Testing site at', BASE, '\n');
    }
    const getPage = OFFLINE
      ? (p) => Promise.resolve(readLocal(p.path))
      : (p) => fetchHttp(BASE + p.path);
    for (const p of pages) {
      try {
        const { statusCode, body } = await getPage(p);
        if (statusCode !== 200) {
          console.log('FAIL', p.name, p.path, '→', statusCode);
          failed++;
          continue;
        }
        const missing = (p.mustInclude || []).filter(s => !body.includes(s));
        const oneOfOk = !p.mustIncludeOneOf || p.mustIncludeOneOf.every(opt => opt.some(s => body.includes(s)));
        if (missing.length || !oneOfOk) {
          if (missing.length) console.log('FAIL', p.name, 'missing:', missing.join(', '));
          if (!oneOfOk) console.log('FAIL', p.name, 'must include one of:', p.mustIncludeOneOf.map(o => o.join('|')).join('; '));
          failed++;
        } else {
          console.log('OK  ', p.name);
        }
      } catch (e) {
        console.log('FAIL', p.name, e.message);
        failed++;
      }
    }
    // Search logic: full-text search with synonym expansion (selfless→love) and fallback verses
    const fs = require('fs');
    const script = fs.readFileSync(__dirname + '/script.js', 'utf8');
    const hasSelflessExpansion = script.includes("'selfless'") && script.includes('love');
    const hasExpandKeywords = script.includes('expandKeywords') && script.includes('rawTokens');
    const hasFallback = script.includes('results.fallback') && script.includes('hope');
    if (!hasSelflessExpansion || !hasExpandKeywords || !hasFallback) {
      console.log('\nFAIL search logic: selfless/love expansion or fallback verses missing in script.js');
      failed++;
    } else {
      console.log('\nOK  search logic (phrase search, synonym expansion, fallback verses)');
    }
    // Prayer counter: element present on home, script wires it and formats numbers
    let homeBody = '';
    try {
      const homeRes = OFFLINE ? readLocal('/') : await fetchHttp(BASE + '/');
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
