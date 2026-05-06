/**
 * topic-*.html (English): body.tdb-inner-page + dawn hero band.
 * Run: node scripts/patch-topic-inner-hero.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const files = fs.readdirSync(root).filter((f) => f.startsWith('topic-') && f.endsWith('.html'));

for (const name of files) {
  const full = path.join(root, name);
  let h = fs.readFileSync(full, 'utf8');

  if (h.includes('<body class="dark-mode">') && !h.includes('tdb-inner-page')) {
    h = h.replace('<body class="dark-mode">', '<body class="dark-mode tdb-inner-page">');
  }
  if (
    h.includes('<body class="dark-mode tdb-topic-mood-page">') &&
    !h.includes('tdb-inner-page')
  ) {
    h = h.replace(
      '<body class="dark-mode tdb-topic-mood-page">',
      '<body class="dark-mode tdb-inner-page tdb-topic-mood-page">'
    );
  }

  h = h.replace(
    '<header class="hero-banner topic-mood-hero">',
    '<header class="hero-banner topic-mood-hero topic-hero--soar-dawn tdb-dawn-bg--mist" id="topic-top">'
  );

  if (!h.includes('topic-mood-hero')) {
    h = h.replace('<header class="hero-banner">', '<header class="hero-banner topic-hero--soar-dawn tdb-dawn-bg--mist" id="topic-top">');
    h = h.replace(
      /(<header class="hero-banner topic-hero--soar-dawn[^>]*>\s*<h1>[^<]*<\/h1>)\s*\r?\n(\s*)<p>/,
      '$1\n$2<p class="topic-hero-lead">'
    );
  }

  fs.writeFileSync(full, h, 'utf8');
  console.log('patched', name);
}
