#!/usr/bin/env node
/**
 * Comprehensive link audit: all internal links across dist/ HTML files.
 * Verifies each href target exists. Run: node scripts/audit-links.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ not found. Run: npm run build');
  process.exit(1);
}

const htmlFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory() && !['.git', 'node_modules'].includes(name)) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(dist);

function resolveTarget(fromFile, href) {
  const raw = href.split('#')[0].split('?')[0].trim();
  if (!raw || raw === '#') return null;
  if (/^(mailto:|tel:|javascript:|https?:)/i.test(raw)) return null;
  const fromDir = path.dirname(fromFile);
  const isAbs = raw.startsWith('/');
  const targetPath = isAbs ? path.join(dist, raw.replace(/^\//, '')) : path.join(fromDir, raw);
  return targetPath;
}

function targetExists(targetPath) {
  if (!targetPath) return false;
  const norm = path.normalize(targetPath);
  if (fs.existsSync(norm) && fs.statSync(norm).isFile()) return true;
  if (fs.existsSync(norm + '.html')) return true;
  const idx = path.join(norm, 'index.html');
  if (fs.existsSync(idx)) return true;
  if (norm.endsWith('.html') && fs.existsSync(norm)) return true;
  const ext = path.extname(norm);
  if (['.css', '.js', '.json', '.ico', '.png', '.svg', '.jpg', '.webp'].includes(ext) && fs.existsSync(norm)) return true;
  return false;
}

const broken = [];
const checked = new Set();

for (const file of htmlFiles) {
  const body = fs.readFileSync(file, 'utf8');
  let htmlOnly = body.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  // Ignore hrefs inside HTML comments (e.g. optional preload templates)
  htmlOnly = htmlOnly.replace(/<!--[\s\S]*?-->/g, '');
  const matches = htmlOnly.matchAll(/href=["']([^"']+)["']/g);
  for (const m of matches) {
    const href = (m[1] || '').trim();
    if (/\.md(?:[?#]|$)/i.test(href.split('#')[0])) continue;
    const target = resolveTarget(file, href);
    if (!target) continue;
    const key = path.relative(dist, file) + ' -> ' + href;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!targetExists(target)) {
      broken.push({ from: path.relative(root, file), href, target: path.relative(root, target) });
    }
  }
}

if (broken.length > 0) {
  console.error('BROKEN LINKS:\n');
  broken.forEach(({ from, href }) => console.error('  ' + from + ' -> ' + href));
  process.exit(1);
}

console.log('OK all internal links (' + checked.size + ' checked across ' + htmlFiles.length + ' files)');
