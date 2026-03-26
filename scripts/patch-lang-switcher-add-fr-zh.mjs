/**
 * Insert Français + 中文 between Español and Bahasa Indonesia in all lang switchers.
 * Run: node scripts/patch-lang-switcher-add-fr-zh.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const INSERT = `            <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
`;

const OLD = `            <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
            <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const NEW = `            <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
            <span class="tdb-lang-sep" aria-hidden="true">·</span>
${INSERT}            <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const OLD_FOOT = `    <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
    <span class="tdb-lang-sep" aria-hidden="true">·</span>
    <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const NEW_FOOT = `    <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
    <span class="tdb-lang-sep" aria-hidden="true">·</span>
    <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
    <span class="tdb-lang-sep" aria-hidden="true">·</span>
    <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
    <span class="tdb-lang-sep" aria-hidden="true">·</span>
    <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const OLD_HERO = `          <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
          <span class="tdb-lang-sep" aria-hidden="true">·</span>
          <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const NEW_HERO = `          <a class="tdb-lang-opt" href="/explore.html#topics-es" hreflang="es" data-tdb-pick="es">Español</a>
          <span class="tdb-lang-sep" aria-hidden="true">·</span>
          <a class="tdb-lang-opt" href="/fr/anxiete.html" hreflang="fr" data-tdb-pick="fr">Français</a>
          <span class="tdb-lang-sep" aria-hidden="true">·</span>
          <a class="tdb-lang-opt" href="/zh/jiaolv.html" hreflang="zh-CN" data-tdb-pick="zh">中文</a>
          <span class="tdb-lang-sep" aria-hidden="true">·</span>
          <a class="tdb-lang-opt" href="/id/kecemasan.html" hreflang="id" data-tdb-pick="id">Bahasa Indonesia</a>`;

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'fr', 'zh']);

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
    if (raw.includes('data-tdb-pick="fr"')) continue;
    let next = raw;
    if (next.includes(OLD)) next = next.split(OLD).join(NEW);
    if (next.includes(OLD_FOOT)) next = next.split(OLD_FOOT).join(NEW_FOOT);
    if (next.includes(OLD_HERO)) next = next.split(OLD_HERO).join(NEW_HERO);
    if (next !== raw) {
      fs.writeFileSync(full, next, 'utf8');
      touched++;
      console.log(rel);
    }
  }
  console.log('patch-lang-switcher-add-fr-zh:', touched, 'files');
}

main();
