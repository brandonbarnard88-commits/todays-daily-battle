/**
 * One-pass removal of "Why not AI?" links and branded mentions from HTML surfaces.
 * why-not-ai.html / why-no-ai.html redirect to about (handled separately).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.worktrees']);
const SKIP_FILES = new Set(['why-not-ai.html', 'why-no-ai.html']);

function walkHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, out);
    else if (e.isFile() && e.name.endsWith('.html') && !SKIP_FILES.has(e.name)) out.push(full);
  }
  return out;
}

function clean(html) {
  let next = html;

  // Standalone link lines (footer sitemap, nav rows).
  next = next.replace(/^[ \t]*<a href="(?:\/|)why-not-ai\.html"[^>]*>Why not AI\?<\/a>\s*\n/gm, '');
  next = next.replace(/^[ \t]*<a href="(?:\/|)why-not-ai\.html"[^>]*>Why not AI<\/a>\s*\n/gm, '');

  // Sidebar / nav items.
  next = next.replace(/^[ \t]*<a href="(?:\/|)why-not-ai\.html"[^>]*data-section="why-not-ai"[^>]*>Why not AI\?<\/a>\s*\n/gm, '');

  // Inline paragraph / eyebrow links.
  next = next.replace(/\s*&middot;\s*<a class="tdb-porch-feel__eyebrow-link" href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*<a class="tdb-porch-feel__eyebrow-link" href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*<a href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*<a href="(?:\/|)why-not-ai\.html">Why not AI<\/a>/g, '');
  next = next.replace(/\s*<a href="(?:\/|)why-not-ai\.html" class="[^"]*"[^>]*>Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*<a class="[^"]*" href="(?:\/|)why-not-ai\.html"[^>]*>Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*, and <a href="(?:\/|)why-not-ai\.html">Why not AI<\/a>/g, '');
  next = next.replace(/\s*and <a href="(?:\/|)why-not-ai\.html">Why not AI<\/a>/g, '');

  // bible-tool Ask the Word note icon link.
  next = next.replace(/\s*<a href="why-not-ai\.html" class="qa-server-note-icon-link"[^>]*>[\s\S]*?<\/a>/g, '');
  next = next.replace(/\s*·\s*<a class="qa-server-note-inline" href="why-not-ai\.html">Why not AI\?<\/a>/g, '');

  // Moat / porch CTA button.
  next = next.replace(/\s*<a class="tdb-moat-banner-cta" href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>\s*\n/g, '\n');

  // Header nav (homepage-style).
  next = next.replace(/\s*<a href="(?:\/|)why-not-ai\.html" aria-label="Why we are not an AI chat tool">Why not AI\?<\/a>\s*\n/g, '\n');

  // explore.html list items.
  next = next.replace(/<li><a href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>[^<]*<\/li>\s*\n/g, '');

  // FAQ / about comparison links in prose.
  next = next.replace(/\s*<a href="(?:\/|)why-not-ai\.html">Honest comparison: Why not AI\?<\/a>/g, '');
  next = next.replace(/\s*For a side-by-side comparison with typical AI apps, see\s*<\/p>/g, '.</p>');
  next = next.replace(/\s*For a side-by-side comparison with typical AI apps, see<\/p>/g, '.</p>');
  next = next.replace(/\s*For an honest comparison with typical AI tools, see https:\/\/todaysdailybattle\.com\/why-not-ai\.html/g, '');

  // explore hero trailing link.
  next = next.replace(/\s*&mdash;not chatted at\.\s*<a href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>/g, '&mdash;not chatted at.');

  // Homepage porch-light / moat copy.
  next = next.replace(/Privacy, Why not AI, sample plans/g, 'Privacy, sample plans');
  next = next.replace(/Why not AI, privacy paths, sample plans\./g, 'Privacy paths, sample plans.');
  next = next.replace(/<!-- ── Feel Search \(nav anchor: #quick-search-hero\) — below Why not AI teaser, above Battle Plans ── -->/g,
    '<!-- ── Feel Search (nav anchor: #quick-search-hero) — above Battle Plans ── -->');

  // FAQ hero inline link.
  next = next.replace(/\s*and how this differs from an AI chat\.\s*<a href="(?:\/|)why-not-ai\.html">Why not AI\?<\/a>/g,
    ' and how this differs from an AI chat.');

  // about.html "No AI thread" phrase.
  next = next.replace(/No AI thread that won&rsquo;t quit\./g, 'No endless scroll that won&rsquo;t quit.');

  return next;
}

const files = walkHtml(root, []);
let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = clean(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
  }
}
console.log('remove-why-not-ai-mentions: updated', changed, 'HTML file(s)');
