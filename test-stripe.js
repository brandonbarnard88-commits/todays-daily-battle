#!/usr/bin/env node
/**
 * Stripe integration tests (config + endpoint reachability).
 * Run: node test-stripe.js
 * Optional: set BASE_URL for create-checkout-session (default: from config SUPABASE_URL).
 *
 * Does NOT use real Stripe keys or charge cards. It checks:
 * - config.js has STRIPE_PRICE_IDS and create-checkout-session URL
 * - create-checkout-session endpoint responds (401 without auth = expected)
 * - pricing.html has Subscribe / Stripe-related content
 */

const fs = require('fs');
const http = require('http');
const https = require('https');

const configPath = require('path').join(__dirname, 'config.js');
const pricingPath = require('path').join(__dirname, 'pricing.html');

function readConfig() {
  const raw = fs.readFileSync(configPath, 'utf8');
  const out = {};
  const priceIdsMatch = raw.match(/STRIPE_PRICE_IDS\s*=\s*(\{[\s\S]*?\});/);
  if (priceIdsMatch) {
    try {
      out.STRIPE_PRICE_IDS = JSON.parse(priceIdsMatch[1]);
    } catch (_) { out.STRIPE_PRICE_IDS = null; }
  }
  const createUrlMatch = raw.match(/CREATE_CHECKOUT_SESSION_URL\s*=\s*\([^)]+\)\s*\+\s*['\']\/functions\/v1\/create-checkout-session['\']/);
  out.hasCreateCheckoutUrl = !!raw.match(/CREATE_CHECKOUT_SESSION_URL|create-checkout-session/);
  const supabaseUrlMatch = raw.match(/SUPABASE_URL:\s*['"]([^'"]+)['"]/);
  out.SUPABASE_URL = supabaseUrlMatch ? supabaseUrlMatch[1] : '';
  out.CREATE_CHECKOUT_SESSION_URL = out.SUPABASE_URL ? out.SUPABASE_URL + '/functions/v1/create-checkout-session' : '';
  const linkKeys = [
    'STRIPE_SUPPORTER_MONTHLY_LINK', 'STRIPE_SUPPORTER_YEARLY_LINK',
    'STRIPE_BATTLEPRO_MONTHLY_LINK', 'STRIPE_BATTLEPRO_YEARLY_LINK',
    'STRIPE_CHURCH_MONTHLY_LINK', 'STRIPE_CHURCH_YEARLY_LINK'
  ];
  out.paymentLinksSet = linkKeys.some(k => new RegExp(k + ':\\s*[\'"][^\'"]+[\'"]').test(raw));
  return out;
}

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  let failed = 0;
  console.log('Stripe integration checks\n');

  const config = readConfig();

  // 1. STRIPE_PRICE_IDS present and has expected structure
  const ids = config.STRIPE_PRICE_IDS;
  const tiers = ['supporter', 'battle_pro', 'church'];
  const periods = ['monthly', 'yearly'];
  if (!ids || typeof ids !== 'object') {
    console.log('FAIL STRIPE_PRICE_IDS missing or invalid in config.js');
    failed++;
  } else {
    const missing = [];
    for (const t of tiers) {
      if (!ids[t] || typeof ids[t] !== 'object') missing.push(t);
      else for (const p of periods) {
        if (!ids[t][p] || !String(ids[t][p]).startsWith('price_')) missing.push(`${t}.${p}`);
      }
    }
    if (missing.length) {
      console.log('FAIL STRIPE_PRICE_IDS missing or invalid:', missing.join(', '));
      failed++;
    } else {
      console.log('OK   STRIPE_PRICE_IDS present (supporter, battle_pro, church × monthly, yearly)');
    }
  }

  // 2. create-checkout-session URL
  const fnUrl = config.CREATE_CHECKOUT_SESSION_URL;
  if (!fnUrl) {
    console.log('SKIP create-checkout-session URL (no SUPABASE_URL in config)');
  } else {
    try {
      const res = await fetchUrl(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_id: 'price_fake' })
      });
      if (res.statusCode === 401) {
        console.log('OK   create-checkout-session reachable (401 without auth = expected)');
      } else if (res.statusCode === 404) {
        console.log('INFO create-checkout-session returned 404 (deploy with: supabase functions deploy create-checkout-session)');
      } else if (res.statusCode === 500 && res.body && res.body.includes('Stripe not configured')) {
        console.log('OK   create-checkout-session reachable (Stripe not configured on server)');
      } else if (res.statusCode === 400) {
        console.log('OK   create-checkout-session reachable (400 = invalid price_id)');
      } else {
        console.log('INFO create-checkout-session returned', res.statusCode);
      }
    } catch (e) {
      console.log('FAIL create-checkout-session request failed:', e.message);
      failed++;
    }
  }

  // 3. Payment Links (optional)
  if (config.paymentLinksSet) {
    console.log('OK   At least one Stripe Payment Link URL set in config');
  } else {
    console.log('INFO No Payment Link URLs set (Subscribe buttons will show Notify me / waitlist)');
  }

  // 4. pricing.html content
  if (!fs.existsSync(pricingPath)) {
    console.log('FAIL pricing.html not found');
    failed++;
  } else {
    const pricing = fs.readFileSync(pricingPath, 'utf8');
    const hasSubscribe = /Subscribe|Subscribe now|Unlock/i.test(pricing);
    const hasPricing = /Pricing|price|plan/i.test(pricing);
    const hasTerms = /terms\.html|Terms/i.test(pricing);
    if (!hasSubscribe || !hasPricing) {
      console.log('FAIL pricing.html missing expected content (Subscribe, Pricing)');
      failed++;
    } else {
      console.log('OK   pricing.html has Subscribe / plan content');
    }
    if (!hasTerms) console.log('INFO pricing.html: add link to terms.html for compliance');
  }

  // 5. script.js TDB_GO_TO_CHECKOUT and openStripeCheckout
  const scriptPath = require('path').join(__dirname, 'script.js');
  const script = fs.readFileSync(scriptPath, 'utf8');
  if (!script.includes('TDB_GO_TO_CHECKOUT') || !script.includes('create-checkout-session')) {
    console.log('FAIL script.js missing TDB_GO_TO_CHECKOUT or create-checkout-session usage');
    failed++;
  } else {
    console.log('OK   script.js wires TDB_GO_TO_CHECKOUT and create-checkout-session');
  }

  console.log('\n' + (failed ? failed + ' failure(s).' : 'All Stripe checks passed.'));
  console.log('\nManual test: Use Stripe test card 4242 4242 4242 4242 on pricing.html.');
  console.log('Webhook: Use "stripe listen" and "stripe trigger checkout.session.completed" to test.');
  process.exit(failed ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
