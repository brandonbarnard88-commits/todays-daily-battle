#!/usr/bin/env node
/**
 * After build-copy-static, inject UTC day-of-year hero verse into dist/index.html so the parser can
 * paint verse text before deferred hero scripts run. Adds data-tdb-hero-prebuilt="1" for first-paint
 * logic (DOM verse until hero-daily-365-data.js loads). Verse source: hero-daily-365-data.js.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';
import {
  buildHeroLaymanPlain,
  loadVersePlainMeanings,
} from './lib/hero-layman-plain.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');
const rootIndex = path.join(root, 'index.html');

function loadHeroExplanationsMap() {
  try {
    const code = fs.readFileSync(path.join(root, 'hero-daily-365-explanations.js'), 'utf8');
    const sandbox = { console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.runInNewContext(code, sandbox, { filename: 'hero-daily-365-explanations.js' });
    const list = sandbox.__TDB_HERO_DAILY_EXPLANATIONS;
    const map = Object.create(null);
    if (Array.isArray(list)) {
      for (const row of list) {
        if (!row || !row.ref) continue;
        map[normalizeRefBare(row.ref)] = row;
      }
    }
    return map;
  } catch (e) {
    return Object.create(null);
  }
}

function loadVerseContextResolver() {
  try {
    const code = fs.readFileSync(path.join(root, 'verse-context.js'), 'utf8');
    const sandbox = { console };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.runInNewContext(code, sandbox, { filename: 'verse-context.js' });
    return typeof sandbox.TDB_resolveVerseContext === 'function'
      ? sandbox.TDB_resolveVerseContext
      : null;
  } catch (e) {
    return null;
  }
}

function composeInjectedCombined(situation, plain) {
  const sit = String(situation || '').replace(/\s+/g, ' ').trim();
  const p = String(plain || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .replace(/^What it means:\s*/i, '');
  if (sit && p) {
    if (/^What was going on:/i.test(p) || p.toLowerCase().indexOf(sit.slice(0, 24).toLowerCase()) === 0) {
      return p;
    }
    return 'What was going on: ' + sit.replace(/\.$/, '') + '. What it means: ' + p;
  }
  return p || sit || '';
}

/** Replace stub id="tdb-home-daily-graph" (source index.html → dist) with UTC verse graph. */
const HOME_DAILY_LD_RE =
  /<script nonce="tdb2025s" type="application\/ld\+json" id="tdb-home-daily-graph">\s*[\s\S]*?<\/script>/;

function buildHomeLdGraph(title, desc, refPlain, textPlain) {
  const site = 'https://todaysdailybattle.com';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': site + '/#webpage',
        url: site + '/',
        name: title,
        description: desc,
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          name: "Today's Daily Battle",
          url: site + '/',
        },
        mainEntity: { '@id': site + '/#home-daily-verse' },
      },
      {
        '@type': 'CreativeWork',
        '@id': site + '/#home-daily-verse',
        name: refPlain + ' (KJV)',
        headline: refPlain + ' (KJV)',
        text: textPlain,
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        isBasedOn: {
          '@type': 'Book',
          name: 'Holy Bible',
          bookEdition: 'King James Version',
        },
      },
    ],
  };
}

function fail(msg) {
  console.error('inject-home-hero:', msg);
  process.exit(1);
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeRefBare(ref) {
  return String(ref || '')
    .replace(/\uFEFF/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*\(KJV\)\s*$/i, '')
    .replace(/^Matt\b\.?\s+/i, 'Matthew ')
    .replace(/^Mt\.?\s+/i, 'Matthew ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHeroKjvLine(t) {
  let s = String(t == null ? '' : t).replace(/\uFEFF/g, '');
  s = s.replace(/\*\*([^*]{0,400}?)\*\*/g, '$1').replace(/\*([^*\n]{0,400}?)\*/g, '$1');
  s = s.replace(/__([^_]{0,400}?)__/g, '$1');
  s = s.replace(/\s+/g, ' ').trim();
  if (/^are the light of the world\.?$/i.test(s)) {
    s = 'Ye are the light of the world.';
  }
  if (/^[\"'\u201c\u2018\u201d\u2019]*\s*are the light of the world\.?\s*[\"'\u201c\u201d]*$/i.test(s)) {
    s = 'Ye are the light of the world.';
  }
  if (s.length <= 220 && !/\bye\b/i.test(s) && /\bare the light of the world\.?$/i.test(s.trim())) {
    s = 'Ye are the light of the world.';
  }
  return s;
}

function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildReadChapterHref(refStr) {
  const m = refStr.match(/^(.+?)\s+(\d+):\d+/);
  if (!m) return null;
  const book = encodeURIComponent(m[1].trim());
  const chapter = encodeURIComponent(m[2]);
  return (
    'reader.html?book=' +
    book +
    '&chapter=' +
    chapter +
    '&ref=' +
    encodeURIComponent(refStr.trim().replace(/\s+/g, ' '))
  );
}

/** Easy first-paint lesson copy for inject (mirrors hero-daily-first-paint tone). */
function buildInjectedHeroLesson(refPlain, textPlain, plainMap, explMap, resolveCtx) {
  const ref = normalizeRefBare(refPlain);
  const text = String(textPlain || '').replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();
  const expl = (explMap && explMap[ref]) || null;
  let meaningOnly = '';
  let step =
    'Read it slowly one more time out loud. Thank God for one clear thing it says, then take the next small step with that line in mind.';
  let prayer =
    'Lord, sink ' +
    refPlain +
    ' into my heart—not as noise, but as truth that changes how I walk. In Jesus’ name, Amen.';

  if (/^psalm\s+90\s*:\s*14$/i.test(ref) || /satisfy us early with thy mercy/i.test(lower)) {
    meaningOnly =
      'God, fill us early with Your kindness, so we can rejoice and be glad all day long.';
    step =
      'Before you open messages, pray once: “Satisfy me early with Your mercy.” Then name one thing you can be glad for today.';
    prayer =
      'Lord, sink Psalm 90:14 into my heart—not as noise, but as truth that changes how I walk. In Jesus’ name, Amen.';
  } else if (expl && expl.plain) {
    meaningOnly = String(expl.plain).replace(/\s+/g, ' ').trim();
    if (expl.step) step = String(expl.step).replace(/\s+/g, ' ').trim();
  } else {
    // Prefer curated plain meanings (Psalm/Psalms alias-safe). Never echo the KJV with a prefix.
    meaningOnly = buildHeroLaymanPlain(ref, text, plainMap);
  }

  let situation = expl && expl.setting ? String(expl.setting).replace(/\s+/g, ' ').trim() : '';
  if (!situation && typeof resolveCtx === 'function') {
    try {
      const hit = resolveCtx(ref) || {};
      situation = String(hit.situation || hit.setting || '').replace(/\s+/g, ' ').trim();
    } catch (eCtx) {
      /* non-fatal */
    }
  }
  const combined = composeInjectedCombined(situation, meaningOnly);
  return {
    plain: combined || meaningOnly,
    meaningOnly: meaningOnly || '',
    situation,
    step,
    prayer,
  };
}

function applyHeroInject(html, label, refPlain, textPlain, verseInner, plainMap, explMap, resolveCtx) {
  const heroVerseRe = /<p[^>]*\bid="heroVerse"[^>]*>[\s\S]*?<\/p>/;
  if (!heroVerseRe.test(html)) fail('could not find #heroVerse paragraph in ' + label);
  html = html.replace(
    heroVerseRe,
    '<p class="hero-verse verse-body is-visible" id="heroVerse" elementtiming="tdb-hero-verse">' + verseInner + '</p>'
  );

  const heroRefRe = /<p[^>]*\bid="heroRef"[^>]*>[\s\S]*?<\/p>/;
  if (!heroRefRe.test(html)) fail('could not find #heroRef in ' + label);
  html = html.replace(
    heroRefRe,
    '<p class="big-kjv verse-ref hero-daily-ref-above" id="heroRef"><strong>' + escapeHtmlText(refPlain) + ' (KJV)</strong></p>'
  );

  if (!html.includes('data-tdb-hero-prebuilt')) {
    const verseCardRe = /<section\b[^>]*\bid="verseCard"[^>]*>/;
    if (!verseCardRe.test(html)) fail('could not find #verseCard <section> in ' + label);
    html = html.replace(verseCardRe, function (full) {
      if (full.includes('data-tdb-hero-prebuilt')) return full;
      return full.slice(0, -1) + ' data-tdb-hero-prebuilt="1">';
    });
  }

  html = html.replace(/<button([^>]*id="heroWordStudyBtn"[^>]*)>/, function (_full, inner) {
    let u = inner.replace(
      /data-tdb-wordstudy-ref="[^"]*"/,
      'data-tdb-wordstudy-ref="' + escapeHtmlAttr(refPlain) + '"'
    );
    u = u.replace(
      /data-tdb-wordstudy-text="[^"]*"/,
      'data-tdb-wordstudy-text="' + escapeHtmlAttr(textPlain) + '"'
    );
    return '<button' + u + '>';
  });

  // Prefill split situation + meaning so first paint is scannable (labels separate from body).
  const lesson = buildInjectedHeroLesson(refPlain, textPlain, plainMap, explMap, resolveCtx);
  let meaningOnly = String(lesson.meaningOnly || lesson.plain || '')
    .replace(/^What was going on:[\s\S]*?What it means:\s*/i, '')
    .trim();
  const sitOnly = String(lesson.situation || '').trim();
  const combined =
    sitOnly && meaningOnly
      ? 'What was going on: ' + sitOnly.replace(/\.$/, '') + '. What it means: ' + meaningOnly
      : lesson.plain || meaningOnly || sitOnly;
  html = html.replace(
    /(<p id="heroSimpleBreakdown"[^>]*>)[\s\S]*?(<\/p>)/,
    '$1' + escapeHtmlText(combined) + '$2'
  );
  if (sitOnly) {
    html = html.replace(
      /(<p[^>]*id="heroSimpleSituation"[^>]*>)[\s\S]*?(<\/p>)/,
      '$1' + escapeHtmlText(sitOnly) + '$2'
    );
    html = html.replace(
      /(<div class="hero-vbd-bundle" id="heroVbdRowSit"[^>]*)\s*hidden/,
      '$1'
    );
    html = html.replace(
      /(<p[^>]*id="heroDeepSituation"[^>]*>)[\s\S]*?(<\/p>)/,
      '$1' + escapeHtmlText(sitOnly) + '$2'
    );
  }
  if (meaningOnly) {
    html = html.replace(
      /(<p[^>]*id="heroSimpleMeaning"[^>]*>)[\s\S]*?(<\/p>)/,
      '$1' + escapeHtmlText(meaningOnly) + '$2'
    );
  }
  if (explMap) {
    const expl = explMap[normalizeRefBare(refPlain)];
    if (expl && expl.about) {
      html = html.replace(
        /(<div class="hero-vbd-bundle" id="heroVbdRowWho"[^>]*)\s*hidden/,
        '$1'
      );
      html = html.replace(
        /(<p[^>]*\bid="heroDeepWho"[^>]*>)[\s\S]*?(<\/p>)/,
        '$1' + escapeHtmlText(String(expl.about)) + '$2'
      );
    }
    if (expl && expl.to) {
      html = html.replace(
        /(<div class="hero-vbd-bundle" id="heroVbdRowAud"[^>]*)\s*hidden/,
        '$1'
      );
      html = html.replace(
        /(<p[^>]*\bid="heroDeepAudience"[^>]*>)[\s\S]*?(<\/p>)/,
        '$1' + escapeHtmlText(String(expl.to)) + '$2'
      );
    }
  }
  html = html.replace(
    /(<span id="heroVotdOneStep">)[\s\S]*?(<\/span>)/,
    '$1' + escapeHtmlText(lesson.step) + '$2'
  );
  html = html.replace(
    /(<span id="heroVotdPrayer">)[\s\S]*?(<\/span>)/,
    '$1' + escapeHtmlText(lesson.prayer) + '$2'
  );

  html = html.replace(
    /<p class="verse-img-text" id="verseImgText"><\/p>/,
    '<p class="verse-img-text" id="verseImgText">' + verseInner + '</p>'
  );
  html = html.replace(
    /<p class="verse-img-ref" id="verseImgRef"><\/p>/,
    '<p class="verse-img-ref" id="verseImgRef">' + escapeHtmlText(refPlain) + '</p>'
  );

  const href = buildReadChapterHref(refPlain);
  if (href) {
    const m2 = refPlain.match(/^(.+?)\s+(\d+):\d+/);
    const alabel = m2
      ? 'Read ' + m2[1].trim() + ' chapter ' + m2[2] + ' in full context'
      : 'Read the full chapter';
    const linkRe =
      /<a href="[^"]*" id="readChapterLink" class="read-chapter-link"[^>]*>/;
    if (linkRe.test(html)) {
      html = html.replace(
        linkRe,
        '<a href="' +
          href +
          '" id="readChapterLink" class="read-chapter-link" aria-label="' +
          escapeHtmlAttr(alabel) +
          '">'
      );
    }
  }

  const brandTitle =
    'Today\u2019s Daily Battle \u2014 One KJV verse for what you\u2019re carrying';
  const title = brandTitle;
  const desc =
    'Today\u2019s verse: ' +
    refPlain +
    ' (KJV). One KJV verse for what you\u2019re carrying. Free. Private. No ads, no login wall.';
  const ldWebPageName = brandTitle + ' \u00b7 Today\u2019s KJV: ' + refPlain;

  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtmlText(title) + '</title>');
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    '<meta name="description" content="' + escapeHtmlAttr(desc) + '"'
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    '<meta property="og:title" content="' + escapeHtmlAttr(title) + '"'
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    '<meta property="og:description" content="' + escapeHtmlAttr(desc) + '"'
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    '<meta name="twitter:title" content="' + escapeHtmlAttr(title) + '"'
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    '<meta name="twitter:description" content="' + escapeHtmlAttr(desc) + '"'
  );

  if (!HOME_DAILY_LD_RE.test(html)) {
    fail(label + ' missing id="tdb-home-daily-graph" stub — sync index.html comment block');
  }
  const homeLdPretty = JSON.stringify(buildHomeLdGraph(ldWebPageName, desc, refPlain, textPlain), null, 2);
  html = html.replace(
    HOME_DAILY_LD_RE,
    '<script nonce="tdb2025s" type="application/ld+json" id="tdb-home-daily-graph">\n' +
      homeLdPretty +
      '\n  </script>',
  );

  var appleShort = 'Quiet place · ' + refPlain;
  if (appleShort.length > 29) {
    appleShort = refPlain.length > 26 ? refPlain.slice(0, 24) + '…' : refPlain;
  }
  html = html.replace(
    /<meta name="apple-mobile-web-app-title" content="[^"]*"/,
    '<meta name="apple-mobile-web-app-title" content="' + escapeHtmlAttr(appleShort) + '"'
  );

  /* Strip stray markdown fence lines occasionally left by editors / partial MD pastes into HTML. */
  html = html
    .replace(/^\s*```\s*$/gm, '')
    .replace(/\n(?:\s*```\s*\n){2,}/g, '\n');

  return html;
}

function main() {
  if (!fs.existsSync(distIndex)) {
    fail('dist/index.html missing — run build-copy-static first.');
  }
  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  if (!v || !v.ref || !v.text) {
    fail('invalid verse from 365 list');
  }
  const plainMap = loadVersePlainMeanings(root);
  const explMap = loadHeroExplanationsMap();
  const resolveCtx = loadVerseContextResolver();

  const refPlain = String(v.ref).trim();
  const refNorm = normalizeRefBare(refPlain);
  let textPlain = normalizeHeroKjvLine(v.text);
  if (/^matthew\s+5\s*:\s*14$/i.test(refNorm) && !/^ye\s+/i.test(textPlain.replace(/\uFEFF/g, '').trim())) {
    textPlain = 'Ye are the light of the world.';
  }
  const verseInner = '\u201c' + escapeHtmlText(textPlain) + '\u201d';

  const targets = [
    { path: distIndex, label: 'dist/index.html' },
    { path: rootIndex, label: 'index.html' },
  ];
  for (const t of targets) {
    if (!fs.existsSync(t.path)) continue;
    const next = applyHeroInject(
      fs.readFileSync(t.path, 'utf8'),
      t.label,
      refPlain,
      textPlain,
      verseInner,
      plainMap,
      explMap,
      resolveCtx
    );
    fs.writeFileSync(t.path, next, 'utf8');
  }

  // Match preloads in index.html + verse.html — must exist on origin before SW install or 404 in console.
  const distDir = path.join(root, 'dist');
  const verseJson = (verse, dayOfYear) =>
    JSON.stringify(
      {
        ref: String(verse.ref).trim(),
        text: String(verse.text).trim(),
        dayOfYear,
        source: 'hero-daily-365',
      },
      null,
      0
    ) + '\n';
  const yDate = new Date();
  yDate.setUTCDate(yDate.getUTCDate() - 1);
  const vYesterday = pickVerseForToday(year365, yDate);
  fs.writeFileSync(path.join(distDir, 'today-kjv-verse.json'), verseJson(v, utcDayOfYear()), 'utf8');
  fs.writeFileSync(
    path.join(distDir, 'yesterday-kjv-verse.json'),
    verseJson(vYesterday, utcDayOfYear(yDate)),
    'utf8'
  );

  console.log('inject-home-hero: OK —', refPlain, '(UTC doy', utcDayOfYear() + ')');
}

main();
