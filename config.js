/**
 * Config for Today's Daily Battle. Supabase anon key is public by design; RLS protects data.
 * Admin: Supabase app_metadata.role === 'admin' OR login email in MASTER_EMAIL_OBFUSCATED / MASTER_EMAIL.
 * Stripe: add keys locally (or env); keep config.js in .gitignore for production secrets.
 */
window.TDB_CONFIG = {
  SUPABASE_URL: 'https://rixsnhpwrlbvvymkfamj.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeHNuaHB3cmxidnZ5bWtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTExMTMsImV4cCI6MjA4NDU2NzExM30.h5VdhM4L4v_cT6qiRIwY6qoFM4AnzFCluXlM8mcW9Iw',
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: '',
  // Master login (HTML-entity obfuscated): decoded at runtime for admin / Pro access
  MASTER_EMAIL_OBFUSCATED: '&#98;&#114;&#97;&#110;&#100;&#111;&#110;&#64;&#116;&#111;&#100;&#97;&#121;&#115;&#100;&#97;&#105;&#108;&#121;&#98;&#97;&#116;&#116;&#108;&#101;&#46;&#99;&#111;&#109',
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
  STRIPE_CHURCH_YEARLY_LINK: ''
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
// Submit Quick Pray via Edge Function (Turnstile verification). Set TURNSTILE_SITE_KEY to enable.
window.TDB_CONFIG.SUBMIT_PRAYER_URL = (window.TDB_CONFIG.SUPABASE_URL || '') + '/functions/v1/submit-prayer';

// Set to true after running supabase-get-prayers-today-count.sql so "Prayed by X warriors today" uses the RPC (avoids 404).
window.TDB_CONFIG.PRAYERS_TODAY_COUNT_ENABLED = false;

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
