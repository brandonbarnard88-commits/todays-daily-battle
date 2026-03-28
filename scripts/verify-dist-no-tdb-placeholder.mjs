#!/usr/bin/env node
/**
 * After `npm run build`, fail if any dist HTML file still contains the build
 * placeholder token (means HTML was copied without build-copy-static replace).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function fail(msg) {
  console.error('verify-dist-no-tdb-placeholder:', msg);
  process.exit(1);
}

function walkHtml(dir, out) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const buildDatePath = path.join(dist, 'build-date.txt');
if (!fs.existsSync(buildDatePath)) {
  fail('dist/build-date.txt missing. Run npm run build (build-copy-static writes it).');
}
const stamp = fs.readFileSync(buildDatePath, 'utf8').trim();
if (!stamp) {
  fail('dist/build-date.txt is empty.');
}

const files = walkHtml(dist, []);
const bad = [];
for (let f = 0; f < files.length; f++) {
  const html = fs.readFileSync(files[f], 'utf8');
  if (html.includes('TDB_BUILD_DATE')) bad.push(path.relative(root, files[f]));
}
if (bad.length) {
  fail(
    'Literal TDB_BUILD_DATE still present in ' +
      bad.length +
      ' file(s):\n  ' +
      bad.join('\n  ')
  );
}

console.log(
  'verify-dist-no-tdb-placeholder: OK (',
  files.length,
  'HTML files, build-date.txt OK)'
);
