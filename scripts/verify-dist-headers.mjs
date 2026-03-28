#!/usr/bin/env node
/**
 * After `npm run build`, ensures dist/_headers exists and contains the catch-all
 * security block (CSP + core headers). Prevents silent deploys where the output
 * directory is wrong or _headers failed to copy.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distHeaders = path.join(root, 'dist', '_headers');

function fail(msg) {
  console.error('verify-dist-headers:', msg);
  process.exit(1);
}

if (!fs.existsSync(distHeaders)) {
  fail(
    'dist/_headers missing. Run npm run build and ensure build-copy-static.js copies _headers into dist/.'
  );
}

const raw = fs.readFileSync(distHeaders, 'utf8');
if (!raw.includes('\n/*\n') && !raw.includes('\n/*\r\n')) {
  fail('dist/_headers: missing /* catch-all block');
}
if (!/Content-Security-Policy:\s+/m.test(raw)) {
  fail('dist/_headers: missing Content-Security-Policy');
}
if (!/default-src\s+'self'/i.test(raw)) {
  fail('dist/_headers: CSP missing default-src self');
}
if (!/trusted-types\s+default\s+dompurify/i.test(raw)) {
  fail('dist/_headers: CSP missing trusted-types default dompurify');
}
if (!/X-Frame-Options:\s+DENY/i.test(raw)) {
  fail('dist/_headers: missing X-Frame-Options: DENY');
}
if (!/Referrer-Policy:\s+no-referrer/i.test(raw)) {
  fail('dist/_headers: missing Referrer-Policy: no-referrer');
}

console.log('verify-dist-headers: OK dist/_headers has /* CSP + core security headers');
