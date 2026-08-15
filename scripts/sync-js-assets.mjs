#!/usr/bin/env node
/**
 * Copies critical JS assets into dist/ after the main static copy step.
 * This guards root-level production requests that should never 404.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const assets = [
  { src: path.join(root, 'register-sw.js'), dest: path.join(dist, 'register-sw.js') },
  { src: path.join(root, 'kids', 'kids-shared.js'), dest: path.join(dist, 'kids-shared.js') },
  { src: path.join(root, 'core-home.js'), dest: path.join(dist, 'core-home.js') },
  { src: path.join(root, 'porch-effects.js'), dest: path.join(dist, 'porch-effects.js') },
  { src: path.join(root, 'tdb-verse-accuracy.js'), dest: path.join(dist, 'tdb-verse-accuracy.js') }
];

function fail(message) {
  console.error('sync-js-assets: ' + message);
  process.exit(1);
}

if (!fs.existsSync(dist)) fail('dist/ missing. Run after build-copy-static.js.');

console.log('sync-js-assets: copying ' + assets.length + ' critical JS file(s)...');

for (const asset of assets) {
  if (!fs.existsSync(asset.src)) {
    fail('missing source ' + path.relative(root, asset.src));
  }
  fs.copyFileSync(asset.src, asset.dest);
  console.log('sync-js-assets: copied ' + path.relative(root, asset.src) + ' -> ' + path.relative(root, asset.dest));
}

