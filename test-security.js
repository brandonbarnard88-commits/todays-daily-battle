#!/usr/bin/env node
/**
 * Security test: defense and offense.
 * Run: node test-security.js
 *
 * Defense: CSP, headers, sanitization, no exposed secrets, security.txt.
 * Offense: patterns that could be exploited (eval, unescaped innerHTML, secrets in repo).
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let failed = 0;
const warnings = [];

function read(file) {
  const p = path.join(ROOT, file);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function ok(msg) {
  console.log('OK   ', msg);
}

function fail(msg) {
  console.log('FAIL ', msg);
  failed++;
}

function warn(msg) {
  console.log('WARN ', msg);
  warnings.push(msg);
}

console.log('=== Security test: defense & offense ===\n');

// --- DEFENSE ---
console.log('--- Defense ---');

// 1. CSP in index.html
const index = read('index.html');
if (!index.includes('Content-Security-Policy')) {
  fail('index.html: No Content-Security-Policy meta');
} else {
  ok('CSP present in index.html');
}
if (!index.includes("default-src 'self'") && !index.includes('default-src \'self\'')) {
  warn('CSP may be weak: default-src should include self');
}

// 2. Security headers (_headers)
const headers = read('_headers');
const requiredHeaders = ['X-Frame-Options', 'X-Content-Type-Options', 'Strict-Transport-Security'];
for (const h of requiredHeaders) {
  if (!headers.includes(h)) {
    fail('_headers: Missing ' + h);
  }
}
if (headers.includes('X-Frame-Options') && headers.includes('Strict-Transport-Security')) {
  ok('Security headers present in _headers');
}

// 3. security.txt
const securityTxt = read('.well-known/security.txt');
if (!securityTxt.includes('Contact:') || !securityTxt.includes('Expires:')) {
  fail('.well-known/security.txt missing or incomplete (Contact, Expires)');
} else {
  ok('security.txt present with Contact and Expires');
}

// 4. DOMPurify loaded (XSS defense)
if (!index.includes('purify') && !index.includes('dompurify')) {
  fail('index.html: DOMPurify not loaded (XSS mitigation)');
} else {
  ok('DOMPurify loaded');
}

// 5. script.js: escapeHtml / sanitizeUserInput used
const script = read('script.js');
if (!script.includes('function escapeHtml') && !script.includes('escapeHtml(')) {
  fail('script.js: escapeHtml not found');
}
if (!script.includes('sanitizeUserInput')) {
  fail('script.js: sanitizeUserInput not found (user input sanitization)');
}
if (script.includes('escapeHtml') && script.includes('sanitizeUserInput')) {
  ok('script.js: escapeHtml and sanitizeUserInput present');
}

// 6. config.js not committed with secrets (recommend .gitignore)
const gitignore = read('.gitignore');
if (!gitignore.includes('config.js')) {
  warn('config.js not in .gitignore — ensure production config.js is never committed with real keys');
} else {
  ok('config.js in .gitignore');
}

// 7. No eval() of user or remote data in script.js (eval is dangerous)
const scriptEval = script.match(/eval\s*\(/g);
if (scriptEval && scriptEval.length > 0) {
  fail('script.js: eval() used (' + scriptEval.length + ' time(s)) — avoid for user/API data');
} else {
  ok('script.js: no eval()');
}

// 8. test-stripe.js: prefer JSON.parse over eval for parsing config
const testStripe = read('test-stripe.js');
if (testStripe.includes("eval('(' +") && !testStripe.includes('JSON.parse(priceIdsMatch')) {
  warn('test-stripe.js: uses only eval() to parse STRIPE_PRICE_IDS — prefer JSON.parse first');
} else {
  ok('test-stripe.js: JSON.parse used for config or eval fallback documented');
}

// 9. Referrer policy
if (!index.includes('referrer') && !headers.includes('Referrer-Policy')) {
  warn('Referrer-Policy not set (index or _headers)');
} else {
  ok('Referrer policy considered');
}

// 10. Supabase anon key placeholder check (build/deploy should not ship placeholder)
if (script.includes('your-project-ref') || script.includes('your-anon-key')) {
  warn('script.js or config may contain Supabase placeholder — ensure build uses real config');
}

console.log('\n--- Offense (vulnerability patterns) ---');

// O1. innerHTML with potentially unescaped dynamic content (heuristic)
const innerHtmlLines = script.split('\n').filter((line) => {
  if (!line.includes('.innerHTML') || line.trimStart().startsWith('//')) return false;
  const hasEscape = line.includes('escapeHtml') || line.includes('sanitize') || line.includes('DOMPurify');
  const hasConcatenation = line.includes('+') && (line.includes("'") || line.includes('"'));
  const isStatic = /innerHTML\s*=\s*['"][^'"]*['"]\s*;?\s*$/.test(line.trim());
  if (isStatic) return false;
  if (hasConcatenation && !hasEscape) return true;
  return false;
});
if (innerHtmlLines.length > 0) {
  warn(innerHtmlLines.length + ' innerHTML assignment(s) with concatenation but no escapeHtml/sanitize in same line — verify escaping elsewhere');
} else {
  ok('No obvious unescaped innerHTML concatenation in script.js');
}

// O2. document.write (should not be used)
if (script.includes('document.write(')) {
  fail('script.js: document.write() used (XSS vector)');
} else {
  ok('No document.write in script.js');
}

// O3. wins-report.html: statsEl.innerHTML = html — html built from localStorage
const winsReport = read('wins-report.html');
if (winsReport.includes('statsEl.innerHTML = html') && !winsReport.includes('escape') && !winsReport.includes('textContent')) {
  warn('wins-report.html: innerHTML from localStorage (lastKey) — consider escaping for defense in depth');
}

// O4. MASTER_EMAIL or admin emails in client (documented risk in SECURITY-HARDENING)
if (script.includes('MASTER_EMAIL') && script.includes('@')) {
  warn('Admin/MASTER_EMAIL in client script — prefer server-side role check (RPC)');
}

ok('Stats page password is client-side optional (documented)');

console.log('\n--- Summary ---');
console.log('Warnings: ' + warnings.length);
if (warnings.length) {
  warnings.forEach(w => console.log('  - ' + w));
}
if (failed > 0) {
  console.log('\n' + failed + ' failure(s). Fix before treating site as secure.');
  process.exit(1);
}
console.log('\nAll defense checks passed. Review warnings and run manual tests (e.g. XSS on prayer wall, auth flows).');
process.exit(0);
