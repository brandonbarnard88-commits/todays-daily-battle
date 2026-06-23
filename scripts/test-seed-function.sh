#!/bin/bash
#
# Test script for the seed-daily-battle Edge Function.
# Run this after deployment and secrets are set.
#
# Usage:
#   ./scripts/test-seed-function.sh
#   ./scripts/test-seed-function.sh https://rixsnhpwrlbvvymkfamj.supabase.co

set -euo pipefail

PROJECT_REF="${1:-rixsnhpwrlbvvymkfamj}"
FUNC_URL="https://${PROJECT_REF}.supabase.co/functions/v1/seed-daily-battle"

echo "==> Testing seed-daily-battle at:"
echo "    $FUNC_URL"
echo ""

echo "==> Calling the function (POST with no auth — the function itself uses service_role internally)..."
echo ""

response=$(curl -sS -w "\nHTTPSTATUS:%{http_code}" -X POST "$FUNC_URL" \
  -H "Content-Type: application/json" \
  -d '{}' || true)

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

echo "HTTP Status: $status"
echo "Response body:"
echo "$body" | jq . 2>/dev/null || echo "$body"
echo ""

if [ "$status" = "200" ]; then
  echo "✅ SUCCESS"
  echo ""
  echo "The function responded correctly."
  echo "Check your daily_battles table in Supabase to confirm today's row exists."
else
  echo "❌ FAILED (HTTP $status)"
  echo ""
  echo "Common causes after deployment:"
  echo "  - SUPABASE_SERVICE_ROLE_KEY secret not set on the function (or project)"
  echo "  - RLS policies blocking the insert on daily_battles table"
  echo "  - Function logs in Supabase Dashboard → Edge Functions → seed-daily-battle → Logs"
  echo ""
  echo "Re-run the deploy script if needed:"
  echo "  ./scripts/deploy-seed-function.sh"
fi
