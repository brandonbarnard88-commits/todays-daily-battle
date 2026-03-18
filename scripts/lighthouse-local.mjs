#!/usr/bin/env node
/**
 * Build, serve dist on 8080, run Lighthouse, then stop serve.
 * Single-command local Lighthouse audit (no second terminal needed).
 */
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

async function main() {
  console.log('Building...');
  execSync('node build-config.js && node build-copy-static.js', { cwd: root, stdio: 'inherit' });

  console.log('Starting serve on port 8080...');
  const serve = spawn('npx', ['serve', 'dist', '-p', '8080'], {
    cwd: root,
    stdio: 'pipe',
    detached: true
  });
  serve.unref();

  try {
    let ready = false;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 300));
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
    try {
      execSync('lsof -ti :8080 | xargs kill 2>/dev/null', { stdio: 'ignore' });
    } catch (_) {}
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
