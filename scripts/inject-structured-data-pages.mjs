#!/usr/bin/env node
/**
 * After inject-home-hero: enrich dist/verse.html and dist/plans.html with build-time JSON-LD
 * aligned to UTC daily verse (hero-daily-365-data.js) and the live plan-row catalog.
 *
 * Run: node scripts/inject-structured-data-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday, utcDayOfYear } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SITE = 'https://todaysdailybattle.com';
const ORG = {
  '@type': 'Organization',
  name: "Today's Daily Battle",
  url: `${SITE}/`,
};

function fail(msg) {
  console.error('inject-structured-data-pages:', msg);
  process.exit(1);
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildVerseJsonLd(refPlain, textPlain) {
  const pageUrl = `${SITE}/verse.html`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Today's KJV verse — ${refPlain}`,
        description: `Read, listen, save, or share today's King James verse (${refPlain}). Calm reader. No account required.`,
        inLanguage: 'en',
        isAccessibleForFree: true,
        isPartOf: {
          '@type': 'WebSite',
          name: "Today's Daily Battle",
          url: `${SITE}/`,
        },
        publisher: ORG,
        mainEntity: { '@id': `${pageUrl}#kjv-verse` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#daily-verse-ref', '#daily-verse-text'],
        },
        keywords: 'KJV, Bible verse of the day, King James Version, daily Scripture, Christian encouragement',
        about: { '@id': `${pageUrl}#kjv-verse` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: "Today's KJV verse", item: pageUrl },
        ],
      },
      {
        '@type': 'CreativeWork',
        '@id': `${pageUrl}#kjv-verse`,
        name: `${refPlain} (KJV)`,
        headline: `${refPlain} (KJV)`,
        text: textPlain,
        inLanguage: 'en',
        isBasedOn: {
          '@type': 'Book',
          name: 'Holy Bible',
          bookEdition: 'King James Version',
        },
        publisher: ORG,
        isFamilyFriendly: true,
        isAccessibleForFree: true,
      },
    ],
  };
}

function injectVerseLdJson(html, refPlain, textPlain) {
  const json = JSON.stringify(buildVerseJsonLd(refPlain, textPlain));
  const replaced = html.replace(
    /<script[^>]*type="application\/ld\+json"[^>]*>\s*[\s\S]*?<\/script>/,
    `<script type="application/ld+json" nonce="tdb2025s">\n  ${json}\n  </script>`
  );
  if (replaced === html) fail('could not find application/ld+json in dist/verse.html');
  return replaced;
}

function injectVerseDomAndMeta(html, refPlain, textPlain) {
  let next = html;
  next = next.replace(
    /<p class="daily-verse-ref" id="daily-verse-ref">[^<]*<\/p>/,
    `<p class="daily-verse-ref" id="daily-verse-ref">${escapeHtmlText(refPlain)}</p>`
  );
  next = next.replace(
    /<p class="daily-verse-text" id="daily-verse-text">[\s\S]*?<\/p>/,
    `<p class="daily-verse-text" id="daily-verse-text">${escapeHtmlText(textPlain)}</p>`
  );
  next = next.replace(/<button([^>]*id="verse-page-word-study"[^>]*)>/, (_full, inner) => {
    let u = inner.replace(/data-tdb-wordstudy-ref="[^"]*"/, `data-tdb-wordstudy-ref="${escapeHtmlAttr(refPlain)}"`);
    u = u.replace(/data-tdb-wordstudy-text="[^"]*"/, `data-tdb-wordstudy-text="${escapeHtmlAttr(textPlain)}"`);
    return '<button' + u + '>';
  });

  const title = `Today's KJV Verse of the Day — ${refPlain} · Today's Daily Battle`;
  const desc = `Today's King James verse (${refPlain}): ${textPlain} Calm reader—listen, save to My Study, or share. No ads, no login.`;

  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtmlText(title)}</title>`);
  next = next.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtmlAttr(desc)}"`
  );
  next = next.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtmlAttr(title)}"`
  );
  next = next.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtmlAttr(desc)}"`
  );
  next = next.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtmlAttr(title)}"`
  );
  next = next.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtmlAttr(desc)}"`
  );
  return next;
}

function extractPlanRows(html) {
  const out = [];
  const seen = new Set();
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1];
    if (!/class="plan-row/.test(inner)) continue;
    const hrefM = inner.match(/href="plans\.html\?plan=([^"]+)"/);
    const labelM = inner.match(/aria-label="([^"]+)"/);
    if (!hrefM || !labelM) continue;
    const id = hrefM[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const full = labelM[1];
    const name = full.split(/\s+—\s+/)[0].trim() || full;
    out.push({ id, name, full });
  }
  return out;
}

function buildPlansJsonLd(planRows) {
  const pageUrl = `${SITE}/plans.html`;
  const itemListElement = planRows.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    description: p.full,
    url: `${pageUrl}?plan=${encodeURIComponent(p.id)}`,
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "Battle Plans • Today's Daily Battle",
    url: pageUrl,
    description:
      'Short KJV reading plans (7–40 days): one verse a day, plain encouragement, saved on your device offline. No login required.',
    inLanguage: 'en',
    isAccessibleForFree: true,
    isPartOf: {
      '@type': 'WebSite',
      name: "Today's Daily Battle",
      url: `${SITE}/`,
    },
    publisher: ORG,
    about: {
      '@type': 'Book',
      name: 'Holy Bible',
      bookEdition: 'King James Version',
      description: 'Gentle daily readings in the King James Version for anxiety, hope, family, and real-life battles.',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Battle Plans',
      description: 'KJV reading plans—gentle daily steps in Scripture',
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  };
}

function injectPlansLdJson(html, planRows) {
  const json = JSON.stringify(buildPlansJsonLd(planRows));
  const replaced = html.replace(
    /<script nonce="tdb2025s" type="application\/ld\+json">\s*[\s\S]*?<\/script>/,
    `<script nonce="tdb2025s" type="application/ld+json">\n  ${json}\n  </script>`
  );
  if (replaced === html) fail('could not find plans application/ld+json block in dist/plans.html');
  return replaced;
}

function main() {
  const distVerse = path.join(root, 'dist', 'verse.html');
  const distPlans = path.join(root, 'dist', 'plans.html');
  if (!fs.existsSync(distVerse)) fail('dist/verse.html missing');
  if (!fs.existsSync(distPlans)) fail('dist/plans.html missing');

  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  if (!v || !v.ref || !v.text) fail('invalid verse from 365 list');
  const refPlain = String(v.ref).trim();
  const textPlain = String(v.text).trim();

  let verseHtml = fs.readFileSync(distVerse, 'utf8');
  verseHtml = injectVerseLdJson(verseHtml, refPlain, textPlain);
  verseHtml = injectVerseDomAndMeta(verseHtml, refPlain, textPlain);
  fs.writeFileSync(distVerse, verseHtml, 'utf8');

  const plansHtml = fs.readFileSync(distPlans, 'utf8');
  const rows = extractPlanRows(plansHtml);
  if (rows.length < 10) fail('extracted too few plan rows from dist/plans.html');
  const nextPlans = injectPlansLdJson(plansHtml, rows);
  fs.writeFileSync(distPlans, nextPlans, 'utf8');

  console.log(
    'inject-structured-data-pages: OK — verse',
    refPlain,
    '(UTC doy',
    utcDayOfYear() + '); plans',
    rows.length,
    'items'
  );
}

main();
