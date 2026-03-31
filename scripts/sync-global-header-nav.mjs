/**
 * Global nav hygiene for English shells:
 * 1) Legacy: Tools → Calm → Support (was Tools → Support → Explore).
 * 2) More panel: Explore first (was Calm-first).
 * 3) Story on primary bar after Calm; removed from More (Explore + Feel only there; homepage keeps Family / What God has done).
 * Run: npm run sync:header
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git']);

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

/** Tools → Support → Explore (primary bar) */
const RE_BAR =
  /(<a href="\/bible-tool\.html#bible-tool-hub"[^>]*>Tools<\/a>)\s*\r?\n(\s*)<a href="\/give"([^>]*)>Support<\/a>\s*\r?\n\s*<a href="\/explore\.html">Explore<\/a>/g;

/** More: Calm, Story, Feel — standard */
/** Opening div preserved so extra links (e.g. Family) stay intact */
const RE_MORE_CALM_FIRST =
  /(<div class="tdb-nav-more-panel" role="group" aria-label="More pages">)\s*<a href="\/calm\.html">Calm<\/a>\s*<a href="\/story\.html">Story<\/a>\s*<a href="\/#feel-section">Feel search &amp; topics<\/a>/g;

const REPLACEMENT_MORE =
  '$1\n            <a href="/explore.html">Explore</a>\n            <a href="/#feel-section">Feel search &amp; topics</a>';

/** my-verses.html More panel (standalone nav) */
const RE_MORE_MY_VERSES =
  /<div class="tdb-nav-more-panel" role="group" aria-label="More pages">\s*<a href="\/my-verses\.html"[^>]*>My Verses<\/a>\s*<a href="\/calm\.html">Calm<\/a>\s*<a href="\/story\.html">Story<\/a>\s*<a href="\/#feel-section">Feel search &amp; topics<\/a>\s*<\/div>/g;

const REPLACEMENT_MORE_MYVERSES =
  '<div class="tdb-nav-more-panel" role="group" aria-label="More pages">\n        <a href="/explore.html">Explore</a>\n        <a href="/#feel-section">Feel search &amp; topics</a>\n      </div>';

/** Story on bar after Calm; strip duplicate Story from More (multiline or tight) */
function patchStoryPrimaryNav(html) {
  let next = html;
  next = next.replace(
    /(<a href="\/calm\.html">Calm<\/a>)\s*\r?\n(\s*)(<a href="\/give")/g,
    '$1\n$2<a href="/story.html">Story</a>\n$2$3'
  );
  next = next.replace(
    /(<a href="\/explore\.html">Explore<\/a>)\s*\r?\n\s*<a href="\/story\.html">Story<\/a>\s*\r?\n(\s*)(<a href="\/#feel-section">Feel search &amp; topics<\/a>)/g,
    '$1\n$2$3'
  );
  next = next.replace(
    /(<a href="\/explore\.html">Explore<\/a>)\s+<a href="\/story\.html">Story<\/a>\s+(<a href="\/#feel-section">Feel search &amp; topics<\/a>)/g,
    '$1\n            $2'
  );
  return next;
}

function patch(html) {
  const orig = html;
  let next = html;

  next = next.replace(RE_MORE_MY_VERSES, REPLACEMENT_MORE_MYVERSES);

  next = next.replace(RE_BAR, (_, tools, ind, giveRest) => {
    return `${tools}\n${ind}<a href="/calm.html">Calm</a>\n${ind}<a href="/give"${giveRest}>Support</a>`;
  });

  next = next.replace(RE_MORE_CALM_FIRST, REPLACEMENT_MORE);

  next = patchStoryPrimaryNav(next);

  return { html: next, changed: next !== orig };
}

function main() {
  const files = [];
  walkHtml(root, '', files);

  let updated = 0;
  for (const { full, rel } of files) {
    if (rel.startsWith('lighthouse-')) continue;
    let raw = fs.readFileSync(full, 'utf8');
    const { html, changed } = patch(raw);
    if (changed && html !== raw) {
      fs.writeFileSync(full, html, 'utf8');
      console.log('updated', rel);
      updated++;
    }
  }
  console.log('sync-global-header-nav:', updated, 'files');
}

main();
