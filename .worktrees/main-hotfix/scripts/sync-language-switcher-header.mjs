/**
 * Inserts the language switcher (header variant) immediately after <header class="...top-bar...">.
 * Reads nav markup from partials/language-switcher.html (footer class → header class).
 * Run: node scripts/sync-language-switcher-header.mjs
 * Pair with: npm run sync:footer
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const partialPath = path.join(root, 'partials', 'language-switcher.html');

const EXCLUDE = new Set([
  'index.html',
  '404.html',
  '404-admin.html',
  'mobius.html',
  'weekly-email-template.html',
  'node_modules',
  'dist',
  '.git',
]);

const EXCLUDE_PREFIXES = ['lighthouse-'];

function shouldSkip(rel) {
  if (EXCLUDE.has(rel)) return true;
  if (rel.startsWith('partials/')) return true;
  for (const p of EXCLUDE_PREFIXES) {
    if (rel.startsWith(p)) return true;
  }
  if (rel.startsWith('kids/')) return true;
  return false;
}

function walkHtml(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      if (!shouldSkip(rel)) out.push({ full, rel });
    }
  }
}

const HEADER_RE = /<header\s+class="[^"]*\btop-bar\b[^"]*"\s*>/i;
const ALREADY = 'tdb-lang-switcher-header-wrap';

function extractNavFromPartial() {
  const raw = fs.readFileSync(partialPath, 'utf8');
  const m = raw.match(/<nav\b[\s\S]*?data-tdb-lang-switcher[\s\S]*?<\/nav>/i);
  if (!m) {
    console.error('sync-language-switcher-header: no <nav data-tdb-lang-switcher> in partials/language-switcher.html');
    process.exit(1);
  }
  let nav = m[0].replace(/\btdb-lang-switcher--footer\b/g, 'tdb-lang-switcher--header');
  return (
    '      <div class="tdb-lang-switcher-header-wrap">\n' +
    nav.replace(/^/gm, '        ') +
    '\n      </div>\n'
  );
}

function main() {
  const block = extractNavFromPartial();
  const files = [];
  walkHtml(root, '', files);

  let changed = 0;
  let skipped = 0;
  for (const { full, rel } of files) {
    let html = fs.readFileSync(full, 'utf8');
    if (!HEADER_RE.test(html) || html.includes(ALREADY)) {
      skipped++;
      continue;
    }
    const next = html.replace(HEADER_RE, (m) => m + '\n' + block);
    if (next === html) {
      skipped++;
      continue;
    }
    fs.writeFileSync(full, next, 'utf8');
    changed++;
    console.log('updated', rel);
  }
  console.log('sync-language-switcher-header:', changed, 'headers updated;', skipped, 'skipped');
}

main();
