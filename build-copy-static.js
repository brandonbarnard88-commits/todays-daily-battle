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
  'fetch-prayer-guard.js',
  'utils.js',
  '_redirects',
  '_headers',
  'kjv.json',
  'commentary.json',
  'verse-search-dropdown.js',
  // 'bell.mp3' – add to project root if you want a custom bell; otherwise Web Audio beep is used
];
const scriptFiles = ['scripts/header-search-bar.js'];

// All HTML in root (includes index.html, topic-anxiety.html, topic-*.html, etc.)
const htmlFiles = fs.readdirSync(root, { withFileTypes: false })
  .filter((f) => f.endsWith('.html'));

// Hard-force topic copy first (before any other copy) — CI must not skip.
const topics = [
  'topic-anxiety.html',
  'topic-fear.html',
  'topic-forgiveness.html',
  'topic-grief.html',
  'topic-hope.html',
  'topic-parenting.html',
  'topic-strength.html'
];
mkdir(dist);
function formatBuildDate() {
  const d = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}
const BUILD_DATE_STR = formatBuildDate();
topics.forEach(function (f) {
  const src = path.join(root, f);
  const dest = path.join(dist, f);
  if (fs.existsSync(src)) {
    let content = fs.readFileSync(src, 'utf8');
    content = content.replace(/TDB_BUILD_DATE/g, BUILD_DATE_STR);
    fs.writeFileSync(dest, content);
    console.log('Copied topic: ' + f);
  }
});
console.log('Forced topic copy: ' + topics.length + ' files checked');

// Rest of static files (TOPIC_FILES used to exclude from otherHtml)
const TOPIC_FILES = topics;

for (const f of rootFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(dist, f));
  } else if (f === 'kjv.json') {
    console.warn('build-copy-static.js: kjv.json not found in root — verse search and daily verse may fail until it is added or served from origin.');
  }
}
for (const f of scriptFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(dist, f));
  }
}

const otherHtml = htmlFiles.filter((f) => !TOPIC_FILES.includes(f));
for (const f of otherHtml) {
  let content = fs.readFileSync(path.join(root, f), 'utf8');
  content = content.replace(/TDB_BUILD_DATE/g, BUILD_DATE_STR);
  fs.writeFileSync(path.join(dist, f), content);
  if (f === 'index.html') {
    const indexContent = fs.readFileSync(path.join(root, f), 'utf8');
    const required = [
      ['id="quick-actions-hero"', 'quick-topic buttons'],
      ['id="query"', 'search input'],
      ['id="search-btn"', 'search button'],
      ['class="quick-links"', 'quick-links tools section'],
      ['bible-tool.html', 'Bible Tool link'],
      ['pastor-toolkit.html', 'Pastor Toolkit link'],
      ['team-toolkit.html', 'Team Toolkit link'],
      ['study.html', 'Build a Lesson link'],
      ['bible-study.html', 'Bible Studies link'],
      ['sermon.html', 'Build a Sermon link'],
      ['message.html', 'Message Board link'],
      ['coloring.html', 'Kids Corner link'],
      ['id="daily-btn"', "Today's Battle button"],
      ['id="main-search"', 'main-search section']
    ];
    for (const [needle, label] of required) {
      if (!indexContent.includes(needle)) {
        if (needle === 'id="query"' && indexContent.includes('id="tdb-search"')) continue;
        if (needle === 'id="search-hero"' && indexContent.includes('id="quick-search-hero"')) continue;
        console.error('BUILD FAIL: index.html must contain ' + label + ' (' + needle + '). Core tools are not to be polished away.');
        process.exit(1);
      }
    }
    const scriptContent = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    if (!scriptContent.includes('TDB_TOPICS') || !scriptContent.includes('renderQuickTopicButtons') || !scriptContent.includes('wireSearchAndQuickTopics')) {
      console.error('BUILD FAIL: script.js must contain TDB_TOPICS, renderQuickTopicButtons, and wireSearchAndQuickTopics. Quick-search must always work.');
      process.exit(1);
    }
    console.log('Copied index.html (hero + quick-search + tools) to dist/');
  }
}

if (fs.existsSync(path.join(root, 'vendor'))) {
  copyDir(path.join(root, 'vendor'), path.join(dist, 'vendor'));
}

if (fs.existsSync(path.join(root, 'icons'))) {
  copyDir(path.join(root, 'icons'), path.join(dist, 'icons'));
}

const wellKnown = path.join(root, '.well-known');
if (fs.existsSync(wellKnown)) {
  copyDir(wellKnown, path.join(dist, '.well-known'));
}

console.log('build-copy-static.js: copied all static files to dist/ (including topic-*.html).');
