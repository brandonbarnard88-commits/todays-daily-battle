#!/usr/bin/env node
/**
 * Crawl dist/ HTML: audit links, buttons, forms, src assets, empty targets.
 * Run after: npm run build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ missing — run npm run build');
  process.exit(1);
}

const htmlFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (['.git', 'node_modules'].includes(name)) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(dist);

function resolveTarget(fromFile, rawHref) {
  const raw = rawHref.split('#')[0].split('?')[0].trim();
  if (!raw || raw === '#') return null;
  if (/^(mailto:|tel:|javascript:|data:|https?:)/i.test(raw)) return { external: true, raw };
  const fromDir = path.dirname(fromFile);
  const isAbs = raw.startsWith('/');
  const targetPath = isAbs ? path.join(dist, raw.replace(/^\//, '')) : path.join(fromDir, raw);
  return { external: false, targetPath, raw };
}

function targetExists(targetPath) {
  if (!targetPath) return false;
  const norm = path.normalize(targetPath);
  if (fs.existsSync(norm) && fs.statSync(norm).isFile()) return true;
  if (fs.existsSync(norm + '.html')) return true;
  if (fs.existsSync(path.join(norm, 'index.html'))) return true;
  return false;
}

const stats = {
  pages: htmlFiles.length,
  links: 0,
  buttons: 0,
  forms: 0,
  imgs: 0,
  scripts: 0,
  emptyHashLinks: 0,
  jsVoidLinks: 0,
  missingInternal: [],
  missingAssets: [],
  buttonsNoType: [],
  formsNoAction: [],
  duplicateIds: new Map(),
};

const checkedLinks = new Set();
const checkedAssets = new Set();

for (const file of htmlFiles) {
  let body = fs.readFileSync(file, 'utf8');
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  // IDs
  for (const m of body.matchAll(/\bid=["']([^"']+)["']/g)) {
    const id = m[1];
    if (!stats.duplicateIds.has(id)) stats.duplicateIds.set(id, []);
    stats.duplicateIds.get(id).push(path.relative(dist, file));
  }

  // Links
  for (const m of body.matchAll(/<a\b[^>]*\bhref=["']([^"']*)["'][^>]*>/gi)) {
    const href = (m[1] || '').trim();
    stats.links++;
    if (href === '#' || href === '') stats.emptyHashLinks++;
    if (/^javascript:/i.test(href)) stats.jsVoidLinks++;
    const resolved = resolveTarget(file, href);
    if (!resolved || resolved.external) continue;
    const key = path.relative(dist, file) + ' -> ' + href;
    if (checkedLinks.has(key)) continue;
    checkedLinks.add(key);
    if (!targetExists(resolved.targetPath)) {
      stats.missingInternal.push({ from: path.relative(root, file), href });
    }
  }

  // Buttons
  for (const m of body.matchAll(/<button\b([^>]*)>/gi)) {
    stats.buttons++;
    const attrs = m[1] || '';
    if (!/\btype=["']/i.test(attrs) && !/\btype=/i.test(attrs)) {
      stats.buttonsNoType.push(path.relative(dist, file));
    }
  }

  // Forms
  for (const m of body.matchAll(/<form\b([^>]*)>/gi)) {
    stats.forms++;
    const attrs = m[1] || '';
    if (!/\baction=["']/i.test(attrs)) {
      stats.formsNoAction.push(path.relative(dist, file));
    }
  }

  // Images & scripts src
  for (const m of body.matchAll(/\b(?:src|href)=["']([^"']+\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?|mp3|mp4|json))(?:\?[^"']*)?["']/gi)) {
    const src = m[1].split('?')[0];
    if (/^https?:\/\//i.test(src)) continue;
    const key = path.relative(dist, file) + ' -> ' + src;
    if (checkedAssets.has(key)) continue;
    checkedAssets.add(key);
    stats.imgs++;
    const resolved = resolveTarget(file, src);
    if (!resolved || resolved.external) continue;
    if (!targetExists(resolved.targetPath)) {
      stats.missingAssets.push({ from: path.relative(root, file), src });
    }
  }
}

const dupIds = [...stats.duplicateIds.entries()].filter(([, files]) => {
  const uniqueFiles = new Set(files);
  return uniqueFiles.size > 1;
});

console.log('=== Interactive Full Audit (dist/) ===\n');
console.log(`Pages:              ${stats.pages}`);
console.log(`Links (total):      ${stats.links}`);
console.log(`Unique int. links:  ${checkedLinks.size}`);
console.log(`Buttons:            ${stats.buttons}`);
console.log(`Forms:              ${stats.forms}`);
console.log(`Asset refs checked: ${checkedAssets.size}`);
console.log(`Empty/# links:      ${stats.emptyHashLinks}`);
console.log(`javascript: links:  ${stats.jsVoidLinks}`);
console.log(`Buttons w/o type:   ${stats.buttonsNoType.length} (across pages)`);
console.log(`Forms w/o action:   ${stats.formsNoAction.length} (may be JS-handled)`);
console.log(`Duplicate IDs:      ${dupIds.length} IDs on multiple pages`);
console.log('');

let exitCode = 0;

if (stats.missingInternal.length) {
  exitCode = 1;
  console.log(`BROKEN INTERNAL LINKS: ${stats.missingInternal.length}`);
  stats.missingInternal.slice(0, 30).forEach(({ from, href }) => console.log(`  ${from} -> ${href}`));
  if (stats.missingInternal.length > 30) console.log(`  ... +${stats.missingInternal.length - 30} more`);
  console.log('');
}

if (stats.missingAssets.length) {
  exitCode = 1;
  console.log(`MISSING ASSETS: ${stats.missingAssets.length}`);
  stats.missingAssets.slice(0, 30).forEach(({ from, src }) => console.log(`  ${from} -> ${src}`));
  if (stats.missingAssets.length > 30) console.log(`  ... +${stats.missingAssets.length - 30} more`);
  console.log('');
}

if (dupIds.length) {
  console.log(`WARN duplicate IDs (sample): ${Math.min(10, dupIds.length)} shown`);
  dupIds.slice(0, 10).forEach(([id, files]) => {
    const u = [...new Set(files)];
    console.log(`  #${id} on ${u.length} pages (e.g. ${u.slice(0, 3).join(', ')})`);
  });
  console.log('');
}

if (!exitCode) console.log('PASSED — no broken internal links or missing local assets');
process.exit(exitCode);
