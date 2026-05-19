#!/usr/bin/env node
/** Verify every plans.html?plan= ID in dist/ exists in plans.html source */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const plansHtml = fs.readFileSync(path.join(root, 'plans.html'), 'utf8');

const PLAN_ID = '[a-z0-9]+(?:-[a-z0-9]+)*';
const known = new Set();
for (const re of [
  new RegExp(`id=["']plan-row-(${PLAN_ID})["']`, 'gi'),
  new RegExp(`data-plan=["'](${PLAN_ID})["']`, 'gi'),
  new RegExp(`tdb-plan-(${PLAN_ID})-day`, 'gi'),
  new RegExp(`openPlan\\(['"](${PLAN_ID})['"]\\)`, 'gi'),
  new RegExp(`plan:\\s*['"](${PLAN_ID})['"]`, 'gi'),
  new RegExp(`\\bid:\\s*['"](${PLAN_ID})['"]`, 'gi'),
]) {
  let m;
  while ((m = re.exec(plansHtml))) known.add(m[1]);
}

const linked = new Map();
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) {
      const body = fs.readFileSync(p, 'utf8');
      let m;
      const re = /plans\.html\?plan=([a-z0-9]+(?:-[a-z0-9]+)*)/gi;
      while ((m = re.exec(body))) {
        const id = m[1];
        if (!linked.has(id)) linked.set(id, path.relative(root, p));
      }
    }
  }
}
walk(dist);

const missing = [];
for (const [id, from] of linked) {
  if (!known.has(id)) missing.push({ id, from });
}

console.log(`Plan IDs defined in plans.html: ${known.size}`);
console.log(`Unique plan= links in dist/:        ${linked.size}`);
if (missing.length) {
  console.error(`\nUNKNOWN PLAN IDs (${missing.length}):`);
  missing.slice(0, 30).forEach(({ id, from }) => console.error(`  ${id} (from ${from})`));
  process.exit(1);
}
console.log('OK all plan= links resolve to plans.html');
