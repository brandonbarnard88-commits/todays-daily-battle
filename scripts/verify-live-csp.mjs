#!/usr/bin/env node
/**
 * Verifies production (or preview) sends the expected CSP so Cloudflare/Pages
 * has not drifted from _headers (Transform Rules override = silent regression).
 *
 * Usage: node scripts/verify-live-csp.mjs
 * Env:   LIVE_SITE_URL (default https://todaysdailybattle.com)
 */

const url = (process.env.LIVE_SITE_URL || 'https://todaysdailybattle.com').replace(/\/$/, '');

const NEED = [
  { label: 'default-src self', re: /default-src\s+'self'/i },
  { label: "require-trusted-types-for 'script'", re: /require-trusted-types-for\s+'script'/i },
  { label: 'trusted-types default dompurify', re: /trusted-types\s+[^;]*\bdefault\b[^;]*\bdompurify\b/i },
  { label: 'frame-ancestors', re: /frame-ancestors\s+'none'/i },
  { label: 'object-src', re: /object-src\s+'none'/i },
];

async function main() {
  let res;
  try {
    res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'user-agent': 'TDB-verify-live-csp/1.0' },
    });
  } catch (e) {
    console.error('verify-live-csp: fetch failed:', e.message || e);
    process.exit(1);
  }

  if (!res.ok) {
    console.error('verify-live-csp: HTTP', res.status, url);
    process.exit(1);
  }

  const csp = res.headers.get('content-security-policy');
  if (!csp || !String(csp).trim()) {
    console.error(
      'verify-live-csp: No Content-Security-Policy on document response.\n' +
        '  If you use Cloudflare Pages, ensure _headers is deployed to the output root.\n' +
        '  If a Transform Rule sets CSP, align it with _headers or remove the override.'
    );
    process.exit(1);
  }

  const combined = String(csp).trim();
  const missing = [];
  for (const { label, re } of NEED) {
    if (!re.test(combined)) missing.push(label);
  }

  if (missing.length) {
    console.error('verify-live-csp: CSP present but missing required fragments:', missing.join(', '));
    console.error('verify-live-csp: (first 400 chars)', combined.slice(0, 400) + (combined.length > 400 ? '…' : ''));
    process.exit(1);
  }

  console.log('verify-live-csp: OK', url, '→ CSP has Trusted Types + core directives');
}

main();
