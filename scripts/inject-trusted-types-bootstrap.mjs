/**
 * One-time / maintenance: inject sync DOMPurify + tt-bootstrap immediately after <head>
 * so Trusted Types + innerHTML work before any deferred script (CSP require-trusted-types-for).
 * Skips files that already reference tt-bootstrap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const MARKER = 'Trusted Types: DOMPurify + innerHTML bridge';
const INJECT = `  <!-- ${MARKER} (_headers CSP) -->
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js"></script>
`;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'build' || e.name === 'dist' || e.name === 'playwright-report') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let updated = 0;
for (const f of walk(root)) {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('tt-bootstrap.js') || c.includes('/tt-bootstrap.js')) continue;
  if (c.includes(MARKER)) continue;
  if (!/<head[^>]*>/i.test(c)) continue;
  const next = c.replace(/<head([^>]*)>/i, (m) => `${m}\n${INJECT}`);
  if (next === c) continue;
  fs.writeFileSync(f, next);
  updated++;
  console.log(path.relative(root, f));
}
console.error('inject-trusted-types-bootstrap: updated', updated, 'files');
