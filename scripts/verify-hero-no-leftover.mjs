#!/usr/bin/env node
/**
 * Guarantee leftover teaching cannot sit under a new verse.
 * Wired into verify:teaching / build.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pickVerseForToday, loadYear365 } from './lib/hero-daily-verse-pick.mjs';
import {
  situationLooksWrongForRef,
  speakerBelongsToBook,
  leadingSpeakerInText
} from './lib/verse-teaching-guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function auditSourceContracts() {
  const fp = fs.readFileSync(path.join(root, 'hero-daily-first-paint.js'), 'utf8');
  if (!/if\s*\(\s*!bound\s*\|\|\s*bound\s*!==\s*target\s*\)\s*return false/.test(fp)) {
    fail('hero-daily-first-paint.js must refuse snapshots unless data-tdb-bound-ref matches today’s verse');
  }
  if (/displayed\s*&&\s*displayed\s*===\s*target\s*&&\s*!bound/.test(fp)) {
    fail('hero-daily-first-paint.js still trusts an unbound snapshot when the on-screen ref already flipped');
  }
  if (!fp.includes('sitForThisRef')) {
    fail('hero-daily-first-paint.js must drop situation lines that fail the book/speaker lock');
  }
  if (/return 'In ' \+ y \+ ', hold this verse as written/.test(fp)) {
    fail('hero-daily-first-paint.js still generates leftover relate reprint');
  }
  if (!fp.includes('floorHeroTeaching')) {
    fail('hero-daily-first-paint.js must floor missing queue teaching from catalog/context');
  }
  if (/to:\s*liveTo\s*\|\|\s*v\.to/.test(fp)) {
    fail('hero-daily-first-paint.js must prefer this day’s audience over live chapter-band context');
  }
  const inject = fs.readFileSync(path.join(root, 'scripts/inject-home-hero.mjs'), 'utf8');
  if (!inject.includes('data-tdb-bound-ref')) {
    fail('inject-home-hero.mjs must stamp data-tdb-bound-ref on first-paint teaching');
  }
  if (!inject.includes('heroBbeSimple') || !inject.includes('data-bbe-ref')) {
    fail('inject-home-hero.mjs must stamp data-bbe-ref on #heroBbeSimple');
  }
}

function auditLeftoverCases() {
  const johnSit =
    'John urges the church to love one another because love is of God: whoever loves is born of God and knows God, and God is love.';
  const psalmSit = 'Worship the Lord as King: a new song for all lands, idol-smashing glory, and joy for the upright.';
  const paulSit = 'Paul writes from prison to Philippi: rejoice, do not be anxious, the peace of God guards hearts.';

  if (!situationLooksWrongForRef(johnSit, 'Psalm 96:1')) {
    fail('John 4 leftover situation must be rejected under Psalm 96:1');
  }
  if (situationLooksWrongForRef(johnSit, '1 John 4:7')) {
    fail('John 4 situation must still be allowed under 1 John 4:7');
  }
  if (situationLooksWrongForRef(psalmSit, 'Psalm 96:1')) {
    fail('Psalm 96 situation must stay allowed under Psalm 96:1');
  }
  if (!situationLooksWrongForRef(paulSit, 'Psalm 23:1')) {
    fail('Paul prison situation must be rejected under Psalm 23:1');
  }
  if (situationLooksWrongForRef(paulSit, 'Philippians 4:6')) {
    fail('Paul prison situation must stay allowed under Philippians 4:6');
  }
  if (leadingSpeakerInText(johnSit).toLowerCase() !== 'john') {
    fail('leadingSpeakerInText should see John in the leftover 1 John line');
  }
  if (speakerBelongsToBook('John', 'Psalm 96:1')) {
    fail('John must not be a legal speaker for Psalm 96:1');
  }
  if (!situationLooksWrongForRef('This verse is the song: Blessed be the God and Father of our Lord Jesus Christ,.', '1 Peter 1:3')) {
    fail('Role-factory leftover must be rejected under 1 Peter 1:3');
  }
  if (!situationLooksWrongForRef('This verse is the song: O sing unto the Lord a new song.', 'Psalm 96:1')) {
    fail('Role-factory leftover must be rejected even under a psalm');
  }
  if (!situationLooksWrongForRef('Worshipers who needed to hear mercy — and you when you have failed and still need to come', 'Psalm 23:6')) {
    fail('Leftover failure-frame audience must be rejected');
  }
  if (!situationLooksWrongForRef("God's kindness meets you as you are — not after you perform.", 'Micah 6:8')) {
    fail('Leftover kindness stamp must be rejected as teaching');
  }
  if (!situationLooksWrongForRef('Take the verse as it stands: Rejoice evermore.', '1 Thessalonians 5:16')) {
    fail('As-it-stands leftover meaning must be rejected');
  }
  if (!situationLooksWrongForRef('Peter encourages elect exiles: living hope, holy living, and Christ the cornerstone.', '1 Peter 1:8')) {
    fail('Chapter-2 cornerstone leftover must be rejected under 1 Peter 1');
  }
  if (!situationLooksWrongForRef('Worship the Lord as King: a new song for all lands, idol-smashing glory.', 'Psalm 97:11')) {
    fail('Psalm 96 leftover band must be rejected under Psalm 97:11');
  }
  if (!situationLooksWrongForRef('and you when “Rejoice evermore” has to be lived, not only heard', '1 Thessalonians 5:16')) {
    fail('Leftover lived-not-heard audience must be rejected');
  }
  if (
    !situationLooksWrongForRef(
      'Jesus — On the road to Jerusalem: Good Samaritan, Lord’s Prayer, lost sheep/coin/son, rich fool, Zacchaeus.',
      'Luke 12:32'
    )
  ) {
    fail('Luke 10–19 mash must be rejected under Luke 12:32');
  }
}

function auditInjectedHtmlFile(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return;
  const html = fs.readFileSync(full, 'utf8');
  const today = pickVerseForToday(loadYear365(root));
  const expect = String(today && today.ref ? today.ref : '').replace(/\s*\(KJV\)\s*$/i, '').trim();
  const sitM = html.match(/id="heroSimpleSituation"[^>]*>([^<]*)/i);
  const sit = stripHtml(sitM ? sitM[1] : '');
  if (sit && situationLooksWrongForRef(sit, expect)) {
    fail(rel + ' situation does not belong to ' + expect + ': "' + sit.slice(0, 120) + '"');
  }
  const boundIds = ['heroVbdPrimary', 'heroSimpleBreakdown', 'heroDigDeeper'];
  boundIds.forEach((id) => {
    const re = new RegExp('id="' + id + '"[^>]*data-tdb-bound-ref="([^"]+)"');
    const m = html.match(re) || html.match(new RegExp('data-tdb-bound-ref="([^"]+)"[^>]*id="' + id + '"'));
    const bound = m ? String(m[1]).replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
    if (bound !== expect) {
      fail(rel + ' #' + id + ' data-tdb-bound-ref is "' + bound + '" but today is ' + expect);
    }
  });
  const bbeM =
    html.match(/id="heroBbeSimple"[^>]*data-bbe-ref="([^"]+)"/) ||
    html.match(/data-bbe-ref="([^"]+)"[^>]*id="heroBbeSimple"/);
  const bbeRef = bbeM ? String(bbeM[1]).replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
  if (bbeRef !== expect) {
    fail(rel + ' #heroBbeSimple data-bbe-ref is "' + bbeRef + '" but today is ' + expect);
  }
  const ymd = new Date().toISOString().slice(0, 10);
  const ymdM = html.match(/id="verseCard"[^>]*data-tdb-hero-ymd="([^"]+)"/) ||
    html.match(/data-tdb-hero-ymd="([^"]+)"[^>]*id="verseCard"/);
  const stamped = ymdM ? ymdM[1] : '';
  if (stamped !== ymd) {
    fail(rel + ' #verseCard data-tdb-hero-ymd is "' + stamped + '" but UTC today is ' + ymd);
  }
  if (/hold this verse as written/i.test(html)) {
    fail(rel + ' still contains leftover relate reprint');
  }
  if (/has to be lived, not only heard/i.test(html)) {
    fail(rel + ' still contains leftover lived-not-heard teaching');
  }
  if (/platforms make people look tall/i.test(html)) {
    fail(rel + ' still contains leftover 2026 platforms relate');
  }
  if (/filling your screen/i.test(html) || /look taller than God/i.test(html)) {
    fail(rel + ' still contains leftover screen-taller relate');
  }
  if (/On the road to Jerusalem: Good Samaritan/i.test(html) && /Luke 12:32/i.test(html)) {
    fail(rel + ' still paints the Luke 10–19 mash on Luke 12:32');
  }
  if (!html.includes("stamp !== utc")) {
    fail(rel + ' must hide a yesterday inject when data-tdb-hero-ymd is not UTC today');
  }
}

function auditInjectedHtml() {
  auditInjectedHtmlFile('index.html');
  auditInjectedHtmlFile('dist/index.html');
}

auditSourceContracts();
auditLeftoverCases();
auditInjectedHtml();

if (failures.length) {
  console.error('Hero leftover teaching FAIL — ' + failures.length + ' issue(s):\n');
  failures.forEach((f) => console.error(' • ' + f));
  process.exit(1);
}
console.log('Hero leftover teaching PASS: snapshot bound-ref, speaker-in-situation, inject stamp.');
