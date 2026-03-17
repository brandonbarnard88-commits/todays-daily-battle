#!/usr/bin/env bash
# Deploy stripe-webhook Edge Function.
# Prereqs: npx supabase login, npx supabase link
# Set secrets first: npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx STRIPE_SECRET_KEY=sk_xxx
set -e
echo "Deploying stripe-webhook..."
npx supabase functions deploy stripe-webhook
echo "Done. Add webhook endpoint in Stripe Dashboard:"
echo "  URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook"
echo "  Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"
