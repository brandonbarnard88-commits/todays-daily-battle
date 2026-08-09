#!/usr/bin/env node
/**
 * Triple-check every home feeling chip + topic-*.html page.
 * Fail build if any chip lacks KJV-backed curated verses or topic pages lack KISS structure.
 *
 * Run: node scripts/verify-all-topics.mjs
 * Wired into verify:teaching / build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function loadKjv() {
  return JSON.parse(fs.readFileSync(path.join(root, 'data/kjv-full.json'), 'utf8'));
}

function primaryRef(ref) {
  const n = String(ref || '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  /* Romans 6:6-7 → Romans 6:6 */
  const range = n.match(/^(.+?\s+\d+):(\d+)-\d+$/);
  if (range) return range[1] + ':' + range[2];
  const m = n.match(/^(.+?\s+\d+:\d+)/);
  return m ? m[1].trim() : n;
}

function kjvText(kjv, ref) {
  const r = primaryRef(ref);
  if (!r) return '';
  if (kjv[r]) return kjv[r];
  const a = r.replace(/^Psalms\s+/i, 'Psalm ').replace(/^Psalm\s+/i, 'Psalms ');
  return kjv[a] || '';
}

function extractTopicsBody(script) {
  const start = script.indexOf('const topics = {');
  if (start < 0) throw new Error('const topics = { not found in script.js');
  let depth = 0;
  let end = -1;
  for (let j = start; j < script.length && j < start + 250000; j++) {
    if (script[j] === '{') depth++;
    else if (script[j] === '}') {
      depth--;
      if (depth === 0) {
        end = j;
        break;
      }
    }
  }
  if (end < 0) throw new Error('could not close topics object');
  return script.slice(start, end + 1);
}

function extractVerses(topicsBody, topicKey) {
  const escaped = topicKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp("\\n  '" + escaped + "': \\{[\\s\\S]*?verses:\\s*\\[([^\\]]+)\\]", 'i'),
    new RegExp('\\n  "' + escaped + '": \\{[\\s\\S]*?verses:\\s*\\[([^\\]]+)\\]', 'i'),
    new RegExp('\\n  ' + escaped + ': \\{[\\s\\S]*?verses:\\s*\\[([^\\]]+)\\]', 'i'),
  ];
  for (const p of patterns) {
    const hit = topicsBody.match(p);
    if (hit) return [...hit[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }
  return null;
}

function parseChipMap(feelSrc) {
  const m = feelSrc.match(/CHIP_TO_TOPICS_KEY\s*=\s*\{([\s\S]*?)\n\};/);
  if (!m) return {};
  const map = {};
  for (const mm of m[1].matchAll(/(?:'([^']+)'|"([^"]+)"|([a-zA-Z0-9_]+))\s*:\s*["']([^"']+)["']/g)) {
    const key = mm[1] || mm[2] || mm[3];
    map[key] = mm[4];
  }
  return map;
}

function main() {
  console.log('All-topics audit (chips + topic pages)\n');
  const kjv = loadKjv();
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const chips = [
    ...new Set([...index.matchAll(/data-topic="([^"]+)"/g)].map((m) => m[1].trim().toLowerCase())),
  ].sort();
  if (chips.length < 30) fail('Expected 30+ home chips, found ' + chips.length);

  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const topicsBody = extractTopicsBody(script);
  const feel = fs.readFileSync(path.join(root, 'tdb-home-feel.js'), 'utf8');
  if (!feel.includes('CHIP_TO_TOPICS_KEY') || !feel.includes('buildFeelGroupFromScriptTopics')) {
    fail('tdb-home-feel.js missing chip→topics bridge');
  }
  const chipMap = parseChipMap(feel);

  /* Every chip must resolve to a topics key with KJV verses */
  for (const chip of chips) {
    const mapped = chipMap[chip] || chip;
    const verses = extractVerses(topicsBody, mapped) || extractVerses(topicsBody, chip);
    if (!verses || !verses.length) {
      fail('Chip "' + chip + '" → "' + mapped + '" has no topics.verses array');
      continue;
    }
    if (verses.length < 3) {
      fail('Chip "' + chip + '" has only ' + verses.length + ' verses (need ≥3)');
    }
    for (const ref of verses) {
      const t = kjvText(kjv, ref);
      if (!t || t.length < 12) {
        fail('Chip "' + chip + '" verse missing/short KJV: ' + ref);
      }
      /* Multi-verse ranges must not remain if single-key lookup fails */
      if (/:\d+-\d+$/.test(ref) && !kjvText(kjv, ref)) {
        fail('Chip "' + chip + '" range ref not resolvable: ' + ref);
      }
    }
  }

  /* Required chip maps */
  const requiredMaps = {
    'difficult person': 'forgiveness',
    'difficult boss': 'forgiveness',
    'free will': 'free will',
    'jesus said': 'jesus said',
    wonder: 'wonder',
    exhaustion: 'exhaustion',
  };
  for (const [chip, expect] of Object.entries(requiredMaps)) {
    if (chipMap[chip] !== expect && !extractVerses(topicsBody, chip)) {
      if (chipMap[chip] !== expect) {
        fail('CHIP_TO_TOPICS_KEY["' + chip + '"] should be "' + expect + '" (got "' + (chipMap[chip] || '') + '")');
      }
    }
  }

  /* Loneliness must stay clean */
  const lon = extractVerses(topicsBody, 'loneliness') || [];
  if (lon.some((v) => /1\s*Corinthians\s*7:4/i.test(v))) {
    fail('loneliness topics list must not include 1 Corinthians 7:4');
  }
  const lonMust = ['Psalms 68:6', 'Hebrews 13:5', 'Isaiah 41:10'];
  for (const r of lonMust) {
    if (!lon.some((v) => primaryRef(v) === primaryRef(r) || v.replace(/^Psalms/i, 'Psalm') === r.replace(/^Psalms/i, 'Psalm'))) {
      /* soft: allow Psalm/Psalms alias */
      const ok = lon.some((v) => primaryRef(v).replace(/^Psalms\s+/i, 'Psalm ') === primaryRef(r).replace(/^Psalms\s+/i, 'Psalm '));
      if (!ok) fail('loneliness missing anchor ' + r);
    }
  }

  /* Topic pages */
  const pages = fs.readdirSync(root).filter((f) => /^topic-.*\.html$/i.test(f)).sort();
  if (pages.length < 10) fail('Expected ≥10 topic-*.html, found ' + pages.length);
  for (const file of pages) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    /* Only Key Verses list-items — not porch hero / sidebar strongs. */
    const listChunks = [...html.matchAll(/<div class="list-item">[\s\S]*?<\/div>\s*<\/div>/gi)].map(
      (m) => m[0]
    );
    const refs = [];
    for (const chunk of listChunks) {
      const sm = chunk.match(/<strong>([^<]*\d+:\d+[^<]*)<\/strong>/i);
      if (sm) refs.push(String(sm[1]).replace(/\s*\(KJV\)\s*$/i, '').trim());
    }
    if (!refs.length) {
      fail(file + ': no Key Verses list-item refs');
      continue;
    }
    const vbd = (html.match(/data-tdb-topic-vbd="1"/g) || []).length;
    if (vbd < refs.length) fail(file + ': topic-vbd cards ' + vbd + ' < list refs ' + refs.length);
    if (!/tdb-kiss-verse|In simpler words|What was going on|What it means/i.test(html)) {
      fail(file + ': missing KISS structure labels');
    }
    if (/In plain terms for life today:|Sit with that until one phrase lands/i.test(html)) {
      fail(file + ': weak plain stamp in static HTML');
    }
    for (const r of refs) {
      const t = kjvText(kjv, r);
      if (!t) fail(file + ': missing KJV for list ref ' + r);
    }
  }

  /* Pure-topic guard in script.js */
  if (!script.includes('pureTopic') && !script.includes('pure topic')) {
    fail('script.js should prefer curated-only results for pure topic chip queries');
  }
  if (!script.includes('data-tdb-no-verse-breakdown')) {
    fail('script.js home cards should set data-tdb-no-verse-breakdown');
  }

  console.log('Chips checked:', chips.length);
  console.log('Topic pages checked:', pages.length);
  console.log('Checks complete.\n');
  if (failures.length) {
    console.error('FAIL: ' + failures.length + ' topic integrity issue(s):\n');
    failures.forEach((f, i) => console.error('  ' + (i + 1) + '. ' + f));
    process.exit(1);
  }
  console.log('PASS: all topics audit clean.');
}

main();
