#!/usr/bin/env node
/**
 * Optional: point /give at a Stripe Payment Link (customer chooses amount).
 * Set STRIPE_QUIET_PLACE_URL=https://buy.stripe.com/... in CI or locally before build.
 * When unset or invalid, /give stays on the existing Buy Me a Coffee redirect.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const redirectsPath = path.join(root, '_redirects');
const vercelPath = path.join(root, 'vercel.json');

function main() {
  const raw = (process.env.STRIPE_QUIET_PLACE_URL || '').trim();
  if (!raw) {
    console.log('inject-stripe-give: STRIPE_QUIET_PLACE_URL not set; /give unchanged');
    return;
  }
  let u;
  try {
    u = new URL(raw);
  } catch {
    console.error('inject-stripe-give: invalid URL');
    process.exit(1);
  }
  if (u.protocol !== 'https:' || !/^buy\.stripe\.com$/i.test(u.hostname)) {
    console.error('inject-stripe-give: URL must be https://buy.stripe.com/...');
    process.exit(1);
  }

  let red = fs.readFileSync(redirectsPath, 'utf8');
  const lineRe = /^\/give\s+\S+\s+301\s*$/m;
  if (!lineRe.test(red)) {
    console.error('inject-stripe-give: could not find /give line in _redirects');
    process.exit(1);
  }
  red = red.replace(lineRe, '/give ' + raw + ' 301');
  fs.writeFileSync(redirectsPath, red, 'utf8');

  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const redirects = vercel.redirects;
  if (!Array.isArray(redirects)) {
    console.error('inject-stripe-give: vercel.json missing redirects array');
    process.exit(1);
  }
  const give = redirects.find((r) => r && r.source === '/give');
  if (!give) {
    console.error('inject-stripe-give: no /give redirect in vercel.json');
    process.exit(1);
  }
  give.destination = raw;
  fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf8');

  console.log('inject-stripe-give: /give → Stripe Payment Link (build-time)');
}

main();
