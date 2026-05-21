#!/usr/bin/env node
/**
 * Subset Cormorant for home hero LCP — glyphs from 365 daily verses + KJV punctuation.
 * Output: fonts/cormorant-garamond-hero-latin.woff2 (committed; rebuild when hero-365 changes).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { loadYear365 } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcFont = path.join(root, 'fonts', 'cormorant-garamond-latin-normal.woff2');
const outFont = path.join(root, 'fonts', 'cormorant-garamond-hero-latin.woff2');
const venvPy = path.join(root, '.venv-fonttools');

const BASE_CHARS =
  ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  "'\".;,:;!?()-–—&\u2014\u2013\u00A0\n\r";

function collectHeroCharset() {
  const chars = new Set(BASE_CHARS.split(''));
  const arr = loadYear365(root);
  for (let i = 0; i < arr.length; i++) {
    const row = arr[i] || {};
    const chunks = [row.ref, row.text, row.plain, row.verse];
    for (let j = 0; j < chunks.length; j++) {
      const s = String(chunks[j] || '');
      for (let k = 0; k < s.length; k++) chars.add(s[k]);
    }
  }
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const rotateRe = /&ldquo;([\s\S]*?)&rdquo;/g;
  let m;
  while ((m = rotateRe.exec(indexHtml))) {
    const inner = m[1].replace(/<[^>]+>/g, '');
    for (let i = 0; i < inner.length; i++) chars.add(inner[i]);
  }
  return Array.from(chars).sort().join('');
}

function fail(msg) {
  console.error('build-hero-font-subset:', msg);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(srcFont)) fail('missing ' + srcFont);
  const text = collectHeroCharset();
  const textPath = path.join(root, '.tmp-hero-font-chars.txt');
  fs.writeFileSync(textPath, text, 'utf8');

  const pyCmd = fs.existsSync(path.join(venvPy, 'bin', 'python3'))
    ? path.join(venvPy, 'bin', 'python3')
    : 'python3';
  const args = [
    '-m',
    'fontTools.subset',
    srcFont,
    `--text-file=${textPath}`,
    '--flavor=woff2',
    '--layout-features=*',
    `--output-file=${outFont}`,
  ];
  const env = { ...process.env };
  if (fs.existsSync(venvPy)) env.PYTHONPATH = venvPy;

  const run = spawnSync(pyCmd, args, { stdio: 'inherit', env });
  fs.unlinkSync(textPath);
  if (run.status !== 0) {
    fail(
      'fontTools.subset failed — run: pip3 install fonttools --target .venv-fonttools'
    );
  }
  const before = fs.statSync(srcFont).size;
  const after = fs.statSync(outFont).size;
  console.log(
    'build-hero-font-subset: OK —',
    outFont.replace(root + path.sep, ''),
    `(${after} bytes, was ${before}; ${Math.round((1 - after / before) * 100)}% smaller, ${new Set(text.split('')).size} unique chars)`
  );
}

main();
