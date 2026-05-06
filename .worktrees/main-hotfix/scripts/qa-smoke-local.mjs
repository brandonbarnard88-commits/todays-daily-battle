/**
 * Serves ./dist on 127.0.0.1 and runs qa:smoke against it (validates the built artifact).
 * Use from repo root after `npm run build`.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('qa-smoke-local: dist/index.html missing — run npm run build first.');
  process.exit(1);
}

const port = 19840 + Math.floor(Math.random() * 200);
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: distDir,
  stdio: 'ignore'
});

function shutdown(code) {
  try {
    server.kill('SIGTERM');
  } catch (_) {}
  process.exit(code);
}

server.on('error', (err) => {
  console.error('qa-smoke-local: could not start static server:', err.message);
  process.exit(1);
});

await new Promise((r) => setTimeout(r, 700));

const qaUrl = `http://127.0.0.1:${port}/index.html`;
const smoke = spawn(process.execPath, ['scripts/qa-smoke.mjs'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  env: {
    ...process.env,
    QA_URL: qaUrl
  }
});

smoke.on('exit', (code) => shutdown(code ?? 0));
smoke.on('error', (err) => {
  console.error('qa-smoke-local:', err);
  shutdown(1);
});
