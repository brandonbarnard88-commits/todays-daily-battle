#!/usr/bin/env node
/**
 * Repair a live homepage that failed verify-live-hero-today.
 *
 *  1. Restamp first-paint HTML + today-kjv-verse.json from the 730-day queue
 *  2. Purge the Cloudflare edge if a token is present
 *
 * Does not commit. The GH heal job commits + pushes when files change.
 *
 *   npm run heal:live-hero
 *
 * Cannot invent a correct verse if the queue itself is wrong — the live
 * recheck still fails in that case.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const HERO_PURGE_FILES = [
  'https://todaysdailybattle.com/',
  'https://todaysdailybattle.com/index.html',
  'https://todaysdailybattle.com/today-kjv-verse.json',
  'https://todaysdailybattle.com/yesterday-kjv-verse.json',
  'https://todaysdailybattle.com/es/',
  'https://todaysdailybattle.com/es/index.html',
  'https://todaysdailybattle.com/fr/',
  'https://todaysdailybattle.com/fr/index.html',
  'https://todaysdailybattle.com/pt/',
  'https://todaysdailybattle.com/pt/index.html',
  'https://todaysdailybattle.com/verso.html',
  'https://todaysdailybattle.com/zh/',
  'https://todaysdailybattle.com/ru/',
  'https://todaysdailybattle.com/hi/',
  'https://todaysdailybattle.com/id/',
  'https://www.todaysdailybattle.com/',
  'https://www.todaysdailybattle.com/index.html',
  'https://www.todaysdailybattle.com/today-kjv-verse.json',
  'https://www.todaysdailybattle.com/yesterday-kjv-verse.json',
  'https://www.todaysdailybattle.com/es/',
  'https://www.todaysdailybattle.com/fr/',
  'https://www.todaysdailybattle.com/pt/',
  'https://www.todaysdailybattle.com/verso.html',
  'https://www.todaysdailybattle.com/zh/',
  'https://www.todaysdailybattle.com/ru/',
  'https://www.todaysdailybattle.com/hi/',
  'https://www.todaysdailybattle.com/id/',
].join(',');

function run(args, extraEnv = {}) {
  const r = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) {
    throw new Error(args.join(' ') + ' exited ' + r.status);
  }
}

function hasPurgeToken() {
  const a = String(process.env.CF_API_TOKEN || '').trim();
  const b = String(process.env.CLOUDFLARE_API_TOKEN || '').trim();
  return a.length >= 30 || b.length >= 30;
}

function main() {
  const purgeOnly = process.argv.includes('--purge-only');
  const stampOnly = process.argv.includes('--stamp-only');

  if (!purgeOnly) {
    console.log('heal-live-hero-today: restamp first-paint from today’s queue');
    run([path.join(__dirname, 'inject-home-hero.mjs')]);
  }

  if (stampOnly) return;

  if (!hasPurgeToken()) {
    console.warn(
      'heal-live-hero-today: no Cloudflare token — stamp is local only. CDN stays until the next main-push purge.'
    );
    return;
  }

  console.log('heal-live-hero-today: purge homepage + today-kjv-verse.json on apex and www');
  run([path.join(__dirname, 'cloudflare-purge.mjs')], {
    CF_PURGE_FILES: HERO_PURGE_FILES,
  });
  console.log('heal-live-hero-today: done. Recheck with npm run verify:live-hero');
}

main();
