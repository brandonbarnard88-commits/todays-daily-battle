#!/usr/bin/env node
/**
 * Collapse every tdb-lang-switcher-inner to EN · ES · FR · PT · More languages
 * when the block has more than four data-tdb-pick links (legacy full row).
 * Preserves leading whitespace of the opening <span> line for each occurrence.
 *
 * Run from repo root: node scripts/patch-compact-lang-switchers.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function compactBlock(lead) {
  return (
    `${lead}<span class="tdb-lang-switcher-inner">\n` +
    `${lead}  <a class="tdb-lang-opt" href="/" hreflang="en" data-tdb-pick="en">English</a>\n` +
    `${lead}  <span class="tdb-lang-sep" aria-hidden="true">·</span>\n` +
    `${lead}  <a class="tdb-lang-opt" href="/es/" hreflang="es" data-tdb-pick="es">Español</a>\n` +
    `${lead}  <span class="tdb-lang-sep" aria-hidden="true">·</span>\n` +
    `${lead}  <a class="tdb-lang-opt" href="/fr/" hreflang="fr" data-tdb-pick="fr">Français</a>\n` +
    `${lead}  <span class="tdb-lang-sep" aria-hidden="true">·</span>\n` +
    `${lead}  <a class="tdb-lang-opt" href="/pt/" hreflang="pt" data-tdb-pick="pt">Português</a>\n` +
    `${lead}  <span class="tdb-lang-sep" aria-hidden="true">·</span>\n` +
    `${lead}  <a class="tdb-lang-opt tdb-lang-more" href="/explore.html#languages">More languages</a>\n` +
    `${lead}</span>`
  );
}

function findMatchingSpanEnd(html, openBracketIdx) {
  var closeTag = '</span>';
  var i = html.indexOf('>', openBracketIdx) + 1;
  var depth = 1;
  while (i < html.length && depth > 0) {
    var nextOpen = html.indexOf('<span', i);
    var nextClose = html.indexOf(closeTag, i);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 5;
    } else {
      depth--;
      i = nextClose + closeTag.length;
    }
  }
  return i;
}

function processHtml(html) {
  var key = '<span class="tdb-lang-switcher-inner">';
  var pos = 0;
  var out = '';
  var idx;
  while ((idx = html.indexOf(key, pos)) !== -1) {
    out += html.slice(pos, idx);
    var end = findMatchingSpanEnd(html, idx);
    if (end === -1) {
      out += html.slice(idx);
      break;
    }
    var full = html.slice(idx, end);
    var picks = (full.match(/data-tdb-pick=/g) || []).length;
    var before = html.slice(0, idx);
    var leadM = before.match(/(\n[ \t]*)$/);
    var lead = leadM ? leadM[1].replace(/^\n/, '') : '';
    if (picks <= 4) {
      out += full;
    } else {
      out += compactBlock(lead || '        ');
    }
    pos = end;
  }
  out += html.slice(pos);
  return out;
}

function walk(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      out.push({ full, rel });
    }
  }
}

function main() {
  const files = [];
  walk(root, '', files);
  let changed = 0;
  for (const { full, rel } of files) {
    let html = fs.readFileSync(full, 'utf8');
    if (!html.includes('tdb-lang-switcher-inner')) continue;
    const next = processHtml(html);
    if (next !== html) {
      fs.writeFileSync(full, next, 'utf8');
      changed++;
      console.log('updated', rel);
    }
  }
  console.log('patch-compact-lang-switchers:', changed, 'file(s) updated');
}

main();
