#!/usr/bin/env node
/**
 * Static guard: performance-oriented SW + image loading hints stay wired.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('verify-performance:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
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

  console.log('verify-performance: OK');
}

main();
