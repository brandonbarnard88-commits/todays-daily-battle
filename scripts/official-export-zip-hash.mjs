#!/usr/bin/env node
/**
 * Official static export: ZIP dist/ + SHA-256 for immortal.html / official-export-hash.txt.
 *
 * Usage (from repo root):
 *   npm run export:zip-hash
 *   npm run export:zip-hash -- --skip-build          # use existing dist/
 *   npm run export:zip-hash -- --date 2026-04-28       # filename suffix (defaults to local date)
 *
 * Requires `zip` on PATH (macOS/Linux). Windows: use WSL, Git Bash with zip, or zip manually and run:
 *   node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('YOUR.zip')).digest('hex'))"
 *
 * Does not edit files — paste printed hash into immortal.html <pre> and data/official-export-hash.txt, then redeploy.
 */
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, readFileSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function parseArgs(argv) {
  let skipBuild = false;
  let dateStr = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--skip-build') skipBuild = true;
    else if (argv[i] === '--date' && argv[i + 1]) dateStr = argv[++i];
  }
  return { skipBuild, dateStr };
}

function localDateYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function main() {
  const { skipBuild, dateStr } = parseArgs(process.argv.slice(2));
  const stamp = dateStr || localDateYMD();
  const zipName = `todaysdailybattle-full-export-${stamp}.zip`;
  const zipPath = path.join(root, zipName);
  const distPath = path.join(root, 'dist');

  if (!skipBuild) {
    console.log('Running npm run build …');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
  }

  if (!existsSync(distPath)) {
    console.error('BUILD FAIL: dist/ is missing. Run npm run build first.');
    process.exit(1);
  }

  try {
    execSync('command -v zip', { stdio: 'pipe' });
  } catch {
    console.error('This script needs the `zip` CLI (macOS/Linux package zip). On Windows, use WSL/Git Bash or hash by hand.');
    process.exit(1);
  }

  if (existsSync(zipPath)) {
    rmSync(zipPath);
  }

  console.log(`Writing ${zipName} (archives folder dist/) …`);
  execSync(`zip -r -q "${zipPath}" dist`, { cwd: root });

  const buf = readFileSync(zipPath);
  const hash = createHash('sha256').update(buf).digest('hex');

  console.log('\n── SHA-256 (canonical fingerprint for this ZIP) ──\n');
  console.log(hash);

  console.log('\n── Paste inside <pre id="tdb-official-export-hash" …> on immortal.html (text only) ──\n');
  console.log(hash);

  console.log('\n── Paste into data/official-export-hash.txt as one line ──\n');
  console.log(`official-export-sha256=${hash}`);

  console.log(`\nZIP: ${zipPath}`);
  console.log(`Bytes: ${buf.length}\n`);
}

main();
