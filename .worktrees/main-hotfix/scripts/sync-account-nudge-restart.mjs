/**
 * Inserts the Restart tour button into .tdb-header-account-nudge blocks that have
 * Site tour + Log in but not yet .tdb-tour-restart-btn (sync script cannot refresh
 * existing nudges). Skips localized pilots same as sync-primary-site-nav.
 *
 * Run: node scripts/sync-account-nudge-restart.mjs
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

const RE_INSERT = /(class="tdb-header-account-nudge__link tdb-tour-open-btn" id="tdb-tour-open-btn"[^>]*>Site tour<\/button>)\s*\r?\n(\s*)(<a href="\/login\.html" class="tdb-header-account-nudge__link">)/g;

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
    if (shouldSkipFile(rel)) continue;

    let html = fs.readFileSync(full, 'utf8');
    const nudge = html.match(/<div class="tdb-header-account-nudge"[\s\S]*?<\/div>/);
    if (!nudge || nudge[0].includes('tdb-tour-restart-btn')) continue;

    const next = html.replace(RE_INSERT, (_, openBtn, sp, loginA) => {
      return (
        `${openBtn}\n` +
        `${sp}<button type="button" class="tdb-header-account-nudge__link tdb-tour-restart-btn" aria-label="Restart the five-minute site tour from the beginning">Restart</button>\n` +
        `${sp}${loginA}`
      );
    });

    if (next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      console.log('updated', rel);
      updated++;
    }
  }
  console.log('sync-account-nudge-restart:', updated, 'files');
}

main();
