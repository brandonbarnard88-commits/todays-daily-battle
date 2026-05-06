#!/usr/bin/env node
/**
 * Generate VAPID keys for Web Push (daily verse notifications).
 * Run: node scripts/generate-vapid-keys.mjs
 * Add the public key to config.js (VAPID_PUBLIC_KEY) and Cloudflare env.
 * Add both keys to Supabase Edge Function secrets for send-daily-verse-push.
 */
import { execSync } from 'child_process';

try {
  const out = execSync('npx web-push generate-vapid-keys', { encoding: 'utf8' });
  console.log(out);
  console.log('\n--- Add to config ---');
  console.log('1. VAPID_PUBLIC_KEY → config.js and Cloudflare env (VAPID_PUBLIC_KEY)');
  console.log('2. VAPID_PRIVATE_KEY + VAPID_PUBLIC_KEY + VAPID_SUBJECT (mailto:you@example.com) → Supabase Edge Function secrets');
  console.log('3. PUSH_SUBSCRIBE_URL → https://YOUR_PROJECT.supabase.co/functions/v1/save-push-subscription');
  console.log('4. PUSH_UNSUBSCRIBE_URL → https://YOUR_PROJECT.supabase.co/functions/v1/remove-push-subscription');
} catch (e) {
  console.error('Install web-push first: npm install -g web-push');
  console.error('Or run: npx web-push generate-vapid-keys');
  process.exit(1);
}
