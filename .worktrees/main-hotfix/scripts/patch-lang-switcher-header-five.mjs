/**
 * Insert Tagalog pick between Bahasa Indonesia and More languages in header navs.
 * Run after partials gain Tagalog: node scripts/patch-lang-switcher-header-five.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const OLD = `            <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>`;

const NEW = `            <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/tl/kabalisahan.html" hreflang="tl" data-tdb-pick="tl">Tagalog</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>`;

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function walkHtml(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      out.push({ full, rel });
    }
  }
}

function main() {
  const files = [];
  walkHtml(root, '', files);
  let touched = 0;
  let reps = 0;
  for (const { full, rel } of files) {
    let raw = fs.readFileSync(full, 'utf8');
    if (!raw.includes(OLD)) continue;
    const n = raw.split(OLD).length - 1;
    const next = raw.split(OLD).join(NEW);
    fs.writeFileSync(full, next, 'utf8');
    touched++;
    reps += n;
    console.log(rel, n);
  }
  console.log('patch-lang-switcher-header-five:', touched, 'files,', reps, 'replacement(s)');
}

main();
