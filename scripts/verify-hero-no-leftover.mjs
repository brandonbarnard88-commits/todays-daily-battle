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
}

function auditInjectedHtml() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const today = pickVerseForToday(loadYear365(root));
  const expect = String(today && today.ref ? today.ref : '').replace(/\s*\(KJV\)\s*$/i, '').trim();
  const sitM = html.match(/id="heroSimpleSituation"[^>]*>([^<]*)/i);
  const sit = stripHtml(sitM ? sitM[1] : '');
  if (sit && situationLooksWrongForRef(sit, expect)) {
    fail('Injected homepage situation does not belong to ' + expect + ': "' + sit.slice(0, 120) + '"');
  }
  const boundIds = ['heroVbdPrimary', 'heroSimpleBreakdown', 'heroDigDeeper'];
  boundIds.forEach((id) => {
    const re = new RegExp('id="' + id + '"[^>]*data-tdb-bound-ref="([^"]+)"');
    const m = html.match(re) || html.match(new RegExp('data-tdb-bound-ref="([^"]+)"[^>]*id="' + id + '"'));
    const bound = m ? String(m[1]).replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
    if (bound !== expect) {
      fail('#' + id + ' data-tdb-bound-ref is "' + bound + '" but today is ' + expect);
    }
  });
  const bbeM =
    html.match(/id="heroBbeSimple"[^>]*data-bbe-ref="([^"]+)"/) ||
    html.match(/data-bbe-ref="([^"]+)"[^>]*id="heroBbeSimple"/);
  const bbeRef = bbeM ? String(bbeM[1]).replace(/\s*\(KJV\)\s*$/i, '').trim() : '';
  if (bbeRef !== expect) {
    fail('#heroBbeSimple data-bbe-ref is "' + bbeRef + '" but today is ' + expect);
  }
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
