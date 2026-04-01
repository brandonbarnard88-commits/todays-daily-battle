#!/usr/bin/env node
/**
 * Build, serve dist on 8080, run Lighthouse, then stop serve.
 *
 * Defaults (reliable on heavy pages / busy machines):
 *   URL: homepage
 *   Categories: accessibility, best-practices only (Performance trace often PROTOCOL_TIMEOUT / NO_FCP locally)
 *
 * Full run with Performance (uses calm.html + no simulated throttling):
 *   npm run audit:lighthouse:local:perf
 *
 * Env overrides:
 *   LIGHTHOUSE_LOCAL_URL — e.g. http://127.0.0.1:8080/calm.html
 *   LIGHTHOUSE_LOCAL_CATEGORIES — e.g. performance,accessibility,best-practices
 *
 * Skip rebuild (after `npm run build`):
 *   node scripts/lighthouse-local.mjs --skip-build
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
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const DEFAULT_URL = 'http://127.0.0.1:8080/';
const DEFAULT_CATEGORIES = 'accessibility,best-practices';

async function main() {
  const skipBuild = process.argv.includes('--skip-build');
  if (!skipBuild) {
    console.log('Building...');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }

  console.log('Starting serve on port 8080...');
  await freePort(8080);
  const server = createServer((req, res) => {
    let p = req.url === '/' ? '/index.html' : req.url;
    p = join(dist, p.replace(/\?.*/, '').replace(/^\/+/, ''));
    if (!p.startsWith(dist)) { res.writeHead(403); res.end(); return; }
    if (!existsSync(p) || !statSync(p).isFile()) {
      const idx = join(p, 'index.html');
      p = existsSync(idx) ? idx : join(dist, '404.html');
    }
    if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
    const mime = MIME[extname(p)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(readFileSync(p));
  });
  server.listen(8080, '127.0.0.1');

  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 200));
      try {
        const res = await fetch('http://127.0.0.1:8080/');
        if (res.ok) { ready = true; break; }
      } catch (_) {}
    }
    if (!ready) throw new Error('Server did not start on port 8080 in time');

    const targetUrl = (process.env.LIGHTHOUSE_LOCAL_URL || DEFAULT_URL).trim() || DEFAULT_URL;
    const categories = (process.env.LIGHTHOUSE_LOCAL_CATEGORIES || DEFAULT_CATEGORIES).trim() || DEFAULT_CATEGORIES;
    const includePerf = categories.split(',').map((s) => s.trim()).includes('performance');

    console.log('Server ready. Running Lighthouse on', targetUrl);
    console.log('Categories:', categories.replace(/,/g, ', '));
    if (!includePerf) {
      console.log('Tip: npm run audit:lighthouse:local:perf for Performance on calm.html (all three categories).');
    } else {
      console.log('Performance run uses --throttling-method=provided (lab ceiling, not slow 4G — use PSI on prod).');
    }

    const outBase = join(root, 'lighthouse-report');
    const lhArgs = [
      'lighthouse',
      targetUrl,
      '--output=html',
      '--output=json',
      `--output-path=${outBase}`,
      '--form-factor=mobile',
      '--screenEmulation.mobile=true',
      '--max-wait-for-load=120000'
    ];
    if (includePerf) lhArgs.push('--throttling-method=provided');
    lhArgs.push(
      '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
      `--only-categories=${categories}`
    );

    const lh = spawnSync('npx', lhArgs, { cwd: root, stdio: 'inherit', shell: false, env: process.env });
    if (lh.status !== 0 && lh.status !== null) {
      throw new Error(`lighthouse exited with code ${lh.status}`);
    }
    console.log('Wrote lighthouse-report.report.html and lighthouse-report.report.json (open the HTML in your browser).');
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
