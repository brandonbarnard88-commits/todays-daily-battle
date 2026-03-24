#!/usr/bin/env node
/**
 * Run mobile smoke test against local dist/ (more reliable than live site).
 * Usage: npm run test:mobile  (build + this server), or npm run build && npm run test:mobile:local
 */
import { spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const DIST = join(root, 'dist');
const PORT = process.env.MOBILE_TEST_PORT || 39393;

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run: npm run build');
  process.exit(1);
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

const server = createServer((req, res) => {
  let p = (req.url || '/').split('?')[0];
  if (p === '/') p = '/index.html';
  const file = resolve(DIST, p.slice(1));
  if (!file.startsWith(DIST)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const stat = statSync(file);
    if (stat.isDirectory()) {
      const idx = join(file, 'index.html');
      if (existsSync(idx)) {
        res.setHeader('Content-Type', 'text/html');
        res.end(readFileSync(idx));
        return;
      }
    }
    if (!stat.isFile()) {
      res.writeHead(404);
      res.end();
      return;
    }
    const ext = extname(file);
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    res.end(readFileSync(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}/`;
  console.log('Serving dist at', url);

  const child = spawn('node', ['scripts/mobile-smoke-test.mjs'], {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, MOBILE_TEST_URL: url }
  });
  child.on('close', (code) => {
    server.close();
    process.exit(code ?? 0);
  });
});
