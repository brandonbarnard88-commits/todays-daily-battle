#!/usr/bin/env node
/**
 * Bootstrap a new Indonesian pilot HTML file from id/ketakutan.html (KJV + ID pattern).
 *
 * Usage (repo root):
 *   node scripts/scaffold-id-pilot.mjs [--force] <slug> <en-topic.html> "<page-title>"
 *
 * Example:
 *   node scripts/scaffold-id-pilot.mjs kekuatan topic-strength.html "Kekuatan: ayat KJV | Today's Daily Battle"
 *
 * Only rewrites URLs and the English topic pair; you must edit verses, Indonesian copy,
 * hreflang, related links, switcher maps, infra, and hub cards by hand.
 * See docs/LOCALE-COMPLETE.md → "Checklist: add one ID pilot page".
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const args = argv.filter((a) => a !== '--force');

if (args.length < 3) {
  console.error('Usage: node scripts/scaffold-id-pilot.mjs [--force] <slug> <en-topic.html> "<page-title>"');
  process.exit(1);
}

const [slug, enTopic, pageTitle] = args;
if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error('slug must be lowercase letters, digits, hyphen only (e.g. kekuatan)');
  process.exit(1);
}
if (!/^topic-[a-z0-9-]+\.html$/i.test(enTopic)) {
  console.error('en-topic must look like topic-strength.html');
  process.exit(1);
}

const templatePath = path.join(ROOT, 'id', 'ketakutan.html');
const outRel = `id/${slug}.html`;
const outAbs = path.join(ROOT, outRel);

if (!fs.existsSync(templatePath)) {
  console.error('Missing template:', templatePath);
  process.exit(1);
}
if (fs.existsSync(outAbs) && !force) {
  console.error('Refusing to overwrite', outRel, '(pass --force)');
  process.exit(1);
}

const canonicalNew = `https://todaysdailybattle.com/id/${slug}.html`;
const titleWord = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let body = fs.readFileSync(templatePath, 'utf8');

body = body.replace(
  /<!-- Pilot: Indonesian support[\s\S]*?-->/,
  `<!-- Pilot: Indonesian support around KJV text; EN pair ${enTopic}; sunting pasangan ES/FR/PT. -->`,
);
body = body.split('https://todaysdailybattle.com/id/ketakutan.html').join(canonicalNew);
body = body.split('/id/ketakutan.html').join(`/id/${slug}.html`);
body = body.split('topic-fear.html').join(enTopic);
body = body.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(pageTitle)}</title>`);
body = body.replace(
  /(<header class="hero-banner">\s*<h1>)[^<]*(<\/h1>)/,
  `$1Sunting judul — ${escHtml(titleWord)}$2`,
);
body = body.replace(
  /"headline": "[^"]*"/,
  `"headline": "${pageTitle.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`,
);

fs.writeFileSync(outAbs, body, 'utf8');
console.log('Wrote', outRel);
console.log('');
console.log('Next: verses + ID copy, hreflang, related buttons, sidebar, language-switcher.js, _headers, sitemap, purge, tests, id/index + explore.');
