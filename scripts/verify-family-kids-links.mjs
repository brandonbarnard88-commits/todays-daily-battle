#!/usr/bin/env node
/**
 * Static guard: Family & Kids hub pages stay cross-linked for IA cohesion.
 * Run after build (reads dist/).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fail(msg) {
  console.error('verify-family-kids-links:', msg);
  process.exit(1);
}

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  return fs.readFileSync(p, 'utf8');
}

function main() {
  const family = read('dist/family.html');
  if (!/href=["']printables\.html["']/.test(family)) {
    fail('dist/family.html: expected href to printables.html');
  }
  if (!/href=["'][^"']*family-armor\.html["']/.test(family)) {
    fail('dist/family.html: expected href to family-armor.html');
  }
  if (!/href=["']\/kids\/["']/.test(family) && !/href=["']kids\/["']/.test(family)) {
    fail('dist/family.html: expected href to kids hub (/kids/ or kids/)');
  }

  const kidsIdx = read('dist/kids/index.html');
  if (!/href=["']\.\.\/family\.html["']/.test(kidsIdx)) {
    fail('dist/kids/index.html: expected href to ../family.html');
  }
  if (!/href=["']\.\.\/printables\.html["']/.test(kidsIdx)) {
    fail('dist/kids/index.html: expected href to ../printables.html');
  }
  const gamesAt = kidsIdx.indexOf('id="kids-easy-games-h"');
  const moreAt = kidsIdx.indexOf('class="kids-easy-more"');
  if (gamesAt < 0) fail('dist/kids/index.html: Games heading missing');
  if (moreAt >= 0 && gamesAt > moreAt) {
    fail('dist/kids/index.html: Games must sit on the porch, not inside More');
  }

  const printables = read('dist/printables.html');
  if (!/href=["']family\.html["']/.test(printables)) {
    fail('dist/printables.html: expected href to family.html');
  }
  if (!/href=["']kids\/["']/.test(printables) && !/href=["']\/kids\/["']/.test(printables)) {
    fail('dist/printables.html: expected href to kids hub');
  }

  const armor = read('dist/family-armor.html');
  if (!/href=["'][^"']*family\.html["']/.test(armor)) {
    fail('dist/family-armor.html: expected href to family.html');
  }

  const yearly = read('dist/yearly-rhythm.html');
  if (!/href=["'][^"']*family\.html["']/.test(yearly)) {
    fail('dist/yearly-rhythm.html: expected href to family.html');
  }

  const weekKids = read('dist/one-week-rhythm-kids.html');
  if (!/href=["']family\.html["']/.test(weekKids)) {
    fail('dist/one-week-rhythm-kids.html: expected href to family.html');
  }

  console.log('verify-family-kids-links: OK');
}

main();
