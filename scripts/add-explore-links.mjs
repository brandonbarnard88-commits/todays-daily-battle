/**
 * Helper: add Explore link after Home in footers and global navs.
 * Safe to re-run: skips if explore already present after Home / in footer-quick-links.
 * Note: Calm uses `<a href="calm.html" aria-current="page">` — patch that file by hand
 * (or extend patchGlobalNavHomeCalm) so Explore sits between Home and Calm.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function walkHtml(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
      walkHtml(p, out);
    } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function relToExplore(filePath) {
  return path.relative(path.dirname(filePath), path.join(root, 'explore.html')).replace(/\\/g, '/');
}

function patchFooterQuickLinks(s, rel) {
  if (!s.includes('class="footer-quick-links"')) return s;
  if (/footer-quick-links[\s\S]{0,800}href="[^"]*explore\.html"/.test(s)) return s;
  return s.replace(
    /(<nav class="footer-quick-links"[^>]*>\s*\n)(\s*)(<a )/,
    (all, open, indent, a) => `${open}${indent}<a href="${rel}">Explore</a>\n${indent}${a}`
  );
}

function patchToolFooterLinks(s, rel) {
  if (!s.includes('class="tool-footer-links"')) return s;
  if (/tool-footer-links[\s\S]{0,400}href="[^"]*explore\.html"/.test(s)) return s;
  return s.replace(
    /(<nav class="tool-footer-links"[^>]*>\s*\n)(\s*)(<a )/,
    (all, open, indent, a) => `${open}${indent}<a href="${rel}">Explore</a>\n${indent}${a}`
  );
}

function patchGlobalNavHomeCalm(s, rel) {
  // Already has Explore right after Home (English or path)
  if (/<a href="\/">Home<\/a>\s*\n\s*<a href="[^"]*explore\.html"/.test(s)) return s;
  if (/<a href="\/">Inicio<\/a>\s*\n\s*<a href="[^"]*explore\.html"/.test(s)) return s;
  let out = s.replace(
    /(<a href="\/">Home<\/a>)(\s*\n\s*)(<a href="calm\.html">)/g,
    `$1$2<a href="${rel}">Explore</a>$2$3`
  );
  out = out.replace(
    /(<a href="\/">Inicio<\/a>)(\s*\n\s*)(<a href="calm\.html">)/g,
    `$1$2<a href="${rel}">Explore</a>$2$3`
  );
  return out;
}

const files = walkHtml(root);
let n = 0;
for (const file of files) {
  const rel = relToExplore(file);
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  s = patchFooterQuickLinks(s, rel);
  s = patchToolFooterLinks(s, rel);
  s = patchGlobalNavHomeCalm(s, rel);
  if (s !== orig) {
    fs.writeFileSync(file, s);
    n++;
    console.log('patched', path.relative(root, file));
  }
}
console.log('done, files changed:', n);
