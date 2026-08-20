#!/usr/bin/env node
/** Reina-Valera 1960 is not public domain and must not be quoted on the site. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SKIP_DIR = new Set(['node_modules', '.git', '.worktrees', 'next-app', 'archive', 'api', 'dist']);
const ALLOW = new Set([
  'scripts/replace-rv1960-with-rv1909.mjs',
  'scripts/verify-no-rv1960.mjs',
  'scripts/verify-no-copyrighted-editions.mjs',
  'scripts/legal-fix-unverified-scripture.mjs',
  'data/bibles/meta.json',
  'data/bibles/NOTICE.txt',
  'bible-credits.html',
  'dist/bible-credits.html'
]);
const failures = [];

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name) || name.startsWith('lighthouse')) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|js|mjs|md|json)$/.test(name)) out.push(p);
  }
}

function main() {
  const files = [];
  walk(root, files);
  for (const file of files) {
    const rel = path.relative(root, file);
    if (ALLOW.has(rel)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (/Reina-Valera 1960|Reina Valera 1960|RV1960|RV 1960/.test(text)) {
      failures.push(rel);
    }
  }
  const credits = fs.readFileSync(path.join(root, 'bible-credits.html'), 'utf8');
  if (!/do not use Reina-Valera 1960/.test(credits)) {
    failures.push('bible-credits.html must say we do not use Reina-Valera 1960');
  }
  if (failures.length) {
    failures.forEach((f) => console.error('verify-no-rv1960:', f));
    process.exit(1);
  }
  console.log('verify-no-rv1960: OK');
}

main();
