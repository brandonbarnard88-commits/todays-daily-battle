#!/usr/bin/env node
/**
 * Verifies production (or preview) sends CSP + core security headers from repo _headers.
 * HEAD first; GET if CSP missing (some stacks differ). Checks apex + www by default.
 *
 * Usage: node scripts/verify-live-csp.mjs
 * Env:   LIVE_SITE_URL       — if set, only this URL (overrides multi-URL default)
 *        LIVE_SITE_URLS      — comma-separated (used when LIVE_SITE_URL unset)
 *        LIVE_CSP_FAIL_ON_REPORT_ONLY — if "1", fail when Report-Only header exists and
 *        differs from enforced CSP (default: warn only; see CLOUDFLARE-CSP-FIX.md §9).
 *        LIVE_CSP_HEADERS_ONLY — if "1", skip X-Frame / Referrer / etc. byte match (use when
 *        Cloudflare overrides frame options but you still want CSP + Report-Only validation).
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

const RETRY_ATTEMPTS = Math.max(1, Number(process.env.LIVE_CSP_ATTEMPTS || 3));
const RETRY_SLEEP_MS = Math.max(500, Number(process.env.LIVE_CSP_SLEEP_MS || 5000));

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/** Normalize CSP strings for equality (collapse ASCII whitespace). */
function normCspValue(s) {
  return norm(s).replace(/\s+/g, ' ');
}

/** Parse CSP into directive → token[] (order preserved per directive). */
function parseCspDirectives(csp) {
  const out = {};
  normCspValue(csp)
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const space = part.indexOf(' ');
      if (space === -1) return;
      const name = part.slice(0, space).trim().toLowerCase();
      const tokens = part
        .slice(space + 1)
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      out[name] = tokens;
    });
  return out;
}

/** True when live CSP contains every repo directive token (order-independent). */
function cspSemanticallyMatches(got, expected) {
  const gotD = parseCspDirectives(got);
  const expD = parseCspDirectives(expected);
  for (const [directive, expTokens] of Object.entries(expD)) {
    const gotTokens = gotD[directive];
    if (!gotTokens) return false;
    const gotSet = new Set(gotTokens);
    for (const token of expTokens) {
      if (!gotSet.has(token)) return false;
    }
  }
  return true;
}

/**
 * Stale Content-Security-Policy-Report-Only at Cloudflare causes DevTools
 * "[Report Only] Refused to load …" for same-origin scripts even when enforced CSP is correct.
 */
function checkReportOnlyHeader(res, url, enforcedCsp, via) {
  const ro = norm(res.headers.get('content-security-policy-report-only'));
  if (!ro) return;
  if (normCspValue(ro) === normCspValue(enforcedCsp)) {
    console.log(
      'verify-live-csp:',
      url,
      '(' + via + ') → Content-Security-Policy-Report-Only matches enforced CSP'
    );
    return;
  }
  const detail = [
    'verify-live-csp: WARNING — Content-Security-Policy-Report-Only differs from enforced CSP.',
    '  URL: ' + url,
    '  DevTools will show [Report Only] violations for resources that are actually allowed.',
    '  Fix (Cloudflare): Rules → Transform Rules → remove the rule that sets',
    '  Content-Security-Policy-Report-Only, or set it to the exact same value as Content-Security-Policy',
    '  (see _headers and CLOUDFLARE-CSP-COPY-PASTE.txt). Then Caching → Purge Everything.',
    '  Doc: CLOUDFLARE-CSP-FIX.md §9',
  ].join('\n');
  console.warn(detail);
  if (process.env.LIVE_CSP_FAIL_ON_REPORT_ONLY === '1') {
    throw new Error(
      'Content-Security-Policy-Report-Only mismatch (set LIVE_CSP_FAIL_ON_REPORT_ONLY=0 to warn only).'
    );
  }
}

function knownCloudflareOverrideHint(res) {
  const csp = norm(res.headers.get('content-security-policy'));
  const frame = norm(res.headers.get('x-frame-options'));
  const referrer = norm(res.headers.get('referrer-policy'));
  if (!csp && /sameorigin/i.test(frame) && /same-origin/i.test(referrer)) {
    return (
      '  Observed SAMEORIGIN + same-origin without CSP. This usually means the custom domain is not serving repo-managed _headers,\n' +
      '  or a Cloudflare Transform Rule / proxy origin is overriding the response headers before they reach users.'
    );
  }
  return '';
}

async function verifyOneWithRetry(url, expected) {
  let lastError = null;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      await verifyOne(url, expected);
      return;
    } catch (error) {
      lastError = error;
      if (attempt === RETRY_ATTEMPTS) break;
      console.warn(
        'verify-live-csp: retrying',
        url,
        '(' + attempt + '/' + RETRY_ATTEMPTS + ') →',
        error.message || error
      );
      await sleep(RETRY_SLEEP_MS);
    }
  }
  throw lastError || new Error('Unknown CSP verification failure.');
}

async function verifyOne(url, expected) {
  let res;
  let via;
  try {
    const out = await getResponseWithCsp(url);
    res = out.res;
    via = out.via;
  } catch (e) {
    throw new Error('fetch failed for ' + url + ': ' + (e.message || e));
  }

  if (!res.ok) {
    throw new Error('HTTP ' + res.status + ' for ' + url);
  }

  const csp = norm(res.headers.get('content-security-policy'));
  if (!csp) {
    throw new Error(
      'No Content-Security-Policy on document response (' +
        via +
        ').\n' +
        '  URL: ' +
        url +
        '\n' +
        '  If you use Cloudflare Pages, ensure dist/_headers is deployed to the output root.\n' +
        '  If you use Vercel, ensure vercel.json is deployed (run npm run sync:vercel-headers).\n' +
        '  If a Transform Rule sets or strips CSP, align with _headers or remove the override.\n' +
        knownCloudflareOverrideHint(res)
    );
  }

  const missing = [];
  for (const { label, re } of NEED) {
    if (!re.test(csp)) missing.push(label);
  }
  if (missing.length) {
    throw new Error(
      'CSP present but missing required fragments: ' +
        missing.join(', ') +
        '\n  URL: ' +
        url +
        '\n  First 400 chars: ' +
        (csp.slice(0, 400) + (csp.length > 400 ? '…' : ''))
    );
  }

  const expCsp = norm(expected['content-security-policy']);
  if (expCsp) {
    const gotNorm = normCspValue(csp);
    const expNorm = normCspValue(expCsp);
    if (gotNorm !== expNorm && !cspSemanticallyMatches(csp, expCsp)) {
      throw new Error(
        'CSP does not match repo _headers (byte-for-byte or semantic token set).\n' +
          '  URL: ' +
          url +
          '\n  got (first 120 chars): ' +
          (csp.slice(0, 120) + '…')
      );
    }
  }

  /* Warn on stale Report-Only edge header before other header mismatches (e.g. X-Frame-Options). */
  checkReportOnlyHeader(res, url, csp, via);

  if (process.env.LIVE_CSP_HEADERS_ONLY === '1') {
    console.log(
      'verify-live-csp: OK (headers-only mode)',
      url,
      '(' + via + ') → CSP matches _headers; skipped frame/referrer strict checks'
    );
    return;
  }

  const checks = [
    ['x-frame-options', 'X-Frame-Options'],
    ['referrer-policy', 'Referrer-Policy'],
    ['x-content-type-options', 'X-Content-Type-Options'],
    ['strict-transport-security', 'Strict-Transport-Security'],
    ['permissions-policy', 'Permissions-Policy'],
  ];
  for (const [ek, name] of checks) {
    const got = norm(res.headers.get(name));
    const want = norm(expected[ek]);
    if (want && got !== want) {
      let hint = '';
      if (
        ek === 'x-frame-options' &&
        /^deny$/i.test(want) &&
        /^sameorigin$/i.test(got)
      ) {
        hint =
          '\n\n  Remediation (Cloudflare is overriding Pages `_headers`):\n' +
          '  • Dashboard → Rules → Transform Rules → HTTP Response Headers: find any rule that sets\n' +
          '    X-Frame-Options to SAMEORIGIN; change to DENY or remove that action so `dist/_headers` wins.\n' +
          '  • Also check Security → Settings for legacy “HTTP headers” overrides.\n' +
          '  • After change: Caching → Purge Everything, then re-run `npm run test:live-csp`.\n' +
          '  • Doc: docs/SECURITY-HEADERS-CLOUDFLARE.md (X-Frame-Options row + Troubleshooting).\n';
      }
      throw new Error(
        name + ' mismatch for ' + url + ' (' + via + ').\n' +
          '  expected: ' +
          want +
          '\n' +
          '  got:      ' +
          (got || '(absent)') +
          hint
      );
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
  try {
    for (const url of list) {
      await verifyOneWithRetry(url, expected);
    }
  } catch (e) {
    console.error('verify-live-csp:', e.message || e);
    process.exit(1);
  }
}

main();
