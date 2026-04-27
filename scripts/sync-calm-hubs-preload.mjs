#!/usr/bin/env node
/**
 * Ensures each HTML page that loads tdb-calm-hubs.css?v=… has a matching
 * <link rel="preload" … as="style"> immediately before the first such stylesheet.
 * Skips dist/ and node_modules. Idempotent.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

const STYLESHEET_RE =
  /<link\s+[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']*tdb-calm-hubs\.css\?v=[^"']+)["'][^>]*>/i;

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const base = ent.name;
    if (base.startsWith('.')) continue;
    const p = path.join(dir, base);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(base)) continue;
      walkHtml(p, out);
    } else if (base.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

function hasPreloadFor(s, href) {
  const esc = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\brel=["']preload["'][^>]*\\bhref=["']${esc}["'][^>]*\\bas=["']style["']`, 'i').test(
    s,
  );
}

function patchFile(absPath) {
  let s = fs.readFileSync(absPath, 'utf8');
  const m = s.match(STYLESHEET_RE);
  if (!m) return false;
  const href = m[1];
  if (hasPreloadFor(s, href)) return false;

  const full = m[0];
  const escapedFull = full.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRe = new RegExp(`(^|[\\n\\r])([ \\t]*)${escapedFull}`);
  const lm = lineRe.exec(s);
  if (!lm) return false;
  /** $2 is the line indent — do not duplicate it inside preloadTag (avoids 4-space lines). */
  const preloadTag = `<link rel="preload" href="${href}" as="style">`;
  const next = s.replace(lineRe, `$1$2${preloadTag}\n$2${full}`);
  if (next === s) return false;
  fs.writeFileSync(absPath, next, 'utf8');
  return true;
}

let n = 0;
for (const f of walkHtml(root)) {
  if (patchFile(f)) {
    console.log('sync-calm-hubs-preload:', path.relative(root, f));
    n++;
  }
}
console.log(`sync-calm-hubs-preload: OK (${n} file(s) updated)`);
