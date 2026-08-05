/**
 * Fail the build when bulk verse-breakdown plains/applications collapse into filler stamps.
 * Run after scripts/build-verse-breakdown-overrides.mjs.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const runtimePath = path.join(repoRoot, 'verse-breakdown-overrides.js');

/** Strings that must not dominate the corpus (share of overrides). */
const BANNED_PLAIN_PREFIXES = [
  'This verse says something true from God for real life today'
];
const BANNED_APP_EXACT = [
  'Carry this verse into the next choice, the next conversation, and the next quiet minute with God.',
  'This verse meets anxious moments with steady help instead of more noise.',
  'This verse keeps your eyes up when the day feels slow, heavy, or unfinished.'
];

const MAX_SINGLE_PLAIN_SHARE = 0.12;
const MAX_BANNED_PLAIN_SHARE = 0.08;
const MAX_SINGLE_APP_SHARE = 0.25;
const MAX_BANNED_APP_SHARE = 0.05;

function extractOverrides(source) {
  const m = source.match(/var data = (\{[\s\S]*?\});\s*\n\s*global\.TDB_VERSE_BREAKDOWN_DATA/);
  if (!m) throw new Error('Could not parse verse-breakdown-overrides.js data blob');
  return JSON.parse(m[1]);
}

function tally(values) {
  const counts = new Map();
  for (const v of values) {
    const key = String(v || '').trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function topShare(counts, total) {
  let best = ['', 0];
  for (const [k, n] of counts) {
    if (n > best[1]) best = [k, n];
  }
  return { text: best[0], count: best[1], share: total ? best[1] / total : 0 };
}

function prefixCount(values, prefix) {
  const p = prefix.toLowerCase();
  return values.filter((v) => String(v || '').toLowerCase().startsWith(p)).length;
}

async function main() {
  const raw = await fs.readFile(runtimePath, 'utf8');
  const data = extractOverrides(raw);
  const overrides = data.overrides || {};
  const plains = [];
  const apps = [];
  for (const ref of Object.keys(overrides)) {
    const g = overrides[ref] && overrides[ref].general;
    if (!g) continue;
    plains.push(g.plainExplanation || '');
    apps.push(g.modernApplication || '');
  }
  const total = plains.length;
  if (total < 100) {
    throw new Error(`Too few overrides to quality-check (${total})`);
  }

  const plainCounts = tally(plains);
  const appCounts = tally(apps);
  const plainTop = topShare(plainCounts, total);
  const appTop = topShare(appCounts, total);

  const errors = [];
  if (plainTop.share > MAX_SINGLE_PLAIN_SHARE) {
    errors.push(
      `Top plainExplanation is ${(plainTop.share * 100).toFixed(1)}% of corpus (max ${(MAX_SINGLE_PLAIN_SHARE * 100).toFixed(0)}%): "${plainTop.text.slice(0, 90)}…"`
    );
  }
  if (appTop.share > MAX_SINGLE_APP_SHARE) {
    errors.push(
      `Top modernApplication is ${(appTop.share * 100).toFixed(1)}% of corpus (max ${(MAX_SINGLE_APP_SHARE * 100).toFixed(0)}%): "${appTop.text.slice(0, 90)}…"`
    );
  }
  for (const prefix of BANNED_PLAIN_PREFIXES) {
    const n = prefixCount(plains, prefix);
    const share = n / total;
    if (share > MAX_BANNED_PLAIN_SHARE) {
      errors.push(
        `Banned plain filler "${prefix}" is ${(share * 100).toFixed(1)}% (max ${(MAX_BANNED_PLAIN_SHARE * 100).toFixed(0)}%)`
      );
    }
  }
  for (const exact of BANNED_APP_EXACT) {
    const n = appCounts.get(exact) || 0;
    const share = n / total;
    if (share > MAX_BANNED_APP_SHARE) {
      errors.push(
        `Banned application stamp is ${(share * 100).toFixed(1)}% (max ${(MAX_BANNED_APP_SHARE * 100).toFixed(0)}%)`
      );
    }
  }

  console.log(
    `phrase-quality: ${total} overrides · unique plains ${plainCounts.size} · unique apps ${appCounts.size}`
  );
  console.log(
    `  top plain ${(plainTop.share * 100).toFixed(1)}% · top app ${(appTop.share * 100).toFixed(1)}%`
  );

  if (errors.length) {
    console.error('phrase-quality FAIL:\n' + errors.map((e) => ' - ' + e).join('\n'));
    process.exit(1);
  }
  console.log('phrase-quality: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
