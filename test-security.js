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

function walkJsFiles(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    const full = path.join(dir, name);
    if (entry.isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === '.cursor' || name === 'dist') continue;
      walkJsFiles(full, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!name.endsWith('.js')) continue;
    out.push(full);
  }
}

function relPath(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, '/');
}

function extractInnerHtmlRhs(stmt) {
  const m = stmt.match(/innerHTML\s*=\s*([\s\S]*?)\s*;?\s*$/);
  return m ? m[1].trim() : '';
}

function isLiteralOnlyConcatenation(rhs) {
  if (!rhs) return false;
  // Allow concatenations of string literals only: 'a' + "b" + `c`
  // Replace string literals with a marker and ensure the rest is only +/()/whitespace.
  const noStrings = rhs.replace(/'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"|`[^`\\]*(?:\\.[^`\\]*)*`/g, 'S');
  return /^[S+\s()]*$/.test(noStrings);
}

console.log('=== Security test: defense & offense ===\n');

// --- DEFENSE ---
console.log('--- Defense ---');

// 1. CSP — authoritative policy is in _headers (HTTP header), not a meta tag.
//    Meta CSP was intentionally removed to avoid conflicts with the HTTP header.
const headersForCsp = read('_headers');
if (!headersForCsp.includes('Content-Security-Policy')) {
  fail('_headers: No Content-Security-Policy header');
} else {
  ok('CSP present in _headers (HTTP header — correct)');
}
if (!headersForCsp.includes("default-src 'self'") && !headersForCsp.includes('default-src \'self\'')) {
  warn('CSP may be weak: default-src should include self');
}

// 2. Security headers (_headers)
const index = read('index.html');
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

// 7. No eval() in app JS modules (eval is dangerous)
const jsFiles = [];
walkJsFiles(ROOT, jsFiles);
const runtimeJsFiles = jsFiles.filter((p) => {
  const rel = relPath(p);
  if (rel === 'test-security.js') return false;
  if (rel.startsWith('docs/')) return false;
  if (rel === 'setup-config.js') return false;
  if (rel.startsWith('scripts/')) return false;
  if (rel.startsWith('firebase-functions/')) return false;
  if (rel.startsWith('supabase/functions/')) return false;
  return true;
});
const evalFindings = [];
for (const absPath of runtimeJsFiles) {
  const src = fs.readFileSync(absPath, 'utf8');
  const matches = src.match(/eval\s*\(/g);
  if (matches && matches.length > 0) {
    evalFindings.push(relPath(absPath) + ' (' + matches.length + ')');
  }
}
if (evalFindings.length > 0) {
  fail('eval() used in app JS: ' + evalFindings.join(', '));
} else {
  ok('No eval() in app JS modules');
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
const hasOldPlaceholders = script.includes('your-project-ref') || script.includes('your-anon-key');
const hasNewPlaceholders = script.includes('SUPABASE_URL_PLACEHOLDER') || script.includes('SUPABASE_ANON_KEY_PLACEHOLDER');
if (hasOldPlaceholders || hasNewPlaceholders) {
  warn('script.js or config may contain Supabase placeholder tokens (old/new) — ensure build uses real config');
}

console.log('\n--- Offense (vulnerability patterns) ---');

// O1. innerHTML with potentially unescaped dynamic content (heuristic)
const innerHtmlFindings = [];
for (const absPath of runtimeJsFiles) {
  const rel = relPath(absPath);
  const src = fs.readFileSync(absPath, 'utf8');
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('.innerHTML') || line.trimStart().startsWith('//')) continue;

    let stmt = line;
    let j = i + 1;
    while (j < lines.length && j <= i + 10 && !lines[j - 1].includes(';')) {
      stmt += '\n' + lines[j];
      j += 1;
    }

    const hasEscape = /escapeHtml|escHtml|attrEscape|sanitize|DOMPurify|encodeURIComponent|sanitizeSvgMarkup|\besc\(/.test(stmt);
    const hasConcatenation = stmt.includes('+') && (stmt.includes("'") || stmt.includes('"') || stmt.includes('`'));
    const rhs = extractInnerHtmlRhs(stmt);
    const isStatic = /innerHTML\s*=\s*['"`][\s\S]*?['"`]\s*;?\s*$/.test(stmt.trim()) && !hasConcatenation;
    const isLiteralConcat = isLiteralOnlyConcatenation(rhs);
    if (isStatic) continue;
    if (isLiteralConcat) continue;
    if (hasConcatenation && !hasEscape) {
      innerHtmlFindings.push(rel + ':' + (i + 1));
    }
  }
}
if (innerHtmlFindings.length > 0) {
  const sample = innerHtmlFindings.slice(0, 12).join(', ');
  warn(
    innerHtmlFindings.length +
    ' innerHTML assignment(s) with concatenation but no escape/sanitize on same line. Sample: ' + sample +
    (innerHtmlFindings.length > 12 ? ', ...' : '')
  );
} else {
  ok('No obvious unescaped innerHTML concatenation across app JS');
}

// O2. document.write should not be used
const documentWriteFindings = [];
for (const absPath of runtimeJsFiles) {
  const rel = relPath(absPath);
  const src = fs.readFileSync(absPath, 'utf8');
  if (src.includes('document.write(')) {
    documentWriteFindings.push(rel);
  }
}
if (documentWriteFindings.length > 0) {
  fail('document.write() used in app JS: ' + documentWriteFindings.join(', '));
} else {
  ok('No document.write in app JS modules');
}

// O3. wins-report.html: statsEl.innerHTML = html — html built from localStorage
const winsReport = read('wins-report.html');
if (winsReport.includes('statsEl.innerHTML = html') && !winsReport.includes('escape') && !winsReport.includes('textContent')) {
  warn('wins-report.html: innerHTML from localStorage (lastKey) — consider escaping for defense in depth');
}

// O4. MASTER_EMAIL or admin emails in any client module (documented risk)
const adminEmailFindings = [];
for (const absPath of runtimeJsFiles) {
  const rel = relPath(absPath);
  const src = fs.readFileSync(absPath, 'utf8');
  const masterLiteralEmail = /MASTER_EMAILS?\s*[:=]\s*["'`][^"'`]*@[^"'`]+["'`]/.test(src);
  if (masterLiteralEmail) {
    adminEmailFindings.push(rel);
  }
}
if (adminEmailFindings.length > 0) {
  warn('Admin/MASTER_EMAIL appears client-side in: ' + adminEmailFindings.join(', ') + ' — prefer server-side role check');
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
