#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const offlineStripPath = path.join(root, 'tdb-offline-strip.js');

const IGNORE_DIRS = new Set([
  '.cursor',
  '.git',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results'
]);

function fail(message) {
  console.error('verify-offline-strip-coverage:', message);
  process.exit(1);
}

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.html') && !entry.name.endsWith('.js')) continue;
    out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

const offlineStrip = fs.readFileSync(offlineStripPath, 'utf8');
const messageKeys = new Set();
for (const match of offlineStrip.matchAll(/^\s*(?:'([^']+)'|([A-Za-z][A-Za-z0-9-]*)):\s*$/gm)) {
  messageKeys.add(match[1] || match[2]);
}

const files = walk(root, []);
const usedKeys = new Map();

for (const file of files) {
  if (path.basename(file) === 'tdb-offline-strip.js') continue;
  const body = fs.readFileSync(file, 'utf8');
  for (const match of body.matchAll(/data-tdb-offline-page="([^"]+)"/g)) {
    const key = String(match[1] || '').trim();
    if (!key) continue;
    if (!usedKeys.has(key)) usedKeys.set(key, []);
    usedKeys.get(key).push(rel(file));
  }
  for (const match of body.matchAll(/TDB_showOfflineStrip\(\s*'([^']+)'/g)) {
    const key = String(match[1] || '').trim();
    if (!key) continue;
    if (!usedKeys.has(key)) usedKeys.set(key, []);
    usedKeys.get(key).push(rel(file));
  }
}

const missing = [];
for (const [key, refs] of usedKeys.entries()) {
  if (!messageKeys.has(key)) {
    missing.push(key + ' ← ' + Array.from(new Set(refs)).join(', '));
  }
}

if (missing.length) {
  fail('missing offline-strip messages for:\n  ' + missing.join('\n  '));
}

console.log('verify-offline-strip-coverage: OK', usedKeys.size, 'offline page keys covered');
