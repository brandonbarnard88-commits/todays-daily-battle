/**
 * Shared strings for Kids Loop + Story Library — used by verify-live-kids + verify-kids-dist + test-site.
 * When you bump kids-corner.css, script.js?…, or kids/kids-corner.js?… in HTML, update this file and
 * og:image ?v= in kids-corner.html / kids/corner.html (and SHARE_OG_V in scripts/cloudflare-purge.mjs).
 */
export const LOOP_HTML_MARKERS = [
  'kids-loop-og.jpg',
  'summary_large_image',
  'Download loop progress (PDF)',
  'loop-pdf-export',
  '20260322loop-pdf-summary',
  'kids-corner.css?v=7'
];

export const STORY_HTML_MARKERS = [
  'kids-story-library-og.jpg',
  'summary_large_image',
  'Download Story Library List (PDF)',
  'pdf-export',
  'kids-corner.js?v=66'
];

export const OG_ASSET_PATHS = [
  'assets/share/kids-loop-og.jpg',
  'assets/share/kids-story-library-og.jpg'
];
