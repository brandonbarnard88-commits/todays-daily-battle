#!/usr/bin/env node
/**
 * Fail-safe layer: Bible characters / “who is this” integrity
 *
 * - people-verse-map.js refs must exist in KJV
 * - bible-characters.json entries must cite real KJV refs in did/impact
 * - Character name ↔ verse map consistency (spot checks)
 *
 * Run: node scripts/verify-characters-integrity.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import {
  loadKjvFull,
  resolveKjvText,
  extractRefsFromText,
} from './lib/kjv-ref-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function loadPeopleVerseMap() {
  const code = fs.readFileSync(path.join(root, 'people-verse-map.js'), 'utf8');
  const sandbox = {};
  sandbox.root = sandbox;
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'people-verse-map.js' });
  // IIFE may attach to root or window
  const map =
    sandbox.PEOPLE_VERSE_MAP ||
    (sandbox.window && sandbox.window.PEOPLE_VERSE_MAP) ||
    sandbox.root?.PEOPLE_VERSE_MAP;
  if (!map || typeof map !== 'object') {
    // fallback parse
    const m = code.match(/PEOPLE_VERSE_MAP\s*=\s*\{([\s\S]*?)\n\s*\};/);
    if (!m) throw new Error('PEOPLE_VERSE_MAP not found');
    // crude: re-run with function wrapper
    const fn = new Function(`${code}; return typeof PEOPLE_VERSE_MAP !== 'undefined' ? PEOPLE_VERSE_MAP : (typeof root !== 'undefined' && root.PEOPLE_VERSE_MAP);`);
    return fn();
  }
  return map;
}

function auditPeopleVerseMap(kjv) {
  let map;
  try {
    const code = fs.readFileSync(path.join(root, 'people-verse-map.js'), 'utf8');
    // Extract object literal after PEOPLE_VERSE_MAP =
    const start = code.indexOf('PEOPLE_VERSE_MAP');
    const brace = code.indexOf('{', start);
    let depth = 0;
    let end = -1;
    for (let i = brace; i < code.length; i++) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    map = JSON.parse(
      code
        .slice(brace, end + 1)
        .replace(/(['"])?([a-zA-Z][a-zA-Z0-9 ]*)\1\s*:/g, (m, q, k) => {
          // already quoted keys mostly
          return m;
        })
        // keys are already "jesus": [...]
        .replace(/(\w+)\s*:/g, (m, k) => {
          if (k === 'true' || k === 'false' || k === 'null') return m;
          return m;
        })
    );
  } catch {
    // manual line parse
    map = {};
    const code = fs.readFileSync(path.join(root, 'people-verse-map.js'), 'utf8');
    for (const m of code.matchAll(/"([^"]+)":\s*\[([^\]]+)\]/g)) {
      const name = m[1];
      const refs = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      map[name] = refs;
    }
  }

  const names = Object.keys(map);
  if (names.length < 20) fail(`people-verse-map too small (${names.length} names)`);

  let checked = 0;
  for (const [name, refs] of Object.entries(map)) {
    if (!Array.isArray(refs) || !refs.length) {
      fail(`people-verse-map "${name}" has no verses`);
      continue;
    }
    for (const ref of refs) {
      if (!resolveKjvText(kjv, ref)) {
        fail(`people-verse-map "${name}" bad ref: ${ref}`);
      } else {
        checked++;
      }
    }
  }
  if (checked < 40) fail(`people-verse-map: only ${checked} valid refs`);
}

function auditBibleCharactersJson(kjv) {
  const p = path.join(root, 'bible-characters.json');
  if (!fs.existsSync(p)) {
    fail('bible-characters.json missing');
    return;
  }
  const list = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!Array.isArray(list) || list.length < 30) {
    fail(`bible-characters.json too small (${list?.length || 0})`);
    return;
  }

  // Must-have core people
  const names = new Set(list.map((c) => String(c.name || '').toLowerCase()));
  for (const must of ['jesus', 'moses', 'david', 'paul', 'peter', 'abraham', 'mary']) {
    if (![...names].some((n) => n.includes(must))) {
      fail(`bible-characters.json missing core person: ${must}`);
    }
  }

  let refsChecked = 0;
  for (const c of list) {
    if (!c.name || !c.who) {
      fail(`character entry missing name/who: ${JSON.stringify(c).slice(0, 80)}`);
      continue;
    }
    const blob = `${c.did || ''} ${c.impact || ''} ${c.who || ''}`;
    const refs = extractRefsFromText(blob);
    for (const ref of refs) {
      if (!resolveKjvText(kjv, ref)) {
        fail(`bible-characters "${c.name}" cites missing KJV ref: ${ref}`);
      } else {
        refsChecked++;
      }
    }
  }
  if (refsChecked < 20) {
    fail(`bible-characters.json: too few valid embedded refs (${refsChecked})`);
  }
}

/** Spot-check: Jesus map must include John 3:16 or Matthew 28 style gospel refs */
function auditFamousConsistency(kjv) {
  const code = fs.readFileSync(path.join(root, 'people-verse-map.js'), 'utf8');
  if (!/john\s*3:16/i.test(code)) {
    fail('people-verse-map: Jesus block should include John 3:16');
  }
  if (!/1 samuel 17/i.test(code) && !/1\s*samuel\s*17/i.test(code)) {
    // david goliath
    warnOrFailDavid(code);
  }
  void kjv;
}

function warnOrFailDavid(code) {
  if (!/david/.test(code)) fail('people-verse-map missing david');
}

function main() {
  console.log('Characters / who-is integrity (fail-safe layer)\n');
  const kjv = loadKjvFull(root);
  auditPeopleVerseMap(kjv);
  auditBibleCharactersJson(kjv);
  auditFamousConsistency(kjv);

  if (failures.length) {
    console.error(`FAIL: ${failures.length} character integrity issue(s):\n`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  }
  console.log('PASS: characters integrity clean.');
}

main();
