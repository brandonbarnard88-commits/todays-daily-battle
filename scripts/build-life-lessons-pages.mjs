#!/usr/bin/env node
/**
 * Generate Life Lessons HTML (lesson + print) and life-lessons-data.js from scripts/life-lessons-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LIFE_LESSONS } from './life-lessons-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const lessonsDir = path.join(root, 'life-lessons');
const cssV = '20260518ll2';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function topicsAttr(topics) {
  return esc((topics || []).join(' '));
}

function tagRow(lesson) {
  const tags = [];
  if (lesson.families) tags.push('<span class="tdb-ll-audience tdb-ll-audience--family">For Families</span>');
  if (lesson.grownups) tags.push('<span class="tdb-ll-audience tdb-ll-audience--grown">For Grown-ups</span>');
  return tags.join(' ');
}

function listItems(arr, allowHtml) {
  return (arr || [])
    .map((item) => `        <li>${allowHtml ? item : esc(item)}</li>`)
    .join('\n');
}

function porchLinks(porch) {
  return (porch || [])
    .map((p) => `<li><a href="${esc(p.href)}">${esc(p.label)}</a></li>`)
    .join('\n');
}

function lessonPage(lesson) {
  const canonical = `https://todaysdailybattle.com/life-lessons/${lesson.slug}.html`;
  const printHref = `${lesson.slug}-print.html`;
  const redScript =
    lesson.redLetter
      ? `  <script src="../red-letter.js?v=20260518-rl" data-tdb-red-letter="1"></script>\n  <script src="../life-lessons-tool.js?v=${cssV}" defer></script>`
      : `  <script src="../life-lessons-tool.js?v=${cssV}" defer></script>`;

  const scriptureBody = esc(lesson.scriptureText);
  const redNote = lesson.redLetter
    ? '<p class="section-note tdb-ll-red-note">Gospel passage: turn on <a href="/red-letters.html">Red letters</a> to see the Lord Jesus&rsquo;s words in red on your device.</p>'
    : '';

  const reflectionBlock =
    lesson.reflection && lesson.reflection.length
      ? `    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-reflect-h">
      <h2 id="tdb-ll-reflect-h">Quiet reflection <span class="tdb-ll-optional">(optional)</span></h2>
      <ul class="tdb-ll-reflection">
${listItems(lesson.reflection)}
      </ul>
    </section>`
      : '';

  const storyBlock = lesson.story
    ? `    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-story-h">
      <h2 id="tdb-ll-story-h">The story / setting</h2>
      <p>${esc(lesson.story)}</p>
    </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <script src="/vendor/dompurify.min.js"></script>
  <script src="/tt-bootstrap.js?v=20260503-consent-persist-fix"></script>
  <script defer src="../analytics-loader.js"></script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(lesson.title)} &middot; Life Lessons &middot; Today&apos;s Daily Battle</title>
  <meta name="description" content="${esc(lesson.summary)} KJV life lesson for families and grown-ups.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="preload" href="../styles.css?v=20260503-consent-persist-fix" as="style">
  <link rel="stylesheet" href="../styles.css?v=20260503-consent-persist-fix">
  <link rel="preload" href="../life-lessons.css?v=${cssV}" as="style">
  <link rel="stylesheet" href="../life-lessons.css?v=${cssV}">
</head>
<body class="dark-mode tdb-inner-page tdb-ll-lesson-page" data-ll-slug="${esc(lesson.slug)}" data-ll-ref="${esc(lesson.scriptureRef)}"${lesson.redLetter ? ' data-ll-red-letter="1"' : ''}>
  <a href="#main-content" class="skip-link">Skip to lesson</a>
  <main id="main-content" class="tdb-quiet-container tdb-ll-layout">
    <div class="tdb-ll-main-col">
    <nav class="tdb-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="../life-lessons.html">Life Lessons</a></li>
        <li aria-current="page">${esc(lesson.title)}</li>
      </ol>
    </nav>
    <header class="glass tdb-porch-paper-glass tdb-ll-hero">
      <p class="section-note topic-mood-porch">${esc(lesson.testament)} &middot; ${esc(lesson.keyVerseRef)}</p>
      <h1>${esc(lesson.title)}</h1>
      <p class="tdb-ll-key-verse">&ldquo;${esc(lesson.keyVerseText)}&rdquo;</p>
      <p class="section-note util-mb-0">${esc(lesson.summary)}</p>
      <div class="tdb-ll-hero-tags">${tagRow(lesson)}</div>
      <div class="tdb-ll-hero-actions">
        <a class="btn btn-secondary" href="${printHref}">Print this lesson</a>
        <button type="button" class="btn btn-secondary tdb-ll-return-btn" id="tdb-ll-return-btn" data-ll-slug="${esc(lesson.slug)}" aria-pressed="false">I returned to this lesson</button>
      </div>
    </header>
    <section class="glass tdb-porch-paper-glass" aria-labelledby="tdb-ll-scripture-h">
      <h2 class="section-divider" id="tdb-ll-scripture-h">The Scripture</h2>
      ${redNote}
      <blockquote class="tdb-ll-scripture">
        <span id="tdb-ll-scripture-body" class="tdb-ll-kjv">${scriptureBody}</span>
        <cite>${esc(lesson.scriptureRef)} (<abbr title="King James Version">KJV</abbr>)</cite>
      </blockquote>
    </section>
${storyBlock}
    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-learned-h">
      <h2 id="tdb-ll-learned-h">The lesson learned</h2>
      <p>${esc(lesson.learned)}</p>
    </section>
    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-applies-h">
      <h2 id="tdb-ll-applies-h">How it applies today</h2>
      <p>${esc(lesson.applies)}</p>
    </section>
    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-prepare-h">
      <h2 id="tdb-ll-prepare-h">How to prepare the heart</h2>
      <ul>
${listItems(lesson.prepare, true)}
      </ul>
    </section>
${reflectionBlock}
    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-little-h">
      <h2 id="tdb-ll-little-h">For little ones</h2>
      <p>${lesson.littleOnes}</p>
    </section>
    <section class="glass tdb-porch-paper-glass tdb-ll-section" aria-labelledby="tdb-ll-porch-h">
      <h2 id="tdb-ll-porch-h">Tie to the porch</h2>
      <ul class="tdb-ll-porch-list">
${porchLinks(lesson.porch)}
      </ul>
    </section>
    <p class="section-note tdb-ll-bridge"><a href="../life-lessons.html">All Life Lessons</a> &middot; <a href="../bible-study.html">Bible Studies</a> &middot; <a href="../mystudy.html">My Study</a></p>
    </div>
    <aside class="tdb-ll-sidebar glass tdb-porch-paper-glass" aria-labelledby="tdb-ll-sidebar-h">
      <h2 class="section-divider" id="tdb-ll-sidebar-h">Related on the porch</h2>
      <ul class="tdb-ll-sidebar-list">
${porchLinks(lesson.porch)}
      </ul>
      <p class="section-note util-mb-0"><a href="${printHref}">Print this lesson</a></p>
    </aside>
  </main>
  <footer class="site-footer site-footer--canonical" role="contentinfo">
    <nav class="site-footer-essentials" aria-label="Key pages">
      <a href="/">Home</a><span class="site-footer-ess-sep" aria-hidden="true">&middot;</span>
      <a href="../life-lessons.html">Life Lessons</a><span class="site-footer-ess-sep" aria-hidden="true">&middot;</span>
      <a href="/kids/corner.html">Kids</a>
    </nav>
    <p class="footer-humility">We battle. He wins.</p>
  </footer>
${redScript}
  <script src="../register-sw.js" defer></script>
</body>
</html>
`;
}

function printPage(lesson) {
  const canonical = `https://todaysdailybattle.com/life-lessons/${lesson.slug}-print.html`;
  const lessonHref = `${lesson.slug}.html`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Print &middot; ${esc(lesson.title)} &middot; Life Lessons</title>
  <meta name="description" content="Ink-friendly one-page print: ${esc(lesson.title)}. KJV Scripture and practical steps.">
  <link rel="canonical" href="${canonical}">
  <style>
    :root { color-scheme: light; --ink: #17202c; --soft: #4d5a6b; --line: #d7dfeb; --gold: #b98d33; --paper: #fffdfa; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Inter", system-ui, sans-serif; color: var(--ink); background: var(--paper); line-height: 1.38; }
    main { max-width: 8.25in; margin: 0 auto; padding: 0.4in 0.5in 0.5in; }
    h1 { font-size: 1.05rem; margin: 0 0 0.2rem; }
    .eyebrow { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin: 0 0 0.25rem; }
    .lead { color: var(--soft); font-size: 0.78rem; margin: 0 0 0.35rem; }
    .block { border: 1px solid var(--line); border-radius: 8px; padding: 0.28rem 0.38rem; margin-top: 0.22rem; background: #fff; page-break-inside: avoid; }
    .block h2 { font-size: 0.72rem; color: #2f3d4f; margin: 0 0 0.1rem; }
    .kjv { font-size: 0.66rem; margin: 0.08rem 0 0; line-height: 1.32; font-family: Georgia, "Times New Roman", serif; }
    .key { font-size: 0.7rem; font-style: italic; margin: 0.12rem 0 0.2rem; }
    ul { margin: 0.1rem 0 0; padding-left: 1rem; font-size: 0.66rem; }
    li { margin-bottom: 0.12rem; }
    p { font-size: 0.66rem; margin: 0.08rem 0 0; }
    .footer { margin-top: 0.35rem; font-size: 0.68rem; color: var(--soft); }
    .no-print { margin-bottom: 0.35rem; font-size: 0.78rem; }
    .no-print a { color: #2d4a6f; }
    @media print { .no-print { display: none; } main { max-width: none; padding: 0.15in 0.2in; } a { color: inherit; text-decoration: none; } }
  </style>
</head>
<body>
  <main>
    <p class="no-print"><a href="${lessonHref}">Open on this device</a> &middot; <a href="../life-lessons.html">All Life Lessons</a> &middot; <a href="../printables.html">Print hub</a> &middot; <a href="/">Home</a></p>
    <p class="eyebrow">Life Lessons &middot; <abbr title="King James Version">KJV</abbr> &middot; printable</p>
    <h1>${esc(lesson.title)}</h1>
    <p class="key">&ldquo;${esc(lesson.keyVerseText)}&rdquo; &mdash; ${esc(lesson.keyVerseRef)}</p>
    <p class="lead">${esc(lesson.summary)}</p>
    <div class="block">
      <h2>The Scripture (${esc(lesson.scriptureRef)})</h2>
      <p class="kjv">${esc(lesson.scriptureText)}</p>
    </div>
    <div class="block">
      <h2>The story / setting</h2>
      <p>${esc(lesson.story)}</p>
    </div>
    <div class="block">
      <h2>The lesson learned</h2>
      <p>${esc(lesson.learned)}</p>
    </div>
    <div class="block">
      <h2>How it applies today</h2>
      <p>${esc(lesson.applies)}</p>
    </div>
    <div class="block">
      <h2>How to prepare the heart</h2>
      <ul>
${listItems(lesson.prepare, true)}
      </ul>
    </div>
    <div class="block">
      <h2>Quiet reflection (optional)</h2>
      <ul>
${listItems(lesson.reflection)}
      </ul>
    </div>
    <div class="block">
      <h2>For little ones</h2>
      <p>${lesson.littleOnes.replace(/<[^>]+>/g, '')}</p>
    </div>
    <p class="footer">todaysdailybattle.com &middot; We battle. He wins. &middot; Return anytime&mdash;no score.</p>
  </main>
</body>
</html>
`;
}

function hubCards() {
  return LIFE_LESSONS.map((lesson) => {
    const topics = topicsAttr(lesson.topics);
    return `        <article class="tdb-ll-card" role="listitem" data-ll-topics="${topics}" data-ll-title="${esc(lesson.title.toLowerCase())}" data-ll-summary="${esc(lesson.summary.toLowerCase())}">
          <h2><a href="life-lessons/${lesson.slug}.html">${esc(lesson.title)}</a></h2>
          <p class="tdb-ll-card-verse"><span class="tdb-ll-card-ref">${esc(lesson.keyVerseRef)}</span> &mdash; ${esc(lesson.keyVerseText)}</p>
          <p class="tdb-ll-card-summary">${esc(lesson.summary)}</p>
          <div class="tdb-ll-card-tags">${tagRow(lesson)} <span class="tdb-ll-tag">${esc(lesson.testament)}</span></div>
          <div class="tdb-ll-card-links">
            <a href="life-lessons/${lesson.slug}.html">Open lesson</a>
            <span aria-hidden="true">&middot;</span>
            <a href="life-lessons/${lesson.slug}-print.html">Print</a>
          </div>
        </article>`;
  }).join('\n');
}

function topicChips() {
  const set = new Set();
  LIFE_LESSONS.forEach((l) => (l.topics || []).forEach((t) => set.add(t)));
  return [...set]
    .sort()
    .map((t) => `<button type="button" class="tdb-ll-topic-chip" data-ll-topic="${esc(t)}">${esc(t.replace(/-/g, ' '))}</button>`)
    .join('\n        ');
}

function dataJs() {
  const payload = LIFE_LESSONS.map((l) => ({
    slug: l.slug,
    title: l.title,
    keyVerseRef: l.keyVerseRef,
    summary: l.summary,
    topics: l.topics,
    families: l.families,
    grownups: l.grownups,
  }));
  return `/** Auto-generated by scripts/build-life-lessons-pages.mjs — do not edit by hand */\n(function (g) {\n  'use strict';\n  g.TDB_LIFE_LESSONS = ${JSON.stringify(payload, null, 2)};\n})(typeof window !== 'undefined' ? window : this);\n`;
}

function patchHub() {
  const hubPath = path.join(root, 'life-lessons.html');
  if (!fs.existsSync(hubPath)) return;
  let html = fs.readFileSync(hubPath, 'utf8');
  const start = '<!-- TDB_LL_CARDS_START -->';
  const end = '<!-- TDB_LL_CARDS_END -->';
  const chipsStart = '<!-- TDB_LL_TOPICS_START -->';
  const chipsEnd = '<!-- TDB_LL_TOPICS_END -->';
  if (!html.includes(start)) return;
  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${hubCards()}\n      ${end}`);
  html = html.replace(
    new RegExp(`${chipsStart}[\\s\\S]*?${chipsEnd}`),
    `${chipsStart}\n        ${topicChips()}\n        ${chipsEnd}`
  );
  fs.writeFileSync(hubPath, html, 'utf8');
}

let count = 0;
for (const lesson of LIFE_LESSONS) {
  const lessonHtml = lessonPage(lesson);
  const printHtml = printPage(lesson);
  fs.writeFileSync(path.join(lessonsDir, `${lesson.slug}.html`), lessonHtml, 'utf8');
  fs.writeFileSync(path.join(lessonsDir, `${lesson.slug}-print.html`), printHtml, 'utf8');
  count += 2;
}

fs.writeFileSync(path.join(root, 'life-lessons-data.js'), dataJs(), 'utf8');
patchHub();
console.log(`Life Lessons: wrote ${count} pages + life-lessons-data.js (${LIFE_LESSONS.length} lessons), hub patched`);

export { hubCards, topicChips, LIFE_LESSONS };
