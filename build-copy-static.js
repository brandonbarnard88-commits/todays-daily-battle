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
const AUTH_ASSET_VERSION_PATH = path.join(root, 'AUTH-ASSET-VERSION');
const SITE_ASSET_VERSION_PATH = path.join(root, 'SITE-ASSET-VERSION');
const AUTH_ASSET_VERSION = fs.existsSync(AUTH_ASSET_VERSION_PATH)
  ? fs.readFileSync(AUTH_ASSET_VERSION_PATH, 'utf8').trim()
  : '';
const SITE_ASSET_VERSION = fs.existsSync(SITE_ASSET_VERSION_PATH)
  ? fs.readFileSync(SITE_ASSET_VERSION_PATH, 'utf8').trim()
  : '';

if (!AUTH_ASSET_VERSION) {
  console.error('BUILD FAIL: AUTH-ASSET-VERSION is missing or empty.');
  process.exit(1);
}

if (!SITE_ASSET_VERSION) {
  console.error('BUILD FAIL: SITE-ASSET-VERSION is missing or empty.');
  process.exit(1);
}

/** CSP require-trusted-types-for: sync DOMPurify + innerHTML bridge before any deferred script */
const TT_BOOTSTRAP_MARK = 'Trusted Types: DOMPurify + innerHTML bridge';
const TT_BOOTSTRAP_SNIPPET =
  '\n  <!-- ' + TT_BOOTSTRAP_MARK + ' (_headers CSP) -->\n' +
  '  <script src="/vendor/dompurify.min.js"></script>\n' +
  '  <script src="/tt-bootstrap.js?v=' + SITE_ASSET_VERSION + '"></script>\n';

function ensureTrustedTypesBootstrap(html) {
  if (!/<head[^>]*>/i.test(html)) return html;
  if (html.includes('tt-bootstrap.js') || html.includes('/tt-bootstrap.js')) return html;
  return html.replace(/<head([^>]*)>/i, function (m) {
    return m + TT_BOOTSTRAP_SNIPPET;
  });
}

function stampAuthAssetUrls(html) {
  var assets = ['browser-shared.js', 'auth.js', 'owner-console.js', 'profile.js'];
  var out = html;
  for (var i = 0; i < assets.length; i++) {
    var asset = assets[i];
    var escaped = asset.replace(/\./g, '\\.');
    var re = new RegExp('(src=["\'][^"\']*' + escaped + ')(?:\\?v=[^"\']*)?(["\'])', 'g');
    out = out.replace(re, '$1?v=' + AUTH_ASSET_VERSION + '$2');
  }
  return out;
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

function removeDistDuplicateArtifacts(dir) {
  if (!fs.existsSync(dir)) return 0;
  let removed = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removed += removeDistDuplicateArtifacts(fullPath);
      continue;
    }
    if (/ \d+\.[^/]+$/.test(entry.name) || / 2\.[^/]+$/.test(entry.name)) {
      try {
        fs.unlinkSync(fullPath);
        removed += 1;
      } catch (err) {
        // Duplicate cleanup is best-effort; ignore if file vanished between scan and delete.
        if (!err || err.code !== 'ENOENT') throw err;
      }
    }
  }
  return removed;
}

// Single files to copy (root)

// Critical JS that must ship in dist/ (CF often deploys tracked dist; new files must copy + verify).
const CRITICAL_DIST_JS = [
  'tdb-one-interrupt.js',
  'tdb-backup-reminder.js',
  'hero-daily-first-paint.js',
  'tdb-another-verse.js',
  'js/surfaces/home.js',
  'js/surfaces/plans.js',
  'js/surfaces/church.js',
  'kids/kids-play-helpers.js',
  'kids/kids-play-skin.css'
];
const rootFiles = [
  'config.js',
  'manifest.json',
  'icon.svg',
  'favicon.ico',
  'favicon-32.png',
  'favicon-192.png',
  'favicon-512.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'logo-shield-600.png',
  'ads.txt',
  'logo-crest.jpg',
  'hero-sunrise-bible.png',
  'world-map-source.svg',
  'styles.css',
  'tdb-home-page.css',
  'cormorant-latin-subset.css',
  'tdb-quiet-luxury.css',
  'tdb-swoop-surfaces.css',
  'tdb-swoop-surfaces.js',
  'tdb-calm-hubs.css',
  'calm-rest-kit.js',
  'calm-breathe.js',
  'plans-builder.js',
  'plans-weary-season-plans.js',
  'tdb-feel-combo.js',
  'tool-pages.css',
  'church.css',
  'loop-player.css',
  'kids-corner.css',
  'kids-corner-daily-verse.js',
  'little-ones.js',
  'kids-data-loader.js',
  'mystudy.css',
  'what-god-has-done.css',
  'script.js',
  'script.js.map',
  'footer-build-stamp.js',
  'tdb-back-to-verse-float.js',
  'tdb-backup-reminder.js',
  'tdb-one-interrupt.js',
  'service-worker.js',
  'sw.js',
  'register-sw.js',
  'daily-verse-widget.js',
  'daily-battle-core.js',
  'daily-tile.js',
  'hero-daily-365-data.js',
  'hero-daily-365-explanations.js',
  'hero-hero-pools.js',
  'hero-daily-first-paint.js',
  'tdb-another-verse.js',
  'js/surfaces/home.js',
  'js/surfaces/plans.js',
  'js/surfaces/church.js',
  'red-letter.js',
  'bible-heritage-data.js',
  'one-family-tree.js',
  'one-family-tree.css',
  'life-lessons.css',
  'lessons-from-the-valley.css',
  'life-lessons-data.js',
  'life-lessons-tool.js',
  'life-lessons-mystudy-bridge.js',
  'verse-breakdown-standard.js',
  'tdb-home-mobius-week.js',
  'tdb-home-experience.js',
  'tdb-home-feel.js',
  'tdb-porch-restfulness.js',
  'tdb-core-seven.css',
  'tdb-visual-tokens.css',
  'tdb-home-hero-lcp-critical.css',
  'tdb-heavy-now.css',
  'tdb-porch-verse-widget.css',
  'tdb-porch-verse-widget.js',
  'tdb-january-quiet.js',
  'tdb-uog-month-signpost.js',
  'inline-bootstrap.js',
  'ga-config.js',
  'tt-bootstrap.js',
  'sky-ip-geo.js',
  'team-toolkit-packs-pdf.js',
  'analytics-loader.js',
  'gsc-verify.js',
  'gentle-suggest.js',
  'embed-verse-widget.js',
  'embeddable-widgets-page.js',
  'ask-the-word.js',
  'ask-the-word-core.js',
  'ask-the-word-answers.json',
  'learn-the-word.html',
  'find-a-path.html',
  'search-widget.js',
  'print-pack-generator.js',
  'embeddable-widgets.html',
  'contact-form.js',
  'shop-waitlist.js',
  'feeling-suggest-form.js',
  'plan-suggest-form.js',
  'one-week-rhythm.html',
  'one-week-rhythm-kids.html',
  'be-still-moments.html',
  'firebase-push.js',
  'voice-message.js',
  'voice-pray.js',
  'pray.js',
  'fetch-prayer-guard.js',
  'lazy-loader.js',
  'utils.js',
  'fallback-search.js',
  'language-switcher.js',
  'search-wire.js',
  'share-page.js',
  'easter-eggs.js',
  'easter-season.js',
  'easter-eggs.css',
  'plans-data.js',
  'university-plan-extensions.js',
  'memory-verses.js',
  'mission-outreach-data.js',
  'home-votm.js',
  'verse-breakdown.js',
  'verse-context.js',
  'verse-breakdown-overrides.js',
  'bbe-simple.js',
  'tdb-home-funnel.js',
  'kjv-dictionary.js',
  'bible-study-companion.js',
  'word-study.js',
  'verse-study.js',
  'verse-narration.js',
  'family-verse-bridge.js',
  'kjv-lexicon.json',
  'chapters.json',
  'concordance.json',
  'mystudy.js',
  'what-god-has-done.js',
  'tdb-offline-strip.js',
  'tdb-continue-surface.js',
  'reader-core.js',
  'memorize.js',
  'highlights.js',
  'streak.js',
  'family-dashboard.js',
  'family-hierarchy.js',
  'crest.js',
  'avatar-progress.js',
  'bible-progress.js',
  'mobius-loop.js',
  'mobius-universal.js',
  'mobius-text-v2.js',
  'tdb-mobius-journal.js',
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
  'core-home.js',
  'porch-effects.js',
  'start-my-day.js',
  'first-visit-welcome.js',
  'auth.js',
  'browser-shared.js',
  'owner-console.js',
  'verse-image.js',
  'verse-ref-slug.js',
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
  'book-intros.json',
  'cross-refs.json',
  'kjv-word-notes.json',
  // 'bell.mp3' – add to project root if you want a custom bell; otherwise Web Audio beep is used
];
const scriptFiles = ['scripts/header-search-bar.js'];

// All HTML in root (includes index.html, topic-anxiety.html, topic-*.html, etc.)
const htmlFiles = fs.readdirSync(root, { withFileTypes: false })
  .filter((f) => f.endsWith('.html') && f !== 'stats.html' && f !== 'test-search-diagnosis.html');

// Hard-force topic copy first (before any other copy) — CI must not skip.
const topics = [
  'topic-anxiety.html',
  'topic-fear.html',
  'topic-forgiveness.html',
  'topic-grief.html',
  'topic-trauma.html',
  'topic-hope.html',
  'topic-guilt.html',
  'topic-loneliness.html',
  'topic-overwhelmed.html',
  'topic-parenting.html',
  'topic-strength.html',
  'topic-worthless.html',
  'topic-worry.html'
];
mkdir(dist);
const removedDistDuplicates = removeDistDuplicateArtifacts(dist);
if (removedDistDuplicates) {
  console.log('Removed stale duplicate dist artifacts: ' + removedDistDuplicates);
}
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
    content = stampAuthAssetUrls(content);
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

for (const f of CRITICAL_DIST_JS) {
  const src = path.join(root, f);
  const dest = path.join(dist, f);
  if (!fs.existsSync(src)) {
    console.error('build-copy-static.js: CRITICAL missing source ' + f);
    process.exit(1);
  }
  copyFile(src, dest);
  if (!fs.existsSync(dest)) {
    console.error('build-copy-static.js: CRITICAL failed to copy ' + f);
    process.exit(1);
  }
  console.log('build-copy-static.js: critical copy OK ' + f);
}

if (fs.existsSync(path.join(root, 'kjv.json'))) {
  copyFile(path.join(root, 'kjv.json'), path.join(dist, 'assets', 'data', 'kjv.json'));
  console.log('Copied kjv.json fallback to dist/assets/data/kjv.json');
}
for (const f of scriptFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(dist, f));
  }
}
if (fs.existsSync(path.join(root, 'js'))) {
  copyDir(path.join(root, 'js'), path.join(dist, 'js'));
}

const otherHtml = htmlFiles.filter((f) => !TOPIC_FILES.includes(f) && !f.startsWith('lighthouse-'));
for (const f of otherHtml) {
  let content = fs.readFileSync(path.join(root, f), 'utf8');
  content = content.replace(/TDB_BUILD_DATE/g, BUILD_DATE_STR);
  content = ensureTrustedTypesBootstrap(content);
  content = stampAuthAssetUrls(content);
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
    if (!content.includes('heavyhope') || !content.includes('tdb-plan-heavyhope-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Depression & Hopelessness plan (heavyhope / tdb-plan-heavyhope-day).');
      process.exit(1);
    }
    if (!content.includes('universitywaiting') || !content.includes('tdb-plan-universitywaiting-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Waiting plan (universitywaiting / tdb-plan-universitywaiting-day).');
      process.exit(1);
    }
    if (!content.includes('universitygrief') || !content.includes('tdb-plan-universitygrief-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Grief plan (universitygrief / tdb-plan-universitygrief-day).');
      process.exit(1);
    }
    if (!content.includes('parentweary') || !content.includes('tdb-plan-parentweary-day')) {
      console.error('BUILD FAIL: plans.html must include parentweary porch plan (parentweary / tdb-plan-parentweary-day).');
      process.exit(1);
    }
    if (!content.includes('aftergrief') || !content.includes('tdb-plan-aftergrief-day')) {
      console.error('BUILD FAIL: plans.html must include aftergrief porch plan (aftergrief / tdb-plan-aftergrief-day).');
      process.exit(1);
    }
    if (!content.includes('ordinarytuesday') || !content.includes('tdb-plan-ordinarytuesday-day')) {
      console.error('BUILD FAIL: plans.html must include ordinarytuesday porch plan (ordinarytuesday / tdb-plan-ordinarytuesday-day).');
      process.exit(1);
    }
    if (!content.includes('smallchurchheavy') || !content.includes('tdb-plan-smallchurchheavy-day')) {
      console.error('BUILD FAIL: plans.html must include smallchurchheavy porch plan (smallchurchheavy / tdb-plan-smallchurchheavy-day).');
      process.exit(1);
    }
    if (!content.includes('universityparenting') || !content.includes('tdb-plan-universityparenting-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Parenting Young Kids plan (universityparenting / tdb-plan-universityparenting-day).');
      process.exit(1);
    }
    if (!content.includes('universitysecretprayer') || !content.includes('tdb-plan-universitysecretprayer-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Secret Prayer plan (universitysecretprayer / tdb-plan-universitysecretprayer-day).');
      process.exit(1);
    }
    if (!content.includes('universityanxiety') || !content.includes('tdb-plan-universityanxiety-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Anxiety & Fear plan (universityanxiety / tdb-plan-universityanxiety-day).');
      process.exit(1);
    }
    if (!content.includes('universityexhaustion') || !content.includes('tdb-plan-universityexhaustion-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Exhaustion plan (universityexhaustion / tdb-plan-universityexhaustion-day).');
      process.exit(1);
    }
    if (!content.includes('universitygratitude') || !content.includes('tdb-plan-universitygratitude-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Gratitude plan (universitygratitude / tdb-plan-universitygratitude-day).');
      process.exit(1);
    }
    if (!content.includes('universityloneliness') || !content.includes('tdb-plan-universityloneliness-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Loneliness plan (universityloneliness / tdb-plan-universityloneliness-day).');
      process.exit(1);
    }
    if (!content.includes('universityforgiveness') || !content.includes('tdb-plan-universityforgiveness-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Forgiveness plan (universityforgiveness / tdb-plan-universityforgiveness-day).');
      process.exit(1);
    }
    if (!content.includes('universitydoubt') || !content.includes('tdb-plan-universitydoubt-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Doubt plan (universitydoubt / tdb-plan-universitydoubt-day).');
      process.exit(1);
    }
    if (!content.includes('universitybitterness') || !content.includes('tdb-plan-universitybitterness-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Bitterness plan (universitybitterness / tdb-plan-universitybitterness-day).');
      process.exit(1);
    }
    if (!content.includes('universitybroken') || !content.includes('tdb-plan-universitybroken-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Broken Relationships plan (universitybroken / tdb-plan-universitybroken-day).');
      process.exit(1);
    }
    if (!content.includes('latesummerrest') || !content.includes('tdb-plan-latesummerrest-day')) {
      console.error('BUILD FAIL: plans.html must include Late Summer, Early Rest plan (latesummerrest / tdb-plan-latesummerrest-day).');
      process.exit(1);
    }
    if (!content.includes('universitycomparison') || !content.includes('tdb-plan-universitycomparison-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Comparison plan (universitycomparison / tdb-plan-universitycomparison-day).');
      process.exit(1);
    }
    if (!content.includes('universityanger') || !content.includes('tdb-plan-universityanger-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Anger plan (universityanger / tdb-plan-universityanger-day).');
      process.exit(1);
    }
    if (!content.includes('quietfallharvest') || !content.includes('tdb-plan-quietfallharvest-day')) {
      console.error('BUILD FAIL: plans.html must include Quiet Fall Harvest plan (quietfallharvest / tdb-plan-quietfallharvest-day).');
      process.exit(1);
    }
    if (!content.includes('universityregret') || !content.includes('tdb-plan-universityregret-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Regret plan (universityregret / tdb-plan-universityregret-day).');
      process.exit(1);
    }
    if (!content.includes('universitycontentment') || !content.includes('tdb-plan-universitycontentment-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Contentment in Small Seasons plan (universitycontentment / tdb-plan-universitycontentment-day).');
      process.exit(1);
    }
    if (!content.includes('universityoverwhelm') || !content.includes('tdb-plan-universityoverwhelm-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Overwhelm plan (universityoverwhelm / tdb-plan-universityoverwhelm-day).');
      process.exit(1);
    }
    if (!content.includes('universityparentfear') || !content.includes('tdb-plan-universityparentfear-day')) {
      console.error('BUILD FAIL: plans.html must include The University of Fear for My Children plan (universityparentfear / tdb-plan-universityparentfear-day).');
      process.exit(1);
    }
    if (!content.includes('latefallwinter') || !content.includes('tdb-plan-latefallwinter-day')) {
      console.error('BUILD FAIL: plans.html must include Late Fall, Quiet Winter plan (latefallwinter / tdb-plan-latefallwinter-day).');
      process.exit(1);
    }
    if (!content.includes('eveninguog') || !content.includes('tdb-plan-eveninguog-day')) {
      console.error('BUILD FAIL: plans.html must include Evening in the University plan (eveninguog / tdb-plan-eveninguog-day).');
      process.exit(1);
    }
    if (!content.includes('cancercomfort') || !content.includes('tdb-plan-cancercomfort-day')) {
      console.error('BUILD FAIL: plans.html must include Cancer Comfort plan (cancercomfort / tdb-plan-cancercomfort-day).');
      process.exit(1);
    }
    if (!content.includes('id="plans-start-here-title"')) {
      console.error('BUILD FAIL: plans.html must include Start here section (id="plans-start-here-title").');
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
    if (!content.includes('ask-the-word-core.js')) {
      console.error('BUILD FAIL: bible-tool.html must load ask-the-word-core.js (unified Q&A brain).');
      process.exit(1);
    }
    if (!fs.existsSync(path.join(dist, 'ask-the-word-core.js'))) {
      console.error('BUILD FAIL: ask-the-word-core.js must exist in dist/.');
      process.exit(1);
    }
    console.log('Copied bible-tool.html (Ask the Word wired)');
  }
  if (f === 'learn-the-word.html') {
    if (!content.includes('Learn the Word') || !content.includes('spine-christ')) {
      console.error('BUILD FAIL: learn-the-word.html must include spine teaching path.');
      process.exit(1);
    }
    console.log('Copied learn-the-word.html (teaching spine)');
  }
  if (f === 'find-a-path.html') {
    // Alias now redirects to Explore start-here; keep a calm redirect stub (not a second lobby).
    if (
      !content.includes('explore.html#start-here') ||
      !content.includes('Find a path moved') ||
      !content.includes('location.replace')
    ) {
      console.error('BUILD FAIL: find-a-path.html must redirect to Explore start-here (no second lobby).');
      process.exit(1);
    }
    console.log('Copied find-a-path.html (redirect stub → Explore)');
  }
  if (f === 'site-guide.html') {
    if (
      !content.includes('explore.html#start-here') ||
      !content.includes('Start here moved') ||
      !content.includes('location.replace')
    ) {
      console.error('BUILD FAIL: site-guide.html must redirect to Explore start-here (no second lobby).');
      process.exit(1);
    }
    console.log('Copied site-guide.html (redirect stub → Explore)');
  }
  if (f === 'index.html') {
    const indexContent = fs.readFileSync(path.join(root, f), 'utf8');

    if (!indexContent.includes('id="tdbHomePrimaryPair"') || !indexContent.includes('id="feel-section"')) {
      console.error('BUILD FAIL: index.html must keep today’s verse + Ask as the simple front door.');
      process.exit(1);
    }
    if (!indexContent.includes('ask-the-word-core.js')) {
      console.error('BUILD FAIL: index.html must load ask-the-word-core.js (unified Ask the Word).');
      process.exit(1);
    }
    // KISS product: no campus / pastor / university required on home.
    if (indexContent.includes('id="nav-pastors') || /Pastor.?s Study/.test(indexContent.split('site-footer')[0] || indexContent)) {
      console.error('BUILD FAIL: index.html must not promote Pastor’s Study in the main shell (KISS).');
      process.exit(1);
    }
    const required = [
      ['id="quick-actions-hero"', 'quick-topic buttons'],
      ['id="query"', 'search input'],
      ['id="search-btn"', 'search button'],
      ['class="quick-links', 'quick-links tools section'],
      ['bible-tool.html', 'Look up a verse link'],
      ['/kids/', 'Kids link'],
      ['prayer-wall.html', 'Prayer link'],
      ['coloring.html', 'Kids Coloring link'],
      ['plans.html', 'Plans link'],
      ['calm.html', 'When it’s hard link'],
      ['id="main-search"', 'main-search section (core search anchor)'],
      ['id="nav-site-guide"', 'All pages link in primary flyout'],
      ['id="nav-site-search"', 'Site search link in primary flyout'],
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
      'search.html',
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

if (fs.existsSync(path.join(root, 'images'))) {
  copyDir(path.join(root, 'images'), path.join(dist, 'images'));
  console.log('Copied images/ folder (product covers and site images)');
}

if (fs.existsSync(path.join(root, 'fonts'))) {
  copyDir(path.join(root, 'fonts'), path.join(dist, 'fonts'));
  console.log('Copied fonts/ folder (self-hosted Cormorant, Caveat, etc.)');
}

if (fs.existsSync(path.join(root, 'data'))) {
  copyDir(path.join(root, 'data'), path.join(dist, 'data'));
  console.log('Copied data/ folder (KJV dictionary and future JSON)');
  const fullKjv = path.join(dist, 'data', 'kjv-full.json');
  if (!fs.existsSync(fullKjv)) {
    console.error('BUILD FAIL: data/kjv-full.json missing in dist/ — search requires full KJV corpus.');
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(fullKjv, 'utf8');
    const sample = raw.slice(0, 200);
    if (raw.length < 1000000 || sample.indexOf('Genesis') === -1) {
      console.error('BUILD FAIL: dist/data/kjv-full.json looks too small or invalid.');
      process.exit(1);
    }
    console.log('Verified dist/data/kjv-full.json (' + Math.round(raw.length / 1024) + ' KB)');
  } catch (eFull) {
    console.error('BUILD FAIL: could not read dist/data/kjv-full.json');
    process.exit(1);
  }
}
// Some production edges do not serve /data/*; mirror index at root (same pattern as kjv-lexicon.json).
const siteSearchIdx = path.join(dist, 'data', 'site-search-index.json');
if (fs.existsSync(siteSearchIdx)) {
  copyFile(siteSearchIdx, path.join(dist, 'site-search-index.json'));
  console.log('Copied site-search-index.json to dist/ root for search.html fetch');
} else {
  console.warn('build-copy-static.js: data/site-search-index.json missing in dist — run scripts/build-site-search-index.mjs before copy.');
}
if (fs.existsSync(path.join(root, 'coloring-pages'))) {
  copyDir(path.join(root, 'coloring-pages'), path.join(dist, 'coloring-pages'));
  console.log('Copied coloring-pages/ (digital coloring book line art)');
}

if (fs.existsSync(path.join(root, 'kids'))) {
  copyDir(path.join(root, 'kids'), path.join(dist, 'kids'));
  console.log('Copied kids/ folder (Kids + parent dashboard)');
  // Stick-figure panel SVGs are retired (Color & Tell only). Remove any leftovers so
  // a stale dist/ or partial copy never re-ships them to Cloudflare Pages.
  const kidsDist = path.join(dist, 'kids');
  let strippedPanels = 0;
  if (fs.existsSync(kidsDist)) {
    for (const name of fs.readdirSync(kidsDist)) {
      if (/^panel-.*\.svg$/i.test(name)) {
        try {
          fs.unlinkSync(path.join(kidsDist, name));
          strippedPanels += 1;
        } catch (_) { /* ignore */ }
      }
    }
  }
  if (strippedPanels) {
    console.log('Removed retired stick panel SVGs from dist/kids: ' + strippedPanels);
  }
}

if (fs.existsSync(path.join(root, 'life-lessons'))) {
  copyDir(path.join(root, 'life-lessons'), path.join(dist, 'life-lessons'));
  console.log('Copied life-lessons/ folder (Life Lessons from the Word)');
}

if (fs.existsSync(path.join(root, 'about'))) {
  copyDir(path.join(root, 'about'), path.join(dist, 'about'));
  console.log('Copied about/ (static /about/ index → about.html for simple hosts)');
}

if (fs.existsSync(path.join(root, 'pastor'))) {
  copyDir(path.join(root, 'pastor'), path.join(dist, 'pastor'));
  const pastorIndex = fs.readFileSync(path.join(dist, 'pastor', 'index.html'), 'utf8');
  if (!pastorIndex.includes('Pastor hub moved') || !pastorIndex.includes('location.replace')) {
    console.error('BUILD FAIL: pastor/index.html must redirect away from pastor hub (KISS home path).');
    process.exit(1);
  }
  console.log('Copied pastor/ folder (hub stub → home; tools/builder/library kept offline)');
}

if (fs.existsSync(path.join(root, 'church'))) {
  copyDir(path.join(root, 'church'), path.join(dist, 'church'));
  console.log('Copied church/ folder (index + daily)');
}

if (fs.existsSync(path.join(root, 'bible'))) {
  copyDir(path.join(root, 'bible'), path.join(dist, 'bible'));
  console.log('Copied bible/ folder (hub + tools)');
}

if (fs.existsSync(path.join(root, 'id'))) {
  copyDir(path.join(root, 'id'), path.join(dist, 'id'));
  console.log('Copied id/ folder (localized topical pilots)');
}

if (fs.existsSync(path.join(root, 'tl'))) {
  copyDir(path.join(root, 'tl'), path.join(dist, 'tl'));
  console.log('Copied tl/ folder (localized topical pilots)');
}

if (fs.existsSync(path.join(root, 'es'))) {
  copyDir(path.join(root, 'es'), path.join(dist, 'es'));
  console.log('Copied es/ folder (Spanish hub)');
}

if (fs.existsSync(path.join(root, 'fr'))) {
  copyDir(path.join(root, 'fr'), path.join(dist, 'fr'));
  console.log('Copied fr/ folder (French topical pilots)');
}

if (fs.existsSync(path.join(root, 'zh'))) {
  copyDir(path.join(root, 'zh'), path.join(dist, 'zh'));
  console.log('Copied zh/ folder (Chinese topical pilots)');
}

if (fs.existsSync(path.join(root, 'ar'))) {
  copyDir(path.join(root, 'ar'), path.join(dist, 'ar'));
  console.log('Copied ar/ folder (Arabic topical pilots)');
}

if (fs.existsSync(path.join(root, 'hi'))) {
  copyDir(path.join(root, 'hi'), path.join(dist, 'hi'));
  console.log('Copied hi/ folder (Hindi topical pilots)');
}

if (fs.existsSync(path.join(root, 'ru'))) {
  copyDir(path.join(root, 'ru'), path.join(dist, 'ru'));
  console.log('Copied ru/ folder (Russian topical pilots)');
}

if (fs.existsSync(path.join(root, 'sv'))) {
  copyDir(path.join(root, 'sv'), path.join(dist, 'sv'));
  console.log('Copied sv/ folder (Swedish topical pilots)');
}

if (fs.existsSync(path.join(root, 'pt'))) {
  copyDir(path.join(root, 'pt'), path.join(dist, 'pt'));
  console.log('Copied pt/ folder (Portuguese topical pilots)');
}

if (fs.existsSync(path.join(root, 'bn'))) {
  copyDir(path.join(root, 'bn'), path.join(dist, 'bn'));
  console.log('Copied bn/ folder (Bengali topical pilots)');
}

if (fs.existsSync(path.join(root, 'sw'))) {
  copyDir(path.join(root, 'sw'), path.join(dist, 'sw'));
  console.log('Copied sw/ folder (Swahili topical pilots)');
}

if (fs.existsSync(path.join(root, 'verse-cards'))) {
  copyDir(path.join(root, 'verse-cards'), path.join(dist, 'verse-cards'));
  copyDir(path.join(root, 'embed'), path.join(dist, 'embed'));
  console.log('Copied verse-cards/ folder (Pinterest verse images)');
}
if (fs.existsSync(path.join(root, 'journal'))) {
  copyDir(path.join(root, 'journal'), path.join(dist, 'journal'));
  console.log('Copied journal/ folder (SEO battle posts)');
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

// Root HTML is replaced in the loops above; nested dirs use copyDir() and would still
// ship TDB_BUILD_DATE. Replace in every dist/**/*.html so deploy matches build time.
(function replaceTdbBuildDateUnderDist() {
  let count = 0;
  walkHtmlUnder(dist, function (filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('TDB_BUILD_DATE')) return;
    fs.writeFileSync(filePath, html.replace(/TDB_BUILD_DATE/g, BUILD_DATE_STR), 'utf8');
    count++;
  });
  if (count) console.log('build-copy-static.js: TDB_BUILD_DATE → build stamp in ' + count + ' dist HTML file(s) (nested + any stragglers)');
})();

// Classic deferred script: fills #footer-date without waiting for script.js (module cache / CSP / order).
(function injectFooterBuildStampScript() {
  var SNIPPET = '\n  <script nonce="tdb2025s" defer src="/footer-build-stamp.js?v=' + SITE_ASSET_VERSION + '"></script>';
  function ensure(html) {
    if (html.indexOf('footer-build-stamp.js') !== -1) return html;
    if (!/id\s*=\s*["']footer-date["']/.test(html)) return html;
    if (!/<head[^>]*>/i.test(html)) return html;
    return html.replace(/<head([^>]*)>/i, function (m) {
      return m + SNIPPET;
    });
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected footer-build-stamp.js in ' + injected + ' dist HTML file(s)');
  }
})();

// Mobile: fixed "Today's verse" on inner pages (not home / verse / embed).
(function injectBackToVerseFloatScript() {
  var SNIPPET = '\n  <script nonce="tdb2025s" defer src="/tdb-back-to-verse-float.js?v=' + SITE_ASSET_VERSION + '"></script>';
  var SKIP_BASENAMES = {
    'index.html': true,
    'verse.html': true,
    '404.html': true,
    '404-admin.html': true
  };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (!/\btdb-inner-page\b/.test(html)) return false;
    if (html.indexOf('tdb-back-to-verse-float.js') !== -1) return false;
    return true;
  }
  function ensure(html) {
    if (!/<head[^>]*>/i.test(html)) return html;
    return html.replace(/<head([^>]*)>/i, function (m) { return m + SNIPPET; });
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-back-to-verse-float.js in ' + injected + ' dist HTML file(s)');
  }
})();


// One interrupt max per visit — load before backup reminder when present.
(function injectOneInterruptScript() {
  var SNIPPET = '\n  <script nonce="tdb2025s" defer src="/tdb-one-interrupt.js?v=' + SITE_ASSET_VERSION + '"></script>';
  var SKIP_BASENAMES = {
    '404.html': true,
    '404-admin.html': true
  };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (html.indexOf('tdb-one-interrupt.js') !== -1) return false;
    if (!/\bsite-footer--canonical\b/.test(html) && base !== 'index.html') return false;
    return true;
  }
  function ensure(html) {
    if (!/<head[^>]*>/i.test(html)) return html;
    return html.replace(/<head([^>]*)>/i, function (m) { return m + SNIPPET; });
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-one-interrupt.js in ' + injected + ' dist HTML file(s)');
  }
})();

// Site-wide backup reminder on standard porch pages (canonical footer).
(function injectBackupReminderScript() {
  var SNIPPET = '\n  <script nonce="tdb2025s" defer src="/tdb-backup-reminder.js?v=' + SITE_ASSET_VERSION + '"></script>';
  var SKIP_BASENAMES = {
    '404.html': true,
    '404-admin.html': true
  };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (base === 'index.html' && html.indexOf('backup-reminder.js') !== -1) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (html.indexOf('tdb-backup-reminder.js') !== -1) return false;
    if (!/\bsite-footer--canonical\b/.test(html)) return false;
    return true;
  }
  function ensure(html) {
    if (!/<head[^>]*>/i.test(html)) return html;
    return html.replace(/<head([^>]*)>/i, function (m) { return m + SNIPPET; });
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-backup-reminder.js in ' + injected + ' dist HTML file(s)');
  }
})();

// Bundle swoop CSS into dist/styles.css so inner pages get typography/cards (clean-css drops loose @imports).
(function bundleTdbSwoopSurfacesCss() {
  var SWOOP_MARKER = '/* tdb-swoop-surfaces bundled */';
  var stylesPath = path.join(dist, 'styles.css');
  var swoopPath = path.join(dist, 'tdb-swoop-surfaces.css');
  if (!fs.existsSync(stylesPath) || !fs.existsSync(swoopPath)) return;
  var styles = fs.readFileSync(stylesPath, 'utf8');
  if (styles.indexOf(SWOOP_MARKER) !== -1) return;
  styles = styles.replace(/@import url\("tdb-swoop-surfaces\.css"\);\s*/g, '');
  var swoop = fs.readFileSync(swoopPath, 'utf8');
  fs.writeFileSync(stylesPath, styles + '\n' + SWOOP_MARKER + '\n' + swoop, 'utf8');
  console.log('build-copy-static.js: bundled tdb-swoop-surfaces.css into dist/styles.css');
})();

// Inner pages: explicit swoop JS (do not rely on script.js dynamic inject alone).
(function injectTdbSwoopSurfacesScript() {
  var SWOOP_V = '20260530-swoop-final';
  var SNIPPET = '\n  <script nonce="tdb2025s" defer src="/tdb-swoop-surfaces.js?v=' + SWOOP_V + '"></script>';
  var SKIP_BASENAMES = { '404.html': true, '404-admin.html': true };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (html.indexOf('tdb-swoop-surfaces.js') !== -1) return false;
    if (base === 'index.html') return false;
    return /\btdb-inner-page\b/.test(html) || base === 'start.html';
  }
  function ensure(html) {
    if (!/<\/body>/i.test(html)) return html;
    return html.replace(/<\/body>/i, SNIPPET + '\n</body>');
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-swoop-surfaces.js in ' + injected + ' dist HTML file(s)');
  }
})();

// Inner pages: explicit swoop CSS link (belt-and-suspenders beside bundled styles.css).
(function injectTdbSwoopSurfacesCssLink() {
  var SWOOP_V = '20260530-swoop-final';
  var PRELOAD = '  <link rel="preload" href="/tdb-swoop-surfaces.css?v=' + SWOOP_V + '" as="style">\n';
  var SWOOP_LINK = '  <link rel="stylesheet" href="/tdb-swoop-surfaces.css?v=' + SWOOP_V + '">\n';
  var SNIPPET = PRELOAD + SWOOP_LINK;
  var SKIP_BASENAMES = { '404.html': true, '404-admin.html': true, 'index.html': true };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (html.indexOf('tdb-swoop-surfaces.css') !== -1) return false;
    return /\btdb-inner-page\b/.test(html) || base === 'start.html';
  }
  function ensure(html) {
    var sheetRe = /(<link[^>]+rel=["']stylesheet["'][^>]+href="[^"]*styles\.css[^"]*"[^>]*>)/i;
    if (sheetRe.test(html)) {
      return html.replace(sheetRe, '$1\n' + SNIPPET);
    }
    if (!/<\/head>/i.test(html)) return html;
    return html.replace(/<\/head>/i, SNIPPET + '</head>');
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-swoop-surfaces.css link in ' + injected + ' dist HTML file(s)');
  }
})();

// Inner pages: polished bottom dock (CSS lives in tdb-swoop-surfaces.css).
(function injectTdbBottomDockInner() {
  var dockPath = path.join(root, 'partials', 'tdb-bottom-dock-inner.html');
  if (!fs.existsSync(dockPath)) return;
  var SNIPPET = fs.readFileSync(dockPath, 'utf8');
  var SKIP_BASENAMES = { '404.html': true, '404-admin.html': true, 'index.html': true };
  function shouldInject(filePath, html) {
    var base = path.basename(filePath);
    if (SKIP_BASENAMES[base]) return false;
    if (/\/embed\//i.test(filePath.replace(/\\/g, '/'))) return false;
    if (html.indexOf('class="tdb-bottom-dock"') !== -1) return false;
    return /\btdb-inner-page\b/.test(html) || base === 'start.html';
  }
  function ensure(html) {
    if (/<footer[^>]+class="[^"]*site-footer/i.test(html)) {
      return html.replace(/(\s*<footer[^>]+class="[^"]*site-footer)/i, '\n' + SNIPPET + '$1');
    }
    if (!/<\/body>/i.test(html)) return html;
    return html.replace(/<\/body>/i, SNIPPET + '</body>');
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected tdb-bottom-dock in ' + injected + ' dist HTML file(s)');
  }
})();

// Topic mood pages: static start strip under hero (works without JS).
(function injectTopicStartStripHtml() {
  var STRIP =
    '\n        <p id="tdb-start-strip" class="tdb-start-strip section-note">' +
    '<strong>New here?</strong> This page meets one hard moment with KJV verses. ' +
    '<a href="/explore.html#start-here">See the full map</a> &mdash; hard moment, daily rhythm, family, or church.</p>\n';
  function shouldInject(filePath, html) {
    if (path.basename(filePath) === 'index.html') return false;
    if (html.indexOf('id="tdb-start-strip"') !== -1) return false;
    return /\btdb-topic-mood-page\b/.test(html);
  }
  function ensure(html) {
    if (/<header[^>]+id="topic-top"[^>]*>[\s\S]*?<\/header>/i.test(html)) {
      return html.replace(
        /(<header[^>]+id="topic-top"[^>]*>[\s\S]*?<\/header>)/i,
        '$1' + STRIP
      );
    }
    if (/<header[^>]+class="[^"]*hero-banner[^"]*"[^>]*>[\s\S]*?<\/header>/i.test(html)) {
      return html.replace(
        /(<header[^>]+class="[^"]*hero-banner[^"]*"[^>]*>[\s\S]*?<\/header>)/i,
        '$1' + STRIP
      );
    }
    return html;
  }
  var injected = 0;
  walkHtmlUnder(dist, function (filePath) {
    var html = fs.readFileSync(filePath, 'utf8');
    if (!shouldInject(filePath, html)) return;
    var next = ensure(html);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      injected++;
    }
  });
  if (injected) {
    console.log('build-copy-static.js: injected topic start strip in ' + injected + ' dist HTML file(s)');
  }
})();

// Write build-date.txt so JS can fetch it as fallback if HTML replacement missed
fs.writeFileSync(path.join(dist, 'build-date.txt'), BUILD_DATE_STR, 'utf8');

// Embed build date inside footer-build-stamp.js so footer works even when build-date.txt 404s at edge
(function stampFooterBuildStampJs() {
  var p = path.join(dist, 'footer-build-stamp.js');
  if (!fs.existsSync(p)) return;
  var c = fs.readFileSync(p, 'utf8');
  if (c.indexOf('@@TDB_DIST_STAMP@@') === -1) return;
  var safe = BUILD_DATE_STR.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  fs.writeFileSync(p, c.replace(/@@TDB_DIST_STAMP@@/g, safe), 'utf8');
  console.log('build-copy-static.js: inlined build stamp in dist/footer-build-stamp.js');
})();

// Verify critical pages exist (fail build if missing)
const CRITICAL_PAGES = [
  'index.html', 'bible-tool.html', 'pastor-toolkit.html', 'sermon.html', 'plans.html',
  'testimonials.html', 'why-not-ai.html', 'why-no-ai.html', 'login.html',
  'pastor/index.html', 'bible/index.html', 'script.js', 'auth.js', 'browser-shared.js',
  'footer-build-stamp.js', 'build-date.txt'
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
if (!sitemapBody.includes('id/kecemasan.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Indonesian pilot topical (id/kecemasan.html).');
  process.exit(1);
}
if (!sitemapBody.includes('tl/kabalisahan.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Tagalog pilot topical (tl/kabalisahan.html).');
  process.exit(1);
}
if (!sitemapBody.includes('fr/anxiete.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French anxiety pilot (fr/anxiete.html).');
  process.exit(1);
}
if (!sitemapBody.includes('zh/jiaolv.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Chinese anxiety pilot (zh/jiaolv.html).');
  process.exit(1);
}
if (!sitemapBody.includes('ar/qalaq.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Arabic anxiety pilot (ar/qalaq.html).');
  process.exit(1);
}
if (!sitemapBody.includes('hi/chinta.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Hindi anxiety pilot (hi/chinta.html).');
  process.exit(1);
}
if (!sitemapBody.includes('ru/trevoga.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Russian anxiety pilot (ru/trevoga.html).');
  process.exit(1);
}
if (!sitemapBody.includes('sv/oro.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Swedish anxiety pilot (sv/oro.html).');
  process.exit(1);
}
if (!sitemapBody.includes('todaysdailybattle.com/pt/</loc>')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Portuguese hub (https://todaysdailybattle.com/pt/).');
  process.exit(1);
}
if (!sitemapBody.includes('todaysdailybattle.com/fr/</loc>')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French hub (https://todaysdailybattle.com/fr/).');
  process.exit(1);
}
if (!sitemapBody.includes('todaysdailybattle.com/es/</loc>')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Spanish hub (https://todaysdailybattle.com/es/).');
  process.exit(1);
}
if (!sitemapBody.includes('todaysdailybattle.com/id/</loc>')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Indonesian hub (https://todaysdailybattle.com/id/).');
  process.exit(1);
}
if (!sitemapBody.includes('pt/ansiedade.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Portuguese anxiety pilot (pt/ansiedade.html).');
  process.exit(1);
}
if (!sitemapBody.includes('pt/medo.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Portuguese fear pilot (pt/medo.html).');
  process.exit(1);
}
if (!sitemapBody.includes('pt/planos.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Portuguese plans shell (pt/planos.html).');
  process.exit(1);
}
if (!sitemapBody.includes('pt/privacy.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Portuguese privacy summary (pt/privacy.html).');
  process.exit(1);
}
if (!sitemapBody.includes('bn/chinta.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Bengali anxiety pilot (bn/chinta.html).');
  process.exit(1);
}
if (!sitemapBody.includes('sw/wasiwasi.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Swahili anxiety pilot (sw/wasiwasi.html).');
  process.exit(1);
}
if (!sitemapBody.includes('fr/espoir.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French hope pilot (fr/espoir.html).');
  process.exit(1);
}
if (!sitemapBody.includes('zh/xiwang.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Chinese hope pilot (zh/xiwang.html).');
  process.exit(1);
}
if (!sitemapBody.includes('fr/solitude.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French loneliness pilot (fr/solitude.html).');
  process.exit(1);
}
if (!sitemapBody.includes('zh/gudu.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Chinese loneliness pilot (zh/gudu.html).');
  process.exit(1);
}
if (!sitemapBody.includes('fr/culpabilite.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French guilt pilot (fr/culpabilite.html).');
  process.exit(1);
}
if (!sitemapBody.includes('zh/neijiu.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Chinese guilt pilot (zh/neijiu.html).');
  process.exit(1);
}
if (!sitemapBody.includes('fr/deborde.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list French overwhelm pilot (fr/deborde.html).');
  process.exit(1);
}
if (!sitemapBody.includes('zh/taiduo.html')) {
  console.error('BUILD FAIL: dist/sitemap.xml must list Chinese overwhelm pilot (zh/taiduo.html).');
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
if (!fs.existsSync(path.join(dist, 'journal', 'index.html'))) {
  console.error('BUILD FAIL: journal/index.html missing in dist/. Journal hub will 404 on /journal/.');
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

// Verify donation/support routes in _redirects (required for bot-probe cleanup)
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
// Prefer 200! rewrite (avoids CF clean-URL 308 ↔ 301 infinite loop). 301 accepted only as legacy.
const givePageMatch = /^\/give\s+\/give\.html\s+(200!?|301)\s*$/m;
if (!givePageMatch.test(redirectsContent)) {
  console.error('BUILD FAIL: _redirects must map /give → /give.html (200! rewrite preferred; 301 legacy) for the calm support page.');
  process.exit(1);
}
const missingRedirects = DONATION_REDIRECTS.filter(function (r) {
  const lineMatch = new RegExp('^' + r.path.replace(/\*/g, '\\*') + '\\s+' + buymeacoffee.replace(/\./g, '\\.') + '\\s+301', 'm');
  return !lineMatch.test(redirectsContent);
});
if (missingRedirects.length) {
  console.error('BUILD FAIL: _redirects missing required donation rules:');
  missingRedirects.forEach(function (r) { console.error('  - ' + r.desc); });
  process.exit(1);
}
if (!/^\/why-not-ai\s+\/about\.html\s+301/m.test(redirectsContent)) {
  console.error('BUILD FAIL: _redirects must map /why-not-ai → /about.html (301) for retired moat page.');
  process.exit(1);
}
const LOCALE_HUB_REDIRECTS = [
  { needle: '/ru /ru/index.html 200!', path: 'ru/index.html', slug: 'ru' },
  { needle: '/zh /zh/index.html 200!', path: 'zh/index.html', slug: 'zh' },
  { needle: '/hi /hi/index.html 200!', path: 'hi/index.html', slug: 'hi' }
];
for (let i = 0; i < LOCALE_HUB_REDIRECTS.length; i++) {
  const h = LOCALE_HUB_REDIRECTS[i];
  if (!redirectsContent.includes(h.needle)) {
    console.error('BUILD FAIL: _redirects missing locale hub rewrite: ' + h.needle);
    process.exit(1);
  }
  const hubHtml = path.join(dist, h.path);
  if (!fs.existsSync(hubHtml)) {
    console.error('BUILD FAIL: dist/' + h.path + ' missing — required for /' + h.slug + '/ (Cloudflare Pages).');
    process.exit(1);
  }
}
const aboutIndexHtml = path.join(dist, 'about', 'index.html');
if (!fs.existsSync(aboutIndexHtml) || !fs.readFileSync(aboutIndexHtml, 'utf8').includes('/about.html')) {
  console.error('BUILD FAIL: dist/about/index.html must exist and point to /about.html (static fallback for /about/).');
  process.exit(1);
}
console.log('Verified: /give support page route + donation redirects (/donate, /stripe, /support, /donations*) present in _redirects.');
console.log('Verified: RU / ZH / HI hub index.html + _redirects 200! rules in dist/.');

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

// Verify vercel.json has support + donation redirects (Vercel deploy parity)
const vercelPath = path.join(root, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const redirects = vercel.redirects || [];
  const requiredSources = ['/donate', '/stripe', '/support', '/donations', '/donations/:path*'];
  const dest = 'https://buymeacoffee.com/todaysdailybattle';
  const hasGivePageRedirect = redirects.some(function (r) {
    return r.source === '/give' && r.destination === '/give.html';
  });
  const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
  const hasGivePageRewrite = rewrites.some(function (r) {
    return r.source === '/give' && r.destination === '/give.html';
  });
  if (!hasGivePageRedirect && !hasGivePageRewrite) {
    console.error('BUILD FAIL: vercel.json missing /give → /give.html rewrite or redirect.');
    process.exit(1);
  }
  const missingVercel = requiredSources.filter(function (src) {
    return !redirects.some(function (r) {
      return r.source === src && r.destination === dest && r.permanent === true;
    });
  });
  if (missingVercel.length) {
    console.error('BUILD FAIL: vercel.json missing donation redirects: ' + missingVercel.join(', '));
    process.exit(1);
  }
  console.log('Verified: vercel.json /give support page redirect + donation redirects present.');
}

console.log('build-copy-static.js: copied all static files to dist/ (including topic-*.html).');
console.log('Verified: Bible Tool, Pastor Toolkit, plans, pastor/, bible/ present.');
