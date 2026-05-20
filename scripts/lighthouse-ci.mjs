#!/usr/bin/env node
/**
 * Serves ./dist on 127.0.0.1:8080, runs Lighthouse (mobile) via Playwright’s Chromium, asserts scores.
 * Prerequisite: npm run build
 */
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { chromium } from 'playwright';
import { freePort } from './free-port.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const outJsonHome = join(root, 'lhr-ci-home.json');
const outJsonReader = join(root, 'lhr-ci-reader.json');
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
};

if (!existsSync(join(dist, 'index.html'))) {
  console.error('lighthouse-ci: dist/ missing or empty — run npm run build first');
  process.exit(1);
}

const server = createServer((req, res) => {
  let p = req.url === '/' ? '/index.html' : req.url;
  p = join(dist, p.replace(/\?.*/, '').replace(/^\/+/, ''));
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

await freePort(8080);
await new Promise((resolve, reject) => {
  server.listen(8080, '127.0.0.1', (err) => (err ? reject(err) : resolve()));
});

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
if (!ready) {
  server.close();
  console.error('lighthouse-ci: server did not become ready');
  process.exit(1);
}

const chromePath = chromium.executablePath();
function runLighthouse(url, outPath, label) {
  console.log('\n[lighthouse-ci] Auditing', label, url);
  const args = [
    'lighthouse',
    url,
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--output=json',
    `--output-path=${outPath}`,
    `--chrome-path=${chromePath}`,
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
    '--only-categories=accessibility,best-practices,performance',
    '--quiet',
  ];
  const run = spawnSync('npx', args, { cwd: root, stdio: 'inherit', env: process.env });
  if (run.status !== 0) {
    console.error('lighthouse-ci: lighthouse exited for', label, run.status);
    return false;
  }
  const assert = spawnSync(process.execPath, [join(__dirname, 'assert-lighthouse.mjs'), outPath], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, LH_PAGE: label === 'home' ? 'home' : label === 'reader' ? 'reader' : '' },
  });
  if (assert.status !== 0) {
    console.error('lighthouse-ci: thresholds failed for', label);
    return false;
  }
  return true;
}

const okHome = runLighthouse('http://127.0.0.1:8080/', outJsonHome, 'home');
const okReader = runLighthouse('http://127.0.0.1:8080/reader.html', outJsonReader, 'reader');
server.close();

process.exit(okHome && okReader ? 0 : 1);
