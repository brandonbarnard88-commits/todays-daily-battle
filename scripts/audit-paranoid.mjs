import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set(['.git', 'node_modules']);
const SOURCE_IGNORE_DIRS = new Set(['.git', 'node_modules', 'vendor', 'dist']);

function walkFiles(startDir, extensions, ignoreDirs = IGNORE_DIRS) {
  const out = [];
  const stack = [startDir];
  while (stack.length) {
    const dir = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) continue;
        stack.push(abs);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        out.push(abs);
      }
    }
  }
  return out.sort();
}

function rel(abs) {
  return path.relative(root, abs).replace(/\\/g, '/');
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function hasFailures() {
  return process.exitCode && process.exitCode !== 0;
}

function runNodeCheck(file) {
  const checked = spawnSync(process.execPath, ['--check', file], {
    cwd: root,
    encoding: 'utf8'
  });
  if (checked.status !== 0) {
    const msg = (checked.stderr || checked.stdout || '').trim();
    fail(`SYNTAX FAIL ${file}\n${msg}`);
  }
}

function checkAllJsSyntax() {
  const files = walkFiles(root, ['.js', '.mjs']);
  files.forEach((abs) => runNodeCheck(rel(abs)));
  if (!hasFailures()) console.log(`OK syntax (${files.length} files)`);
}

function checkScriptDuplicateFunctions() {
  const scriptPath = path.join(root, 'script.js');
  if (!fs.existsSync(scriptPath)) return;
  const src = fs.readFileSync(scriptPath, 'utf8');
  const names = new Map();
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (!m) continue;
    const name = m[1];
    if (!names.has(name)) names.set(name, []);
    names.get(name).push(i + 1);
  }
  for (const [name, found] of names.entries()) {
    if (found.length > 1) fail(`DUPLICATE FUNCTION script.js ${name} at lines ${found.join(', ')}`);
  }
  if (!hasFailures()) console.log('OK script.js duplicate-function scan');
}

function parseAnchors(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const htmlOnly = raw.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const hrefs = [];
  const ids = new Set();
  const anchorRe = /<a\b[^>]*\bhref="([^"]+)"[^>]*>/gi;
  const idRe = /\bid="([^"]+)"/gi;
  let m;
  while ((m = anchorRe.exec(htmlOnly))) {
    const href = String(m[1] || '').trim();
    if (href) hrefs.push(href);
  }
  while ((m = idRe.exec(htmlOnly))) {
    const id = String(m[1] || '').trim();
    if (id) ids.add(id);
  }
  return { hrefs, ids };
}

function checkHtmlAnchors(baseDir, opts = {}) {
  const htmlFiles = walkFiles(baseDir, ['.html'], opts.ignoreDirs || IGNORE_DIRS);
  const baseLabel = opts.label || rel(baseDir) || '.';
  const normalize = (p) => String(p || '').replace(/\\/g, '/');
  const rootIndexPath = normalize(path.join(baseDir, 'index.html'));

  function fileExistsForLink(targetAbsRaw) {
    const targetAbs = normalize(targetAbsRaw);
    if (fs.existsSync(targetAbs)) return true;
    if (targetAbs.endsWith('/')) {
      return fs.existsSync(path.join(targetAbs, 'index.html'));
    }
    if (!path.extname(targetAbs)) {
      if (fs.existsSync(targetAbs + '.html')) return true;
      if (fs.existsSync(path.join(targetAbs, 'index.html'))) return true;
    }
    return false;
  }

  for (const file of htmlFiles) {
    const { hrefs, ids } = parseAnchors(file);
    const fileNorm = normalize(file);
    const fileDir = path.dirname(file);
    for (const href of hrefs) {
      if (/^(mailto:|tel:|javascript:|https?:)/i.test(href)) continue;
      const raw = String(href || '').trim();
      if (!raw || raw === '#') continue;
      let url;
      try {
        url = new URL(raw, 'https://todaysdailybattle.local/');
      } catch {
        fail(`BAD HREF ${rel(file)} -> ${raw}`);
        continue;
      }
      const targetPath = decodeURIComponent(url.pathname || '');
      const hash = (url.hash || '').replace(/^#/, '');
      const hashOnly = raw.startsWith('#');
      const queryOnly = raw.startsWith('?');
      const pathWithMaybeQuery = raw.split('#')[0];
      const pathOnly = pathWithMaybeQuery.split('?')[0];

      if (!hashOnly && !queryOnly) {
        const isAbsolute = pathOnly.startsWith('/');
        const targetAbs = isAbsolute
          ? path.resolve(baseDir, '.' + pathOnly)
          : path.resolve(fileDir, pathOnly);
        if (!fileExistsForLink(targetAbs)) fail(`MISSING FILE ${rel(file)} -> ${raw}`);
      }

      const sameDocByPath = !targetPath || targetPath === '/' || normalize(path.resolve(baseDir, '.' + targetPath)) === fileNorm;
      const sameDoc = hashOnly || queryOnly || sameDocByPath;
      const absoluteRootHash = targetPath === '/' || normalize(path.resolve(baseDir, '.' + targetPath)) === rootIndexPath;
      if (hash && sameDoc && !absoluteRootHash && !ids.has(hash)) fail(`MISSING HASH ${rel(file)} -> #${hash}`);
    }
  }
  if (!hasFailures()) console.log(`OK anchor scan (${baseLabel})`);
}

function ensureDistBuilt() {
  const distIndex = path.join(root, 'dist', 'index.html');
  if (!fs.existsSync(distIndex)) {
    console.log('INFO dist/ missing; running build for dist checks');
    const built = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true });
    if (built.status !== 0) fail('BUILD FAIL unable to generate dist/');
  }
}

function run() {
  console.log('Paranoid audit start');
  checkAllJsSyntax();
  checkScriptDuplicateFunctions();
  checkHtmlAnchors(root, { ignoreDirs: SOURCE_IGNORE_DIRS, label: 'source html' });
  ensureDistBuilt();
  checkHtmlAnchors(path.join(root, 'dist'), { ignoreDirs: new Set(['.git', 'node_modules']), label: 'dist html' });
  if (hasFailures()) {
    console.error('Paranoid audit FAILED');
    process.exit(1);
  }
  console.log('Paranoid audit PASSED');
}

run();
