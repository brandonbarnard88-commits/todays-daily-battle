#!/usr/bin/env node
/**
 * Every shipped HTML file under dist/: non-empty, declares a document (<!DOCTYPE or <html>).
 * Complements audit-links.mjs (href graph) and viewport baseline (source HTML).
 *
 * Run after: npm run build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');

/** Fragment shipped as .html for embedding (not a standalone document). Matches verify-viewport-baseline.mjs SKIP_FILE. */
const SKIP_HTML = new Set(['modal.html']);

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('verify-dist-html-sanity: dist/index.html missing — run npm run build');
  process.exit(1);
}

const ROOT_RE = /<!DOCTYPE\s+html|<html[\s>]/i;

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (name.endsWith('.html') && !SKIP_HTML.has(name)) out.push(p);
  }
  return out;
}

const files = walkHtml(dist);

/** Canonical footer must ship the KJV imprint + Christian Messenger lines on the homepage (built from partials/site-footer.html). */
function verifyFooterLegalBlock(distPath) {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) return;
  let raw;
  try {
    raw = fs.readFileSync(indexPath, 'utf8');
  } catch {
    return;
  }
  const legalPs = raw.match(/<p class="site-footer-copy site-footer-legal-line">/g) || [];
  if (legalPs.length < 2) {
    console.error(
      'verify-dist-html-sanity: FAIL dist/index.html — expected ≥2 site-footer-copy site-footer-legal-line paragraphs',
      '(' + legalPs.length + ')',
    );
    return false;
  }
  if (!raw.includes('Christian Messenger Service')) {
    console.error(
      'verify-dist-html-sanity: FAIL dist/index.html — missing Christian Messenger Service imprint (run npm run sync:footer && npm run build)',
    );
    return false;
  }
  return true;
}

let failed = false;
if (verifyFooterLegalBlock(dist) === false) {
  failed = true;
}

for (const f of files) {
  const rel = path.relative(dist, f);
  let raw;
  try {
    raw = fs.readFileSync(f, 'utf8');
  } catch (e) {
    console.error('FAIL read:', rel, e.message);
    failed = true;
    continue;
  }
  const trimmed = raw.trimStart();
  if (trimmed.length < 80) {
    console.error('FAIL too short:', rel, '(' + trimmed.length + ' chars)');
    failed = true;
    continue;
  }
  if (!ROOT_RE.test(trimmed.slice(0, 8000))) {
    console.error('FAIL no <!DOCTYPE html> or <html> near start:', rel);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log('verify-dist-html-sanity: OK (', files.length, 'HTML files under dist/)');
