/**
 * Replaces every <footer>...</footer> in each HTML file with partials/site-footer.html (thematic sitemap: Narrow Paths, Tools of the Quiet Trade, For the Household of Faith, Further In).
 * If multiple footers exist (merge drift), keeps one canonical footer and strips the rest.
 * Excludes lightweight pages, Spanish topic pages, kids hubs, tool-minimal footers, and 404s.
 * Run from repo root: node scripts/sync-site-footer.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const partialPath = path.join(root, 'partials', 'site-footer.html');
const finaleFragmentPath = path.join(root, 'partials', 'site-footer-finale-fragment.html');
const FINALE_MARK = 'tdb-site-footer-finale';

const EXCLUDE = new Set([
  '404.html',
  '404-admin.html',
  'node_modules',
  'dist',
  '.git',
  '.worktrees',
]);

const EXCLUDE_PREFIXES = ['lighthouse-'];

/** ES topical + tool shells at site root (Reina-Valera pilots): custom footer, pilot note, Spanish aria-labels. */
const ES_ROOT_FOOTER_SKIP = new Set([
  'agobio.html',
  'ansiedad.html',
  'culpa.html',
  'duelo.html',
  'esperanza.html',
  'fuerza.html',
  'ira.html',
  'lector.html',
  'miedo.html',
  'muro.html',
  'ninos.html',
  'paz.html',
  'perdon.html',
  'planes.html',
  'soledad.html',
]);

function shouldSkip(rel) {
  if (EXCLUDE.has(rel)) return true;
  for (const p of EXCLUDE_PREFIXES) {
    if (rel.startsWith(p)) return true;
  }
  if (ES_ROOT_FOOTER_SKIP.has(rel)) return true;
  /* Spanish hub and any future es/*.html */
  if (rel.startsWith('es/')) return true;
  /* Localized topical pilots use custom footers (pilot note, essentials). Do not overwrite with global partial. */
  if (/^(ar|bn|es|fr|hi|id|pt|ru|sv|sw|tl|zh)\/[^/]+\.html$/.test(rel)) {
    return true;
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
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name === '.worktrees') continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      if (!shouldSkip(rel)) out.push({ full, rel });
    }
  }
}

/** For footer finale: walk every HTML page except dist / tooling (404 and localized pages included). */
function shouldSkipFinaleWalk(rel) {
  if (EXCLUDE.has(rel) && rel !== '404.html' && rel !== '404-admin.html') return true;
  for (const p of EXCLUDE_PREFIXES) {
    if (rel.startsWith(p)) return true;
  }
  if (rel.startsWith('dist/') || rel === 'node_modules' || rel.startsWith('node_modules/')) return true;
  if (rel.startsWith('.git/')) return true;
  return false;
}

function walkHtmlForFinale(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git' || e.name === '.worktrees') continue;
      walkHtmlForFinale(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      if (!shouldSkipFinaleWalk(rel)) out.push({ full, rel });
    }
  }
}

/** Non-greedy: first balanced </footer>; run globally to collapse accidental duplicates. */
const FOOTER_BLOCK_RE = /<footer\b[^>]*>[\s\S]*?<\/footer>/gi;

/**
 * Replace all footer blocks: first becomes the canonical partial; extras are removed.
 */
function replaceFootersDedup(html, footerHtml, rel) {
  FOOTER_BLOCK_RE.lastIndex = 0;
  let i = 0;
  let removed = 0;
  const next = html.replace(FOOTER_BLOCK_RE, () => {
    i += 1;
    if (i === 1) return footerHtml;
    removed += 1;
    return '';
  });
  FOOTER_BLOCK_RE.lastIndex = 0;
  if (removed > 0) {
    console.warn('sync-site-footer: removed', removed, 'duplicate <footer> block(s) in', rel);
  }
  return next;
}

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
    const next = replaceFootersDedup(html, footerHtml, rel);
    if (next === html) {
      skipped++;
      continue;
    }
    fs.writeFileSync(full, next, 'utf8');
    changed++;
    console.log('updated', rel);
  }
  console.log('sync-site-footer: replaced', changed, 'footers; skipped', skipped, 'files');

  appendFinaleToPagesMissingIt();
}

function appendFinaleToPagesMissingIt() {
  if (!fs.existsSync(finaleFragmentPath)) {
    console.warn('sync-site-footer: no', finaleFragmentPath, '— skip finale append');
    return;
  }
  const fragment = '\n' + fs.readFileSync(finaleFragmentPath, 'utf8');
  if (!fragment.includes(FINALE_MARK)) {
    console.error('sync-site-footer: fragment missing tdb marker');
    process.exit(1);
  }
  const files = [];
  walkHtmlForFinale(root, '', files);
  let added = 0;
  for (const { full, rel } of files) {
    let html;
    try {
      html = fs.readFileSync(full, 'utf8');
    } catch {
      continue;
    }
    if (html.includes(FINALE_MARK)) continue;
    if (!/<footer\b/i.test(html)) continue;
    const idx = html.lastIndexOf('</footer>');
    if (idx === -1) continue;
    const next = html.slice(0, idx) + fragment + '\n' + html.slice(idx);
    fs.writeFileSync(full, next, 'utf8');
    added++;
    console.log('finale', rel);
  }
  console.log('sync-site-footer: appended footer finale to', added, 'pages still missing it');
}

main();
