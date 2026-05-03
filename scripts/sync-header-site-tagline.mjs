/**
 * Canonical header tagline: "For Family, For Country, For GOD" replaces the old
 * "Learning of Him, one day at a time." heartbeat line across English shells.
 * Run from repo root: node scripts/sync-header-site-tagline.mjs
 *
 * Leaves dist/ alone (built output). Skips localization pilots under ar|bn|es|etc.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git']);
const SKIP_LOCALIZED = /^(ar|bn|es|fr|hi|id|pt|ru|sv|sw|tl|zh)\//;

const LEARNING_PARAGRAPH =
  /<p class="tdb-header-heartbeat" lang="en">Learning of Him, one day at a time\.(?: <span class="tdb-header-tag-cite" title="Take my yoke upon you, and learn of me\.">Matthew 11:29<\/span>)?<\/p>/g;
const TAGLINE_PARAGRAPH =
  '<p class="tdb-header-heartbeat site-tagline" lang="en">For Family, For Country, For GOD</p>';

const LEARNING_SPAN =
  /<span class="brand-subtitle tdb-brand-subtitle-learning" lang="en">Learning of Him, one day at a time\.(?: <span class="tdb-header-tag-cite" title="Take my yoke upon you, and learn of me\.">Matthew 11:29<\/span>)?<\/span>/g;
const TAGLINE_SPAN =
  '<span class="brand-subtitle tdb-brand-subtitle-learning site-tagline" lang="en">For Family, For Country, For GOD</span>';

const UOG_UNIV_LINE =
  /<p class="tdb-brand-subtitle-learning uog-header-learning-line" lang="en">The University of God &mdash; learning of Him, one day at a time\.<\/p>/g;
const UOG_REPLACE = '';

function walkHtml(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE_DIRS.has(e.name)) continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      out.push({ full, rel });
    }
  }
}

function main() {
  const files = [];
  walkHtml(root, '', files);
  let updated = 0;
  for (const { full, rel } of files) {
    if (rel.startsWith('lighthouse-')) continue;
    if (SKIP_LOCALIZED.test(rel)) continue;
    let raw = fs.readFileSync(full, 'utf8');
    let next = raw;
    next = next.replace(LEARNING_PARAGRAPH, TAGLINE_PARAGRAPH);
    next = next.replace(LEARNING_SPAN, TAGLINE_SPAN);
    next = next.replace(UOG_UNIV_LINE, UOG_REPLACE);
    if (next !== raw) {
      fs.writeFileSync(full, next, 'utf8');
      updated++;
      console.log('updated', rel);
    }
  }
  console.log('sync-header-site-tagline:', updated, 'files');
}

main();
