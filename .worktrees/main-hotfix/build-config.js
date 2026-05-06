/**
 * Cloudflare Pages (or any CI): writes config.js from environment variables.
 * Run in build: node build-config.js
 * Set SUPABASE_URL and SUPABASE_ANON_KEY (required); others optional.
 * Does nothing if SUPABASE_URL is not set (so local dev keeps your real config.js).
 *
 * Optional: STRIPE_PRICE_IDS_JSON — single-line JSON for signed-in checkout, e.g.
 * {"supporter":{"monthly":"price_…","yearly":"price_…"},"battle_pro":{...},"church":{...}}
 */
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SITE_ASSET_VERSION_PATH = path.join(__dirname, 'SITE-ASSET-VERSION');
const SITE_ASSET_VERSION = fs.existsSync(SITE_ASSET_VERSION_PATH)
  ? fs.readFileSync(SITE_ASSET_VERSION_PATH, 'utf8').trim()
  : '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const outPath = path.join(__dirname, 'config.js');
  if (!fs.existsSync(outPath)) {
    console.log('build-config.js: SUPABASE_URL not set and config.js missing — writing minimal config (Playwright/CI).');
    const minimal = {
      SUPABASE_URL: '',
      SUPABASE_ANON_KEY: '',
      CREATE_CHECKOUT_SESSION_URL: '',
      CREATE_DONATION_SESSION_URL: '',
      SUBMIT_PRAYER_URL: '',
      TURNSTILE_SITE_KEY: '',
      STRIPE_PRICE_IDS: {
        supporter: { monthly: '', yearly: '' },
        battle_pro: { monthly: '', yearly: '' },
        church: { monthly: '', yearly: '' }
      },
      WALKTHROUGH_VIDEO_URL: '',
      STRIPE_SUPPORTER_MONTHLY_URL: '',
      STRIPE_SUPPORTER_YEARLY_URL: '',
      STRIPE_BATTLEPRO_MONTHLY_URL: '',
      STRIPE_BATTLEPRO_YEARLY_URL: '',
      STRIPE_CHURCH_MONTHLY_URL: '',
      STRIPE_CHURCH_YEARLY_URL: '',
      CF_ANALYTICS_TOKEN: '',
      GA_MEASUREMENT_ID: '',
      GOOGLE_SITE_VERIFICATION: '',
      BATTLE_MUG_URL: '',
      ERROR_REPORT_URL: '',
      SITE_ASSET_VERSION,
      VAPID_PUBLIC_KEY: '',
      PUSH_SUBSCRIBE_URL: '',
      PUSH_UNSUBSCRIBE_URL: '',
      STATS_PASSWORD: ''
    };
    const out = `/**
 * Minimal config (no Supabase). For Playwright/CI when env not set.
 */
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';
window.TDB_CONFIG = ${JSON.stringify(minimal, null, 2)};
`;
    fs.writeFileSync(outPath, out, 'utf8');
  } else {
    console.log('build-config.js: SUPABASE_URL or SUPABASE_ANON_KEY not set, keeping existing config.js.');
  }
  process.exit(0);
}

const config = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  CREATE_CHECKOUT_SESSION_URL: SUPABASE_URL ? SUPABASE_URL + '/functions/v1/create-checkout-session' : '',
  CREATE_DONATION_SESSION_URL: SUPABASE_URL ? SUPABASE_URL + '/functions/v1/create-donation-session' : '',
  SUBMIT_PRAYER_URL: SUPABASE_URL ? SUPABASE_URL + '/functions/v1/submit-prayer' : '',
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY || '',
  WALKTHROUGH_VIDEO_URL: process.env.WALKTHROUGH_VIDEO_URL || '',
  STRIPE_SUPPORTER_MONTHLY_URL: process.env.STRIPE_SUPPORTER_MONTHLY_URL || process.env.STRIPE_SUPPORTER_MONTHLY_LINK || '',
  STRIPE_SUPPORTER_YEARLY_URL: process.env.STRIPE_SUPPORTER_YEARLY_URL || process.env.STRIPE_SUPPORTER_YEARLY_LINK || '',
  STRIPE_BATTLEPRO_MONTHLY_URL: process.env.STRIPE_BATTLEPRO_MONTHLY_URL || process.env.STRIPE_BATTLEPRO_MONTHLY_LINK || '',
  STRIPE_BATTLEPRO_YEARLY_URL: process.env.STRIPE_BATTLEPRO_YEARLY_URL || process.env.STRIPE_BATTLEPRO_YEARLY_LINK || '',
  STRIPE_CHURCH_MONTHLY_URL: process.env.STRIPE_CHURCH_MONTHLY_URL || process.env.STRIPE_CHURCH_MONTHLY_LINK || '',
  STRIPE_CHURCH_YEARLY_URL: process.env.STRIPE_CHURCH_YEARLY_URL || process.env.STRIPE_CHURCH_YEARLY_LINK || '',
  CF_ANALYTICS_TOKEN: process.env.CF_ANALYTICS_TOKEN || '',
  GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID || '',
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || '',
  BATTLE_MUG_URL: process.env.BATTLE_MUG_URL || '',
  ERROR_REPORT_URL: process.env.ERROR_REPORT_URL || '',
  SITE_ASSET_VERSION,
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || '',
  PUSH_SUBSCRIBE_URL: process.env.PUSH_SUBSCRIBE_URL || '',
  PUSH_UNSUBSCRIBE_URL: process.env.PUSH_UNSUBSCRIBE_URL || '',
  STATS_PASSWORD: process.env.STATS_PASSWORD || ''
};

const priceRaw = (process.env.STRIPE_PRICE_IDS_JSON || '').trim();
if (priceRaw) {
  try {
    config.STRIPE_PRICE_IDS = JSON.parse(priceRaw);
  } catch (e) {
    console.warn('build-config.js: STRIPE_PRICE_IDS_JSON is not valid JSON, skipping.');
  }
}

const out = `/**
 * Generated at build from env (Cloudflare/CI). Do not commit.
 */
export const SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};
export const SUPABASE_ANON_KEY = ${JSON.stringify(SUPABASE_ANON_KEY)};
window.TDB_CONFIG = ${JSON.stringify(config, null, 2)};
`;

const outPath = path.join(__dirname, 'config.js');
fs.writeFileSync(outPath, out, 'utf8');
console.log('build-config.js: wrote config.js from env.');
process.exit(0);
