#!/usr/bin/env node
/**
 * Minifies script.js and CSS files in dist/ for production.
 * Run after build-copy-static.js.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const JS_FILES = ['script.js', 'easter-eggs.js', 'easter-season.js', 'plans-data.js', 'memory-verses.js', 'mission-outreach-data.js', 'tdb-home-feel.js', 'tdb-porch-restfulness.js'];
const CSS_FILES = ['styles.css', 'tdb-home-page.css', 'tdb-quiet-luxury.css', 'tdb-calm-hubs.css', 'tool-pages.css', 'church.css', 'loop-player.css', 'kids-corner.css', 'mystudy.css', 'what-god-has-done.css', 'kids/story-library-fonts.css'];

async function minifyJs(filePath) {
  const { minify } = await import('terser');
  const code = fs.readFileSync(filePath, 'utf8');
  /* Multiple compress passes shrink the main bundle (~1–3% typical). Avoid unsafe_* flags here — DOM-heavy code + user data. */
  const result = await minify(code, {
    /* unused: false — required: default unused-drop can strip large chunks of tdbInitImpl
       (e.g. prayer wall init / data-prayer-wall-ready) when call graph through async init is mis-analyzed. */
    compress: { passes: 3, unused: false },
    /* keep_fnames: window.tdbInit calls tdbInitImpl(); mangling the impl name without rewriting that call caused ReferenceError in production/E2E. */
    mangle: { keep_fnames: /^tdbInitImpl$/ },
    format: { comments: false },
    sourceMap: false
  });
  if (result.error) throw result.error;
  fs.writeFileSync(filePath, result.code);
}

async function minifyCss(filePath) {
  const { default: CleanCSS } = await import('clean-css');
  const code = fs.readFileSync(filePath, 'utf8');
  const result = new CleanCSS({ level: 2 }).minify(code);
  if (result.errors.length) throw new Error(result.errors.join('; '));
  fs.writeFileSync(filePath, result.styles);
}

async function main() {
  if (!fs.existsSync(dist)) {
    console.error('minify: dist/ not found. Run npm run build first.');
    process.exit(1);
  }

  for (const f of JS_FILES) {
    const p = path.join(dist, f);
    if (fs.existsSync(p)) {
      await minifyJs(p);
      console.log('Minified: ' + f);
    }
  }

  for (const f of CSS_FILES) {
    const p = path.join(dist, f);
    if (fs.existsSync(p)) {
      await minifyCss(p);
      console.log('Minified: ' + f);
    }
  }
}

main().catch((err) => {
  console.error('minify error:', err);
  process.exit(1);
});
