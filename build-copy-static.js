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
  'ga-config.js',
  'gsc-verify.js',
  'search-widget.js',
  'contact-form.js',
  'firebase-push.js',
  'voice-message.js',
  'voice-pray.js',
  'fetch-prayer-guard.js',
  'lazy-loader.js',
  'utils.js',
  'fallback-search.js',
  'search-wire.js',
  '_redirects',
  '_headers',
  'kjv.json',
  'relations-dict.json',
  'commentary.json',
  'bible-characters.json',
  'people-verse-map.js',
  'daily-verses.js',
  'verse-search-dropdown.js',
  'toolbox-tabs.js',
  'curriculum.js',
  'curriculum-widget.js',
  'cartoon.js',
  'action-bible.js',
  'action-bible-workshop.js',
  'action-bible-365.json',
  'action-bible-weekly-packs.json',
  'armor.js',
  'lineage-tree.js',
  'story-manifest.js',
  'verse-rotator.js',
  'auth.js',
  'avatar-topic-system.js',
  'curriculum.json',
  'characters.json',
  'story-assets-manifest.json',
  'cinematic-story-prompts.json',
  'cinematic-story-prompts.md',
  'bible-character-avatars.json',
  'family-lineage.json',
  'tree.json',
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
  if (f === 'plans.html') {
    if (!content.includes('plan-list') || !content.includes('Battle Distraction')) {
      console.error('BUILD FAIL: plans.html must contain plan-list and Battle Distraction. Plan cards are required.');
      process.exit(1);
    }
    console.log('Copied plans.html (5 battle plans)');
  }
  if (f === 'privacy.html') {
    if (!content.includes('Privacy') || !content.includes('Supabase')) {
      console.error('BUILD FAIL: privacy.html must contain Privacy and Supabase. Required for trust.');
      process.exit(1);
    }
    console.log('Copied privacy.html');
  }
  if (f === 'index.html') {
    const indexContent = fs.readFileSync(path.join(root, f), 'utf8');
    const required = [
      ['id="quick-actions-hero"', 'quick-topic buttons'],
      ['id="query"', 'search input'],
      ['id="search-btn"', 'search button'],
      ['class="quick-links"', 'quick-links tools section'],
      ['bible-tool.html', 'Bible Tool link'],
      ['sermon.html', 'Build a Sermon / Sermon Builder link'],
      ['kids/index.html', 'Kids Corner link'],
      // DO NOT REMOVE: protected core tools — workspace rule "Core tools (DO NOT REMOVE)"
      ['pastor-toolkit.html', 'Pastor Toolkit link'],
      ['team-toolkit.html', 'Team Toolkit link'],
      ['message.html', 'Message Board link'],
      ['coloring.html', 'Kids Coloring / Coloring page link'],
      // DO NOT REMOVE: core search IDs — build fails if quick-search is missing
      ['id="main-search"', 'main-search section (core search anchor)'],
    ];
    for (const [needle, label] of required) {
      if (!indexContent.includes(needle)) {
        if (needle === 'id="query"' && indexContent.includes('id="tdb-search"')) continue;
        if (needle === 'id="search-hero"' && indexContent.includes('id="quick-search-hero"')) continue;
        console.error('BUILD FAIL: index.html must contain ' + label + ' (' + needle + '). Core tools are not to be polished away.');
        process.exit(1);
      }
    }
    // DO NOT REMOVE: script.js quick-search functions — workspace rule
    const scriptContent = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    if (!scriptContent.includes('TDB_TOPICS') || !scriptContent.includes('renderQuickTopicButtons') || !scriptContent.includes('wireSearchAndQuickTopics')) {
      console.error('BUILD FAIL: script.js must contain TDB_TOPICS, renderQuickTopicButtons, and wireSearchAndQuickTopics. Quick-search must always work.');
      process.exit(1);
    }
    // DO NOT REMOVE: verify core pages exist on disk
    const corePages = [
      'pastor-toolkit.html', 'team-toolkit.html', 'study.html',
      'bible-study.html', 'message.html', 'coloring.html',
    ];
    for (const page of corePages) {
      if (!fs.existsSync(path.join(root, page))) {
        console.error('BUILD FAIL: core page missing from repo: ' + page + '. Per workspace rule "Core tools (DO NOT REMOVE)".');
        process.exit(1);
      }
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

if (fs.existsSync(path.join(root, 'kids'))) {
  copyDir(path.join(root, 'kids'), path.join(dist, 'kids'));
  console.log('Copied kids/ folder (Kids Battle + parent dashboard)');
}

if (fs.existsSync(path.join(root, 'pastor'))) {
  copyDir(path.join(root, 'pastor'), path.join(dist, 'pastor'));
  console.log('Copied pastor/ folder (hub, tools, builder, library)');
}

if (fs.existsSync(path.join(root, 'church'))) {
  copyDir(path.join(root, 'church'), path.join(dist, 'church'));
  console.log('Copied church/ folder (index + daily)');
}

if (fs.existsSync(path.join(root, 'bible'))) {
  copyDir(path.join(root, 'bible'), path.join(dist, 'bible'));
  console.log('Copied bible/ folder (hub + tools)');
}

const activeBibleMedia = path.join(root, 'media', 'active-bible');
if (fs.existsSync(activeBibleMedia)) {
  copyDir(activeBibleMedia, path.join(dist, 'media', 'active-bible'));
  console.log('Copied media/active-bible assets');
}

const wellKnown = path.join(root, '.well-known');
if (fs.existsSync(wellKnown)) {
  copyDir(wellKnown, path.join(dist, '.well-known'));
}

// Write build-date.txt so JS can fetch it as fallback if HTML replacement missed
fs.writeFileSync(path.join(dist, 'build-date.txt'), BUILD_DATE_STR, 'utf8');
console.log('build-copy-static.js: copied all static files to dist/ (including topic-*.html).');
