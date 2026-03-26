/**
 * Footer inner uses 6 spaces (not 4): add FR/ZH between ES and ID.
 * Run: node scripts/patch-lang-footer-six-space-fr-zh.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const OLD = `      <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const NEW = `      <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
      <span class="tdb-lang-sep" aria-hidden="true">·</span>
      <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

function walkHtml(dir, baseRel, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(baseRel, e.name).replace(/\\/g, '/');
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walkHtml(full, rel, out);
    } else if (e.name.endsWith('.html')) {
      out.push({ full, rel });
    }
  }
}

function main() {
  const files = [];
  walkHtml(root, '', files);
  let touched = 0;
  for (const { full, rel } of files) {
    let raw = fs.readFileSync(full, 'utf8');
    if (!raw.includes(OLD)) continue;
    const next = raw.split(OLD).join(NEW);
    if (next === raw) continue;
    fs.writeFileSync(full, next, 'utf8');
    touched++;
    console.log(rel);
  }
  console.log('patch-lang-footer-six-space-fr-zh:', touched, 'files');
}

main();
