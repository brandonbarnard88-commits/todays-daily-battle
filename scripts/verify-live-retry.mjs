#!/usr/bin/env node
/**
 * Re-runs verify-live-key-html until success or max attempts (CDN / deploy propagation).
 *
 *   LIVE_BASE_URL=https://todaysdailybattle.com npm run verify:live-key-html:retry
 *
 * Env: LIVE_VERIFY_ATTEMPTS (default 6), LIVE_VERIFY_SLEEP_MS (default 20000)
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(__dirname, 'verify-live-key-html.mjs');
const attempts = Math.max(1, parseInt(process.env.LIVE_VERIFY_ATTEMPTS || '6', 10) || 6);
const sleepMs = Math.max(0, parseInt(process.env.LIVE_VERIFY_SLEEP_MS || '20000', 10) || 20000);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  for (let i = 1; i <= attempts; i++) {
    console.log(`verify-live-retry: attempt ${i}/${attempts}`);
    const r = spawnSync(process.execPath, [script], {
      stdio: 'inherit',
      env: process.env,
    });
    if (r.status === 0) {
      console.log('verify-live-retry: all attempts succeeded');
      process.exit(0);
    }
    if (i < attempts) {
      console.log(`verify-live-retry: waiting ${sleepMs}ms before retry…`);
      await sleep(sleepMs);
    }
  }
  console.error('verify-live-retry: exhausted attempts');
  process.exit(1);
}

main();
