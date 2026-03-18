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

const JS_FILES = ['script.js'];
const CSS_FILES = ['styles.css', 'tool-pages.css', 'church.css', 'loop-player.css', 'kids-corner.css', 'mystudy.css'];

async function minifyJs(filePath) {
  const { minify } = await import('terser');
  const code = fs.readFileSync(filePath, 'utf8');
  const result = await minify(code, {
    compress: { passes: 1 },
    mangle: true,
    format: { comments: false }
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
