#!/usr/bin/env node
/**
 * Validates dist/verse.html + dist/plans.html JSON-LD after inject-structured-data-pages.
 * Run: node scripts/verify-structured-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadYear365, pickVerseForToday } from './lib/hero-daily-verse-pick.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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

function main() {
  const distVerse = path.join(root, 'dist', 'verse.html');
  const distPlans = path.join(root, 'dist', 'plans.html');
  if (!fs.existsSync(distVerse)) fail('dist/verse.html missing — run npm run build');
  if (!fs.existsSync(distPlans)) fail('dist/plans.html missing — run npm run build');

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

  console.log('verify-structured-data: OK (verse +', els.length, 'plans)');
}

main();
