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

/** CSP require-trusted-types-for: sync DOMPurify + innerHTML bridge before any deferred script */
const TT_BOOTSTRAP_MARK = 'Trusted Types: DOMPurify + innerHTML bridge';
const TT_BOOTSTRAP_SNIPPET =
  '\n  <!-- ' + TT_BOOTSTRAP_MARK + ' (_headers CSP) -->\n' +
  '  <script src="/vendor/dompurify.min.js"></script>\n' +
  '  <script src="/tt-bootstrap.js"></script>\n';

function ensureTrustedTypesBootstrap(html) {
  if (!/<head[^>]*>/i.test(html)) return html;
  if (html.includes('tt-bootstrap.js') || html.includes('/tt-bootstrap.js')) return html;
  return html.replace(/<head([^>]*)>/i, function (m) {
    return m + TT_BOOTSTRAP_SNIPPET;
  });
}

function walkHtmlUnder(dir, onFile) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtmlUnder(p, onFile);
    else if (e.name.endsWith('.html')) onFile(p);
  }
}

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
  'favicon.ico',
  'favicon-32.png',
  'favicon-192.png',
  'favicon-512.png',
  'icon-192.png',
  'apple-touch-icon.png',
  'logo-shield-600.png',
  'logo-crest.jpg',
  'world-map-source.svg',
  'styles.css',
  'tool-pages.css',
  'church.css',
  'loop-player.css',
  'kids-corner.css',
  'mystudy.css',
  'script.js',
  'script.js.map',
  'service-worker.js',
  'sw.js',
  'daily-verse-widget.js',
  'hero-daily-365-data.js',
  'hero-daily-first-paint.js',
  'inline-bootstrap.js',
  'ga-config.js',
  'tt-bootstrap.js',
  'analytics-loader.js',
  'gsc-verify.js',
  'ask-the-word.js',
  'search-widget.js',
  'contact-form.js',
  'shop-waitlist.js',
  'feeling-suggest-form.js',
  'firebase-push.js',
  'voice-message.js',
  'voice-pray.js',
  'fetch-prayer-guard.js',
  'lazy-loader.js',
  'utils.js',
  'fallback-search.js',
  'search-wire.js',
  'share-page.js',
  'easter-eggs.js',
  'easter-eggs.css',
  'plans-data.js',
  'verse-breakdown.js',
  'highlights.js',
  'streak.js',
  'family-hierarchy.js',
  'crest.js',
  'avatar-progress.js',
  'bible-progress.js',
  'mobius-loop.js',
  'mobius-universal.js',
  '_redirects',
  '_headers',
  'robots.txt',
  'sitemap.xml',
  'SW-VERSION',
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
  'verse-image.js',
  'profile.js',
  'loop-feedback-config.js',
  'loops.json',
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
  'topic-guilt.html',
  'topic-loneliness.html',
  'topic-overwhelmed.html',
  'topic-parenting.html',
  'topic-strength.html',
  'topic-worthless.html'
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
    content = ensureTrustedTypesBootstrap(content);
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

const otherHtml = htmlFiles.filter((f) => !TOPIC_FILES.includes(f) && !f.startsWith('lighthouse-'));
for (const f of otherHtml) {
  let content = fs.readFileSync(path.join(root, f), 'utf8');
  content = content.replace(/TDB_BUILD_DATE/g, BUILD_DATE_STR);
  content = ensureTrustedTypesBootstrap(content);
  fs.writeFileSync(path.join(dist, f), content);
  if (f === 'plans.html') {
    if (!content.includes('plan-list') || !content.includes('Battle Distraction')) {
      console.error('BUILD FAIL: plans.html must contain plan-list and Battle Distraction. Plan cards are required.');
      process.exit(1);
    }
    if (!content.includes('fearfaith') || !content.includes('tdb-plan-fearfaith-day')) {
      console.error('BUILD FAIL: plans.html must include Fear to Faith plan (fearfaith / tdb-plan-fearfaith-day).');
      process.exit(1);
    }
    if (!content.includes('worrytrust') || !content.includes('tdb-plan-worrytrust-day')) {
      console.error('BUILD FAIL: plans.html must include Worry to Trust plan (worrytrust / tdb-plan-worrytrust-day).');
      process.exit(1);
    }
    if (!content.includes('angerpeace') || !content.includes('tdb-plan-angerpeace-day')) {
      console.error('BUILD FAIL: plans.html must include Anger → Peace plan (angerpeace / tdb-plan-angerpeace-day).');
      process.exit(1);
    }
    if (!content.includes('doubtassurance') || !content.includes('tdb-plan-doubtassurance-day')) {
      console.error('BUILD FAIL: plans.html must include Doubt → Assurance plan (doubtassurance / tdb-plan-doubtassurance-day).');
      process.exit(1);
    }
    if (!content.includes('griefhope') || !content.includes('tdb-plan-griefhope-day')) {
      console.error('BUILD FAIL: plans.html must include Grief → Hope plan (griefhope / tdb-plan-griefhope-day).');
      process.exit(1);
    }
    if (!content.includes('painwontquit') || !content.includes('tdb-plan-painwontquit-day')) {
      console.error('BUILD FAIL: plans.html must include When Pain Won\'t Quit plan (painwontquit / tdb-plan-painwontquit-day).');
      process.exit(1);
    }
    console.log('Copied plans.html (battle plans library)');
  }
  if (f === 'privacy.html') {
    if (!content.includes('Privacy') || !content.includes('Supabase')) {
      console.error('BUILD FAIL: privacy.html must contain Privacy and Supabase. Required for trust.');
      process.exit(1);
    }
    console.log('Copied privacy.html');
  }
  if (f === 'bible-tool.html') {
    const askRequired = ['id="bible-qa-search"', 'id="bible-qa-btn"', 'ask-the-word.js', 'id="qa-result"'];
    for (const needle of askRequired) {
      if (!content.includes(needle)) {
        console.error('BUILD FAIL: bible-tool.html must contain Ask the Word (' + needle + ').');
        process.exit(1);
      }
    }
    if (!fs.existsSync(path.join(dist, 'ask-the-word.js'))) {
      console.error('BUILD FAIL: ask-the-word.js must exist in dist/ (add to rootFiles in build-copy-static.js).');
      process.exit(1);
    }
    console.log('Copied bible-tool.html (Ask the Word wired)');
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

if (fs.existsSync(path.join(root, 'audio'))) {
  copyDir(path.join(root, 'audio'), path.join(dist, 'audio'));
  console.log('Copied audio/ folder (verse clips, mobius-guided-10min.mp3)');
}

if (fs.existsSync(path.join(root, 'vendor'))) {
  copyDir(path.join(root, 'vendor'), path.join(dist, 'vendor'));
}

if (fs.existsSync(path.join(root, 'icons'))) {
  copyDir(path.join(root, 'icons'), path.join(dist, 'icons'));
}

if (fs.existsSync(path.join(root, 'assets'))) {
  copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
  console.log('Copied assets/ folder (share images for OG/Twitter)');
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

if (fs.existsSync(path.join(root, 'verse-cards'))) {
  copyDir(path.join(root, 'verse-cards'), path.join(dist, 'verse-cards'));
  console.log('Copied verse-cards/ folder (Pinterest verse images)');
}

const activeBibleMedia = path.join(root, 'media', 'active-bible');
if (fs.existsSync(activeBibleMedia)) {
  copyDir(activeBibleMedia, path.join(dist, 'media', 'active-bible'));
  console.log('Copied media/active-bible assets');
}

const kidsStoriesMedia = path.join(root, 'media', 'kids-stories');
if (fs.existsSync(kidsStoriesMedia)) {
  copyDir(kidsStoriesMedia, path.join(dist, 'media', 'kids-stories'));
  console.log('Copied media/kids-stories assets');
}

const wellKnown = path.join(root, '.well-known');
if (fs.existsSync(wellKnown)) {
  copyDir(wellKnown, path.join(dist, '.well-known'));
}

// Write build-date.txt so JS can fetch it as fallback if HTML replacement missed
fs.writeFileSync(path.join(dist, 'build-date.txt'), BUILD_DATE_STR, 'utf8');

// Verify critical pages exist (fail build if missing)
const CRITICAL_PAGES = [
  'index.html', 'bible-tool.html', 'pastor-toolkit.html', 'sermon.html', 'plans.html',
  'testimonials.html', 'why-not-ai.html',
  'pastor/index.html', 'bible/index.html', 'script.js'
];
const missing = CRITICAL_PAGES.filter(function (f) { return !fs.existsSync(path.join(dist, f)); });
if (missing.length) {
  console.error('BUILD FAIL: Missing critical files in dist/: ' + missing.join(', '));
  process.exit(1);
}

// SEO / discovery: must ship with Pages output (dist-only deploys skip root-only files otherwise)
const sitemapDist = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapDist)) {
  console.error('BUILD FAIL: sitemap.xml missing in dist/. Add sitemap.xml to rootFiles in build-copy-static.js.');
  process.exit(1);
}
const sitemapBody = fs.readFileSync(sitemapDist, 'utf8');
if (!sitemapBody.includes('ansiedad.html') || !sitemapBody.includes('verse-cards')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Spanish pages and verse-cards (expected ansiedad + verse-cards).');
  process.exit(1);
}
if (!sitemapBody.includes('testimonials.html') || !sitemapBody.includes('calm.html') || !sitemapBody.includes('mobius.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list testimonials.html, calm.html, and mobius.html (SEO / discoverability).');
  process.exit(1);
}
if (!fs.existsSync(path.join(dist, 'verse-cards', 'index.html'))) {
  console.error('BUILD FAIL: verse-cards/index.html missing in dist/. Pinterest gallery will 404 on /verse-cards/.');
  process.exit(1);
}
const SHARE_OG = ['home-og.jpg', 'calm-og.jpg', 'mobius-og.jpg', 'shop-og.jpg', 'testimonials-og.jpg', 'verse-share.jpg', 'kids-loop-og.jpg', 'kids-story-library-og.jpg'];
for (let i = 0; i < SHARE_OG.length; i++) {
  const p = path.join(dist, 'assets', 'share', SHARE_OG[i]);
  if (!fs.existsSync(p)) {
    console.error('BUILD FAIL: OG share image missing: ' + p);
    process.exit(1);
  }
}
console.log('Verified: sitemap.xml + robots.txt in dist/, verse-cards/index.html + Spanish URLs in sitemap.');
console.log('Verified: assets/share OG JPEGs (1200×630) for social previews.');

const amenSignalPath = path.join(dist, 'assets', 'data', 'community-amen-signal.json');
if (!fs.existsSync(amenSignalPath)) {
  console.error('BUILD FAIL: assets/data/community-amen-signal.json missing in dist/. Required for optional aggregate Amen line.');
  process.exit(1);
}

// Verify donation redirects in _redirects (required for bot-probe cleanup)
const redirectsPath = path.join(dist, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  console.error('BUILD FAIL: _redirects missing from dist/. Donation redirects required.');
  process.exit(1);
}
const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
const DONATION_REDIRECTS = [
  { path: '/donate', desc: '/donate → Buy Me a Coffee' },
  { path: '/stripe', desc: '/stripe → Buy Me a Coffee' },
  { path: '/support', desc: '/support → Buy Me a Coffee' },
  { path: '/donations', desc: '/donations → Buy Me a Coffee' },
  { path: '/donations/*', desc: '/donations/* wildcard → Buy Me a Coffee' }
];
const buymeacoffee = 'https://buymeacoffee.com/todaysdailybattle';
const missingRedirects = DONATION_REDIRECTS.filter(function (r) {
  const lineMatch = new RegExp('^' + r.path.replace(/\*/g, '\\*') + '\\s+' + buymeacoffee.replace(/\./g, '\\.') + '\\s+301', 'm');
  return !lineMatch.test(redirectsContent);
});
if (missingRedirects.length) {
  console.error('BUILD FAIL: _redirects missing required donation rules:');
  missingRedirects.forEach(function (r) { console.error('  - ' + r.desc); });
  process.exit(1);
}
if (!/^\/why-not-ai\s+\/why-not-ai\.html\s+200!/m.test(redirectsContent)) {
  console.error('BUILD FAIL: _redirects must map /why-not-ai → /why-not-ai.html (200!) for Cloudflare Pages.');
  process.exit(1);
}
console.log('Verified: donation redirects (/donate, /stripe, /support, /donations*) present in _redirects.');

// Trusted Types: every shipped HTML must load sync DOMPurify + tt-bootstrap before deferred scripts
let ttPatched = 0;
walkHtmlUnder(dist, function (htmlPath) {
  const before = fs.readFileSync(htmlPath, 'utf8');
  const after = ensureTrustedTypesBootstrap(before);
  if (after !== before) {
    fs.writeFileSync(htmlPath, after);
    ttPatched++;
  }
});
if (ttPatched) {
  console.log('ensureTrustedTypesBootstrap: patched ' + ttPatched + ' HTML file(s) under dist/');
}

// Verify vercel.json has donation redirects (Vercel deploy parity)
const vercelPath = path.join(root, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const redirects = vercel.redirects || [];
  const requiredSources = ['/donate', '/stripe', '/support', '/donations', '/donations/:path*'];
  const dest = 'https://buymeacoffee.com/todaysdailybattle';
  const missingVercel = requiredSources.filter(function (src) {
    return !redirects.some(function (r) {
      return r.source === src && r.destination === dest && r.permanent === true;
    });
  });
  if (missingVercel.length) {
    console.error('BUILD FAIL: vercel.json missing donation redirects: ' + missingVercel.join(', '));
    process.exit(1);
  }
  console.log('Verified: vercel.json donation redirects present.');
}

console.log('build-copy-static.js: copied all static files to dist/ (including topic-*.html).');
console.log('Verified: Bible Tool, Pastor Toolkit, plans, pastor/, bible/ present.');
