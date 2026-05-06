/**
 * One-shot / occasional: add visible "Language" (or "Bahasa" under id/) eyebrow + tdb-lang-switcher--labeled
 * to header/footer language <nav> blocks that predate partial updates.
 * Run: node scripts/patch-lang-switcher-labeled.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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

function eyebrowForRel(rel) {
  return rel.startsWith('id/') ? 'Bahasa' : 'Language';
}

function patchNavBlocks(html, rel) {
  const eye = eyebrowForRel(rel);
  let out = html;
  let n = 0;

  const patchHeader = () => {
    const re =
      /<nav class="tdb-lang-switcher tdb-lang-switcher--header"(?! tdb-lang-switcher--labeled) aria-label="Choose language" data-tdb-lang-switcher lang="en">\s*\n(\s*)<span class="tdb-lang-switcher-inner">/g;
    out = out.replace(re, (_, ind) => {
      n++;
      return `<nav class="tdb-lang-switcher tdb-lang-switcher--header tdb-lang-switcher--labeled" aria-label="Choose language" data-tdb-lang-switcher lang="en">\n${ind}<span class="tdb-lang-switcher-eyebrow" aria-hidden="true">${eye}</span>\n${ind}<span class="tdb-lang-switcher-inner">`;
    });
  };

  const patchFooterEn = () => {
    const re =
      /<nav class="tdb-lang-switcher tdb-lang-switcher--footer"(?! tdb-lang-switcher--labeled) aria-label="Choose language" data-tdb-lang-switcher lang="en">\s*\n(\s*)<span class="tdb-lang-switcher-inner">/g;
    out = out.replace(re, (_, ind) => {
      n++;
      return `<nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Choose language" data-tdb-lang-switcher lang="en">\n${ind}<span class="tdb-lang-switcher-eyebrow" aria-hidden="true">${eye}</span>\n${ind}<span class="tdb-lang-switcher-inner">`;
    });
  };

  const patchFooterId = () => {
    const re =
      /<nav class="tdb-lang-switcher tdb-lang-switcher--footer"(?! tdb-lang-switcher--labeled) aria-label="Pilih bahasa" data-tdb-lang-switcher lang="en">\s*\n(\s*)<span class="tdb-lang-switcher-inner">/g;
    out = out.replace(re, (_, ind) => {
      n++;
      return `<nav class="tdb-lang-switcher tdb-lang-switcher--footer tdb-lang-switcher--labeled" aria-label="Pilih bahasa" data-tdb-lang-switcher lang="en">\n${ind}<span class="tdb-lang-switcher-eyebrow" aria-hidden="true">Bahasa</span>\n${ind}<span class="tdb-lang-switcher-inner">`;
    });
  };

  patchHeader();
  patchFooterEn();
  patchFooterId();
  return { html: out, changes: n };
}

function main() {
  const files = [];
  walkHtml(root, '', files);
  let filesTouched = 0;
  let total = 0;
  for (const { full, rel } of files) {
    let raw = fs.readFileSync(full, 'utf8');
    const { html, changes } = patchNavBlocks(raw, rel);
    if (changes > 0) {
      fs.writeFileSync(full, html, 'utf8');
      filesTouched++;
      total += changes;
      console.log(rel, changes);
    }
  }
  console.log('patch-lang-switcher-labeled:', filesTouched, 'files,', total, 'nav block(s) updated');
}

main();
