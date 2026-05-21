#!/usr/bin/env node
/**
 * Static guard: performance-oriented SW + image loading hints stay wired.
 * Also ensures every same-origin stylesheet has an immediate preceding
 * rel=preload as=style for the same href (see npm run sync:css-preloads),
 * for source HTML and — when dist/ exists — the built copy under dist/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'next-app']);

function fail(msg) {
  console.error('verify-performance:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
}

function walkHtmlFiles(startDir, skipDirs, out = []) {
  for (const ent of fs.readdirSync(startDir, { withFileTypes: true })) {
    const base = ent.name;
    if (base.startsWith('.')) continue;
    const p = path.join(startDir, base);
    if (ent.isDirectory()) {
      if (skipDirs.has(base)) continue;
      walkHtmlFiles(p, skipDirs, out);
    } else if (base.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

/** Every local .css stylesheet link must be preceded by preload with the same href (same line order as sync scripts). */
function verifyStylesheetPreloadPairs(htmlPaths) {
  for (const abs of htmlPaths) {
    const rel = path.relative(root, abs);
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/\brel=["']stylesheet["']/.test(line)) continue;
      const m = line.match(/\bhref=["']([^"']+)["']/);
      if (!m) continue;
      const href = m[1];
      if (/^https?:\/\//i.test(href)) continue;
      if (!/\.css(?:\?|$)/.test(href)) continue;
      if (i === 0) fail(`${rel}: stylesheet for ${href} has no preceding line for preload`);
      const prev = lines[i - 1].trimEnd();
      const ok =
        /\brel=["']preload["']/.test(prev) &&
        prev.includes(href) &&
        /\bas=["']style["']/.test(prev);
      if (!ok) {
        fail(`${rel}: expected line before stylesheet to preload as=style with href ${href}`);
      }
    }
  }
}

function verifyLocalStylesheetPreloads() {
  verifyStylesheetPreloadPairs(walkHtmlFiles(root, SKIP_DIRS));
  const distDir = path.join(root, 'dist');
  if (fs.existsSync(distDir)) {
    verifyStylesheetPreloadPairs(walkHtmlFiles(distDir, new Set(['node_modules', '.git'])));
  }
}

function main() {
  const sw = read('service-worker.js');
  if (!sw.includes('/family-armor.html')) fail('service-worker.js: precache should include /family-armor.html');
  if (!sw.includes('/yearly-rhythm.html')) fail('service-worker.js: precache should include /yearly-rhythm.html');
  if (!sw.includes('/site-search-index.json')) fail('service-worker.js: precache should include /site-search-index.json');
  if (!sw.includes('/print-pack-generator.html')) fail('service-worker.js: precache should include /print-pack-generator.html');
  if (!sw.includes('/print-pack-generator.js')) fail('service-worker.js: precache should include /print-pack-generator.js');
  if (!sw.includes('/embeddable-widgets.html')) fail('service-worker.js: precache should include /embeddable-widgets.html');
  if (!sw.includes('/embed-verse-widget.js')) fail('service-worker.js: precache should include /embed-verse-widget.js');
  if (!sw.includes('/prayer-wall.html')) fail('service-worker.js: precache should include /prayer-wall.html');
  if (!sw.includes('/search.html')) fail('service-worker.js: precache should include /search.html');
  if (!sw.includes('/contact.html')) fail('service-worker.js: precache should include /contact.html');
  if (!sw.includes('/privacy.html')) fail('service-worker.js: precache should include /privacy.html');
  if (!sw.includes('/faq.html')) fail('service-worker.js: precache should include /faq.html');
  if (!sw.includes('/explore.html')) fail('service-worker.js: precache should include /explore.html');
  if (!sw.includes('/seasonal.html')) fail('service-worker.js: precache should include /seasonal.html');
  if (!sw.includes('/give.html')) fail('service-worker.js: precache should include /give.html');
  if (!sw.includes('/journal/index.html')) fail('service-worker.js: precache should include /journal/index.html');
  if (!sw.includes('Same-origin images')) fail('service-worker.js: image stale-while-revalidate block missing');
  if (!/const\s+CACHE_NAME\s*=\s*'tdb-cache-v/.test(sw)) {
    fail('service-worker.js: CACHE_NAME should use tdb-cache-v… prefix');
  }

  const kids = read('kids/index.html');
  const tags = kids.match(/<img\b[^>]*>/g) || [];
  if (!tags.length) fail('kids/index.html: expected at least one <img>');
  for (const tag of tags) {
    if (!/\bdecoding=["']async["']/.test(tag)) {
      fail('kids/index.html: every <img> needs decoding="async"');
    }
    if (!/\bloading=["']lazy["']/.test(tag)) {
      fail('kids/index.html: every <img> needs loading="lazy"');
    }
  }

  const family = read('family.html');
  if (!family.includes('rel="preload"') || !family.includes('styles.css') || !family.includes('as="style"')) {
    fail('family.html: expected link rel=preload for styles.css (as=style)');
  }

  const seasonal = read('seasonal.html');
  if (!/rel=["']preload["'][^>]*tdb-quiet-luxury\.css/.test(seasonal) || !seasonal.includes('as="style"')) {
    fail('seasonal.html: expected link rel=preload for tdb-quiet-luxury.css (as=style)');
  }

  const yearlyRhythm = read('yearly-rhythm.html');
  if (!/rel=["']preload["'][^>]*tdb-quiet-luxury\.css/.test(yearlyRhythm) || !yearlyRhythm.includes('as="style"')) {
    fail('yearly-rhythm.html: expected link rel=preload for tdb-quiet-luxury.css (as=style)');
  }

  const dailyRhythm = read('daily-rhythm.html');
  if (!/rel=["']preload["'][^>]*tdb-calm-hubs\.css/.test(dailyRhythm) || !dailyRhythm.includes('as="style"')) {
    fail('daily-rhythm.html: expected link rel=preload for tdb-calm-hubs.css (as=style)');
  }

  const mobius = read('mobius.html');
  if (!/rel=["']preload["'][^>]*tool-pages\.css/.test(mobius) || !mobius.includes('as="style"')) {
    fail('mobius.html: expected link rel=preload for tool-pages.css (as=style)');
  }

  const reader = read('reader.html');
  if (!/rel=["']preload["'][^>]*cormorant-latin-subset\.css/.test(reader) || !reader.includes('as="style"')) {
    fail('reader.html: expected link rel=preload for cormorant-latin-subset.css (as=style)');
  }

  const coloring = read('coloring.html');
  if (!/rel=["']preload["'][^>]*color-and-tell\.css/.test(coloring) || !coloring.includes('as="style"')) {
    fail('coloring.html: expected link rel=preload for color-and-tell.css (as=style)');
  }

  const pastorHub = read('pastor/index.html');
  if (!/rel=["']preload["'][^>]*pastor\.css/.test(pastorHub) || !pastorHub.includes('as="style"')) {
    fail('pastor/index.html: expected link rel=preload for pastor.css (as=style)');
  }

  const home = read('index.html');
  if (!home.includes('id="tdb-hero-lcp-critical"')) {
    fail('index.html: expected inline #tdb-hero-lcp-critical for hero LCP font + verse paint');
  }
  if (!home.includes('/fonts/cormorant-garamond-hero-latin.woff2')) {
    fail('index.html: expected preload for cormorant-garamond-hero-latin.woff2 (hero LCP subset)');
  }
  if (!/font-display:\s*swap/.test(home) || !home.includes('#heroVerse')) {
    fail('index.html: hero LCP critical block should include font-display:swap and #heroVerse rules');
  }

  verifyLocalStylesheetPreloads();

  console.log('verify-performance: OK');
}

main();
