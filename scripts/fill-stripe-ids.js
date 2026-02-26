#!/usr/bin/env node
/**
 * Writes the 6 Stripe Price IDs into config.js so you don't have to edit by hand.
 * Run from project root after you have the 6 price_1... IDs from Stripe Dashboard.
 *
 * Usage (env vars):
 *   STRIPE_SUPPORTER_MONTHLY=price_xxx STRIPE_SUPPORTER_YEARLY=price_xxx \
 *   STRIPE_BATTLEPRO_MONTHLY=price_xxx STRIPE_BATTLEPRO_YEARLY=price_xxx \
 *   STRIPE_CHURCH_MONTHLY=price_xxx STRIPE_CHURCH_YEARLY=price_xxx \
 *   node scripts/fill-stripe-ids.js
 *
 * Or pass 6 args in order: supporter_mo, supporter_yr, battlepro_mo, battlepro_yr, church_mo, church_yr
 *   node scripts/fill-stripe-ids.js price_1A price_1B price_1C price_1D price_1E price_1F
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'config.js');

const fromEnv = {
  supporter_monthly: process.env.STRIPE_SUPPORTER_MONTHLY || '',
  supporter_yearly: process.env.STRIPE_SUPPORTER_YEARLY || '',
  battle_pro_monthly: process.env.STRIPE_BATTLEPRO_MONTHLY || '',
  battle_pro_yearly: process.env.STRIPE_BATTLEPRO_YEARLY || '',
  church_monthly: process.env.STRIPE_CHURCH_MONTHLY || '',
  church_yearly: process.env.STRIPE_CHURCH_YEARLY || ''
};

if (process.argv.length >= 7) {
  fromEnv.supporter_monthly = process.argv[2];
  fromEnv.supporter_yearly = process.argv[3];
  fromEnv.battle_pro_monthly = process.argv[4];
  fromEnv.battle_pro_yearly = process.argv[5];
  fromEnv.church_monthly = process.argv[6];
  fromEnv.church_yearly = process.argv[7];
}

const ids = {
  supporter: { monthly: fromEnv.supporter_monthly, yearly: fromEnv.supporter_yearly },
  battle_pro: { monthly: fromEnv.battle_pro_monthly, yearly: fromEnv.battle_pro_yearly },
  church: { monthly: fromEnv.church_monthly, yearly: fromEnv.church_yearly }
};

let content = fs.readFileSync(configPath, 'utf8');

const block = `window.TDB_CONFIG.STRIPE_PRICE_IDS = {
  supporter: { monthly: '${ids.supporter.monthly}', yearly: '${ids.supporter.yearly}' },
  battle_pro: { monthly: '${ids.battle_pro.monthly}', yearly: '${ids.battle_pro.yearly}' },
  church: { monthly: '${ids.church.monthly}', yearly: '${ids.church.yearly}' }
};`;

const regex = /window\.TDB_CONFIG\.STRIPE_PRICE_IDS\s*=\s*\{[\s\S]*?church:\s*\{\s*monthly:\s*'[^']*',\s*yearly:\s*'[^']*'\s*\}\s*\};/;
const newContent = content.replace(regex, block);
if (newContent === content) {
  console.error('Could not find STRIPE_PRICE_IDS block in config.js');
  process.exit(1);
}
fs.writeFileSync(configPath, newContent);
console.log('Updated config.js with STRIPE_PRICE_IDS.');
console.log('Commit and push when ready: git add config.js && git commit -m "Add Stripe Price IDs" && git push');
