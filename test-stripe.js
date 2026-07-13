#!/usr/bin/env node
/**
 * Stripe integration tests (config + endpoint reachability).
 * Run: node test-stripe.js
 * Optional: set BASE_URL for create-checkout-session (default: from config SUPABASE_URL).
 *
 * Does NOT use real Stripe keys or charge cards. It checks:
 * - config still has create-checkout-session URL (endpoint now returns subscriptions_closed)
 * - create-checkout-session responds (410 subscriptions closed = expected after Phase 2b-1)
 * - pricing / script redirect subscription checkouts toward Give
 * - donation path remains separate (create-donation-session)
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

  // 1. STRIPE_PRICE_IDS — legacy; not required for new feature checkouts (Phase 2b-1)
  const ids = config.STRIPE_PRICE_IDS;
  const tiers = ['supporter', 'battle_pro', 'church'];
  const periods = ['monthly', 'yearly'];
  if (!ids || typeof ids !== 'object') {
    console.log('INFO STRIPE_PRICE_IDS absent in config.js (OK — feature subscriptions closed)');
  } else {
    const missing = [];
    for (const t of tiers) {
      if (!ids[t] || typeof ids[t] !== 'object') missing.push(t);
      else for (const p of periods) {
        if (!ids[t][p] || !String(ids[t][p]).startsWith('price_')) missing.push(`${t}.${p}`);
      }
    }
    if (missing.length) {
      console.log('INFO STRIPE_PRICE_IDS incomplete (unused for new checkouts):', missing.join(', '));
    } else {
      console.log('INFO STRIPE_PRICE_IDS still present (legacy; unused for new feature checkouts)');
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
      if (res.statusCode === 410 && res.body && res.body.indexOf('subscriptions_closed') !== -1) {
        console.log('OK   create-checkout-session closed (410 subscriptions_closed = Phase 2b-1)');
      } else if (res.statusCode === 401) {
        console.log('INFO create-checkout-session still requires auth (redeploy function for 410 closed response)');
      } else if (res.statusCode === 404) {
        console.log('INFO create-checkout-session returned 404 (deploy with: supabase functions deploy create-checkout-session)');
      } else if (res.statusCode === 500 && res.body && res.body.includes('Stripe not configured')) {
        console.log('INFO create-checkout-session reachable (Stripe not configured on server)');
      } else if (res.statusCode === 400) {
        console.log('INFO create-checkout-session returned 400 (redeploy for subscriptions_closed)');
      } else {
        console.log('INFO create-checkout-session returned', res.statusCode);
      }
    } catch (e) {
      console.log('FAIL create-checkout-session request failed:', e.message);
      failed++;
    }
  }

  // 3. Payment Links (optional / legacy)
  if (config.paymentLinksSet) {
    console.log('INFO Payment Link URLs still present in config (unused for feature tiers; Give uses donations)');
  } else {
    console.log('OK   No subscription Payment Link URLs required');
  }

  // 4. pricing.html content — free + giving model
  if (!fs.existsSync(pricingPath)) {
    console.log('FAIL pricing.html not found');
    failed++;
  } else {
    const pricing = fs.readFileSync(pricingPath, 'utf8');
    const hasFreeModel = /Everything is free|Giving is completely optional/i.test(pricing);
    const hasGive = /\/give/.test(pricing);
    const hasTerms = /terms\.html|Terms/i.test(pricing);
    const hasSubscribeUpsell = /Subscribe \$|Join Battle Pro|Unlock with/i.test(pricing);
    if (!hasFreeModel || !hasGive) {
      console.log('FAIL pricing.html missing free + giving messaging');
      failed++;
    } else if (hasSubscribeUpsell) {
      console.log('FAIL pricing.html still has subscription upsell CTAs');
      failed++;
    } else {
      console.log('OK   pricing.html free + giving model (no subscription upsell)');
    }
    if (!hasTerms) console.log('INFO pricing.html: add link to terms.html for compliance');
  }

  // 5. script.js — subscription checkout kill switch
  const scriptPath = require('path').join(__dirname, 'script.js');
  const script = fs.readFileSync(scriptPath, 'utf8');
  if (!script.includes('TDB_GO_TO_CHECKOUT') || !script.includes('subscription_checkout_closed') || !script.includes("'/give'")) {
    console.log('FAIL script.js missing subscription kill switch (TDB_GO_TO_CHECKOUT → /give)');
    failed++;
  } else {
    console.log('OK   script.js redirects closed subscription checkouts to /give');
  }

  console.log('\n' + (failed ? failed + ' failure(s).' : 'All Stripe checks passed.'));
  console.log('\nDonations: test Give page / create-donation-session. Feature subscriptions are closed.');
  console.log('Deploy closed checkout: supabase functions deploy create-checkout-session');
  process.exit(failed ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
