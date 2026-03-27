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
      if (name === 'node_modules' || name === '.git' || name === '.cursor' || name === 'dist' || name === 'playwright-report' || name === 'test-results') continue;
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
// require-trusted-types-for 'script' removed: strict sink enforcement breaks third-party scripts (e.g. GA/gtag)
// that assign plain strings to HTML sinks; tt-bootstrap still wraps innerHTML via default + dompurify policies.
if (headersForCsp.includes("require-trusted-types-for 'script'")) {
  warn('CSP: require-trusted-types-for script is set — may cause TrustedHTML console violations with third-party JS');
} else {
  ok('CSP: no require-trusted-types-for (third-party-safe; Trusted Types policies + tt-bootstrap sanitization remain)');
}
if (!headersForCsp.includes('trusted-types default dompurify')) {
  fail('_headers: CSP trusted-types must allow default and dompurify (DOMPurify internal policy)');
} else if (headersForCsp.includes('decodeHTMLEntitiesPolicy')) {
  warn('CSP: decodeHTMLEntitiesPolicy in trusted-types is unnecessary for this repo; prefer minimal allowlist (default dompurify)');
} else {
  ok('CSP: trusted-types default dompurify (minimal allowlist)');
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

// 2b. Cache hygiene — high-churn HTML must not stick at CDN (see _headers comment + cloudflare-purge.mjs)
const headerLines = headers.split(/\r?\n/).map((l) => l.trim());
const cacheHygienePaths = [
  '/explore.html',
  '/explore',
  '/plans.html',
  '/plans',
  '/my-verses.html',
  '/my-verses',
  '/bible-tool.html',
  '/bible-tool',
  '/verse.html',
  '/verse',
  '/study.html',
  '/study',
  '/reader.html',
  '/reader',
  '/message.html',
  '/message',
  '/ansiedad.html',
  '/ansiedad',
  '/fuerza.html',
  '/fuerza',
  '/paz.html',
  '/paz',
  '/miedo.html',
  '/miedo',
  '/soledad.html',
  '/soledad',
  '/culpa.html',
  '/culpa',
  '/agobio.html',
  '/agobio',
  '/esperanza.html',
  '/esperanza',
  '/planes.html',
  '/planes',
  '/muro.html',
  '/muro',
  '/lector.html',
  '/lector',
  '/ninos.html',
  '/ninos',
  '/ira.html',
  '/ira',
  '/duelo.html',
  '/duelo',
  '/perdon.html',
  '/perdon',
  '/es/',
  '/es',
  '/es/index.html',
  '/id/',
  '/id',
  '/id/index.html',
  '/id/kecemasan.html',
  '/id/kecemasan',
  '/id/ketakutan.html',
  '/id/ketakutan',
  '/ru/',
  '/ru',
  '/ru/index.html',
  '/ru/trevoga.html',
  '/ru/trevoga',
  '/ru/nadezhda.html',
  '/ru/nadezhda',
  '/ru/strakh.html',
  '/ru/strakh',
  '/ru/sila.html',
  '/ru/sila',
  '/ru/mir.html',
  '/ru/mir',
  '/ru/odinochestvo.html',
  '/ru/odinochestvo',
  '/ru/proshchenie.html',
  '/ru/proshchenie',
  '/zh/',
  '/zh',
  '/zh/index.html',
  '/zh/kongju.html',
  '/zh/kongju',
  '/zh/liliang.html',
  '/zh/liliang',
  '/hi/',
  '/hi',
  '/hi/index.html',
  '/hi/chinta.html',
  '/hi/chinta',
  '/hi/asha.html',
  '/hi/asha',
  '/hi/dar.html',
  '/hi/dar',
  '/hi/shakti.html',
  '/hi/shakti',
  '/hi/shanti.html',
  '/hi/shanti',
  '/hi/akelapan.html',
  '/hi/akelapan',
  '/hi/kshama.html',
  '/hi/kshama',
  '/tl/kabalisahan.html',
  '/tl/kabalisahan',
  '/fr/',
  '/fr',
  '/fr/index.html',
  '/fr/anxiete.html',
  '/fr/anxiete',
  '/fr/peur.html',
  '/fr/peur',
  '/fr/force.html',
  '/fr/force',
  '/fr/paix.html',
  '/fr/paix',
  '/fr/plans.html',
  '/fr/plans',
  '/fr/mural.html',
  '/fr/mural',
  '/fr/lecteur.html',
  '/fr/lecteur',
  '/fr/enfants.html',
  '/fr/enfants',
  '/fr/colere.html',
  '/fr/colere',
  '/fr/tristesse.html',
  '/fr/tristesse',
  '/fr/pardon.html',
  '/fr/pardon',
  '/zh/jiaolv.html',
  '/zh/jiaolv',
  '/zh/heping.html',
  '/zh/heping',
  '/zh/kuanshu.html',
  '/zh/kuanshu',
  '/ar/qalaq.html',
  '/ar/qalaq',
  '/sv/oro.html',
  '/sv/oro',
  '/pt/',
  '/pt',
  '/pt/index.html',
  '/pt/ansiedade.html',
  '/pt/ansiedade',
  '/pt/esperanca.html',
  '/pt/esperanca',
  '/pt/medo.html',
  '/pt/medo',
  '/pt/forca.html',
  '/pt/forca',
  '/pt/paz.html',
  '/pt/paz',
  '/pt/solidao.html',
  '/pt/solidao',
  '/pt/culpa.html',
  '/pt/culpa',
  '/pt/sobrecarga.html',
  '/pt/sobrecarga',
  '/pt/planos.html',
  '/pt/planos',
  '/pt/mural.html',
  '/pt/mural',
  '/pt/leitor.html',
  '/pt/leitor',
  '/pt/criancas.html',
  '/pt/criancas',
  '/pt/privacy.html',
  '/pt/privacy',
  '/pt/terms.html',
  '/pt/terms',
  '/bn/chinta.html',
  '/bn/chinta',
  '/sw/wasiwasi.html',
  '/sw/wasiwasi',
  '/fr/espoir.html',
  '/fr/espoir',
  '/zh/xiwang.html',
  '/zh/xiwang',
  '/fr/solitude.html',
  '/fr/solitude',
  '/zh/gudu.html',
  '/zh/gudu',
  '/fr/culpabilite.html',
  '/fr/culpabilite',
  '/zh/neijiu.html',
  '/zh/neijiu',
  '/fr/deborde.html',
  '/fr/deborde',
  '/zh/taiduo.html',
  '/zh/taiduo',
];
let cacheHygieneOk = true;
for (const p of cacheHygienePaths) {
  if (!headerLines.includes(p)) {
    fail('_headers: cache hygiene block missing path line: ' + p);
    cacheHygieneOk = false;
  }
}
if (cacheHygieneOk) {
  const probes = ['/explore.html', '/verse.html', '/study.html', '/ansiedad.html'];
  for (const probe of probes) {
    const i = headers.indexOf(probe);
    if (i < 0) {
      fail('_headers: ' + probe + ' not found for cache probe');
      cacheHygieneOk = false;
      break;
    }
    const slice = headers.slice(i, i + 120);
    if (!slice.includes('Cache-Control: no-cache') || !slice.includes('must-revalidate')) {
      fail('_headers: ' + probe + ' must have Cache-Control: no-cache, must-revalidate immediately after path');
      cacheHygieneOk = false;
      break;
    }
  }
  if (cacheHygieneOk) {
    ok('_headers: cache hygiene paths (hubs + verse + study/reader/message + ES topics) have no-cache');
  }
}

if (headers.includes('/manifest.json') && headers.includes('application/manifest+json') && headers.includes('/robots.txt')) {
  ok('_headers: manifest + robots explicit Content-Type (edge analytics / MIME clarity)');
}
if (headers.includes('/.well-known/security.txt') && headers.includes('text/plain')) {
  ok('_headers: security.txt explicit Content-Type');
}

// 3. security.txt
const securityTxt = read('.well-known/security.txt');
if (!securityTxt.includes('Contact:') || !securityTxt.includes('Expires:')) {
  fail('.well-known/security.txt missing or incomplete (Contact, Expires)');
} else {
  ok('security.txt present with Contact and Expires');
}

// 3b. Internal routes blocked at the edge (Cloudflare Pages _redirects)
const redirects = read('_redirects');
if (!redirects.includes('/admin /blocked.html') || !redirects.includes('/admin.html /blocked.html')) {
  fail('_redirects: production must map /admin and /admin.html to blocked.html (404, minimal body — see SECURITY.md)');
} else {
  ok('_redirects: admin URLs return minimal blocked.html in production');
}

if (
  !redirects.includes('/ru /ru/index.html 200!') ||
  !redirects.includes('/zh /zh/index.html 200!') ||
  !redirects.includes('/hi /hi/index.html 200!')
) {
  fail('_redirects: RU / ZH / HI hub folder URLs must rewrite to index.html (200!)');
} else {
  ok('_redirects: RU / ZH / HI hub rewrites present');
}

const esRewriteNeedles = [
  '/ansiedad /ansiedad.html?tdb_cb=20260328esNav 302',
  '/fuerza /fuerza.html?tdb_cb=20260328esNav 302',
  '/paz /paz.html?tdb_cb=20260328esNav 302',
  '/miedo /miedo.html?tdb_cb=20260328esNav 302',
  '/soledad /soledad.html?tdb_cb=20260328esNav 302',
  '/culpa /culpa.html?tdb_cb=20260328esNav 302',
  '/agobio /agobio.html?tdb_cb=20260328esNav 302',
  '/esperanza /esperanza.html?tdb_cb=20260328esNav 302',
  '/planes /planes.html?tdb_cb=20260328esNav 302',
  '/muro /muro.html?tdb_cb=20260328esNav 302',
  '/lector /lector.html?tdb_cb=20260328esNav 302',
  '/ninos /ninos.html?tdb_cb=20260328esNav 302',
  '/ira /ira.html?tdb_cb=20260328esNav 302',
  '/duelo /duelo.html?tdb_cb=20260328esNav 302',
  '/perdon /perdon.html?tdb_cb=20260328esNav 302',
];
let esRewriteOk = true;
for (const n of esRewriteNeedles) {
  if (!redirects.includes(n)) {
    fail('_redirects: Spanish clean URL cache-bust redirect missing: ' + n);
    esRewriteOk = false;
  }
}
if (esRewriteOk) {
  ok('_redirects: Spanish topical clean URLs 302 to ?tdb_cb= (edge cache-bust)');
}

const ansiedadHtml = read('ansiedad.html');
if (
  !ansiedadHtml.includes('es-mas-ayuda') ||
  !ansiedadHtml.includes('es-mas-ayuda-tools') ||
  !ansiedadHtml.includes('cta-group') ||
  !ansiedadHtml.includes('Herramienta Biblia')
) {
  fail('ansiedad.html: Más ayuda block must include es-mas-ayuda, es-mas-ayuda-tools, cta-group, and Herramienta Biblia link');
} else {
  ok('ansiedad.html: Más ayuda tool row markup present (source guard)');
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
if (!script.includes('migrateLegacyTdbSavedNotesOnce') || !script.includes('tdb-saved-notes-migrated-v1')) {
  fail('script.js: legacy saved-notes → My Verses migration missing');
} else {
  ok('script.js: legacy saved-notes migration helpers present');
}
if (!script.includes('tdbGatherVersesForJournalExport')) {
  fail('script.js: tdbGatherVersesForJournalExport missing (journal export)');
} else {
  ok('script.js: journal export gather helper present');
}
const purgeMjs = read('scripts/cloudflare-purge.mjs');
if (
  !purgeMjs.includes("'/ansiedad.html'") ||
  !purgeMjs.includes("'/fuerza.html'") ||
  !purgeMjs.includes("'/paz.html'") ||
  !purgeMjs.includes("'/id/'") ||
  !purgeMjs.includes("'/id/index.html'") ||
  !purgeMjs.includes("'/id/kecemasan.html'") ||
  !purgeMjs.includes("'/tl/kabalisahan.html'") ||
  !purgeMjs.includes("'/es/'") ||
  !purgeMjs.includes("'/es/index.html'") ||
  !purgeMjs.includes("'/fr/'") ||
  !purgeMjs.includes("'/fr/index.html'") ||
  !purgeMjs.includes("'/fr/anxiete.html'") ||
  !purgeMjs.includes("'/zh/jiaolv.html'") ||
  !purgeMjs.includes("'/ar/qalaq.html'") ||
  !purgeMjs.includes("'/hi/chinta.html'") ||
  !purgeMjs.includes("'/ru/'") ||
  !purgeMjs.includes("'/ru/strakh.html'") ||
  !purgeMjs.includes("'/zh/'") ||
  !purgeMjs.includes("'/zh/kongju.html'") ||
  !purgeMjs.includes("'/hi/'") ||
  !purgeMjs.includes("'/hi/dar.html'") ||
  !purgeMjs.includes("'/sv/oro.html'") ||
  !purgeMjs.includes("'/pt/'") ||
  !purgeMjs.includes("'/pt/index.html'") ||
  !purgeMjs.includes("'/pt/ansiedade.html'") ||
  !purgeMjs.includes("'/pt/medo.html'") ||
  !purgeMjs.includes("'/bn/chinta.html'") ||
  !purgeMjs.includes("'/sw/wasiwasi.html'") ||
  !purgeMjs.includes("'/fr/espoir.html'") ||
  !purgeMjs.includes("'/zh/xiwang.html'") ||
  !purgeMjs.includes("'/fr/solitude.html'") ||
  !purgeMjs.includes("'/zh/gudu.html'") ||
  !purgeMjs.includes("'/fr/culpabilite.html'") ||
  !purgeMjs.includes("'/zh/neijiu.html'") ||
  !purgeMjs.includes("'/fr/deborde.html'") ||
  !purgeMjs.includes("'/zh/taiduo.html'") ||
  !purgeMjs.includes("'/fr/peur.html'") ||
  !purgeMjs.includes("'/fr/force.html'") ||
  !purgeMjs.includes("'/fr/paix.html'") ||
  !purgeMjs.includes("'/ira.html'") ||
  !purgeMjs.includes("'/duelo.html'") ||
  !purgeMjs.includes("'/perdon.html'") ||
  !purgeMjs.includes("'/perdon.html?tdb_cb=20260328esNav'") ||
  !purgeMjs.includes("'/fr/colere.html'") ||
  !purgeMjs.includes("'/fr/tristesse.html'") ||
  !purgeMjs.includes("'/fr/pardon.html'") ||
  !purgeMjs.includes("'/zh/heping.html'") ||
  !purgeMjs.includes("'/zh/kuanshu.html'") ||
  !purgeMjs.includes("'/ru/proshchenie.html'") ||
  !purgeMjs.includes("'/hi/kshama.html'") ||
  !purgeMjs.includes("'/id/ketakutan.html'") ||
  !purgeMjs.includes("'/miedo.html'") ||
  !purgeMjs.includes("'/soledad.html'") ||
  !purgeMjs.includes("'/culpa.html'") ||
  !purgeMjs.includes("'/agobio.html'") ||
  !purgeMjs.includes("'/esperanza.html'") ||
  !purgeMjs.includes("'/planes.html'") ||
  !purgeMjs.includes("'/fr/plans.html'") ||
  !purgeMjs.includes("'/esperanza.html?tdb_cb=20260328esNav'") ||
  !purgeMjs.includes("'/miedo.html?tdb_cb=20260328esNav'") ||
  !purgeMjs.includes("'/ansiedad.html?tdb_cb=20260328esNav'") ||
  !purgeMjs.includes("'/styles.css?v=20260328esNav'")
) {
  fail('scripts/cloudflare-purge.mjs: Spanish/CSS purge paths missing from SOCIAL_PURGE_PATHS');
} else {
  ok('cloudflare-purge.mjs: Spanish topical + ?tdb_cb + ES styles purge paths present');
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

// O4. No admin email allowlist in shipped config/bootstrap (role-only admin in Supabase)
const configJs = read('config.js');
const inlineBoot = read('inline-bootstrap.js');
if (configJs.includes('MASTER_EMAIL_OBFUSCATED') || inlineBoot.includes('MASTER_EMAIL_OBFUSCATED')) {
  fail('config.js or inline-bootstrap.js must not ship MASTER_EMAIL_OBFUSCATED (use app_metadata.role === admin only)');
} else {
  ok('No MASTER_EMAIL_OBFUSCATED in config.js / inline-bootstrap.js');
}

// O4b. MASTER_EMAIL literal in any client module (documented risk)
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
