/**
 * Config for Today's Daily Battle. Supabase anon key is public by design; RLS protects data.
 * Admin: Supabase app_metadata.role === 'admin' only (set in Supabase Auth). Do not ship admin email in client bundles.
 * Stripe: add keys locally (or env); keep config.js in .gitignore for production secrets.
 */
export const SUPABASE_URL = 'https://rixsnhpwrlbvvymkfamj.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeHNuaHB3cmxidnZ5bWtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTExMTMsImV4cCI6MjA4NDU2NzExM30.h5VdhM4L4v_cT6qiRIwY6qoFM4AnzFCluXlM8mcW9Iw';

window.TDB_CONFIG = {
  SUPABASE_URL: 'https://rixsnhpwrlbvvymkfamj.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeHNuaHB3cmxidnZ5bWtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTExMTMsImV4cCI6MjA4NDU2NzExM30.h5VdhM4L4v_cT6qiRIwY6qoFM4AnzFCluXlM8mcW9Iw',
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: '',
  // Web Push (VAPID) via Supabase Edge Functions
  VAPID_PUBLIC_KEY: '',
  PUSH_SUBSCRIBE_URL: 'https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/save-push-subscription',
  PUSH_UNSUBSCRIBE_URL: 'https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/remove-push-subscription',
  // Battle Pro / Stripe — paste Payment Link URLs from Stripe Dashboard; see STRIPE-CONFIG.md
  STRIPE_PUBLISHABLE_KEY: '',
  // Supporter: $5/mo, $50/yr
  STRIPE_SUPPORTER_LINK: '',
  STRIPE_SUPPORTER_MONTHLY_LINK: '',
  STRIPE_SUPPORTER_YEARLY_LINK: '',
  // Battle Pro: $10/mo, $100/yr
  STRIPE_BATTLEPRO_MONTHLY_LINK: '',
  STRIPE_BATTLEPRO_YEARLY_LINK: '',
  // Military discount: Battle Pro $1/mo, $10/yr
  STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK: '',
  STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK: '',
  // Church/Team: $10/mo, $100/yr (beta)
  STRIPE_CHURCH_LINK: '',
  STRIPE_CHURCH_MONTHLY_LINK: '',
  STRIPE_CHURCH_YEARLY_LINK: '',
  // GA4: analytics.google.com → Admin → Create Property → Web → copy Measurement ID (G-XXXXXXXXXX)
  GA_MEASUREMENT_ID: 'G-NFQ5GWJXCB',
  // Cloudflare Web Analytics beacon token (dashboard.cloudflare.com → Web Analytics). Empty = off.
  // Cookieless page views; does not replace GA4 product events. See docs/FOUNDER-ANALYTICS.md
  CF_ANALYTICS_TOKEN: '',
  // GSC: search.google.com/search-console → Add Property → HTML tag → copy content value
  GOOGLE_SITE_VERIFICATION: ''
};

// Abuse protection: Cloudflare Turnstile (Quick Pray). Get keys at dashboard.cloudflare.com → Turnstile.
// Site key is public (frontend); secret key goes in Supabase Edge Function secrets for submit-prayer.
window.TDB_CONFIG.TURNSTILE_SITE_KEY = '';

// Price IDs for create-checkout-session (signed-in flow with metadata). Paste from Stripe Dashboard → Products → [price] ID (e.g. price_1ABC...).
// Order: Supporter $5/$50, Battle Pro $10/$100, Church $10/$100 — monthly then yearly per tier.
window.TDB_CONFIG.STRIPE_PRICE_IDS = {
  supporter: { monthly: 'price_1T5C10PyNV9eq3QeHyy5RLdy', yearly: 'price_1T5C20PyNV9eq3Qe70Bida8E' },
  battle_pro: { monthly: 'price_1T5C3aPyNV9eq3QeJx4Xg9Ej', yearly: 'price_1T5C47PyNV9eq3QeDXr6hz5A' },
  church: { monthly: 'price_1T5C5hPyNV9eq3QeDeqLOBYs', yearly: 'price_1T5C6APyNV9eq3QeTSZK87Yv' }
};

// Edge Function URL for creating a Checkout Session with user_id in metadata (derived from SUPABASE_URL).
window.TDB_CONFIG.CREATE_CHECKOUT_SESSION_URL = (window.TDB_CONFIG.SUPABASE_URL || '') + '/functions/v1/create-checkout-session';
// Donation checkout (no auth required).
window.TDB_CONFIG.CREATE_DONATION_SESSION_URL = (window.TDB_CONFIG.SUPABASE_URL || '') + '/functions/v1/create-donation-session';
// Submit Quick Pray via Edge Function (Turnstile verification). Set TURNSTILE_SITE_KEY to enable.
window.TDB_CONFIG.SUBMIT_PRAYER_URL = (window.TDB_CONFIG.SUPABASE_URL || '') + '/functions/v1/submit-prayer';
// Post message via Edge Function (rate limit + server-side sanitization). When set, client uses this instead of direct insert.
window.TDB_CONFIG.POST_MESSAGE_URL = (window.TDB_CONFIG.SUPABASE_URL || '') + '/functions/v1/post-message';

// Enable only after running supabase-get-prayers-today-count.sql in production.
// Keep this false until the RPC exists so the homepage does not spam 404s in the console.
window.TDB_CONFIG.PRAYERS_TODAY_COUNT_ENABLED = false;

// .org = movement site; .com = product site. Same codebase, different messaging.
window.TDB_IS_ORG = typeof location !== 'undefined' && location.hostname === 'todaysdailybattle.org';

// Promo countdown (home + pricing). Empty string = no active promo (do not leave expired dates).
window.TDB_CONFIG.PROMO_END_DATE = '';

/**
 * Get Stripe Payment Link URL for a given tier and period.
 * @param {string} tier - 'supporter' | 'battle_pro' | 'battle_pro_military' | 'church'
 * @param {string} period - 'monthly' | 'yearly'
 * @returns {string} URL or '' if not set
 */
window.TDB_GET_STRIPE_LINK = function (tier, period) {
  var c = window.TDB_CONFIG || {};
  var key = tier === 'supporter' ? (period === 'yearly' ? 'STRIPE_SUPPORTER_YEARLY_LINK' : 'STRIPE_SUPPORTER_MONTHLY_LINK')
    : tier === 'battle_pro' ? (period === 'yearly' ? 'STRIPE_BATTLEPRO_YEARLY_LINK' : 'STRIPE_BATTLEPRO_MONTHLY_LINK')
    : tier === 'battle_pro_military' ? (period === 'yearly' ? 'STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK' : 'STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK')
    : tier === 'church' ? (period === 'yearly' ? 'STRIPE_CHURCH_YEARLY_LINK' : 'STRIPE_CHURCH_MONTHLY_LINK')
    : '';
  if (!key) return '';
  var link = c[key] || (tier === 'supporter' && period === 'monthly' ? c.STRIPE_SUPPORTER_LINK : null) || (tier === 'church' && period === 'monthly' ? c.STRIPE_CHURCH_LINK : null);
  return link || '';
};

/** True when at least one Stripe checkout path is configured (links or publishable key). */
window.TDB_SUPPORT_CHECKOUT_READY = function () {
  var c = window.TDB_CONFIG || {};
  if (c.STRIPE_PUBLISHABLE_KEY) return true;
  if (c.STRIPE_SUPPORTER_LINK || c.STRIPE_SUPPORTER_MONTHLY_LINK || c.STRIPE_SUPPORTER_YEARLY_LINK) return true;
  if (c.STRIPE_BATTLEPRO_MONTHLY_LINK || c.STRIPE_BATTLEPRO_YEARLY_LINK) return true;
  if (c.STRIPE_CHURCH_LINK || c.STRIPE_CHURCH_MONTHLY_LINK || c.STRIPE_CHURCH_YEARLY_LINK) return true;
  if (typeof window.TDB_GET_STRIPE_LINK === 'function') {
    return !!(
      window.TDB_GET_STRIPE_LINK('supporter', 'monthly') ||
      window.TDB_GET_STRIPE_LINK('battle_pro', 'monthly') ||
      window.TDB_GET_STRIPE_LINK('church', 'monthly')
    );
  }
  return false;
};

/** True when Cloudflare Web Analytics token is set. */
window.TDB_CF_ANALYTICS_READY = function () {
  var c = window.TDB_CONFIG || {};
  return !!(c.CF_ANALYTICS_TOKEN && String(c.CF_ANALYTICS_TOKEN).trim());
};
