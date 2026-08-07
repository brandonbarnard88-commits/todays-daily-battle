/**
 * Replaces English primary site nav blocks with partials/site-global-nav-topbar.html
 * (inside .top-bar) or partials/site-global-nav-standalone.html (nav-only shells).
 * Optionally inserts partials/site-header-account-nudge.html before #sidebar-toggle.
 *
 * Skips localized pilots (ar, bn, es/*, fr/*, hi, id, pt/*, ru, sv, sw, tl, zh/*),
 * Spanish topical root pages, templates, and 404/offline shells.
 *
 * Run: node scripts/sync-primary-site-nav.mjs
 *
 * Finishes with inject-missing-primary-nav for journal/, bible/, life-lessons/, etc.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { injectMissingPrimaryNav } from './inject-missing-primary-nav.mjs';

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

const RE_INLINE_AUTH =
  /\s*<div id="auth-section" class="auth-inline auth-compact">[\s\S]*?<\/div>\s*/gi;

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

    next = next.replace(RE_INLINE_AUTH, '\n');

    if (rel === 'plans.html' && touched) {
      next = next.replace(
        /<a href="\/plans\.html#plans-maps-into-paths-details" id="nav-curriculum"/,
        '<a href="/plans.html#plans-maps-into-paths-details" id="nav-curriculum" aria-current="page"'
      );
    }

    if (rel === 'university.html' && touched) {
      next = next.replace(
        /<a href="\/university\.html" id="nav-university-core"/,
        '<a href="/university.html" id="nav-university-core" aria-current="page"'
      );
    }

    if (rel === 'reader.html' && touched) {
      next = next.replace(
        /<a href="\/reader\.html" id="nav-reader"/,
        '<a href="/reader.html" id="nav-reader" aria-current="page"'
      );
    }

    if (rel === 'family-armor.html' && touched) {
      next = next.replace(
        /<a href="\/family-armor\.html" id="nav-family-armor">/,
        '<a href="/family-armor.html" id="nav-family-armor" aria-current="page">'
      );
    }

    if (rel === 'yearly-rhythm.html' && touched) {
      next = next.replace(
        /<a href="\/yearly-rhythm\.html" id="nav-year-round"/,
        '<a href="/yearly-rhythm.html" id="nav-year-round" aria-current="page"'
      );
    }

    if (rel === 'year-at-a-glance.html' && touched) {
      next = next.replace(
        /<a href="\/year-at-a-glance\.html" id="nav-year-at-a-glance"/,
        '<a href="/year-at-a-glance.html" id="nav-year-at-a-glance" aria-current="page"'
      );
    }

    if (rel === 'verse.html' && touched) {
      next = next.replace(
        /<a href="\/verse\.html">Today&rsquo;s Verse<\/a>/,
        '<a href="/verse.html" aria-current="page">Today&rsquo;s Verse</a>'
      );
    }

    if (rel === 'daily-rhythm.html' && touched) {
      next = next.replace(
        /<a href="\/daily-rhythm\.html">Daily Rhythm<\/a>/,
        '<a href="/daily-rhythm.html" aria-current="page">Daily Rhythm</a>'
      );
    }

    if (rel === 'prayer-wall.html' && touched) {
      next = next.replace(
        /<a href="\/prayer-wall\.html">Pray<\/a>/,
        '<a href="/prayer-wall.html" aria-current="page">Pray</a>'
      );
    }

    if (rel === 'explore.html' && touched) {
      next = next.replace(
        /<a href="\/explore\.html">Explore<\/a>/,
        '<a href="/explore.html" aria-current="page">Explore</a>'
      );
    }

    if (rel === 'mystudy.html' && touched) {
      next = next.replace(
        /<a href="\/mystudy">My Study<\/a>/,
        '<a href="/mystudy" aria-current="page">My Study</a>'
      );
    }

    if (rel === 'bible-tool.html' && touched) {
      next = next.replace(
        /<a href="\/bible-tool\.html#bible-tool-hub" aria-label="The Library — lookup, verse image, chapter reader">The Library<\/a>/,
        '<a href="/bible-tool.html#bible-tool-hub" aria-label="The Library — lookup, verse image, chapter reader" aria-current="page">The Library</a>'
      );
    }

    if (rel === 'plans.html' && touched) {
      next = next.replace(
        /<a href="\/plans\.html" id="nav-browse-curriculum" aria-label="The Paths — KJV tracks for hard weeks and quiet seasons">The Paths<\/a>/,
        '<a href="/plans.html" id="nav-browse-curriculum" aria-current="page" aria-label="The Paths — KJV tracks for hard weeks and quiet seasons">The Paths</a>'
      );
    }

    if (rel === 'university.html' && touched) {
      next = next.replace(
        /<a href="\/university\.html" id="nav-university-core"/,
        '<a href="/university.html" id="nav-university-core" aria-current="page"'
      );
    }

    if (rel === 'family-armor-little-ones.html' && touched) {
      next = next.replace(
        /<a href="\/family-armor-little-ones\.html" id="nav-family-armor-little-ones" aria-label="Family Armor for little ones — calm KJV doorway">/,
        '<a href="/family-armor-little-ones.html" id="nav-family-armor-little-ones" aria-current="page" aria-label="Family Armor for little ones — calm KJV doorway">'
      );
    }

    if (rel === 'memorize.html' && touched) {
      next = next.replace(
        /<a href="\/memorize\.html">Memorize<\/a>/,
        '<a href="/memorize.html" aria-current="page">Memorize</a>'
      );
    }

    if (rel === 'kids/corner.html' && touched) {
      next = next.replace(
        /<a href="\/kids\/corner\.html">Bible Story Library<\/a>/,
        '<a href="/kids/corner.html" aria-current="page">Bible Story Library</a>'
      );
    }

    if (rel === 'site-guide.html' && touched) {
      next = next.replace(
        /<a href="\/explore\.html#start-here" id="nav-site-guide"/,
        '<a href="/explore.html#start-here" id="nav-site-guide" aria-current="page"'
      );
    }

    if (rel === 'search.html' && touched) {
      next = next.replace(
        /<a href="\/search\.html" id="nav-site-search"/,
        '<a href="/search.html" id="nav-site-search" aria-current="page"'
      );
    }

    if (rel === 'about.html' && touched) {
      next = next.replace(/<a href="\/about\.html">About<\/a>/, '<a href="/about.html" aria-current="page">About</a>');
    }

    if (rel === 'printables.html' && touched) {
      next = next.replace(
        /<a href="\/printables\.html" aria-label="Print hub — verse cards, Quiet Hall sheets, family packs">Print hub<\/a>/,
        '<a href="/printables.html" aria-label="Print hub — verse cards, Quiet Hall sheets, family packs" aria-current="page">Print hub</a>'
      );
    }

    if (rel === 'mobius.html' && touched) {
      next = next.replace(
        /<a href="\/mobius\.html">Möbius<\/a>/,
        '<a href="/mobius.html" aria-current="page">Möbius</a>'
      );
    }

    if (rel === 'calm.html' && touched) {
      next = next.replace(
        /<a href="\/calm\.html"(?: aria-label="[^"]*")?>Quiet Hall<\/a>/,
        '<a href="/calm.html" aria-current="page" aria-label="Quiet Hall — one steady KJV verse when the moment is heavy">Quiet Hall</a>'
      );
    }

    if (rel === 'family.html' && touched) {
      next = next.replace(
        /<a href="\/family\.html" aria-label="Family hub — verse, plans, printables">Family hub<\/a>/,
        '<a href="/family.html" aria-current="page" aria-label="Family hub — verse, plans, printables">Family hub</a>'
      );
    }

    if (rel === 'church-hub.html' && touched) {
      next = next.replace(
        /<a href="\/church-hub\.html" id="nav-pastors" aria-label="Pastor’s Study — church tools">Pastor’s Study<\/a>/,
        '<a href="/church-hub.html" id="nav-pastors" aria-current="page" aria-label="Pastor’s Study — church tools">Pastor’s Study</a>'
      );
    }

    if (rel === 'story.html' && touched) {
      next = next.replace(/<a href="\/story\.html">Story<\/a>/, '<a href="/story.html" aria-current="page">Story</a>');
    }

    if (touched && next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      console.log('updated', rel);
      updated++;
    }
  }
  console.log('sync-primary-site-nav:', updated, 'files');
  const injected = injectMissingPrimaryNav();
  console.log('sync-primary-site-nav: inject pass complete (' + injected + ' orphan shells)');
}

main();
