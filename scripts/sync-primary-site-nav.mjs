/**
 * Replaces English primary site nav blocks with partials/site-global-nav-topbar.html
 * (inside .top-bar) or partials/site-global-nav-standalone.html (nav-only shells).
 * Optionally inserts partials/site-header-account-nudge.html before #sidebar-toggle.
 *
 * Skips localized pilots (ar, bn, es/*, fr/*, hi, id, pt/*, ru, sv, sw, tl, zh/*),
 * Spanish topical root pages, templates, and 404/offline shells.
 *
 * Run: node scripts/sync-primary-site-nav.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git']);

const ES_ROOT_SKIP = new Set([
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

const FILE_PREFIX_SKIP = ['lighthouse-', 'test-search-'];

function isLocalizedPath(rel) {
  return /^(ar|bn|es\/|fr\/|hi\/|id\/|pt\/|ru\/|sv\/|sw\/|tl\/|zh\/)/.test(rel);
}

function shouldSkipFile(rel) {
  if (isLocalizedPath(rel)) return true;
  if (ES_ROOT_SKIP.has(path.basename(rel))) return true;
  for (const p of FILE_PREFIX_SKIP) {
    if (rel.startsWith(p)) return true;
  }
  const base = path.basename(rel);
  if (
    base === '404.html' ||
    base === '404-admin.html' ||
    base === 'offline.html' ||
    base === 'blocked.html' ||
    base === 'weekly-email-template.html' ||
    base === 'newsletter-template-weekly.html' ||
    base === 'modal.html' ||
    base === 'mobius-minimal.html'
  ) {
    return true;
  }
  return false;
}

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

function extractNav(partialPath) {
  const raw = fs.readFileSync(partialPath, 'utf8');
  const m = raw.match(/<nav\b[\s\S]*?<\/nav>/i);
  if (!m) {
    console.error('sync-primary-site-nav: no <nav> in', partialPath);
    process.exit(1);
  }
  return m[0];
}

const RE_TOPBAR =
  /<nav class="header-nav tdb-global-nav(?:\s+tdb-primary-site-nav)?"[^>]*>[\s\S]*?<\/nav>/gi;

/** Standalone primary nav only (not header-nav …) */
const RE_STANDALONE =
  /<nav class="tdb-global-nav(?:\s+tdb-primary-site-nav)?"[^>]*aria-label="[^"]*"[^>]*>[\s\S]*?<\/nav>/gi;

const RE_NUDGE_SLOT =
  /(<\/nav>\s*)(<a href="#sidebar" class="header-menu-link" id="sidebar-toggle")/;

function main() {
  const topbarNav = extractNav(path.join(root, 'partials', 'site-global-nav-topbar.html'));
  const standaloneNav = extractNav(path.join(root, 'partials', 'site-global-nav-standalone.html'));
  const nudgeRaw = fs.readFileSync(path.join(root, 'partials', 'site-header-account-nudge.html'), 'utf8');
  const nudgeTrim = nudgeRaw.replace(/^\s+|\s+$/g, '\n');

  const files = [];
  walkHtml(root, '', files);

  let updated = 0;
  for (const { full, rel } of files) {
    if (shouldSkipFile(rel)) continue;

    let html = fs.readFileSync(full, 'utf8');
    let next = html;
    let touched = false;

    const afterTop = next.replace(RE_TOPBAR, (m) => {
      touched = true;
      return topbarNav;
    });
    next = afterTop;

    next = next.replace(RE_STANDALONE, (m) => {
      touched = true;
      return standaloneNav;
    });

    if (touched && !next.includes('tdb-header-account-nudge') && RE_NUDGE_SLOT.test(next)) {
      RE_NUDGE_SLOT.lastIndex = 0;
      next = next.replace(
        RE_NUDGE_SLOT,
        `$1${nudgeTrim}\n      $2`
      );
    }

    if (rel === 'family-armor.html' && touched) {
      next = next.replace(
        /<a href="\/family-armor\.html" id="nav-family-armor">/,
        '<a href="/family-armor.html" id="nav-family-armor" aria-current="page">'
      );
    }

    if (touched && next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      console.log('updated', rel);
      updated++;
    }
  }
  console.log('sync-primary-site-nav:', updated, 'files');
}

main();
