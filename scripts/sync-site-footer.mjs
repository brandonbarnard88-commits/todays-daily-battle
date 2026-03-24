/**
 * Replaces the first <footer>...</footer> in each HTML file with partials/site-footer.html.
 * Excludes lightweight pages, Spanish topic pages, kids hubs, tool-minimal footers, and 404s.
 * Run from repo root: node scripts/sync-site-footer.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const partialPath = path.join(root, 'partials', 'site-footer.html');

const EXCLUDE = new Set([
  '404.html',
  '404-admin.html',
  'mobius.html',
  'ansiedad.html',
  'fuerza.html',
  'paz.html',
  'node_modules',
  'dist',
  '.git',
]);

const EXCLUDE_PREFIXES = ['lighthouse-'];

function shouldSkip(rel) {
  if (EXCLUDE.has(rel)) return true;
  for (const p of EXCLUDE_PREFIXES) {
    if (rel.startsWith(p)) return true;
  }
  if (rel.startsWith('kids/')) {
    if (
      rel === 'kids/kids-beta.html' ||
      rel === 'kids/corner.html' ||
      rel === 'kids/parent.html' ||
      rel === 'kids/all-stories.html' ||
      rel === 'kids/index.html'
    ) {
      return true;
    }
  }
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

const FOOTER_RE = /<footer\b[^>]*>[\s\S]*?<\/footer>/i;

function main() {
  const partialRaw = fs.readFileSync(partialPath, 'utf8');
  const m = partialRaw.match(/<footer\b[\s\S]*<\/footer>/i);
  if (!m) {
    console.error('sync-site-footer: no <footer> block in partials/site-footer.html');
    process.exit(1);
  }
  const footerHtml = m[0];

  const files = [];
  walkHtml(root, '', files);

  let changed = 0;
  let skipped = 0;
  for (const { full, rel } of files) {
    let html = fs.readFileSync(full, 'utf8');
    if (!/<footer\b/i.test(html)) {
      skipped++;
      continue;
    }
    const next = html.replace(FOOTER_RE, footerHtml);
    if (next === html) {
      skipped++;
      continue;
    }
    fs.writeFileSync(full, next, 'utf8');
    changed++;
    console.log('updated', rel);
  }
  console.log('sync-site-footer: replaced', changed, 'footers; skipped', skipped, 'files');
}

main();
