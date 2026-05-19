#!/usr/bin/env node
/**
 * Full-site audit: dist links, plan IDs, life-lesson slugs, core assets.
 * Run after: npm run build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const errors = [];
const warnings = [];
const stats = { htmlFiles: 0, hrefChecked: 0, planRefs: 0, lessonRefs: 0 };

function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ missing — run npm run build');
  process.exit(1);
}

// --- Plan IDs from plans-data.js ---
const plansDataPath = path.join(dist, 'plans-data.js');
let planIds = new Set();
if (fs.existsSync(plansDataPath)) {
  const raw = fs.readFileSync(plansDataPath, 'utf8');
  const m = raw.match(/window\.TDB_PLANS\s*=\s*(\{[\s\S]*?\});?\s*(?:window\.|$)/);
  if (m) {
    try {
      const plans = JSON.parse(m[1].replace(/,\s*([\]}])/g, '$1'));
      planIds = new Set(Object.keys(plans));
    } catch (e) {
      warn('Could not parse plans-data.js as JSON; plan ID check skipped');
    }
  }
}
if (!planIds.size && fs.existsSync(path.join(root, 'plans-data.js'))) {
  const raw = fs.readFileSync(path.join(root, 'plans-data.js'), 'utf8');
  const re = /"([a-z0-9]+)":\s*\{/gi;
  let mm;
  while ((mm = re.exec(raw))) planIds.add(mm[1]);
}

// --- Life lesson slugs ---
const lessonSlugs = new Set();
const llDir = path.join(dist, 'life-lessons');
if (fs.existsSync(llDir)) {
  for (const f of fs.readdirSync(llDir)) {
    if (f.endsWith('.html') && !f.endsWith('-print.html')) {
      lessonSlugs.add(f.replace(/\.html$/, ''));
    }
  }
}

// --- Walk dist HTML only ---
const htmlFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
}
walk(dist);
stats.htmlFiles = htmlFiles.length;

function resolveTarget(fromFile, href) {
  const raw = href.split('#')[0].split('?')[0].trim();
  if (!raw || raw === '#') return null;
  if (/^(mailto:|tel:|javascript:|data:|https?:)/i.test(raw)) return null;
  const fromDir = path.dirname(fromFile);
  const isAbs = raw.startsWith('/');
  return isAbs ? path.join(dist, raw.replace(/^\//, '')) : path.join(fromDir, raw);
}

function targetExists(targetPath) {
  if (!targetPath) return false;
  const norm = path.normalize(targetPath);
  if (fs.existsSync(norm) && fs.statSync(norm).isFile()) return true;
  if (fs.existsSync(norm + '.html')) return true;
  if (fs.existsSync(path.join(norm, 'index.html'))) return true;
  return false;
}

const brokenLinks = [];
const checked = new Set();
const planRefs = new Map();
const lessonRefs = new Map();
const corePages = [
  '/index.html',
  '/plans.html',
  '/bible-tool.html',
  '/bible-study.html',
  '/life-lessons.html',
  '/red-letters.html',
  '/kids/corner.html',
  '/coloring.html',
  '/mystudy.html',
  '/explore.html',
  '/printables.html',
  '/porch-update-email-template.html',
];

for (const file of htmlFiles) {
  let body = fs.readFileSync(file, 'utf8');
  body = body.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<!--[\s\S]*?-->/g, '');

  for (const m of body.matchAll(/href=["']([^"']+)["']/g)) {
    const href = (m[1] || '').trim();
    const target = resolveTarget(file, href);
    if (!target) continue;
    const key = path.relative(dist, file) + ' -> ' + href;
    if (checked.has(key)) continue;
    checked.add(key);
    stats.hrefChecked++;
    if (!targetExists(target)) {
      brokenLinks.push({ from: path.relative(root, file), href });
    }
    const planM = href.match(/plans\.html\?plan=([a-z0-9_-]+)/i);
    if (planM) {
      const id = planM[1];
      stats.planRefs++;
      if (!planRefs.has(id)) planRefs.set(id, []);
      planRefs.get(id).push(path.relative(dist, file));
    }
    const llM = href.match(/life-lessons\/([a-z0-9-]+)\.html/i);
    if (llM && !llM[1].endsWith('-print')) {
      const slug = llM[1].replace(/-print$/, '');
      stats.lessonRefs++;
      if (!lessonRefs.has(slug)) lessonRefs.set(slug, []);
      lessonRefs.get(slug).push(path.relative(dist, file));
    }
  }
}

for (const [id, files] of planRefs) {
  if (planIds.size && !planIds.has(id)) {
    fail(`Unknown plan ID "${id}" linked from ${files[0]} (+${files.length - 1} more)`);
  }
}

for (const [slug, files] of lessonRefs) {
  if (lessonSlugs.size && !lessonSlugs.has(slug)) {
    fail(`Unknown life-lesson slug "${slug}" linked from ${files[0]}`);
  }
}

for (const slug of lessonSlugs) {
  const print = path.join(llDir, `${slug}-print.html`);
  if (!fs.existsSync(print)) fail(`Missing print page for lesson: ${slug}-print.html`);
}

for (const p of corePages) {
  if (!fs.existsSync(path.join(dist, p.replace(/^\//, '')))) fail(`Missing core page: ${p}`);
}

const assets = ['script.js', 'styles.css', 'plans-data.js', 'life-lessons-tool.js', 'red-letter.js', 'register-sw.js', 'service-worker.js'];
for (const a of assets) {
  if (!fs.existsSync(path.join(dist, a))) fail(`Missing core asset in dist: ${a}`);
}

// Report
console.log('=== Today\'s Daily Battle — Full Site Audit (dist/) ===\n');
console.log(`HTML files scanned:     ${stats.htmlFiles}`);
console.log(`Internal hrefs checked: ${stats.hrefChecked}`);
console.log(`Plan IDs in data:       ${planIds.size}`);
console.log(`Plan links found:       ${planRefs.size} unique IDs`);
console.log(`Life lessons on disk:   ${lessonSlugs.size}`);
console.log(`Life lesson link slugs: ${lessonRefs.size} unique`);
console.log('');

if (brokenLinks.length) {
  console.log(`BROKEN LINKS: ${brokenLinks.length}`);
  brokenLinks.slice(0, 40).forEach(({ from, href }) => console.log(`  ${from} -> ${href}`));
  if (brokenLinks.length > 40) console.log(`  ... and ${brokenLinks.length - 40} more`);
  errors.push(`${brokenLinks.length} broken internal links`);
} else {
  console.log('OK  All internal links resolve');
}

if (warnings.length) {
  console.log(`\nWarnings: ${warnings.length}`);
  warnings.forEach((w) => console.log('  WARN ' + w));
}

if (errors.length) {
  console.log(`\nFAILED: ${errors.length} issue(s)`);
  errors.slice(0, 30).forEach((e) => console.log('  FAIL ' + e));
  process.exit(1);
}

console.log('\nPASSED — dist/ link, plan, lesson, and core asset audit');
process.exit(0);
