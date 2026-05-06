#!/usr/bin/env node
/**
 * Serve dist/ once, run Lighthouse on multiple local URLs (mobile, performance + a11y + bp).
 * Usage: npm run build && node scripts/lighthouse-local-pages.mjs --skip-build
 *
 * Env:
 *   LIGHTHOUSE_LOCAL_CATEGORIES — default: performance,accessibility,best-practices
 */
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { freePort } from './free-port.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml'
};

const URLS = [
  'http://127.0.0.1:8080/',
  'http://127.0.0.1:8080/verse.html',
  'http://127.0.0.1:8080/bible-tool.html',
];

async function main() {
  const skipBuild = process.argv.includes('--skip-build');
  if (!skipBuild) {
    console.log('Building...');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }

  await freePort(8080);
  const server = createServer((req, res) => {
    let p = req.url === '/' ? '/index.html' : req.url;
    p = join(dist, p.replace(/\?.*/, '').split('#')[0].replace(/^\/+/, ''));
    if (!p.startsWith(dist)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!existsSync(p) || !statSync(p).isFile()) {
      const idx = join(p, 'index.html');
      p = existsSync(idx) ? idx : join(dist, '404.html');
    }
    if (!existsSync(p)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const mime = MIME[extname(p)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(readFileSync(p));
  });
  server.listen(8080, '127.0.0.1');

  const categories = (
    process.env.LIGHTHOUSE_LOCAL_CATEGORIES || 'performance,accessibility,best-practices'
  ).trim();
  const labels = ['home', 'verse', 'bible-tool'];

  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:8080/');
        if (res.ok) {
          ready = true;
          break;
        }
      } catch (_) {}
    }
    if (!ready) throw new Error('Server did not start on port 8080');

    for (let u = 0; u < URLS.length; u++) {
      const targetUrl = URLS[u];
      const outPath = join(root, 'lighthouse-local-' + (labels[u] || String(u)) + '-phase6');
      console.log('Lighthouse:', targetUrl, '->', outPath + '.* (report files)');
      const lh = spawnSync(
        'npx',
        [
          'lighthouse',
          targetUrl,
          '--output=html',
          '--output=json',
          `--output-path=${outPath}`,
          '--form-factor=mobile',
          '--screenEmulation.mobile=true',
          '--max-wait-for-load=120000',
          '--throttling-method=provided',
          '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
          `--only-categories=${categories}`,
        ],
        { cwd: root, stdio: 'inherit', shell: false, env: process.env }
      );
      if (lh.status !== 0 && lh.status !== null) {
        throw new Error(`lighthouse failed for ${targetUrl} (code ${lh.status})`);
      }
    }
    console.log(`\nWrote ${URLS.length} Lighthouse report pairs: lighthouse-local-*-phase6.* (gitignored, open the .html in a browser).`);
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
