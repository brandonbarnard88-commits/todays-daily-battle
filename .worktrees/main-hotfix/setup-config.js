#!/usr/bin/env node
/**
 * One-time setup: writes config.js with your Supabase URL and anon key.
 * Admin access is not configured here — set app_metadata.role = admin in Supabase Dashboard.
 * Run from project root. Your values stay in your terminal only (never paste them in chat).
 *
 * Usage:
 *   node setup-config.js
 *
 * Or with env vars (paste in terminal, not in chat):
 *   SUPABASE_URL="https://xxxx.supabase.co" SUPABASE_ANON_KEY="eyJ..." node setup-config.js
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.js');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_ANON_KEY || '';

if (url && key) {
  writeConfig(url, key);
  console.log('config.js written successfully. Reload the site and try signing in.');
  process.exit(0);
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

(async () => {
  console.log('Enter your Supabase values (from Dashboard → Project Settings → API).\n');
  const u = (process.env.SUPABASE_URL || await ask('SUPABASE_URL (e.g. https://xxxx.supabase.co): ')).trim();
  const k = (process.env.SUPABASE_ANON_KEY || await ask('SUPABASE_ANON_KEY (anon public key): ')).trim();
  rl.close();
  if (!u || !k) {
    console.log('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Run again.');
    process.exit(1);
  }
  writeConfig(u, k);
  console.log('config.js written. Set admin via Supabase app_metadata if needed; see CONFIG.md.');
})();

function writeConfig(supabaseUrl, anonKey) {
  const content = `/**
 * Optional config for Today's Daily Battle.
 * Add config.js to .gitignore — do not commit keys.
 */
window.TDB_CONFIG = {
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_ANON_KEY: ${JSON.stringify(anonKey)},
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: ''
};
`;
  fs.writeFileSync(configPath, content, 'utf8');
}
