#!/usr/bin/env node
/**
 * 1) Source HTML: @graph (WebPage + BreadcrumbList) for family/print cluster pages
 *    — no dist/ build required; runs in `npm test`.
 * 2) Optional dist/: verse.html + plans.html JSON-LD (flag --verify-dist; used after build).
 * Run: node scripts/verify-structured-data.mjs
 *      node scripts/verify-structured-data.mjs --verify-dist
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** Pages with WebPage + BreadcrumbList @graph; visible .tdb-breadcrumb must match JSON-LD names. */
const SOURCE_WEBPAGE_GRAPHS = [
  'family-activity-packs.html',
  'printables.html',
  'family.html',
  'kids/prayer-activities.html',
  'kids/porch-read-little-hearts.html',
  'kids/porch-read-ordinary-tuesday.html',
  'kids/porch-read-after-grief.html',
  'kids/porch-read-steady-days.html',
  'kids/porch-read-family-worship.html',
  'kids/porch-read-parent-weary.html',
  'kids/porch-read-summer-seeds.html',
  'kids/porch-read-school-courage.html',
  'kids/porch-read-mealtime-thankfulness.html',
  'kids/porch-read-suffer-little-children.html',
  'kids/porch-read-forgiveness-after-fight.html',
  'kids/porch-read-one-leper-came-back.html',
  'kids/porch-read-busy-table.html',
  'kids/porch-read-mustard-quiet.html',
  'kids/porch-read-when-god-speaks-quietly.html',
  'kids/porch-read-when-waiting-feels-long.html',
  'kids/porch-read-when-wrong-feels-loud.html',
  'kids/porch-read-when-friendship-costs.html',
];

function fail(msg) {
  console.error('verify-structured-data:', msg);
  process.exit(1);
}

function extractFirstLdJson(html) {
  const m = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return null;
  return m[1].trim();
}

function normWs(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function extractCanonical(html) {
  const m =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ||
    html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
  return m ? normWs(m[1]) : null;
}

/** Plain-text labels in order: Home, Explore, current page (matches BreadcrumbList). */
function extractVisibleBreadcrumbLabels(html) {
  // class may be "tdb-breadcrumb" or "tdb-breadcrumb util-…" (e.g. kids pages).
  const m = html.match(
    /<nav[^>]*\bclass="[^"]*\btdb-breadcrumb[^"]*"[^>]*>[\s\S]*?<ol>([\s\S]*?)<\/ol>/i,
  );
  if (!m) return null;
  const block = m[1];
  const liChunks = block.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
  return liChunks.map((li) => normWs(li.replace(/<[^>]+>/g, ' ')));
}

function verifySourceWebPageGraph(relPath) {
  const p = path.join(root, relPath);
  if (!fs.existsSync(p)) {
    fail(`${relPath} missing`);
  }
  const html = fs.readFileSync(p, 'utf8');
  const raw = extractFirstLdJson(html);
  if (!raw) fail(`${relPath}: no application/ld+json`);
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    fail(`${relPath}: JSON-LD parse error: ` + (e.message || e));
  }
  if (!data['@graph'] || !Array.isArray(data['@graph'])) {
    fail(`${relPath}: JSON-LD must use @graph`);
  }
  const webPage = data['@graph'].find((n) => n['@type'] === 'WebPage');
  if (!webPage || !webPage.url) {
    fail(`${relPath}: @graph missing WebPage or url`);
  }
  const part = webPage.isPartOf;
  if (!part || part['@type'] !== 'WebSite' || !part.url) {
    fail(`${relPath}: WebPage.isPartOf must be WebSite with url`);
  }
  const bc = data['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
  if (!bc || !Array.isArray(bc.itemListElement)) {
    fail(`${relPath}: @graph missing BreadcrumbList`);
  }
  const listItems = bc.itemListElement
    .filter((x) => x && x['@type'] === 'ListItem')
    .sort((a, b) => (a.position || 0) - (b.position || 0));
  if (listItems.length < 3) {
    fail(`${relPath}: BreadcrumbList must have at least 3 ListItems`);
  }
  const vis = extractVisibleBreadcrumbLabels(html);
  if (!vis || vis.length < 3) {
    fail(
      `${relPath}: .tdb-breadcrumb <ol> must have 3 items (Home, Explore, current); found ` +
        (vis ? vis.length : 0),
    );
  }
  for (let i = 0; i < 3; i++) {
    if (normWs(listItems[i].name) !== vis[i]) {
      fail(
        `${relPath}: BreadcrumbList[${i}].name "${listItems[i].name}" !== visible "${vis[i]}"`,
      );
    }
  }
  const can = extractCanonical(html);
  if (can && normWs(webPage.url) !== can) {
    fail(`${relPath}: <link rel="canonical"> does not match WebPage.url`);
  }
  const last = listItems[2];
  if (!String(last.item || '').trim()) {
    fail(`${relPath}: BreadcrumbList last item missing "item" URL`);
  }
}

function verifySourceWebPageGraphs() {
  for (const rel of SOURCE_WEBPAGE_GRAPHS) {
    verifySourceWebPageGraph(rel);
  }
  console.log(
    'verify-structured-data: source WebPage + BreadcrumbList OK (' + SOURCE_WEBPAGE_GRAPHS.length + ' pages)',
  );
}

function main() {
  const verifyDist = process.argv.includes('--verify-dist');

  verifySourceWebPageGraphs();

  if (!verifyDist) {
    return;
  }

  const distVerse = path.join(root, 'dist', 'verse.html');
  const distPlans = path.join(root, 'dist', 'plans.html');
  if (!fs.existsSync(distVerse) || !fs.existsSync(distPlans)) {
    fail('dist/verse.html or dist/plans.html missing — run npm run build');
  }

  const year365 = loadYear365(root);
  const v = pickVerseForToday(year365);
  const refPlain = String(v.ref).trim();
  const textPlain = String(v.text).trim();

  const verseHtml = fs.readFileSync(distVerse, 'utf8');
  const verseLdRaw = extractFirstLdJson(verseHtml);
  if (!verseLdRaw) fail('no JSON-LD in dist/verse.html');
  let verseLd;
  try {
    verseLd = JSON.parse(verseLdRaw);
  } catch (e) {
    fail('dist/verse.html JSON-LD parse error: ' + (e.message || e));
  }
  if (!verseLd['@graph'] || !Array.isArray(verseLd['@graph'])) {
    fail('verse JSON-LD must use @graph');
  }
  const creative = verseLd['@graph'].find((n) => n['@type'] === 'CreativeWork');
  if (!creative || !creative.text) fail('verse JSON-LD missing CreativeWork.text');
  if (normWs(creative.text) !== normWs(textPlain)) {
    fail('verse JSON-LD text does not match hero-daily-365 pick (re-run build inject)');
  }
  if (!String(creative.name || '').includes(refPlain)) {
    fail('verse JSON-LD CreativeWork.name should include ref ' + refPlain);
  }
  if (!verseHtml.includes(`id="daily-verse-ref">${refPlain}</p>`)) {
    fail('dist/verse.html #daily-verse-ref does not match expected ref');
  }

  const plansHtml = fs.readFileSync(distPlans, 'utf8');
  const plansLdRaw = extractFirstLdJson(plansHtml);
  if (!plansLdRaw) fail('no JSON-LD in dist/plans.html');
  let plansLd;
  try {
    plansLd = JSON.parse(plansLdRaw);
  } catch (e) {
    fail('dist/plans.html JSON-LD parse error: ' + (e.message || e));
  }
  const list = plansLd.mainEntity;
  if (!list || list['@type'] !== 'ItemList') fail('plans JSON-LD mainEntity must be ItemList');
  const els = list.itemListElement;
  if (!Array.isArray(els) || els.length < 10) fail('plans ItemList too small');
  if (list.numberOfItems !== els.length) {
    fail(`plans numberOfItems (${list.numberOfItems}) !== itemListElement.length (${els.length})`);
  }
  for (let i = 0; i < els.length; i++) {
    const it = els[i];
    if (it['@type'] !== 'ListItem') fail('plans list item must be ListItem');
    if (it.position !== i + 1) fail('plans ListItem position mismatch at ' + i);
    if (!it.url || !String(it.url).includes('plans.html?plan=')) fail('plans ListItem missing url');
    if (!it.name) fail('plans ListItem missing name');
  }

  console.log('verify-structured-data: OK (source + dist verse +', els.length, 'plans)');
}

main();
