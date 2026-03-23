#!/usr/bin/env node
/**
 * Build, serve dist on 8080, run Lighthouse, then stop serve.
 * Single-command local Lighthouse audit (no second terminal needed).
 * Uses built-in Node http server (no external deps).
 */
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { freePort } from './free-port.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

async function main() {
  console.log('Building...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });

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
    console.log('Server ready. Running Lighthouse...');
    execSync(
      'npx lighthouse http://localhost:8080 --output=html --output-path=./lighthouse-report.html --view --form-factor=mobile --only-categories=performance,accessibility,best-practices',
      { cwd: root, stdio: 'inherit' }
    );
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
