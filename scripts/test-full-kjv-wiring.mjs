#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const full = JSON.parse(fs.readFileSync(path.join(root, 'data', 'kjv-full.json'), 'utf8'));
const stub = JSON.parse(fs.readFileSync(path.join(root, 'kjv.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function normalizeBibleRef(ref) {
  if (!ref) return '';
  let cleaned = ref.replace(/\u00A0/g, ' ').trim();
  cleaned = cleaned.replace(/\s+/g, ' ');
  cleaned = cleaned.replace(/^Psalms\s*/i, 'Psalm ');
  cleaned = cleaned.replace(/^Ps(?!alms?)\.?\s*/i, 'Psalm ');
  cleaned = cleaned.replace(/^Psalm(\d)/i, 'Psalm $1');
  return cleaned.trim();
}

function resolveBibleTextFromMap(map, ref) {
  if (!map || !ref) return '';
  if (map[ref]) return map[ref];
  const normalized = normalizeBibleRef(ref);
  if (normalized && map[normalized]) return map[normalized];
  const candidates = [];
  if (normalized) candidates.push(normalized);
  if (ref && ref !== normalized) candidates.push(String(ref).trim());
  for (const c of candidates) {
    if (!c) continue;
    if (map[c]) return map[c];
    if (/^Psalm\s+/i.test(c)) {
      const plural = c.replace(/^Psalm\s+/i, 'Psalms ');
      if (map[plural]) return map[plural];
    }
    if (/^Psalms\s+/i.test(c)) {
      const singular = c.replace(/^Psalms\s+/i, 'Psalm ');
      if (map[singular]) return map[singular];
    }
  }
  return '';
}

let failed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg);
    failed++;
  } else console.log('OK', msg);
}

ok(Object.keys(full).length > 30000, 'full corpus size ' + Object.keys(full).length);
ok(Array.isArray(stub) && stub.length < 100, 'stub remains small emergency pack');
ok(script.includes("KJV: '/data/kjv-full.json'"), 'versionFiles.KJV points at full');
ok(script.includes('resolveBibleTextFromMap'), 'resolve helper present');
ok(script.includes('KJV_MIN_VERSE_COUNT'), 'min verse gate present');
ok(script.includes('/data/kjv-full.json'), 'preload/full URLs present');

const psalm = resolveBibleTextFromMap(full, 'Psalm 23:1');
const psalms = resolveBibleTextFromMap(full, 'Psalms 23:1');
ok(!!psalm && psalm.toLowerCase().includes('shepherd'), 'Psalm 23:1 resolves: ' + (psalm || '').slice(0, 40));
ok(!!psalms && psalms === psalm, 'Psalms 23:1 matches Psalm 23:1');

const john = resolveBibleTextFromMap(full, 'John 3:16');
ok(!!john && /begotten Son/i.test(john), 'John 3:16 full text');

// Secondary files prefer full
for (const f of ['mystudy.js', 'gentle-suggest.js', 'fallback-search.js', 'verse-search-dropdown.js', 'service-worker.js']) {
  const t = fs.readFileSync(path.join(root, f), 'utf8');
  ok(t.includes('/data/kjv-full.json'), f + ' prefers full KJV');
}

if (failed) {
  console.error('Failed:', failed);
  process.exit(1);
}
console.log('Full-KJV wiring smoke passed.');
