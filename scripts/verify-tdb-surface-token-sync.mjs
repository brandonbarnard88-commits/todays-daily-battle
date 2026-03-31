#!/usr/bin/env node
/**
 * Optional guard: inline :root --tdb-surface-* definitions must match across
 * quiet-luxury hub pages that duplicate the block (plans, memorize, what-god-has-done).
 * Run after editing any of those files or when changing surface semantics in styles.css
 * (keep hub copies aligned until a shared import exists).
 *
 * Run: node scripts/verify-tdb-surface-token-sync.mjs
 *      npm run test:surface-tokens
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const FILES = ['plans.html', 'memorize.html', 'what-god-has-done.html'];

/** Match from veil through radius (same custom props on all three pages). */
const BLOCK_RE =
  /--tdb-surface-veil-subtle:\s*var\(--tdb-lux-guilloche\);[\s\S]*?--tdb-surface-radius:\s*18px;/;

function normalize(cssChunk) {
  return cssChunk.replace(/\s+/g, ' ').trim();
}

function fail(msg) {
  console.error('FAIL tdb surface token sync:', msg);
  process.exit(1);
}

let canonical = null;

for (const rel of FILES) {
  let html;
  try {
    html = readFileSync(join(root, rel), 'utf8');
  } catch (e) {
    fail(`cannot read ${rel}: ${e && e.message}`);
  }
  const m = html.match(BLOCK_RE);
  if (!m) {
    fail(`${rel}: missing inline :root block (--tdb-surface-veil-subtle … --tdb-surface-radius: 18px;)`);
  }
  const n = normalize(m[0]);
  if (canonical == null) {
    canonical = n;
  } else if (n !== canonical) {
    fail(
      `${rel}: --tdb-surface-* block differs from ${FILES[0]}. Copy the block from plans.html :root or normalize spacing.`
    );
  }
}

console.log('OK   tdb surface token sync (scripts/verify-tdb-surface-token-sync.mjs)');
