#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const required = ['register-sw.js', 'kids-shared.js', 'core-home.js', 'porch-effects.js', 'tdb-one-interrupt.js', 'tdb-backup-reminder.js', 'js/surfaces/home.js'];

function fail(msg) {
  console.error('verify-js-assets:', msg);
  process.exit(1);
}

for (const file of required) {
  if (!fs.existsSync(path.join(dist, file))) {
    fail('missing dist/' + file);
  }
}

/** Every same-origin path in service-worker CORE_ASSETS must exist in dist/ (precache is lenient at runtime; CI should catch gaps). */
function verifyCoreAssetsInDist() {
  const swPath = path.join(root, 'service-worker.js');
  if (!fs.existsSync(swPath)) fail('missing service-worker.js');
  const sw = fs.readFileSync(swPath, 'utf8');
  const m = sw.match(/const CORE_ASSETS = \[([\s\S]*?)\n\];\s*\nconst CDN_FUSE_JS/);
  if (!m) fail('service-worker.js: CORE_ASSETS block not found (anchor CDN_FUSE_JS)');
  const body = m[1];
  const quoted = body.matchAll(/'([^']+)'/g);
  const missing = [];
  for (const q of quoted) {
    const raw = q[1];
    if (!raw || /^https?:\/\//i.test(raw)) continue;
    const pathname = raw.split('?')[0];
    if (!pathname.startsWith('/')) continue;
    const rel = pathname.slice(1);
    if (!rel) continue;
    const dest = path.join(dist, rel);
    if (!fs.existsSync(dest)) missing.push(rel);
  }
  if (missing.length) {
    fail('dist/ missing ' + missing.length + ' CORE_ASSETS path(s): ' + missing.join(', '));
  }
}

verifyCoreAssetsInDist();

console.log('verify-js-assets: OK (' + required.join(', ') + ' + CORE_ASSETS → dist)');
