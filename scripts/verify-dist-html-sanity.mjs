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
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walkHtml(dist);
let failed = false;

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
