/**
 * Shared strings for Kids Loop + Story Library — used by verify-live-kids + verify-kids-dist + test-site.
 *
 * Version bumps: When you change kids-corner.css, script.js?…, or kids/kids-corner.js?… in HTML, update
 * the matching substrings here. For og:image/twitter ?v= cache-bust, set the same value in
 * kids-corner.html + kids/corner.html metas and SHARE_OG_V in scripts/cloudflare-purge.mjs.
 *
 * Custom 1200×630 heroes: Replace assets/share/kids-loop-og.jpg and kids-story-library-og.jpg, bump
 * ?v= in all og:image and twitter:image tags, bump SHARE_OG_V, redeploy, purge (npm run purge:cloudflare:social).
 * Markers still match on filename (kids-*-og.jpg) — no edit needed here unless you rename files.
 */
import { SITE_ASSET_VERSION } from './site-asset-version.mjs';

export const LOOP_HTML_MARKERS = [
  'kids-loop-og.jpg',
  'summary_large_image',
  'Download loop progress (PDF)',
  'loop-pdf-export',
  'aria-describedby="loop-pdf-export-count-hint loop-pdf-export-hint"',
  `script.js?v=${SITE_ASSET_VERSION}`,
  'kids-corner.css?v=12'
];

export const STORY_HTML_MARKERS = [
  'kids-story-library-og.jpg',
  'summary_large_image',
  'Download Story Library List (PDF)',
  'pdf-export',
  'aria-describedby="pdf-export-count-hint pdf-export-hint"',
  'id="kids-childrens-classroom"',
  'corner.html?story=jesusFeeds5000',
  '/coloring.html?story=feeding-5000',
  'corner.html?story=jesusCalmsStorm',
  '/coloring.html?story=jesus-storm',
  'corner.html?story=davidGoliath',
  '/coloring.html?story=david',
  'id="kids-classroom-long-read"',
  'corner.html?story=goodSamaritan',
  '/coloring.html?story=good-samaritan',
  'id="kids-classroom-lost-sheep-read"',
  'corner.html?story=lostSheep',
  '/coloring.html?story=lost-sheep',
  'id="kids-classroom-walks-water-read"',
  'corner.html?story=jesusWalksWater',
  '/coloring.html?story=walks-on-water',
  'id="kids-classroom-prodigal-read"',
  'corner.html?story=prodigalSon',
  '/coloring.html?story=prodigal-son',
  'story-library-fonts.css?v=1',
  'loop-library-coloring.js?v=20260524readquiz',
  'kids-corner.js?v=20260809readquiz',
  'kids-page-sky.css?v=20260326playful',
  'uFuzzy.iife.min.js',
  'kids-verses-365.js?v=20260802-calendar-mix',
  'kids-battle.js?v=20260803softquiz',
  'kids-read-quiz-data.js?v=20260524readquiz',
  'kids-story-remember.js?v=20260803remember',
  'TDB_PANEL_RASTER',
  'nunito-latin.woff2',
  '/kids/panel-david-1.svg'
];

export const OG_ASSET_PATHS = [
  'assets/share/kids-loop-og.jpg',
  'assets/share/kids-story-library-og.jpg'
];
