/**
 * Copies all static site files into dist/ so Cloudflare Pages (or any host)
 * can use "Build output directory" = dist and get every file, including
 * topic-*.html (fixes 503 when topic pages were missing from output).
 * Run after build-config.js: npm run build
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  mkdir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  mkdir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(srcDir, e.name);
    const d = path.join(destDir, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

// Single files to copy (root)
const rootFiles = [
  'config.js',
  'manifest.json',
  'icon.svg',
  'styles.css',
  'script.js',
  'service-worker.js',
  'daily-verse-widget.js',
  'inline-bootstrap.js',
  'search-widget.js',
  'contact-form.js',
  'firebase-push.js',
  'voice-message.js',
  'voice-pray.js',
  '_redirects',
  '_headers',
  'kjv.json',
  'bell.mp3'
];

// All HTML in root (includes index.html, topic-anxiety.html, topic-*.html, etc.)
const htmlFiles = fs.readdirSync(root, { withFileTypes: false })
  .filter((f) => f.endsWith('.html'));

// Force topic copy — no wildcards, no readdir; CI can't skip this.
const TOPIC_FILES = [
  'topic-anxiety.html',
  'topic-fear.html',
  'topic-forgiveness.html',
  'topic-grief.html',
  'topic-hope.html',
  'topic-parenting.html',
  'topic-strength.html'
];
mkdir(dist);
let topicCopied = 0;
TOPIC_FILES.forEach((f) => {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, f));
    topicCopied += 1;
  }
});
console.log('Forced topic copy: ' + topicCopied + ' topic pages to dist/');

for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(dist, f));
  }
}

const otherHtml = htmlFiles.filter((f) => !TOPIC_FILES.includes(f));
for (const f of otherHtml) {
  copyFile(path.join(root, f), path.join(dist, f));
}

if (fs.existsSync(path.join(root, 'vendor'))) {
  copyDir(path.join(root, 'vendor'), path.join(dist, 'vendor'));
}

const wellKnown = path.join(root, '.well-known');
if (fs.existsSync(wellKnown)) {
  copyDir(wellKnown, path.join(dist, '.well-known'));
}

console.log('build-copy-static.js: copied all static files to dist/ (including topic-*.html).');
