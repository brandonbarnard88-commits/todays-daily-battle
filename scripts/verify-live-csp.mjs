#!/usr/bin/env node
/**
 * Verifies production (or preview) sends CSP + core security headers from repo _headers.
 * HEAD first; GET if CSP missing (some stacks differ). Checks apex + www by default.
 *
 * Usage: node scripts/verify-live-csp.mjs
 * Env:   LIVE_SITE_URL       — if set, only this URL (overrides multi-URL default)
 *        LIVE_SITE_URLS      — comma-separated (used when LIVE_SITE_URL unset)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCatchAllHeaders } from './lib/headers-catchall.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const NEED = [
  { label: 'default-src self', re: /default-src\s+'self'/i },
  { label: 'trusted-types default dompurify', re: /trusted-types\s+[^;]*\bdefault\b[^;]*\bdompurify\b/i },
  { label: 'frame-ancestors', re: /frame-ancestors\s+'none'/i },
  { label: 'object-src', re: /object-src\s+'none'/i },
];

function loadExpectedFromRepo() {
  const p = path.join(root, '_headers');
  const raw = fs.readFileSync(p, 'utf8');
  const pairs = parseCatchAllHeaders(raw);
  const map = {};
  for (const { key, value } of pairs) {
    map[key.toLowerCase()] = value;
  }
  return map;
}

function urlsToCheck() {
  const single = process.env.LIVE_SITE_URL;
  if (single && String(single).trim()) {
    return [String(single).trim().replace(/\/$/, '')];
  }
  const multi =
    process.env.LIVE_SITE_URLS ||
    'https://todaysdailybattle.com,https://www.todaysdailybattle.com';
  return multi
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

async function fetchDocument(url, method) {
  return fetch(url, {
    method,
    redirect: 'follow',
    headers: { 'user-agent': 'TDB-verify-live-csp/2.0' },
  });
}

async function getResponseWithCsp(url) {
  let res = await fetchDocument(url, 'HEAD');
  if (res.ok) {
    const csp = res.headers.get('content-security-policy');
    if (csp && String(csp).trim()) return { res, via: 'HEAD' };
  }
  res = await fetchDocument(url, 'GET');
  return { res, via: 'GET' };
}

function norm(s) {
  return s == null ? '' : String(s).trim();
}

async function verifyOne(url, expected) {
  let res;
  let via;
  try {
    const out = await getResponseWithCsp(url);
    res = out.res;
    via = out.via;
  } catch (e) {
    console.error('verify-live-csp: fetch failed:', url, e.message || e);
    process.exit(1);
  }

  if (!res.ok) {
    console.error('verify-live-csp: HTTP', res.status, url);
    process.exit(1);
  }

  const csp = norm(res.headers.get('content-security-policy'));
  if (!csp) {
    console.error(
      'verify-live-csp: No Content-Security-Policy on document response (' +
        via +
        ').\n' +
        '  URL: ' +
        url +
        '\n' +
        '  If you use Cloudflare Pages, ensure dist/_headers is deployed to the output root.\n' +
        '  If you use Vercel, ensure vercel.json is deployed (run npm run sync:vercel-headers).\n' +
        '  If a Transform Rule sets or strips CSP, align with _headers or remove the override.'
    );
    process.exit(1);
  }

  const missing = [];
  for (const { label, re } of NEED) {
    if (!re.test(csp)) missing.push(label);
  }
  if (missing.length) {
    console.error(
      'verify-live-csp: CSP present but missing required fragments:',
      missing.join(', ')
    );
    console.error('verify-live-csp: (first 400 chars)', csp.slice(0, 400) + (csp.length > 400 ? '…' : ''));
    process.exit(1);
  }

  const expCsp = norm(expected['content-security-policy']);
  if (expCsp && csp !== expCsp) {
    console.error('verify-live-csp: CSP does not match repo _headers (byte-for-byte).');
    console.error('  got (first 120 chars):', csp.slice(0, 120) + '…');
    process.exit(1);
  }

  const checks = [
    ['x-frame-options', 'X-Frame-Options'],
    ['referrer-policy', 'Referrer-Policy'],
  ];
  for (const [ek, name] of checks) {
    const got = norm(res.headers.get(name));
    const want = norm(expected[ek]);
    if (want && got !== want) {
      console.error(
        'verify-live-csp: ' + name + ' mismatch for ' + url + ' (' + via + ').\n' +
          '  expected: ' +
          want +
          '\n' +
          '  got:      ' +
          (got || '(absent)')
      );
      process.exit(1);
    }
  }

  console.log('verify-live-csp: OK', url, '(' + via + ') → CSP + frame/referrer match _headers');
}

async function main() {
  let expected;
  try {
    expected = loadExpectedFromRepo();
  } catch (e) {
    console.error('verify-live-csp: could not read _headers:', e.message || e);
    process.exit(1);
  }

  const list = urlsToCheck();
  for (const url of list) {
    await verifyOne(url, expected);
  }
}

main();
