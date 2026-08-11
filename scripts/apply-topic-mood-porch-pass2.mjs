#!/usr/bin/env node
/**
 * Site Guardian pass: ensure topic-mood-porch appears on remaining product HTML.
 * Idempotent: safe to re-run.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  'next-app',
  'partials',
  'api',
  'playwright-report',
]);

const PORCH = {
  en: `You&rsquo;re already welcome here&mdash;rest first; one verse at a time.`,
  es: `Ya est&aacute;s bienvenido aqu&iacute;&mdash;sin prisa; un vers&iacute;culo a la vez.`,
  fr: `Tu es d&eacute;j&agrave; le bienvenu ici&mdash;sans h&acirc;te. Un verset &agrave; la fois.`,
  pt: `Voc&ecirc; j&aacute; &eacute; bem-vindo aqui&mdash;sem pressa. Um vers&iacute;culo de cada vez.`,
  zh: `在这里你已经受到欢迎——不必急，一节经文慢慢读。`,
  hi: `आप यहाँ पहले से स्वागत हैं—जल्दी न करें; एक समय में एक वचन।`,
  ar: `أنت مرحّب به هنا بالفعل—بلا عجلة؛ آية واحدة في كل مرة.`,
  bn: `আপনি এখানে ইতিমধ্যেই স্বাগত—তাড়াহুড়ো নয়; একটা পঙ্ক্তি একবারে।`,
  id: `Anda sudah diterima di sini&mdash;tanpa tergesa; satu ayat pada satu waktu.`,
  ru: `Вы уже желанны здесь&mdash;без спешки; стих за раз.`,
  sv: `Du &auml;r redan v&auml;lkommen h&auml;r&mdash;ingen br&aring;dska; en vers i taget.`,
  sw: `Umeshakukaribishwa hapa&mdash;si haraka; mistari moja kwa wakati.`,
  tl: `Maligayang pagdating&mdash;huwag magmadali; isang talata sa bawat pagkakataon.`,
};

function walkHtmlFiles(startDir, out = []) {
  for (const ent of fs.readdirSync(startDir, { withFileTypes: true })) {
    const base = ent.name;
    if (base.startsWith('.')) continue;
    const p = path.join(startDir, base);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(base)) continue;
      walkHtmlFiles(p, out);
    } else if (base.endsWith('.html')) {
      if (/^lighthouse/i.test(base)) continue;
      out.push(p);
    }
  }
  return out;
}

function porchForLang(langRaw) {
  const base = (langRaw || 'en').split('-')[0].toLowerCase();
  return PORCH[base] || PORCH.en;
}

function langAttrFromRaw(langRaw) {
  const low = (langRaw || 'en').toLowerCase();
  if (low.startsWith('zh')) return 'zh-CN';
  return low.split('-')[0];
}

function applyMoodHeroPorch(html, _rel) {
  const headerRe = /<header class="hero-banner[^"]*">[\s\S]*?<\/header>/;
  const block = html.match(headerRe);
  if (!block || !block[0].includes('real-talk')) return html;
  if (block[0].includes('topic-mood-porch')) return html;

  const langM = html.match(/<html[^>]*\s+lang="([^"]+)"/i);
  const langRaw = langM ? langM[1] : 'en';
  const porchText = porchForLang(langRaw);
  const langAttr = langAttrFromRaw(langRaw);

  const noteAfterH1 =
    /(<header class="hero-banner[^"]*">[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*\n)(\s*<p class="section-note)(?![^>]*\btopic-mood-porch\b)([^>]*>)/;
  if (noteAfterH1.test(html)) {
    return html.replace(noteAfterH1, `$1$2 topic-mood-porch$3`);
  }

  const beforeRt = /(<header class="hero-banner[^"]*">[\s\S]*?)(\n\s*<p class="real-talk">)/;
  if (!beforeRt.test(html)) return html;
  const insert = `\n          <p class="section-note util-mb-0_5 topic-mood-porch" lang="${langAttr}">${porchText}</p>`;
  return html.replace(beforeRt, `$1${insert}$2`);
}

const UNIV_PORCH = `<p class="section-note topic-mood-porch" style="color: var(--muted); font-size: 1.02rem; max-width: 36rem; margin: 0 auto 0.65rem; line-height: 1.55;">You&rsquo;re already welcome here&mdash;this seasonal room is a porch, not a performance.</p>`;

function applyUniversityPorch(html) {
  return html.replace(
    /(<h1 class="(acu|bsu|shu|psu|eru)-title">[\s\S]*?<\/h1>\s*\n\s*)(<p class="\2-lead">)/g,
    (m, g1, _pref, g3) => {
      if (m.includes('topic-mood-porch')) return m;
      return `${g1}${UNIV_PORCH}\n        ${g3}`;
    },
  );
}

function applyYagPorch(html) {
  if (!html.includes('class="yag-porch"')) return html;
  if (/class="yag-porch topic-mood-porch"/.test(html) || /class="yag-porch"[^>]*topic-mood-porch/.test(html))
    return html;
  return html.replace(/class="yag-porch"/, 'class="yag-porch topic-mood-porch"');
}

function applyFaLittlesPorch(html) {
  const re =
    /<p class="section-note" style="margin:0 0 0.5rem; color: rgba\(148, 163, 184, 0.95\);">KJV on this page/;
  if (!re.test(html) || html.includes('Family Armor for Little Ones') === false) return html;
  if (/KJV on this page[\s\S]{0,120}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /<p class="section-note" style="margin:0 0 0.5rem; color: rgba\(148, 163, 184, 0.95\);">/,
    '<p class="section-note topic-mood-porch" style="margin:0 0 0.5rem; color: rgba(148, 163, 184, 0.95);">',
  );
}

function applyTeenJournalPorch(html) {
  if (!html.includes('Teen journal sheet')) return html;
  if (/Teen journal sheet[\s\S]{0,280}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /<h1 class="section-divider">Teen journal sheet<\/h1>\s*\n/,
    `<h1 class="section-divider">Teen journal sheet</h1>\n    <p class="section-note topic-mood-porch util-mb-0_5" lang="en">You&rsquo;re already welcome here&mdash;this sheet is a porch, not a deadline.</p>\n`,
  );
}

function apply404Porch(html) {
  if (!html.includes('tdb-404-hero')) return html;
  if (/tdb-404-hero[\s\S]{0,400}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /<section class="glass tdb-404-hero"[^>]*>[\s\S]*?<h1[^>]*>[\s\S]*?<\/h1>\s*\n\s*<p class="section-note"/,
    (m) => m.replace('<p class="section-note"', '<p class="section-note topic-mood-porch"'),
  );
}

const KIDS_PORCH = `        <p class="section-note topic-mood-porch kids-site-porch" lang="en">No rush—pick one thing.</p>`;

function applyKidsBattleInner(html, rel) {
  if (!rel.startsWith(`kids${path.sep}`)) return html;
  if (!html.includes('content-inner kids-battle-inner')) return html;
  if (/content-inner kids-battle-inner[^"]*"?>[\s\S]{0,220}topic-mood-porch/.test(html)) return html;
  return html.replace(/(<div class="content-inner kids-battle-inner[^"]*">)/, `$1\n${KIDS_PORCH}`);
}

function applyKidsMiscInner(html, rel) {
  if (!rel.startsWith(`kids${path.sep}`)) return html;
  if (html.includes('topic-mood-porch')) return html;
  const patterns = [
    /(<div class="content-inner gn-page">)/,
    /(<div class="content-inner mp-page">)/,
    /(<div class="content-inner match-page">)/,
    /(<div class="content-inner sp-page">)/,
    /(<div class="content-inner" style="max-width:32rem[^"]*">)/,
    /(<div class="content-inner" style="max-width:36rem[^"]*">)/,
  ];
  let s = html;
  for (const re of patterns) {
    if (re.test(s)) return s.replace(re, `$1\n${KIDS_PORCH}`);
  }
  return s;
}

function applyKidsCornerRoot(html, rel) {
  if (rel !== 'kids-corner.html') return html;
  if (!html.includes('content-inner kids-corner-page loop-library-page')) return html;
  if (/loop-library-page"?>[\s\S]{0,220}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /(<div class="content-inner kids-corner-page loop-library-page">)/,
    `$1\n${KIDS_PORCH}`,
  );
}

function mergeClass(html, pattern, classToAdd) {
  if (!pattern.test(html)) return html;
  return html.replace(pattern, (m) => {
    if (m.includes(classToAdd)) return m;
    return m.replace(/class="([^"]*)"/, (_, c) => `class="${c} ${classToAdd}"`);
  });
}

function applyPrintSheetNotes(html) {
  let s = html;
  s = mergeClass(
    s,
    /<p class="section-note" style="margin:0\.2rem 0 0\.4rem;font-size:0\.9rem;color:var\(--muted,#8896b0\)">You&rsquo;re already welcome here&mdash;print when it helps/,
    'topic-mood-porch',
  );
  s = mergeClass(
    s,
    /<p class="section-note" style="margin:0\.15rem 0 0\.45rem;font-size:0\.9rem">You&rsquo;re already welcome here&mdash;color one sheet/,
    'topic-mood-porch',
  );
  s = mergeClass(
    s,
    /<p class="lead" style="margin:0 0 0\.65rem[^"]*">You&rsquo;re already welcome here&mdash;print only what helps/,
    'topic-mood-porch',
  );
  return s;
}

function applyOneWeekRhythmKids(html, rel) {
  if (rel !== 'one-week-rhythm-kids.html') return html;
  if (html.includes('topic-mood-porch')) return html;
  return html.replace(
    /(<p class="subtitle">Kids & Family Edition<br>A gentle time to meet with Jesus together<\/p>)/,
    `$1\n\n  <p class="topic-mood-porch rhythm-kids-porch" style="text-align:center;color:#6b5742;font-size:16px;margin:0 auto 24px;max-width:36rem;line-height:1.55;font-style:normal;">You&rsquo;re already welcome here&mdash;this quiet week on paper is a porch, not a race.</p>`,
  );
}

function applyAdminHero(html, rel) {
  if (rel !== 'admin.html') return html;
  if (/Admin Panel[\s\S]{0,120}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /(<h1>Admin Panel<\/h1>\s*\n)/,
    `$1          <p class="section-note topic-mood-porch" lang="en">You&rsquo;re already welcome here&mdash;owner tools stay private, unhurried, and for faithful care.</p>\n`,
  );
}

function apply404AdminPorch(html, rel) {
  if (rel !== '404-admin.html') return html;
  if (html.includes('topic-mood-porch')) return html;
  return html.replace(
    /(<h1 class="section-divider"[^>]*>Admin access only<\/h1>\s*\n\s*)<p class="section-note" style="margin-bottom: 1rem;">/,
    `$1<p class="section-note topic-mood-porch" style="margin-bottom: 1rem;">`,
  );
}

function applyStatsPorch(html, rel) {
  if (rel !== 'stats.html') return html;
  if (html.includes('topic-mood-porch')) return html;
  return html.replace(
    /<p class="section-note">Private\. Enter password to view\.<\/p>/,
    '<p class="section-note topic-mood-porch">Private. Enter password to view.</p>',
  );
}

function applyMobiusMinimal(html, rel) {
  if (rel !== 'mobius-minimal.html') return html;
  if (html.includes('topic-mood-porch')) return html;
  return html.replace(
    /<main id="main-content">/,
    `<main id="main-content">\n    <p class="topic-mood-porch" style="font-size:0.95rem;color:#444;max-width:32ch;text-align:center;margin:0 auto 0.5rem;line-height:1.5;">You&rsquo;re already welcome here&mdash;one path, no dead end in Him.</p>`,
  );
}

function applyVPage(html, rel) {
  if (rel !== 'v.html') return html;
  if (/v-page[\s\S]{0,200}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /(<h1>KJV verse<\/h1>\s*\n)/,
    `$1    <p class="section-note topic-mood-porch" lang="en">You&rsquo;re already welcome here&mdash;shared link, same gentle Word.</p>\n`,
  );
}

function applyTestSearchDiagnosis(html, rel) {
  if (rel !== 'test-search-diagnosis.html') return html;
  if (/Search diagnosis[\s\S]{0,120}topic-mood-porch/.test(html)) return html;
  return html.replace(
    /(<h1>Search diagnosis<\/h1>\s*\n)/,
    `$1  <p class="topic-mood-porch" style="font-size:0.95rem;color:#cbd5e1;margin:0 0 1.25rem;line-height:1.55;max-width:42rem;">You&rsquo;re already welcome here&mdash;builder-only checks; nothing here grades your soul.</p>\n`,
  );
}

function applyModalPartial(html, rel) {
  if (rel !== 'modal.html') return html;
  if (html.includes('topic-mood-porch')) return html;
  return html.replace(
    /(<h2 id="prayer-history-modal-title"[^>]*>Prayer History<\/h2>\s*\n)/,
    `$1    <p class="section-note topic-mood-porch" lang="en">You&rsquo;re already welcome here&mdash;this history stays local and unranked.</p>\n`,
  );
}

function applyTinyUtilityPages(html, rel) {
  let s = html;
  if (rel === 'blocked.html' && !s.includes('topic-mood-porch')) {
    s = s.replace(
      /<body>/,
      `<body>\n  <p class="topic-mood-porch" style="max-width:28rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.55;color:#333;">You&rsquo;re already welcome here&mdash;this doorway is closed, but you are not.</p>`,
    );
  }
  if (rel === 'dashboard.html' && !s.includes('topic-mood-porch')) {
    s = s.replace(
      /<body>/,
      `<body>\n  <p class="topic-mood-porch" style="max-width:28rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.55;color:#333;">You&rsquo;re already welcome here&mdash;continuing to your progress.</p>`,
    );
  }
  if (rel === path.join('about', 'index.html') && !s.includes('topic-mood-porch')) {
    s = s.replace(
      /<body>/,
      `<body>\n  <p class="topic-mood-porch" style="max-width:28rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.55;color:#333;">You&rsquo;re already welcome here&mdash;redirecting to About.</p>`,
    );
  }
  if (rel === path.join('kids', 'kids-corner.html') && !s.includes('topic-mood-porch')) {
    s = s.replace(
      /<body>/,
      `<body>\n  <p class="topic-mood-porch" style="max-width:28rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.55;color:#333;">You&rsquo;re already welcome here&mdash;same doorway, new URL.</p>`,
    );
  }
  return s;
}

function transform(html, rel) {
  let s = html;
  s = applyMoodHeroPorch(s, rel);
  s = applyUniversityPorch(s);
  s = applyYagPorch(s);
  s = applyFaLittlesPorch(s);
  s = applyTeenJournalPorch(s);
  s = apply404Porch(s);
  s = applyKidsBattleInner(s, rel);
  s = applyKidsMiscInner(s, rel);
  s = applyKidsCornerRoot(s, rel);
  s = applyPrintSheetNotes(s);
  s = applyOneWeekRhythmKids(s, rel);
  s = applyAdminHero(s, rel);
  s = apply404AdminPorch(s, rel);
  s = applyStatsPorch(s, rel);
  s = applyMobiusMinimal(s, rel);
  s = applyVPage(s, rel);
  s = applyTestSearchDiagnosis(s, rel);
  s = applyModalPartial(s, rel);
  s = applyTinyUtilityPages(s, rel);
  return s;
}

function main() {
  const files = walkHtmlFiles(ROOT);
  let updated = 0;
  for (const abs of files) {
    const rel = path.relative(ROOT, abs);
    let s = fs.readFileSync(abs, 'utf8');
    const next = transform(s, rel);
    if (next !== s) {
      fs.writeFileSync(abs, next, 'utf8');
      updated++;
      console.log(rel);
    }
  }
  console.error('apply-topic-mood-porch-pass2: updated', updated, 'files');
}

main();
