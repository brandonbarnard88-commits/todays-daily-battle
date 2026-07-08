/**
 * Inject primary site nav (partials/site-global-nav-standalone.html) into English
 * inner pages that still lack tdb-primary-site-nav.
 *
 * Focus batch: journal/, bible/, red-letters, lessons-from-the-valley hub,
 * life-lessons hub + lessons, curriculum.html
 *
 * Run: node scripts/inject-missing-primary-nav.mjs
 * Also invoked at end of scripts/sync-primary-site-nav.mjs for journal/bible/life-lessons shells.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SCRIPT_SRC = 'script.js?v=20260503-consent-persist-fix';

const TARGET_GLOBS = [
  'journal/*.html',
  'bible/*.html',
  'life-lessons/*.html',
  'red-letters.html',
  'lessons-from-the-valley.html',
  'life-lessons.html',
  'curriculum.html',
];

const TAGLINE_RE =
  /\s*<p class="tdb-header-heartbeat site-tagline" lang="en">For Family, For Country, For GOD<\/p>/gi;

const RL_NAV_RE =
  /<nav class="rl-global-nav"[\s\S]*?<\/nav>\s*/i;

const TOPBAR_LINK_RE =
  /(\s*)<a href="[^"]*" class="header-menu-link">[^<]*<\/a>(\s*<\/header>)/i;

function shouldSkipRel(rel) {
  if (/-print\.html$/i.test(rel)) return true;
  return false;
}

function expandTargets() {
  const files = new Set();
  for (const pattern of TARGET_GLOBS) {
    if (pattern.includes('*')) {
      const dir = path.dirname(pattern);
      const base = path.basename(pattern);
      const fullDir = path.join(root, dir);
      if (!fs.existsSync(fullDir)) continue;
      for (const name of fs.readdirSync(fullDir)) {
        if (base === '*.html' && name.endsWith('.html')) {
          files.add(path.join(dir, name).replace(/\\/g, '/'));
        }
      }
    } else {
      files.add(pattern);
    }
  }
  return [...files].sort();
}

function loadStandaloneNav() {
  const raw = fs.readFileSync(
    path.join(root, 'partials', 'site-global-nav-standalone.html'),
    'utf8'
  );
  return raw.trim();
}

function indentBlock(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n');
}

function scriptTagForRel(rel) {
  const depth = rel.split('/').length - 1;
  if (depth === 0) {
    return `  <script type="module" src="${SCRIPT_SRC}" data-cfasync="false"></script>`;
  }
  const prefix = '../'.repeat(depth);
  return `  <script type="module" src="${prefix}${SCRIPT_SRC}" data-cfasync="false"></script>`;
}

function applyAriaCurrent(html, rel) {
  let next = html;
  if (rel === 'curriculum.html') {
    next = next.replace(
      /<a href="\/gods-university-of-life\.html" id="nav-curriculum"/,
      '<a href="/gods-university-of-life.html" id="nav-curriculum" aria-current="page"'
    );
  }
  if (rel.startsWith('bible/')) {
    next = next.replace(
      /<a href="\/reader\.html" id="nav-reader"/,
      '<a href="/reader.html" id="nav-reader" aria-current="page"'
    );
  }
  if (rel === 'red-letters.html') {
    next = next.replace(
      /<a href="\/bible-tool\.html#bible-tool-hub" aria-label="Bible Tool hub — lookup, verse image, chapter reader">Bible Tool<\/a>/,
      '<a href="/bible-tool.html#bible-tool-hub" aria-label="Bible Tool hub — lookup, verse image, chapter reader" aria-current="page">Bible Tool</a>'
    );
  }
  return next;
}

function injectStandaloneNav(html, rel) {
  if (html.includes('tdb-primary-site-nav')) return html;

  const nav = loadStandaloneNav();
  const skipRe = /(<a[^>]*class="[^"]*skip-link[^"]*"[^>]*>[\s\S]*?<\/a>\s*)/i;
  if (skipRe.test(html)) {
    return html.replace(skipRe, `$1\n${indentBlock(nav, 2)}\n`);
  }

  const bodyRe = /(<body[^>]*>\s*)/i;
  if (bodyRe.test(html)) {
    return html.replace(bodyRe, `$1\n${indentBlock(nav, 2)}\n`);
  }
  return html;
}

function injectTopBarNav(html, rel) {
  if (html.includes('tdb-primary-site-nav')) return html;
  if (!TOPBAR_LINK_RE.test(html)) return html;
  const nav = loadStandaloneNav().replace(
    'class="tdb-global-nav tdb-primary-site-nav"',
    'class="header-nav tdb-global-nav tdb-primary-site-nav"'
  );
  const extraLink =
    rel === 'journal/index.html'
      ? ''
      : `\n      <a href="/journal/" class="header-menu-link">Journal</a>`;
  return html.replace(TOPBAR_LINK_RE, `\n${indentBlock(nav, 6)}${extraLink}$1$2`);
}

function ensureScriptJs(html, rel) {
  if (html.includes(SCRIPT_SRC)) return html;
  const tag = scriptTagForRel(rel);
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${tag}\n</body>`);
  }
  return html + `\n${tag}\n`;
}

function processFile(rel) {
  if (shouldSkipRel(rel)) return false;
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.warn('skip missing', rel);
    return false;
  }

  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('tdb-primary-site-nav')) {
    return false;
  }

  let next = html.replace(TAGLINE_RE, '');
  next = next.replace(RL_NAV_RE, '');

  if (rel.startsWith('journal/')) {
    next = injectTopBarNav(next, rel);
  } else {
    next = injectStandaloneNav(next, rel);
  }

  next = applyAriaCurrent(next, rel);
  next = ensureScriptJs(next, rel);

  if (next !== html) {
    fs.writeFileSync(full, next, 'utf8');
    console.log('updated', rel);
    return true;
  }
  return false;
}

function main() {
  const targets = expandTargets();
  let updated = 0;
  for (const rel of targets) {
    if (processFile(rel)) updated++;
  }
  console.log('inject-missing-primary-nav:', updated, 'files');
  return updated;
}

export { main as injectMissingPrimaryNav };

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  main();
}
