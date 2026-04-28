#!/usr/bin/env node
/**
 * Inserts <link rel="preload" as="style"> immediately before the first matching
 * auxiliary stylesheet on each page (Cormorant subset, Bible hub/tools/study,
 * church, pastor hub, kids bundles, story-library fonts, canvas, coloring, etc.).
 * Skips dist/ and node_modules. Idempotent.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

/** Local aux sheets only (not styles/tdb-quiet-luxury/tdb-calm-hubs/tool-pages — other scripts cover those). */
const AUX_BASENAME =
  /(cormorant-latin-subset|what-god-has-done|mystudy|church|pastor|bible-hub|bible-tools|bible-study|loop-player|kids-battle|kids-hub-play|kids-kids-world|kids-page-sky|kids-corner|color-and-tell|story-library-fonts|canvas)\.css(?:\?|$)/;

const STYLESHEET_LINK_RE =
  /<link\s+[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*\/?>/gi;

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

function isAuxHref(href) {
  if (/^https?:\/\//i.test(href)) return false;
  const base = href.split('/').pop() || '';
  return AUX_BASENAME.test(base);
}

function prevLineHasPreload(s, lineStart, href) {
  if (lineStart <= 0) return false;
  const prevNl = s.lastIndexOf('\n', lineStart - 2);
  const prevLineStart = prevNl === -1 ? 0 : prevNl + 1;
  const prevLine = s.slice(prevLineStart, lineStart - 1);
  return (
    /\brel=["']preload["']/.test(prevLine) &&
    prevLine.includes(`href="${href}"`) &&
    /\bas=["']style["']/.test(prevLine)
  );
}

function patchFile(absPath) {
  let s = fs.readFileSync(absPath, 'utf8');
  let changed = false;

  while (true) {
    STYLESHEET_LINK_RE.lastIndex = 0;
    let hit = null;
    let m;
    while ((m = STYLESHEET_LINK_RE.exec(s)) !== null) {
      const href = m[1];
      if (!isAuxHref(href)) continue;
      const idx = m.index;
      const full = m[0];
      const lineStart = s.lastIndexOf('\n', idx - 1) + 1;
      const indent = s.slice(lineStart, idx);
      if (!/^[\t ]*$/.test(indent)) continue;
      if (prevLineHasPreload(s, lineStart, href)) continue;
      hit = { idx, full, href, lineStart, indent };
      break;
    }
    if (!hit) break;

    const { idx, full, href, lineStart, indent } = hit;
    const preloadTag = `<link rel="preload" href="${href}" as="style">`;
    const newBlock = `${indent}${preloadTag}\n${indent}${full}`;
    s = s.slice(0, lineStart) + newBlock + s.slice(idx + full.length);
    changed = true;
  }

  if (changed) fs.writeFileSync(absPath, s, 'utf8');
  return changed;
}

let n = 0;
for (const f of walkHtml(root)) {
  if (patchFile(f)) {
    console.log('sync-aux-css-preload:', path.relative(root, f));
    n++;
  }
}
console.log(`sync-aux-css-preload: OK (${n} file(s) updated)`);
