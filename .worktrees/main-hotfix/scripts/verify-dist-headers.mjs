#!/usr/bin/env node
/**
 * After `npm run build`, ensures dist/_headers exists and the /* catch-all block
 * matches repo _headers exactly (prevents wrong output dir or stale copy).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCatchAllHeaders, headerPairsEqual } from './lib/headers-catchall.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distHeaders = path.join(root, 'dist', '_headers');
const rootHeaders = path.join(root, '_headers');

function fail(msg) {
  console.error('verify-dist-headers:', msg);
  process.exit(1);
}

if (!fs.existsSync(distHeaders)) {
  fail(
    'dist/_headers missing. Run npm run build and ensure build-copy-static.js copies _headers into dist/.'
  );
}

let rootPairs;
let distPairs;
try {
  rootPairs = parseCatchAllHeaders(fs.readFileSync(rootHeaders, 'utf8'));
  distPairs = parseCatchAllHeaders(fs.readFileSync(distHeaders, 'utf8'));
} catch (e) {
  fail(e.message || String(e));
}

if (!headerPairsEqual(rootPairs, distPairs)) {
  fail(
    'dist/_headers /* catch-all must match repo _headers exactly. Rebuild or fix copy step.'
  );
}

console.log(
  'verify-dist-headers: OK dist/_headers /* block matches repo (',
  rootPairs.length,
  'headers)'
);
