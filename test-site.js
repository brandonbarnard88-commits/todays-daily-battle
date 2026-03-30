#!/usr/bin/env node
/**
 * Hard test of the static site: pages load, critical content present, search logic.
 * Run: node test-site.js
 *   With server: python3 -m http.server 8765 (in dist/), then node test-site.js
 *   Offline: node test-site.js --offline (reads from dist/)
 *
 * Manual smoke — Verse Study overlay: docs/SHIPPING-BAR.md (section “Verse Study overlay”).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const OFFLINE = process.argv.includes('--offline');
const BASE = 'http://127.0.0.1:8765';
const DIST = path.join(__dirname, 'dist');
const pages = [
  { path: '/', name: 'Home', mustInclude: ['id="search-btn"', 'Today\'s Daily Battle', 'id="prayer-counter"', 'Total prayers', 'What battle are you facing today?', 'V2 Command Deck', 'Search by what you feel right now', 'Verse image generator', 'sky-ip-geo.js?v=20260327ipgeo', '<button type="button" id="family-armor-stories-btn"', 'id="armor-builder-btn"', 'id="family-armor-kids-library-link"', 'kids/corner.html', 'id="hero-save-my-verses"', 'script.js?v=20260330pass3a11y', 'footer-build-stamp.js?v=20260329fdbuild', 'id="en-hub-daily-verse"', 'data-tdb-hub-daily-rotate', 'Official calendar', 'Extra anchor (KJV)', 'Anxiety (ES)', 'Strength (ES)', 'Peace (ES)', 'href="/es/"', 'data-tdb-pick="es"', 'href="/fr/"', 'data-tdb-pick="fr"', 'href="/pt/"', 'data-tdb-pick="pt"', 'hreflang="x-default" href="https://todaysdailybattle.com/"', 'hreflang="es" href="https://todaysdailybattle.com/es/"', 'hreflang="fr" href="https://todaysdailybattle.com/fr/"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/"', 'tdb-hero-lang-today-stack', 'id="tdb-hero-lang-label"', 'tdb-lang-switcher--hero-secondary', 'id="tdb-start-lang-label"', 'id="tdb-lang-eyebrow"', 'Explore → Languages lists', 'id="tdb-hero-lang-hint"', 'stay English for now', 'tdb-pwa-nudge', 'Built from pain, not polish', 'href="/family.html"', 'href="/mission-outreach-packs.html"', 'bible/tools.html', 'Study workshop', 'explore.html#start-here', 'First time?', 'hero-hero-pools.js?v=20260328pools', 'hero-daily-first-paint.js?v=20260328pools', 'data-tdb-hero-prebuilt="1"'], mustIncludeOneOf: [['id="query"', 'id="tdb-search"']] },
  { path: '/terms.html', name: 'Terms', mustInclude: ['Terms of Service', 'Acceptance', 'hreflang="pt" href="https://todaysdailybattle.com/pt/terms.html"'] },
  { path: '/pricing.html', name: 'Pricing', mustInclude: ['Pricing', 'Subscribe', 'terms.html'] },
  { path: '/privacy.html', name: 'Privacy', mustInclude: ['Privacy', 'terms.html', 'Privacy is simple here', 'Friday email list', 'hreflang="pt" href="https://todaysdailybattle.com/pt/privacy.html"'] },
  { path: '/study.html', name: 'Study', mustInclude: ['Study', 'notes', 'bible/tools.html', 'Study workshop', 'mystudy.html', 'offline-banner', 'word-study.js'] },
  { path: '/my-verses.html', name: 'My Verses', mustInclude: ['My Verses', 'id="saved-verses"', 'id="my-verses-panel"', 'bible-tool.html', '/bible/tools.html', 'Study workshop', 'Study workspace', 'footer-humility', 'We battle. He wins.', 'tdb-cache-hygiene:'] },
  { path: '/verse.html', name: 'Verse of the Day', mustInclude: ['Verse', 'verse-save-hint', 'verse-page-save-my-verses', 'verse-listen-hint', 'verse-listen-btn', 'KJV loads on this device', 'My Verses', '/bible-tool.html', 'Share with someone who needs it', 'verse-page-share-encourage', 'tdb-cache-hygiene:'] },
  { path: '/calm.html', name: 'Need a verse now', mustInclude: ['God', 'Another verse', 'Back to home', 'Breathe with me for 60 seconds', 'script.js?v=20260325calmen', 'hreflang="x-default"', 'hreflang="es" href="https://todaysdailybattle.com/paz.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/paz.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/shanti.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/mir.html"'] },
  { path: '/church.html', name: 'Church', mustInclude: ['Church'] },
  { path: '/sermon.html', name: 'Sermon', mustInclude: ['Sermon', 'sb-quick-preach-btn', 'The Peace That Guards', 'Philippians 4:6-7', 'sb-pdf-handout-btn', 'Handout PDF', 'Lesson pack', 'sb-oia-points', 'Main points (OIA)', 'For pastors &amp; teachers', 'sb-study-materials', 'Supporting context', 'fp-oia-examples', 'fp-workflow', 'Expository', 'Romans 8:1-4', 'sb-template-btn--starter'] },
  { path: '/reading-plan.html', name: 'Reading plan', mustInclude: ['Reading', 'assets/share/verse-share.jpg'] },
  { path: '/faq.html', name: 'FAQ', mustInclude: ['FAQ'] },
  { path: '/why-not-ai.html', name: 'Why not AI', mustInclude: ['Why not AI?', 'Honest comparison', 'What real readers say', 'privacy.html', 'plans.html', 'message.html'] },
  { path: '/contact.html', name: 'Contact', mustInclude: ['Contact'] },
  { path: '/message.html', name: 'Message / Prayer Wall', mustInclude: ['message', 'Prayer', 'Encouragement', 'hreflang="pt" href="https://todaysdailybattle.com/pt/mural.html"'] },
  { path: '/wins-report.html', name: 'Wins Report', mustInclude: ['Wins', 'Report'] },
  { path: '/for-pastors.html', name: 'For pastors', mustInclude: ['For pastors', 'mobile ministers', 'for-pastors-hub-grid', 'id="for-pastors-hub"', 'id="fp-print"', 'verse-cards', 'sermon.html', 'explore.html#languages', 'plans.html', 'data-tdb-lang-switcher', 'tdb-cache-hygiene:', 'fp-oia-teach', 'Teach from the text', 'Start Sermon workspace', 'bible/tools.html#book-intros', 'Study workshop', '/bible/tools.html', 'id="fp-oia-examples"', 'OIA in practice', 'Psalm 23:1', 'James 1:2', 'Ephesians 2:8', 'fp-oia-compare-table', 'id="fp-workflow"', 'How people use this', 'id="fp-sample-lesson"', 'Galatians 1:6-9'] },
  { path: '/explore.html', name: 'Explore', mustInclude: ['Explore the site', 'explore-hub-grid', 'id="explore-hub"', 'explore-link-list', 'id="explore-first-visit-hint"', 'New today?', 'topic-anxiety.html', 'topic-worry.html', 'verse-image.html', 'id="topics-es">Spanish topics', 'Spanish devotionals', '>Spanish topics</a>', 'id="languages"', 'Supported hubs', 'Additional languages', 'id="open-beta-explore-heading"', 'honest edges', 'for-pastors.html', 'Kecemasan', 'Kabalisahan', 'tl/kabalisahan.html', 'href="/es/"', 'Español — inicio', 'href="/fr/"', 'fr/anxiete.html', 'href="/zh/"', '中文 — hub', 'href="/ru/"', 'Русский — hub', 'href="/hi/"', 'हिन्दी — hub', 'zh/jiaolv.html', 'ar/qalaq.html', 'hi/chinta.html', 'ru/trevoga.html', 'zh/kongju.html', 'hi/dar.html', 'ru/strakh.html', 'sv/oro.html', 'Português — início', 'href="/pt/"', 'pt/ansiedade.html', 'pt/medo.html', 'pt/planos.html', 'pt/privacy.html', 'pt/raiva.html', 'pt/luto.html', 'pt/perdao.html', 'bn/chinta.html', 'sw/wasiwasi.html', 'Synodal', '1917', 'Almeida', 'Calcutta', 'Kiswahili', 'Van Dyck', '1851 Hindi', 'fr/espoir.html', 'zh/xiwang.html', 'ru/nadezhda.html', 'pt/esperanca.html', 'tl/pagasa.html', 'id/harapan.html', 'id/ketakutan.html', 'fr/pardon.html', 'perdon.html', 'zh/heping.html', 'zh/kuanshu.html', 'ru/proshchenie.html', 'hi/kshama.html', 'fr/solitude.html', 'zh/gudu.html', 'fr/culpabilite.html', 'zh/neijiu.html', 'fr/deborde.html', 'zh/taiduo.html', 'Louis Segond', 'Reina-Valera 1960', 'data-tdb-pick="en"', 'data-tdb-pick="es"', 'data-tdb-pick="fr"', 'data-tdb-pick="pt"', 'tdb-lang-switcher-eyebrow', 'family.html', 'family-armor.html', 'id="mission-outreach"', 'mission-outreach-packs.html', 'id="whats-new-spring-2026"', 'What&rsquo;s new (Spring 2026)', 'tdb-cache-hygiene:'] },
  { path: '/about.html', name: 'About', mustInclude: ['About', 'Daily Battle', 'id="open-beta"', 'Open beta', 'working ministry build', 'id="whats-new-family-mission"', 'mission-outreach-packs.html'] },
  { path: '/testimonials.html', name: 'Reader stories', mustInclude: ['Words from the field', 'Share yours', 'support@todaysdailybattle.com'] },
  { path: '/profile.html', name: 'Profile', mustInclude: ['Family', 'Account', 'Your Kids'] },
  { path: '/bible-tool.html', name: 'Bible Tool', mustInclude: ['Bible Tool', 'Study workshop', 'bible/tools.html', 'Bible stories', 'bible-story-tool-index.js', 'Featured this week', 'corner.html?story=davidGoliath', 'Read full chapter', 'assets/share/verse-share.jpg', 'verse-image.html', 'footer-humility', 'We battle. He wins.', 'tdb-cache-hygiene:'] },
  { path: '/plans.html', name: 'Battle Plans', mustInclude: ['Battle Plans', 'plan-list', 'planIndex', 'plans-start-here', 'Start here', 'id="all-plans"', 'familyworship', 'Family Worship in the Trenches', 'psalmscomfortfamily', 'Psalms of Comfort (Family Edition)', 'hreflang="pt" href="https://todaysdailybattle.com/pt/planos.html"', 'tdb-cache-hygiene:'] },
  { path: '/verse-image.html', name: 'Verse image generator', mustInclude: ['Verse image generator', 'verse-image.js', 'verse-ref-slug.js', 'qrcode.browser.min.js', 'verse-image-include-qr', 'Include scan link (QR)', 'assets/share/verse-share.jpg', 'recent-gens', 'verse-image-tweet', 'data-verse-store="verseGens"', 'verse-image-text-color', 'verse-image-layout', 'Silver mist', 'Centered', 'value="cross"', 'Quiet field'] },
  { path: '/v.html', name: 'Verse short link', mustInclude: ['verse-ref-slug.js', 'bible-api.com', 'v-ref', 'v-text', 'Bible Tool'] },
  { path: '/bible-study.html', name: 'Bible Studies', mustInclude: ['Bible', 'Study', 'study-card-title', 'Armor of God', 'reading-plan.html?study=armor-of-god', 'script.js?v=20260328studyhydrate'] },
  { path: '/pastor-toolkit.html', name: 'Pastor Toolkit', mustInclude: ['Pastor'] },
  { path: '/team-toolkit.html', name: 'Team Toolkit', mustInclude: ['Team', 'Ready-to-use packs'] },
  { path: '/coloring.html', name: 'Kids Coloring', mustInclude: ['Coloring', 'Kids', 'coloring-sheet-grid', 'Pick a page'] },
  { path: '/family.html', name: 'Family hub', mustInclude: ['For Families', 'family-daily-verse-root', 'family-plan-cards', 'id="family-prayer-wall"', 'A quiet place for your family', 'family-armor.html', 'Family Armor &amp; Stories', 'daily-quiet-time.html', 'Family quiet time', 'family-activity-packs.html', 'family-youth-journal.html', 'plans.html?plan=familyworship', 'plans.html?plan=psalmscomfortfamily', 'Your family has walked', 'stays the younger-child space', 'tdb-cache-hygiene:'] },
  { path: '/family-armor.html', name: 'Family Armor', mustInclude: ['Family Armor &amp; Stories', 'family-armor-hero-verse-frame', 'whole armour of God', 'Ephesians 6:10', 'family-armor-pieces-grid', 'Praying always', 'Open the Family Armor workspace', '/#armor-builder-btn', 'kids/corner.html', 'family.html', 'curriculum.html', 'aria-current="page"', 'href="/family-armor.html"', 'family-armor-trust-strip', 'stays on this device'] },
  { path: '/family-activity-packs.html', name: 'Family activity packs', mustInclude: ['Printable family activity', 'plans-data.js', 'familyworship', 'psalmscomfortfamily', 'Psalms of Comfort (Family Edition)', 'fam-print-btn'] },
  { path: '/family-youth-journal.html', name: 'Family teen journal', mustInclude: ['Teen journal', 'See — What stands out?', 'galatiansfreedom', 'family-activity-packs.html'] },
  { path: '/mission-outreach-packs.html', name: 'Mission outreach packs', mustInclude: ['Mission &amp; outreach packs', 'mission-outreach-data.js', 'mo-pack-themes', 'hospital &amp; bedside', 'grief &amp; funeral', 'prison &amp; jail', 'mo-print-btn', 'tdb-cache-hygiene:'] },
  { path: '/kids-corner.html', name: 'Kids Corner', mustInclude: ['Bible Loop', 'Story Stars', 'loop-grid', 'kids-loop-og.jpg', 'summary_large_image', 'Download loop progress (PDF)', 'loop-pdf-export', 'aria-describedby="loop-pdf-export-count-hint loop-pdf-export-hint"', 'Quick calm loops', '/kids/corner.html', 'Open Kids Coloring', 'coloring.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/criancas.html"', 'script.js?v=20260328feelwire', 'kids-corner.css?v=8',
    'kids-corner-daily-verse.js?v=3',
    'Verse of the day',
    'kids-family-hub-banner', 'Open Family hub', 'For parents',
    'kids-daily-verse-root', 'kids/kids-page-sky.css?v=20260326playful', 'sky-ip-geo.js?v=20260327ipgeo', 'kids/kids-page-sky.js?v=20260327ipgeo'] },
  { path: '/kids/index.html', name: 'Kids Battle Home', mustInclude: ['Kids Battle', 'Library deep links must hit corner.html', "location.replace('corner.html' + location.search)", 'Read-along words, comic panels', 'Color &amp; create', 'coloring.html', 'uFuzzy.iife.min.js', 'kids-verses-365.js?v=20260325kidsmeans', 'kids-battle.js?v=20260326kidsflow', 'kids-read-quiz-data.js?v=20260330kidslib', 'kids-corner.js?v=20260326kidsflow', 'kids-page-sky.css?v=20260326playful', 'sky-ip-geo.js?v=20260327ipgeo', 'kids-page-sky.js?v=20260327ipgeo', 'kids-hub-story-matches', 'kids-header-site-link-wrap', 'footer-humility', 'We battle. He wins.'] },
  { path: '/kids/corner.html', name: 'Bible Story Library', mustInclude: ['/kids/corner.html?story=noah', 'kids-story-library-og.jpg', 'summary_large_image', 'Download Story Library List (PDF)', 'pdf-export', 'aria-describedby="pdf-export-count-hint pdf-export-hint"', 'story-library-fonts.css?v=1', 'kids-page-sky.css?v=20260326playful', 'sky-ip-geo.js?v=20260327ipgeo', 'kids-page-sky.js?v=20260327ipgeo', 'kids-library-search-hint', 'uFuzzy.iife.min.js', 'fuse.min.js', 'kids-story-fuse-search.js?v=20260331fuse', 'kids-library-search-suggest', 'kids-verses-365.js?v=20260325kidsmeans', 'kids-battle.js?v=20260326kidsflow', 'kids-read-quiz-data.js?v=20260330kidslib', 'kids-corner.js?v=20260326kidsflow', 'hard-refresh', 'canvas-confetti', 'global-quiz-challenge', 'print-qa-btn', 'kids-print-qa-sheet-wrap', 'TDB_PANEL_RASTER', 'nunito-latin.woff2', 'panel-david-1.svg', 'Bible Story Library', 'tdb-kids-story-meta-desc', 'kids-story-modal-back-library', 'kids-corner-breadcrumb'] },
  { path: '/kids/all-stories.html', name: 'Kids All Stories A–Z', mustInclude: ['All Bible Stories', 'bible-story-tool-index.js', 'uFuzzy.iife.min.js', 'fuse.min.js', 'kids-story-fuse-search.js', 'kids-all-stories.js?v=20260331kidsthemes', 'kids-page-sky.css?v=20260326playful', 'sky-ip-geo.js?v=20260327ipgeo', 'kids-page-sky.js?v=20260327ipgeo', 'corner.html?story=', 'kids-all-fuse-suggest', 'kids-all-stories-theme-tabs', 'kids-header-site-link-wrap'] },
  { path: '/resources.html', name: 'Pastor Resources', mustInclude: ['Resources'] },
  { path: '/reader.html', name: 'Chapter Reader', mustInclude: ['Reader', 'Chapter', 'Saved chapters', 'Save chapter', 'reader-bookmark-toggle', 'Recently opened (this device)', 'reader-resume-strip', 'reader-crossrefs-panel', 'reader-chapter-study-notes', 'Related verses', 'reader-xrefs-layer', 'reader-xrefs-sheet-desc', 'reader-wordstudy-sheet-desc', 'reader-wordstudy-layer', 'memorize.html', 'bible/tools.html#book-intros', 'hreflang="pt" href="https://todaysdailybattle.com/pt/leitor.html"'] },
  { path: '/topic-anxiety.html', name: 'Topic Anxiety', mustInclude: ['anxiety', 'Anxiety', 'tdb-mood-door-kjv-banner', 'tdb-mood-door-hope-cluster', 'hreflang="x-default"', 'hreflang="es" href="https://todaysdailybattle.com/ansiedad.html"', 'hreflang="fr" href="https://todaysdailybattle.com/fr/anxiete.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/"', 'hreflang="ar" href="https://todaysdailybattle.com/ar/qalaq.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/"', 'hreflang="sv" href="https://todaysdailybattle.com/sv/oro.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/ansiedade.html"', 'hreflang="bn" href="https://todaysdailybattle.com/bn/chinta.html"', 'hreflang="sw" href="https://todaysdailybattle.com/sw/wasiwasi.html"', '/ru/nadezhda.html'] },
  { path: '/topic-worry.html', name: 'Topic Worry', mustInclude: ['worry', 'Worry', 'topic-mood-hero', 'tdb-mood-door-kjv-banner', 'tdb-mood-door-hope-cluster', 'hreflang="x-default"', 'rel="canonical" href="https://todaysdailybattle.com/topic-worry.html"', 'hreflang="es" href="https://todaysdailybattle.com/ansiedad.html"', 'topic-anxiety.html', 'Matthew 6:34', 'Psalm 55:22', 'Philippians 4:6', '/ru/nadezhda.html', 'Related Topics'] },
  { path: '/topic-hope.html', name: 'Topic Hope', mustInclude: ['Hope', 'hreflang="fr" href="https://todaysdailybattle.com/fr/espoir.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/xiwang.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/nadezhda.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/esperanca.html"', 'fr/espoir.html', 'zh/xiwang.html'] },
  { path: '/topic-loneliness.html', name: 'Topic Loneliness', mustInclude: ['Feel Alone', 'hreflang="fr" href="https://todaysdailybattle.com/fr/solitude.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/gudu.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/solidao.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/akelapan.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/odinochestvo.html"', 'fr/solitude.html', 'zh/gudu.html', 'hi/akelapan.html'] },
  { path: '/topic-guilt.html', name: 'Topic Guilt', mustInclude: ['Guilt', 'hreflang="fr" href="https://todaysdailybattle.com/fr/culpabilite.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/neijiu.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/culpa.html"', 'fr/culpabilite.html', 'zh/neijiu.html'] },
  { path: '/topic-overwhelmed.html', name: 'Topic Overwhelmed', mustInclude: ['Overwhelmed', 'hreflang="fr" href="https://todaysdailybattle.com/fr/deborde.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/taiduo.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/sobrecarga.html"', 'fr/deborde.html', 'zh/taiduo.html'] },
  { path: '/topic-strength.html', name: 'Topic Strength', mustInclude: ['Strength', 'hreflang="x-default"', 'hreflang="es" href="https://todaysdailybattle.com/fuerza.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/forca.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/liliang.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/shakti.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/sila.html"'] },
  { path: '/topic-fear.html', name: 'Topic Fear', mustInclude: ['Fear', 'Courage', 'Key Verses', 'rel="canonical" href="https://todaysdailybattle.com/topic-fear.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/medo.html"', 'hreflang="id" href="https://todaysdailybattle.com/id/ketakutan.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/kongju.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/dar.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/strakh.html"', 'data-tdb-lang-switcher', 'Related Topics'] },
  { path: '/topic-grief.html', name: 'Topic Grief', mustInclude: ['Grief', 'Loss', 'Key Verses', 'rel="canonical" href="https://todaysdailybattle.com/topic-grief.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/luto.html"', 'data-tdb-lang-switcher', 'Related Topics'] },
  { path: '/topic-forgiveness.html', name: 'Topic Forgiveness', mustInclude: ['Forgiveness', 'Key Verses', 'rel="canonical" href="https://todaysdailybattle.com/topic-forgiveness.html"', 'hreflang="es" href="https://todaysdailybattle.com/perdon.html"', 'hreflang="fr" href="https://todaysdailybattle.com/fr/pardon.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/perdao.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/kuanshu.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/proshchenie.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/kshama.html"', 'hreflang="id" href="https://todaysdailybattle.com/id/harapan.html"', 'data-tdb-lang-switcher', 'Related Topics'] },
  { path: '/topic-parenting.html', name: 'Topic Parenting', mustInclude: ['Parenting', 'Key Verses', 'rel="canonical" href="https://todaysdailybattle.com/topic-parenting.html"', 'data-tdb-lang-switcher', 'Related Topics'] },
  { path: '/topic-worthless.html', name: 'Topic Worthless', mustInclude: ['Worthless', 'Key Verses', 'rel="canonical" href="https://todaysdailybattle.com/topic-worthless.html"', 'data-tdb-lang-switcher', 'Related Topics'] },
  { path: '/verse-cards/index.html', name: 'Verse cards gallery', mustInclude: ['KJV verse cards', 'Philippians 4:13', 'verse-strength-philippians-4-13.png', 'Daily Battle'] },
  { path: '/action-bible.html', name: 'Action Bible Archive', mustInclude: ['Action Bible Documentary Archive', 'Documentary Controls', 'My witness profile', 'Play Selected Season', 'Continue Watching'] },
  { path: '/action-bible-workshop.html', name: 'Action Bible Workshop Toolkit', mustInclude: ['Worksheet + Class Toolkit', 'Generate Worksheet', 'Build Leader Dashboard Plan', 'Load Weekly Pack', 'Download Weekly JSON'] },
  { path: '/action-bible-weekly-packs.json', name: 'Action Bible Weekly Packs', mustInclude: ['"totalWeeks"', '"weeks"'] },
  { path: '/manifest.json', name: 'Manifest (PWA)', mustInclude: ['name', 'short_name'] },
  { path: '/shop.html', name: 'Shop', mustInclude: ['Equip Your Battle', 'Battle Mug', 'Coming Soon'] },
  { path: '/progress.html', name: 'Progress', mustInclude: ['Progress', 'Current Streak'] },
  { path: '/wins.html', name: 'Wins', mustInclude: ['Battle Wins', 'Copy My Wins', 'wins-share-encourage', 'Share for someone who needs it', 'Generate Share Graphic'] },
  { path: '/what-god-has-done.html', name: 'What God has done', mustInclude: ['What God has done', 'Private &mdash; everything stays on this device', 'Everything here stays on this device.', 'wghd-footer-privacy', 'what-god-has-done.js', 'id="wghd-save"', 'Name what God has done today', 'wghd-export-details', 'what-god-has-done.js?v=', 'maxlength="800"', 'A few sentences is perfect', 'wghd-body-count-sr', 'tdb-offline-strip'] },
  { path: '/memorize.html', name: 'Memorize', mustInclude: ['Memorize', 'memorize.js', 'One-tap verse cards', 'Gentle review', 'Nothing here yet', 'mem-queue-empty', 'bible-study-companion.js', 'Typing practice', 'tdb-offline-strip'] },
  { path: '/ansiedad.html', name: 'Topic Ansiedad (ES)', mustInclude: ['Ansiedad', 'preocupación', 'hreflang="x-default"', 'rel="canonical" href="https://todaysdailybattle.com/ansiedad.html"', 'Reina-Valera 1960, dominio público) y oración cuando la preocupación', 'aria-label="Elegir idioma"', 'data-tdb-lang-switcher lang="es"', 'aria-label="Pie del sitio"', 'Más idiomas', 'Compartir esta página', 'href="/ansiedad.html" hreflang="es" lang="es">Ansiedad</a>', 'Inicio ES', 'Herramientas del sitio — pantalla en inglés', 'Muro completo (EN)', 'Explore — idiomas (EN)'] },
  { path: '/fuerza.html', name: 'Topic Fuerza (ES)', mustInclude: ['Fuerza', 'hreflang="x-default"', 'rel="canonical" href="https://todaysdailybattle.com/fuerza.html"', 'Fuerza en Cristo: versículos (Reina-Valera 1960', 'hreflang="pt" href="https://todaysdailybattle.com/pt/forca.html"', 'aria-label="Elegir idioma"', 'aria-label="Pie del sitio"', 'href="/fuerza.html" hreflang="es" lang="es">Fuerza</a>'] },
  { path: '/paz.html', name: 'Topic Paz (ES)', mustInclude: ['Paz', 'hreflang="x-default"', 'rel="canonical" href="https://todaysdailybattle.com/paz.html"', 'Paz de Dios: versículos (Reina-Valera 1960', 'hreflang="pt" href="https://todaysdailybattle.com/pt/paz.html"', 'aria-label="Elegir idioma"', 'aria-label="Pie del sitio"', 'Calm (EN)', 'href="/paz.html" hreflang="es" lang="es">Paz</a>'] },
  { path: '/id/kecemasan.html', name: 'Topic Kecemasan (ID)', mustInclude: ['lang="id"', 'Kecemasan', 'KJV', 'Psalm 55:22', 'topic-anxiety.html', 'ansiedad.html', 'tl/kabalisahan.html', 'ar/qalaq.html', 'hi/chinta.html', 'ru/trevoga.html', 'id-mas-ayuda', 'Mulai di sini', 'Napas singkat', 'id-start-here', 'id-why-kjv', 'Mengapa KJV', 'id-my-verses-guide', 'Jika Anda membuka Calm', 'tdb-lang-switcher-eyebrow', '>Bahasa</span>'] },
  { path: '/id/ketakutan.html', name: 'Topic Ketakutan (ID fear pilot)', mustInclude: ['lang="id"', 'Ketakutan', 'KJV', '2 Timothy 1:7', 'topic-fear.html', 'miedo.html', 'fr/peur.html', 'id-mas-ayuda', 'Mulai di sini', 'Isaiah 41:10', 'hreflang="en" href="https://todaysdailybattle.com/topic-fear.html"', 'tdb-lang-more', 'explore.html#languages'] },
  { path: '/tl/kabalisahan.html', name: 'Topic Kabalisahan (TL)', mustInclude: ['lang="tl"', 'Kabalisahan', 'KJV', 'Psalm 55:22', 'topic-anxiety.html', 'ansiedad.html', 'id/kecemasan.html', 'ar/qalaq.html', 'hi/chinta.html', 'ru/trevoga.html', 'tl-mas-tulong', 'Simula dito', 'tl-start-here', 'tl-why-kjv', 'Bakit KJV', 'tl-my-verses-guide', 'Kung bubuksan mo ang Calm', 'tdb-lang-more', 'explore.html#languages', '>Wika</span>'] },
  { path: '/fr/anxiete.html', name: 'Topic Anxiété (FR)', mustInclude: ['lang="fr"', 'anxiété', 'Louis Segond', 'Psaumes 55:22', 'topic-anxiety.html', 'zh/jiaolv.html', 'ar/qalaq.html', 'hi/chinta.html', 'ru/trevoga.html', 'fr-mas-ayuda', 'data-tdb-pick="fr"', 'hreflang="zh-CN"', 'Navigation principale', 'Pied de page', 'Autres langues', 'Partager cette page'] },
  { path: '/zh/jiaolv.html', name: 'Topic 焦虑 (ZH)', mustInclude: ['lang="zh-CN"', '焦虑', '和合本', '诗篇', 'topic-anxiety.html', 'fr/anxiete.html', 'ar/qalaq.html', 'hi/chinta.html', 'ru/trevoga.html', 'zh-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'zh-pilot-body'] },
  { path: '/ar/qalaq.html', name: 'Topic قلق (AR)', mustInclude: ['lang="ar"', 'dir="rtl"', 'ar-pilot-body', 'فان دايك', 'المزمور', 'topic-anxiety.html', 'ar-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'hi/chinta.html', 'ru/trevoga.html', 'عندما يخنقك القلق', 'site-footer-pilot-note'] },
  { path: '/hi/chinta.html', name: 'Topic चिंता (HI)', mustInclude: ['lang="hi"', 'hi-pilot-body', '१८५१', 'भजन संहिता', 'topic-anxiety.html', 'hi-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'ru/trevoga.html', 'जब चिंता साँस रोक दे', 'site-footer-pilot-note'] },
  { path: '/ru/trevoga.html', name: 'Topic Тревога (RU)', mustInclude: ['lang="ru"', 'ru-pilot-body', 'Синодальн', 'Псалом 55', 'topic-anxiety.html', 'ru-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'site-footer-pilot-note', 'tdb-mood-door-kjv-banner', 'распахивается'] },
  { path: '/sv/oro.html', name: 'Topic Oro (SV)', mustInclude: ['lang="sv"', '1917', 'Psaltaren 55', 'topic-anxiety.html', 'sv-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'site-footer-pilot-note'] },
  { path: '/pt/index.html', name: 'Portuguese hub', mustInclude: ['lang="pt"', 'pt-hub-hero', 'pt-hub-showcase', 'Por que este hub em português', 'pt-hub-doors', 'pt-hub-topics', 'pt-hub-shells', 'explore-hub-grid', 'Portas em português', 'pt-hub-daily-verse', 'Versículo do dia', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'pt/ansiedade.html', 'pt/esperanca.html', 'pt/medo.html', 'pt/planos.html', 'pt/privacy.html', 'pt/raiva.html', 'pt/luto.html', 'pt/perdao.html', 'capa em português', 'data-tdb-pick="pt"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/"', 'Salmos 55:22', 'Mateus 11:28', 'Almeida', 'interface em inglês', 'Mais idiomas', 'href="/pt/forca.html"', 'Tópicos em português', 'explore.html#topics-en', 'Temas em inglês', 'href="/es/"', 'href="/fr/"', 'Mural completo (EN)'] },
  { path: '/fr/index.html', name: 'French hub', mustInclude: ['lang="fr"', 'fr-hub-hero', 'fr-hub-doors', 'fr-hub-topics', 'fr-hub-shells', 'explore-hub-grid', 'Portes en français', 'href="/fr/plans.html"', 'href="/fr/mural.html"', 'href="/fr/lecteur.html"', 'href="/fr/enfants.html"', 'href="/es/"', 'Verset du jour', 'fr-hub-daily-verse', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'fr/anxiete.html', 'fr/peur.html', 'fr/force.html', 'fr/paix.html', 'fr/espoir.html', 'href="/fr/colere.html"', 'href="/fr/tristesse.html"', 'href="/fr/pardon.html"', 'href="/pt/"', 'Psaume 55:22', 'Matthieu 11:28', 'Louis Segond', 'data-tdb-pick="fr"', 'hreflang="fr" href="https://todaysdailybattle.com/fr/"', 'KJV', 'Autres langues', 'site-footer-pilot-note', 'explore.html#topics-en', 'Thèmes en anglais', 'Mur complet (EN)'] },
  { path: '/es/index.html', name: 'Spanish hub', mustInclude: ['lang="es"', 'es-hub-hero', 'es-hub-doors', 'es-hub-topics', 'es-hub-shells', 'explore-hub-grid', 'Puertas en español', 'es-hub-daily-verse', 'Verso del día', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'href="/ansiedad.html"', 'href="/esperanza.html"', 'href="/fuerza.html"', 'href="/paz.html"', 'href="/miedo.html"', 'href="/soledad.html"', 'href="/culpa.html"', 'href="/agobio.html"', 'href="/ira.html"', 'href="/duelo.html"', 'href="/perdon.html"', 'href="/planes.html"', 'href="/muro.html"', 'href="/lector.html"', 'href="/ninos.html"', 'href="/fr/"', 'href="/pt/"', 'explore.html#topics-en', 'Temas en inglés', 'hreflang="id" href="https://todaysdailybattle.com/id/"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/"', 'Salmos 55:22', 'Mateo 11:28', 'Reina-Valera 1960', 'data-tdb-pick="es"', 'hreflang="es" href="https://todaysdailybattle.com/es/"', 'KJV', 'Más idiomas', 'site-footer-pilot-note', 'Pie del sitio'] },
  { path: '/id/index.html', name: 'Indonesian hub', mustInclude: ['lang="id"', 'id-hub-hero', 'id-hub-doors', 'explore-hub-grid', 'id-hub-daily-verse', 'Ayat hari ini', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'id/kecemasan.html', 'id/harapan.html', 'id/ketakutan.html', 'href="/es/"', 'href="/fr/"', 'href="/pt/"', 'explore.html#languages', 'Psalm 55:22', 'Matthew 11:28', 'KJV', 'tdb-lang-more', 'hreflang="id" href="https://todaysdailybattle.com/id/"'] },
  { path: '/zh/index.html', name: 'Chinese hub', mustInclude: ['lang="zh-CN"', 'zh-hub-hero', 'zh-hub-doors', 'explore-hub-grid', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'href="/zh/kongju.html"', 'href="/zh/heping.html"', 'href="/zh/kuanshu.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/"', 'tdb-lang-more', 'explore.html#languages'] },
  { path: '/ru/index.html', name: 'Russian hub', mustInclude: ['lang="ru"', 'ru-hub-hero', 'ru-hub-doors', 'explore-hub-grid', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'href="/ru/strakh.html"', 'href="/ru/proshchenie.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/"', 'tdb-lang-more', 'explore.html#languages'] },
  { path: '/hi/index.html', name: 'Hindi hub', mustInclude: ['lang="hi"', 'hi-hub-hero', 'hi-hub-doors', 'explore-hub-grid', 'tdb-hub-daily-split', 'data-tdb-hub-daily-rotate', 'href="/verse.html"', 'href="/hi/dar.html"', 'href="/hi/kshama.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/"', 'tdb-lang-more', 'explore.html#languages'] },
  { path: '/pt/ansiedade.html', name: 'Topic Ansiedade (PT)', mustInclude: ['lang="pt"', 'Almeida', 'Salmos 55', 'topic-anxiety.html', 'pt-mas-ayuda', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'Início PT', 'Hub PT', 'Rodapé do site', 'Compartilhar esta página'] },
  { path: '/pt/medo.html', name: 'Topic Medo (PT)', mustInclude: ['lang="pt"', 'Almeida', '2 Timóteo', 'hreflang="en" href="https://todaysdailybattle.com/topic-fear.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/medo.html"', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'Início PT', 'Hub PT', 'Rodapé do site', 'Compartilhar esta página', 'class="bottom-nav"'] },
  { path: '/pt/privacy.html', name: 'PT Privacy summary', mustInclude: ['lang="pt"', 'Privacidade', 'privacy.html', 'hreflang="en" href="https://todaysdailybattle.com/privacy.html"', 'hreflang="x-default" href="https://todaysdailybattle.com/privacy.html"', 'data-tdb-pick="pt"', 'site-footer-pilot-note'] },
  { path: '/bn/chinta.html', name: 'Topic চিন্তা (BN)', mustInclude: ['lang="bn"', 'bn-pilot-body', 'গীতসংহিতা', 'topic-anxiety.html', 'bn-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'hi/chinta.html', 'site-footer-pilot-note'] },
  { path: '/sw/wasiwasi.html', name: 'Topic Wasiwasi (SW)', mustInclude: ['lang="sw"', 'Zaburi 55', 'topic-anxiety.html', 'sw-mas-ayuda', 'tdb-lang-more', 'explore.html#languages', 'site-footer-pilot-note'] },
  { path: '/fr/espoir.html', name: 'Topic Espoir (FR)', mustInclude: ['lang="fr"', 'espoir', 'Louis Segond', 'Romains 15:13', 'topic-hope.html', 'zh/xiwang.html', 'fr-hope-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/zh/xiwang.html', name: 'Topic 盼望 (ZH)', mustInclude: ['lang="zh-CN"', '盼望', '和合本', '罗马书', 'topic-hope.html', 'fr/espoir.html', 'zh-hope-breakdown', 'tdb-lang-more', 'explore.html#languages', 'zh-pilot-body'] },
  { path: '/ru/nadezhda.html', name: 'Hope Надежда (RU)', mustInclude: ['lang="ru"', 'Надежда', 'topic-hope.html', 'tdb-lang-more', 'explore.html#languages', 'tdb-mood-door-kjv-banner'] },
  { path: '/pt/esperanca.html', name: 'Hope Esperança (PT)', mustInclude: ['lang="pt"', 'Esperança', 'topic-hope.html', 'data-tdb-pick="pt"', 'Almeida', 'Se o peito', 'pt/ansiedade.html', 'Início PT', 'Hub PT', 'Rodapé do site'] },
  { path: '/pt/raiva.html', name: 'Topic Raiva (PT)', mustInclude: ['lang="pt"', 'Raiva', 'Almeida', 'Efésios 4:26', 'hreflang="es" href="https://todaysdailybattle.com/ira.html"', 'explore.html', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'Rodapé do site', 'class="bottom-nav"'] },
  { path: '/pt/luto.html', name: 'Topic Luto (PT)', mustInclude: ['lang="pt"', 'Luto', 'Almeida', 'Mateus 5:4', 'topic-grief.html', 'hreflang="en" href="https://todaysdailybattle.com/topic-grief.html"', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'class="bottom-nav"'] },
  { path: '/pt/perdao.html', name: 'Topic Perdão (PT)', mustInclude: ['lang="pt"', 'Perdão', 'Almeida', 'Efésios 4:32', 'topic-forgiveness.html', 'perdon.html', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'class="bottom-nav"'] },
  { path: '/bn/asha.html', name: 'Hope আশা (BN)', mustInclude: ['lang="bn"', 'bn-hope-breakdown', 'topic-hope.html', 'tdb-lang-more', 'explore.html#languages', 'tdb-mood-door-kjv-banner', 'আজ যা ধরে রাখতে পারেন', 'bn-hope-tools', 'কলকাতা'] },
  { path: '/sw/tumaini.html', name: 'Hope Tumaini (SW)', mustInclude: ['lang="sw"', 'sw-hope-breakdown', 'topic-hope.html', 'tdb-lang-more', 'explore.html#languages', 'tdb-mood-door-kjv-banner', 'Leo kinachokushikilia', 'sw-hope-tools', 'Warumi 15'] },
  { path: '/fr/solitude.html', name: 'Topic Solitude (FR)', mustInclude: ['lang="fr"', 'solitude', 'Louis Segond', 'Hébreux 13:5', 'topic-loneliness.html', 'zh/gudu.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/solidao.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/zh/gudu.html', name: 'Topic 孤独 (ZH)', mustInclude: ['lang="zh-CN"', '孤独', '和合本', '希伯来书', 'topic-loneliness.html', 'fr/solitude.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/solidao.html"', 'zh-topic-breakdown', 'tdb-lang-more', 'explore.html#languages', 'zh-pilot-body'] },
  { path: '/fr/culpabilite.html', name: 'Topic Culpabilité (FR)', mustInclude: ['lang="fr"', 'culpabilité', 'Louis Segond', '1 Jean 1:9', 'topic-guilt.html', 'zh/neijiu.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/culpa.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/zh/neijiu.html', name: 'Topic 内疚 (ZH)', mustInclude: ['lang="zh-CN"', '内疚', '和合本', '约翰一书', 'topic-guilt.html', 'fr/culpabilite.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/culpa.html"', 'zh-topic-breakdown', 'tdb-lang-more', 'explore.html#languages', 'zh-pilot-body'] },
  { path: '/fr/deborde.html', name: 'Topic Débordé (FR)', mustInclude: ['lang="fr"', 'débordé', 'Louis Segond', 'Matthieu 11:28', 'topic-overwhelmed.html', 'zh/taiduo.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/sobrecarga.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/zh/taiduo.html', name: 'Topic 太多 (ZH)', mustInclude: ['lang="zh-CN"', '太多', '和合本', '马太福音', 'topic-overwhelmed.html', 'fr/deborde.html', 'hreflang="pt" href="https://todaysdailybattle.com/pt/sobrecarga.html"', 'zh-topic-breakdown', 'tdb-lang-more', 'explore.html#languages', 'zh-pilot-body'] },
  { path: '/fr/peur.html', name: 'Topic Peur (FR)', mustInclude: ['lang="fr"', 'Peur', 'Louis Segond', '2 Timothée', 'topic-fear.html', 'hreflang="es" href="https://todaysdailybattle.com/miedo.html"', 'hreflang="pt" href="https://todaysdailybattle.com/pt/medo.html"', 'hreflang="id" href="https://todaysdailybattle.com/id/ketakutan.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"', 'site-footer-pilot-note'] },
  { path: '/fr/force.html', name: 'Topic Force (FR)', mustInclude: ['lang="fr"', 'Philippiens', 'Louis Segond', 'topic-strength.html', 'hreflang="es" href="https://todaysdailybattle.com/fuerza.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/fr/paix.html', name: 'Topic Paix (FR)', mustInclude: ['lang="fr"', 'Jean 14:27', 'Louis Segond', 'calm.html', 'hreflang="es" href="https://todaysdailybattle.com/paz.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/heping.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"'] },
  { path: '/fr/colere.html', name: 'Topic Colère (FR)', mustInclude: ['lang="fr"', 'colère', 'Éphésiens', 'Louis Segond', 'explore.html', 'fr-topic-breakdown', 'data-tdb-pick="fr"', 'site-footer-pilot-note', 'Partager cette page', 'class="bottom-nav"'] },
  { path: '/fr/tristesse.html', name: 'Topic Tristesse (FR)', mustInclude: ['lang="fr"', 'tristesse', 'Matthieu', 'Louis Segond', 'topic-grief.html', 'fr-topic-breakdown', 'data-tdb-pick="fr"', 'site-footer-pilot-note'] },
  { path: '/fr/pardon.html', name: 'Topic Pardon (FR forgiveness)', mustInclude: ['lang="fr"', 'Pardonner', 'Louis Segond', 'Éphésiens', 'topic-forgiveness.html', 'hreflang="es" href="https://todaysdailybattle.com/perdon.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/kuanshu.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/proshchenie.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/kshama.html"', 'fr-topic-breakdown', 'data-tdb-pick="fr"', 'site-footer-pilot-note'] },
  { path: '/miedo.html', name: 'Topic Miedo (ES)', mustInclude: ['lang="es"', 'Miedo', 'Reina-Valera 1960', '2 Timoteo', 'topic-fear.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/peur.html"', 'hreflang="id" href="https://todaysdailybattle.com/id/ketakutan.html"', 'es-topic-breakdown', 'data-tdb-pick="es"', 'site-footer-pilot-note', 'Herramientas del sitio — pantalla en inglés', 'Muro completo (EN)', 'href="/?q=fear"'] },
  { path: '/soledad.html', name: 'Topic Soledad (ES)', mustInclude: ['lang="es"', 'Soledad', 'Reina-Valera 1960', 'Hebreos', 'topic-loneliness.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/solitude.html"', 'es-topic-breakdown', 'data-tdb-pick="es"'] },
  { path: '/culpa.html', name: 'Topic Culpa (ES root)', mustInclude: ['lang="es"', 'Culpa', 'Reina-Valera 1960', '1 Juan', 'topic-guilt.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/culpabilite.html"', 'es-topic-breakdown', 'data-tdb-pick="es"'] },
  { path: '/agobio.html', name: 'Topic Agobio (ES)', mustInclude: ['lang="es"', 'Agobio', 'Reina-Valera 1960', 'Mateo 11:28', 'topic-overwhelmed.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/deborde.html"', 'es-topic-breakdown', 'data-tdb-pick="es"'] },
  { path: '/esperanza.html', name: 'Topic Esperanza (ES)', mustInclude: ['lang="es"', 'Esperanza', 'Reina-Valera 1960', 'Romanos 15:13', 'topic-hope.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/espoir.html"', 'es-topic-breakdown', 'data-tdb-pick="es"', 'site-footer-pilot-note', 'Herramientas del sitio — pantalla en inglés', 'href="/?q=hope"'] },
  { path: '/ira.html', name: 'Topic Ira (ES)', mustInclude: ['lang="es"', 'Ira', 'Efesios', 'Reina-Valera 1960', 'explore.html', 'es-topic-breakdown', 'data-tdb-pick="es"', 'site-footer-pilot-note'] },
  { path: '/duelo.html', name: 'Topic Duelo (ES)', mustInclude: ['lang="es"', 'Duelo', 'Mateo', 'Reina-Valera 1960', 'topic-grief.html', 'es-topic-breakdown', 'data-tdb-pick="es"', 'site-footer-pilot-note'] },
  { path: '/perdon.html', name: 'Topic Perdón (ES forgiveness)', mustInclude: ['lang="es"', 'Efesios', 'Reina-Valera 1960', 'topic-forgiveness.html', 'hreflang="fr" href="https://todaysdailybattle.com/fr/pardon.html"', 'hreflang="zh-CN" href="https://todaysdailybattle.com/zh/kuanshu.html"', 'hreflang="ru" href="https://todaysdailybattle.com/ru/proshchenie.html"', 'hreflang="hi" href="https://todaysdailybattle.com/hi/kshama.html"', 'perdón', 'es-topic-breakdown', 'data-tdb-pick="es"', 'site-footer-pilot-note'] },
  { path: '/planes.html', name: 'ES shell Planes', mustInclude: ['lang="es"', 'Planes de lectura — pantalla en inglés', 'href="/plans.html"', 'data-tdb-pick="es"', 'site-footer-pilot-note', 'aria-label="Pie del sitio"', 'Compartir esta página', 'es-shell-tools', 'Herramientas del sitio — pantalla en inglés', 'Muro completo (EN)', 'Explore (EN)', 'Planes (portada ES)'] },
  { path: '/fr/plans.html', name: 'FR shell Plans', mustInclude: ['lang="fr"', 'Plans de lecture — interface en anglais', 'href="/plans.html"', 'data-tdb-pick="fr"', 'site-footer-pilot-note', 'Accueil FR', 'fr-shell-tools', 'Plus de sujets en français', 'solitude.html', 'Mur complet (EN)', 'Explore (EN)'] },
  { path: '/fr/mural.html', name: 'FR shell Mur', mustInclude: ['lang="fr"', 'Mur de prière — interface en anglais', 'fr-shell-tools', 'Mur complet (EN)', 'fr/paix.html'] },
  { path: '/pt/planos.html', name: 'PT Planos shell', mustInclude: ['lang="pt"', 'Planos de leitura — tela em inglês', 'plans.html', 'hreflang="en" href="https://todaysdailybattle.com/plans.html"', 'data-tdb-pick="pt"', 'site-footer-pilot-note', 'Capa da ferramenta', 'class="bottom-nav"', 'pt-shell-tools', 'Mural completo (EN)', 'Hub PT'] },
  { path: '/zh/heping.html', name: 'ZH peace pilot', mustInclude: ['lang="zh-CN"', 'zh/heping.html', '约翰福音', 'calm.html', 'data-tdb-lang-switcher'] },
  { path: '/zh/kuanshu.html', name: 'ZH forgiveness pilot', mustInclude: ['lang="zh-CN"', 'zh/kuanshu.html', '以弗所书', 'topic-forgiveness.html', 'data-tdb-lang-switcher'] },
  { path: '/ru/proshchenie.html', name: 'RU forgiveness pilot', mustInclude: ['lang="ru"', '/ru/proshchenie.html', 'Ефесянам', 'topic-forgiveness.html', 'data-tdb-lang-switcher'] },
  { path: '/hi/kshama.html', name: 'HI forgiveness pilot', mustInclude: ['lang="hi"', '/hi/kshama.html', 'एफिसियों', 'topic-forgiveness.html', 'data-tdb-lang-switcher'] },
  { path: '/church/index.html', name: 'Church Join Hub', mustInclude: ['Church Join Hub', 'Join Hub'] },
];

function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    http.get({ hostname: u.hostname, port: u.port || 80, path: u.pathname + u.search }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

function readLocal(filePath) {
  const p = (filePath === '/' ? '/index.html' : filePath).replace(/^\//, '');
  const full = path.join(DIST, p);
  try {
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      return { statusCode: 200, body: fs.readFileSync(full, 'utf8') };
    }
  } catch (e) {}
  return { statusCode: 404, body: '' };
}

function run() {
  let failed = 0;
  (async () => {
    if (OFFLINE) {
      console.log('Testing site (OFFLINE — reading from dist/)\n');
      const idxPath = path.join(DIST, 'index.html');
      if (fs.existsSync(idxPath)) {
        const raw = fs.readFileSync(idxPath, 'utf8');
        if (raw.includes('hero-hero-pools.js') && !raw.includes('data-tdb-hero-prebuilt="1"')) {
          console.error(
            'test-site: dist/index.html is missing data-tdb-hero-prebuilt="1" (build inject step).\n' +
              'Run: npm run build — then retry npm run test:site\n' +
              '(Stale dist/ from before inject-home-hero.mjs, or copy-static without inject.)'
          );
          process.exit(1);
        }
      }
    } else {
      console.log('Testing site at', BASE, '\n');
    }
    const getPage = OFFLINE
      ? (p) => Promise.resolve(readLocal(p.path))
      : (p) => fetchHttp(BASE + p.path);
    for (const p of pages) {
      try {
        const { statusCode, body } = await getPage(p);
        if (statusCode !== 200) {
          console.log('FAIL', p.name, p.path, '→', statusCode);
          failed++;
          continue;
        }
        const missing = (p.mustInclude || []).filter(s => !body.includes(s));
        const oneOfOk = !p.mustIncludeOneOf || p.mustIncludeOneOf.every(opt => opt.some(s => body.includes(s)));
        if (missing.length || !oneOfOk) {
          if (missing.length) console.log('FAIL', p.name, 'missing:', missing.join(', '));
          if (!oneOfOk) console.log('FAIL', p.name, 'must include one of:', p.mustIncludeOneOf.map(o => o.join('|')).join('; '));
          failed++;
        } else {
          console.log('OK  ', p.name);
        }
      } catch (e) {
        console.log('FAIL', p.name, e.message);
        failed++;
      }
    }
    // Search logic: full-text search with synonym expansion (selfless→love) and fallback verses
    const script = fs.readFileSync(__dirname + '/script.js', 'utf8');
    const hasSelflessExpansion = script.includes("'selfless'") && script.includes('love');
    const hasExpandKeywords = script.includes('expandKeywords') && script.includes('rawTokens');
    const hasFallback = script.includes('results.fallback') && script.includes('hope');
    if (!hasSelflessExpansion || !hasExpandKeywords || !hasFallback) {
      console.log('\nFAIL search logic: selfless/love expansion or fallback verses missing in script.js');
      failed++;
    } else {
      console.log('\nOK  search logic (phrase search, synonym expansion, fallback verses)');
    }
    // Homepage: one visible results bucket; no hidden #output in sr-only #main-search; no duplicate wireSmartSearch path
    let homeBodyForSearch = '';
    try {
      const homeResSearch = OFFLINE ? readLocal('/') : await fetchHttp(BASE + '/');
      homeBodyForSearch = homeResSearch.body || '';
    } catch (e) { homeBodyForSearch = ''; }
    const hasFeelResultsHost = homeBodyForSearch.indexOf('id="feel-results"') !== -1;
    const mainSearchNoOutput = (function () {
      const i = homeBodyForSearch.indexOf('id="main-search"');
      if (i === -1) return true;
      const start = homeBodyForSearch.lastIndexOf('<section', i);
      const end = homeBodyForSearch.indexOf('</section>', i);
      if (start === -1 || end === -1 || end < i) return true;
      const chunk = homeBodyForSearch.slice(start, end);
      return chunk.indexOf('id="output"') === -1 && chunk.indexOf("id='output'") === -1;
    })();
    const hasGetSearchOutputEl = script.includes('function getSearchOutputElement');
    const hasFeelSuggestGate = script.includes("getElementById('feelSuggestDropdown')");
    if (!hasFeelResultsHost || !mainSearchNoOutput || !hasGetSearchOutputEl || !hasFeelSuggestGate) {
      console.log('\nFAIL homepage search wiring (feel-results, no #output inside #main-search, getSearchOutputElement, feelSuggestDropdown gate)');
      failed++;
    } else {
      console.log('\nOK  homepage search wiring guard');
    }
    // Prayer counter: element present on home, script wires it and formats numbers
    let homeBody = '';
    try {
      const homeRes = OFFLINE ? readLocal('/') : await fetchHttp(BASE + '/');
      homeBody = homeRes.body || '';
    } catch (e) { homeBody = ''; }
    const hasCounterEl = homeBody.indexOf('id="prayer-counter"') !== -1 && homeBody.indexOf('Total prayers') !== -1;
    const hasWireCounter = script.includes('prayer-counter') && script.includes('wireRealPrayerCounter');
    const hasFormatCount = script.includes('toLocaleString()') && script.includes('formatCount');
    const hasRefresh = script.includes('__fetchPrayerCount');
    if (!hasCounterEl || !hasWireCounter || !hasFormatCount || !hasRefresh) {
      console.log('\nFAIL prayer counter: missing element, wire, formatCount, or refresh');
      if (!hasCounterEl) console.log('  - Home page must include id="prayer-counter" and "Total prayers"');
      if (!hasWireCounter) console.log('  - script.js must wire prayer-counter in wireRealPrayerCounter');
      if (!hasFormatCount) console.log('  - script.js must use formatCount with toLocaleString');
      if (!hasRefresh) console.log('  - script.js must expose __fetchPrayerCount for refresh');
      failed++;
    } else {
      console.log('\nOK  prayer counter (element, wire, formatCount, refresh)');
    }
    console.log('\n' + (failed ? failed + ' failure(s).' : 'All checks passed.'));
    process.exit(failed ? 1 : 0);
  })();
}
run();
