#!/usr/bin/env node
/** Fail if user-facing source reintroduces banned meta copy. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BANNED = [
  'The Paths',
  'The Library',
  'If you are the builder',
  'This is not two different stories',
  'paid plans add tools',
  'Calm room',
];
const SKIP = new Set(['node_modules','dist','next-app','.git','docs','scripts','vendor','kids-read-quiz-data.js']);

let bad = [];
function walk(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(html|js)$/.test(ent.name) && ent.name !== 'kids-read-quiz-data.js') {
      const t = fs.readFileSync(p, 'utf8');
      for (const b of BANNED) {
        if (t.includes(b)) bad.push(`${path.relative(ROOT, p)}: ${b}`);
      }
    }
  }
}
walk(ROOT);
if (bad.length) {
  console.error('Banned user-facing phrases found:\n' + bad.slice(0, 40).join('\n'));
  process.exit(1);
}
console.log('Site copy phrase lint passed.');
