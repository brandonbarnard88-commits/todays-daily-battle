#!/bin/bash
#
# One-time deployment helper for the daily_battles seeder.
#
# This deploys the Edge Function that the GitHub Action calls every day
# to ensure there is always a row for "today" in the daily_battles table.
#
# Run this from the repo root (todaysdailybattle-site).
#
# Prerequisites:
#   - Supabase CLI installed (brew install supabase/tap/supabase)
#   - You have access to the Supabase project (rixsnhpwrlbvvymkfamj)
#
# After running this, you must still add the two secrets in the Supabase Dashboard
# (or via the Management API). The script will print the exact steps.

set -euo pipefail

PROJECT_REF="rixsnhpwrlbvvymkfamj"
FUNCTION_NAME="seed-daily-battle"

echo "==> Checking for Supabase CLI..."
if ! command -v supabase >/dev/null 2>&1; then
  echo "ERROR: supabase CLI not found."
  echo "Install with: brew install supabase/tap/supabase"
  echo "Then re-run this script."
  exit 1
fi

echo "Supabase CLI version: $(supabase --version)"

echo ""
echo "==> You will now be asked to log in (browser will open if needed)."
echo "    If you are already logged in, this is a no-op."
supabase login

echo ""
echo "==> Deploying Edge Function: $FUNCTION_NAME to project $PROJECT_REF"
supabase functions deploy "$FUNCTION_NAME" --project-ref "$PROJECT_REF"

echo ""
echo "✅ Function deployed (or updated)."
echo ""
echo "================================================================"
echo "NEXT: Set the two required secrets for this Edge Function"
echo "================================================================"
echo ""
echo "We need:"
echo "  - SUPABASE_URL (usually already set)"
echo "  - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard → Settings → API)"
echo ""

SERVICE_KEY=""

# Support non-interactive usage via environment variable (great for CI or power users)
if [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY found in environment — using it automatically."
  SERVICE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
else
  read -p "Do you want to set the secrets via Supabase CLI now? (recommended) [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Paste the service_role key (it will NOT be echoed):"
    read -rs SERVICE_KEY
    echo ""
  else
    echo ""
    echo "Skipping automated secret setup."
    echo "You can set them later in the Supabase Dashboard → Edge Functions → $FUNCTION_NAME → Secrets"
    echo "or by re-running this script."
    echo ""
    echo "After secrets are set, run:"
    echo "  npm run seed:test"
    echo "  npm run health"
    exit 0
  fi
fi

if [ -z "$SERVICE_KEY" ]; then
  echo "No key provided. Skipping secret setup."
  echo "Add the secrets manually in the Supabase Dashboard."
else
  echo "==> Setting project secrets via CLI..."
  supabase secrets set \
    --project-ref "$PROJECT_REF" \
    SUPABASE_URL="https://$PROJECT_REF.supabase.co" \
    SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY"

  echo ""
  echo "✅ Secrets set at the project level."
  echo "Edge Functions can now access SUPABASE_SERVICE_ROLE_KEY."
  echo ""
  echo "Note: If the function has its own secret scope, you may also need to add them"
  echo "in the Supabase Dashboard under Edge Functions → $FUNCTION_NAME → Secrets."
fi

echo ""
echo "After secrets are configured, test with:"
echo "  ./scripts/test-seed-function.sh"
echo ""
echo "Or trigger the GitHub Action manually:"
echo "  gh workflow run 'Seed Daily Battle' --repo brandonbarnard88-commits/todays-daily-battle"
echo ""

read -p "Would you like to run the test script right now? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  ./scripts/test-seed-function.sh
fi

echo ""
echo "See also:"
echo "  - supabase/functions/seed-daily-battle/README.md"
echo "  - .github/workflows/seed-daily-battle.yml"
echo "  - DEPLOY-2026-05-31-SWOOP-AND-FIXES.md (full session context)"
echo ""
echo "Done."