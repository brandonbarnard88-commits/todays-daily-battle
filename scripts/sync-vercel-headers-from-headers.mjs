#!/usr/bin/env node
/**
 * Single source of truth: _headers (/* catch-all). Rewrites vercel.json headers
 * so Vercel deployments match Cloudflare Pages _headers.
 *
 * Usage:
 *   node scripts/sync-vercel-headers-from-headers.mjs          # write vercel.json
 *   node scripts/sync-vercel-headers-from-headers.mjs --check  # exit 1 if drift
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCatchAllHeaders, headerPairsEqual } from './lib/headers-catchall.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const headersPath = path.join(root, '_headers');
const vercelPath = path.join(root, 'vercel.json');

const checkOnly = process.argv.includes('--check');

function readHeadersFile() {
  if (!fs.existsSync(headersPath)) {
    console.error('sync-vercel-headers: _headers not found at', headersPath);
    process.exit(1);
  }
  return fs.readFileSync(headersPath, 'utf8');
}

function buildVercelWithHeaders(pairs) {
  if (!fs.existsSync(vercelPath)) {
    console.error('sync-vercel-headers: vercel.json not found');
    process.exit(1);
  }
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  vercel.headers = [
    {
      source: '/(.*)',
      headers: pairs.map((p) => ({ key: p.key, value: p.value })),
    },
  ];
  return vercel;
}

function main() {
  let pairs;
  try {
    pairs = parseCatchAllHeaders(readHeadersFile());
  } catch (e) {
    console.error('sync-vercel-headers:', e.message || e);
    process.exit(1);
  }

  const next = buildVercelWithHeaders(pairs);

  if (checkOnly) {
    const current = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    const curBlock = current.headers && current.headers[0] && current.headers[0].headers;
    const nextBlock = next.headers[0].headers;
    if (!headerPairsEqual(curBlock, nextBlock)) {
      console.error(
        'sync-vercel-headers: vercel.json catch-all headers are out of sync with _headers.\n' +
          '  Run: npm run sync:vercel-headers\n' +
          '  Or: npm run build (sync runs first)'
      );
      process.exit(1);
    }
    console.log('sync-vercel-headers: OK vercel.json matches _headers /* catch-all');
    return;
  }

  const out = JSON.stringify(next, null, 2) + '\n';
  fs.writeFileSync(vercelPath, out, 'utf8');
  console.log('sync-vercel-headers: wrote vercel.json from _headers (', pairs.length, 'headers)');
}

main();
