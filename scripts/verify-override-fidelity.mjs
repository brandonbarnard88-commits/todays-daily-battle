#!/usr/bin/env node
/**
 * Override catalog fidelity sample gate.
 *
 * Hero 365 is fully checked by verify-hero-365-fidelity.mjs.
 * This samples the large verse-breakdown-manifest overrides so wrong speaker /
 * wrong-cluster / empty-about paste cannot hide off the homepage.
 *
 * Default: 800 random refs (deterministic seed from date UTC).
 *   OVERRIDE_FIDELITY_SAMPLE=1500 node scripts/verify-override-fidelity.mjs
 *   OVERRIDE_FIDELITY_SAMPLE=all  node scripts/verify-override-fidelity.mjs
 *
 * Wired into npm run verify:teaching and npm run build (after overrides build).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isWeakPlainStamp } from './lib/teaching-quality.mjs';
import {
  normalizeRef,
  plainOverlapsVerse,
  situationLooksWrongForRef,
  speakerBelongsToBook
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const GENERIC_PLAIN_RE =
  /Scripture meets ordinary hours|Stay until one sentence lands|Trust God with what you cannot control|Faith is not pretending|God comes near the brokenhearted|Your pain is not ignored|God offers real rest|a place to set the day down|God is a deliverer\. Call on Him|when you need rescue|not only when you feel stro|God is a real refuge\. Stay close|His covering is for ordinary|The fight is real, but you are not alone|Stand in God’s strength, not onl|Choose gladness in it, even if the schedule/i;

function loadManifest() {
  const p = path.join(root, 'data', 'verse-breakdown-manifest.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadKjv() {
  const full = path.join(root, 'data', 'kjv-full.json');
  if (fs.existsSync(full)) return JSON.parse(fs.readFileSync(full, 'utf8'));
  return JSON.parse(fs.readFileSync(path.join(root, 'kjv.json'), 'utf8'));
}

function kjvText(kjv, ref) {
  const n = normalizeRef(ref);
  if (kjv[n]) return kjv[n];
  const psalms = n.replace(/^Psalm\s+/i, 'Psalms ');
  if (kjv[psalms]) return kjv[psalms];
  const psalm = n.replace(/^Psalms\s+/i, 'Psalm ');
  if (kjv[psalm]) return kjv[psalm];
  return (kjv && typeof kjv === 'object' && kjv.sourceTexts && kjv.sourceTexts[n]) || '';
}

function utcDaySeed() {
  const d = new Date();
  return d.getUTCFullYear() * 1000 + (d.getUTCMonth() + 1) * 50 + d.getUTCDate();
}

/** Deterministic shuffle sample */
function sampleKeys(keys, n, seed) {
  const arr = keys.slice();
  let s = seed >>> 0;
  function next() {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr.slice(0, Math.min(n, arr.length));
}

function pickGeneral(entry) {
  if (!entry || typeof entry !== 'object') return null;
  if (entry.general && typeof entry.general === 'object') return entry.general;
  /* Some shapes nest under group keys only */
  if (entry.plainExplanation || entry.about) return entry;
  return null;
}

function main() {
  const manifest = loadManifest();
  const overrides = manifest.overrides || {};
  const sourceTexts = manifest.sourceTexts || {};
  const kjv = loadKjv();
  const allKeys = Object.keys(overrides);
  if (allKeys.length < 100) {
    console.error('Override fidelity FAIL: too few overrides', allKeys.length);
    process.exit(1);
  }

  const envN = String(process.env.OVERRIDE_FIDELITY_SAMPLE || '800').trim();
  const sampleAll = envN === 'all' || envN === '*';
  const n = sampleAll ? allKeys.length : Math.max(100, parseInt(envN, 10) || 800);
  const keys = sampleAll ? allKeys : sampleKeys(allKeys, n, utcDaySeed());

  const failures = [];
  let checked = 0;
  const leftoverPlain =
    /kindness meets you as you are|not after you perform|take the verse as it stands|hold this verse as written|has to be lived, not only heard|life can feel loud/i;
  for (const ref of allKeys) {
    const g = pickGeneral(overrides[ref]);
    const plain = String((g && (g.plainExplanation || g.plain)) || '').trim();
    if (isWeakPlainStamp(plain) || leftoverPlain.test(plain)) {
      failures.push(`${ref}: leftover/weak plain stamp`);
    }
  }
  if (failures.length) {
    console.error(
      'Override fidelity FAIL — leftover plains in full catalog:',
      failures.length,
      '/',
      allKeys.length,
      '\n'
    );
    failures.slice(0, 40).forEach((f) => console.error(' •', f));
    if (failures.length > 40) console.error(' … and', failures.length - 40, 'more');
    process.exit(1);
  }

  for (const ref of keys) {
    const g = pickGeneral(overrides[ref]);
    const label = ref;
    if (!g) {
      failures.push(`${label}: missing general override block`);
      continue;
    }
    const about = String(g.about || '').trim();
    const to = String(g.to || '').trim();
    const plain = String(g.plainExplanation || g.plain || '').trim();
    const setting = String(g.setting || g.situation || '').trim();

    if (!about) failures.push(`${label}: missing about`);
    if (!to) failures.push(`${label}: missing to`);
    if (!plain || (plain.length < 12 && !/^Jesus wept/i.test(plain))) {
      failures.push(`${label}: missing/thin plain`);
    }
    if (isWeakPlainStamp(plain)) failures.push(`${label}: weak plain stamp`);

    if (about && !speakerBelongsToBook(about, ref)) {
      failures.push(`${label}: about does not fit book: "${about}"`);
    }
    if (setting && situationLooksWrongForRef(setting, ref)) {
      failures.push(`${label}: setting wrong-chapter blurb: "${setting.slice(0, 90)}"`);
    }
    if (to && /^Psalm/i.test(ref) && /straight path for work and plans/i.test(to)) {
      failures.push(`${label}: Proverbs audience stub under Psalm`);
    }

    const verseBody = sourceTexts[ref] || sourceTexts[normalizeRef(ref)] || kjvText(kjv, ref);
    if (verseBody && plain) {
      const ov = plainOverlapsVerse(plain, verseBody);
      if (ov.overlap === 0 && GENERIC_PLAIN_RE.test(plain)) {
        failures.push(`${label}: plain 0-overlap pastoral paste: "${plain.slice(0, 80)}"`);
      }
    }

    checked += 1;
  }

  if (failures.length) {
    console.error(
      'Override fidelity FAIL —',
      failures.length,
      'issue(s) in sample of',
      checked,
      '/',
      allKeys.length,
      'overrides:\n'
    );
    failures.slice(0, 40).forEach((f) => console.error(' •', f));
    if (failures.length > 40) console.error(' … and', failures.length - 40, 'more');
    process.exit(1);
  }

  console.log(
    'Override fidelity PASS: checked',
    checked,
    'of',
    allKeys.length,
    'overrides (speaker/cluster/plain paste).'
  );
}

main();
