#!/usr/bin/env node
/**
 * Fail if visitor-facing files claim or map copyrighted Bible editions,
 * or falsely label them as public domain.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SKIP_DIR = new Set(['node_modules', '.git', '.worktrees', 'next-app', 'archive', 'api', 'dist', 'lighthouse-runs', 'playwright-report']);
const ALLOW = new Set([
  'scripts/replace-rv1960-with-rv1909.mjs',
  'scripts/verify-no-rv1960.mjs',
  'scripts/verify-no-copyrighted-editions.mjs',
  'scripts/legal-fix-unverified-scripture.mjs',
  'scripts/generate-hope-pilot-pages.mjs',
  'scripts/vendor-locale-bibles.mjs',
  'data/bibles/meta.json',
  'data/bibles/NOTICE.txt',
  'bible-credits.html',
  'ROADMAP-STARS.md'
]);

const RULES = [
  { re: /NIV:\s*'\/niv\.json'|ESV:\s*'\/esv\.json'|NLT:\s*'\/nlt\.json'|NKJV:\s*'\/nkjv\.json'/, msg: 'must not map NIV/ESV/NLT/NKJV JSON' },
  { re: /Reina-Valera 1960|Reina Valera 1960|RV1960|RV 1960/, msg: 'must not quote Reina-Valera 1960' },
  { re: /terjemahan domain publik umum|Terjemahan Baru–style|Alkitab Terjemahan Baru/, msg: 'must not quote or claim Terjemahan Baru as PD' },
  { re: /१८५१ हिंदी|1851 Hindi Bible tradition/, msg: 'must not claim 1851 Hindi without a stored catalog' },
  { re: /Kiswahili cha umma\)|Krapf lineage/, msg: 'must not claim an unverified Swahili PD Bible' },
  { re: /Tagalog, domain publiko/, msg: 'must not claim unverified Tagalog PD quotes' }
];

const failures = [];

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIR.has(name) || name.startsWith('lighthouse')) continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|js|mjs)$/.test(name) && !name.startsWith('lighthouse')) out.push(p);
  }
}

function main() {
  const files = [];
  walk(root, files);
  for (const file of files) {
    const rel = path.relative(root, file);
    if (ALLOW.has(rel)) continue;
    if (rel.startsWith('scripts/') && rel !== 'script.js') {
      /* generator/fix scripts may mention banned editions as negatives */
      if (/verify-|replace-|legal-fix-|generate-/.test(path.basename(rel))) continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    for (const rule of RULES) {
      if (rule.re.test(text)) failures.push(rel + ' — ' + rule.msg);
    }
  }

  const credits = fs.readFileSync(path.join(root, 'bible-credits.html'), 'utf8');
  if (!/do not use Terjemahan Baru/.test(credits) && !/We do not use Terjemahan Baru/.test(credits)) {
    failures.push('bible-credits.html must say we do not use Terjemahan Baru');
  }
  if (!/Hindi IRV 2019/.test(credits)) {
    failures.push('bible-credits.html must credit Hindi IRV 2019');
  }
  if (!/NIV, ESV, NLT, NKJV/.test(credits)) {
    failures.push('bible-credits.html must say we do not host NIV/ESV/NLT/NKJV');
  }

  if (failures.length) {
    failures.forEach((f) => console.error('verify-no-copyrighted-editions:', f));
    process.exit(1);
  }
  console.log('verify-no-copyrighted-editions: OK');
}

main();
