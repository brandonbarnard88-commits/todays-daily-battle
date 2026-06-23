#!/bin/bash
#
# Direct daily_battles seed using Supabase REST API + service role key.
# Use this as emergency fallback if the Edge Function is unavailable.
#
# Usage:
#   SUPABASE_SERVICE_ROLE_KEY=eyJ... npm run seed:direct
#   or
#   SUPABASE_SERVICE_ROLE_KEY=eyJ... bash scripts/seed-direct.sh

set -euo pipefail

PROJECT_REF="rixsnhpwrlbvvymkfamj"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SERVICE_KEY" ]; then
  echo "ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required."
  echo "Get it from Supabase Dashboard → Settings → API → service_role key"
  exit 1
fi

TODAY=$(date -u +%Y-%m-%d)

echo "==> Directly ensuring row for $TODAY in daily_battles..."

# Check if row exists
EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  "${SUPABASE_URL}/rest/v1/daily_battles?date=eq.${TODAY}&select=date" || echo "000")

if [ "$EXISTS" = "200" ]; then
  # Check actual content
  ROW=$(curl -s \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    "${SUPABASE_URL}/rest/v1/daily_battles?date=eq.${TODAY}&select=date" | jq length 2>/dev/null || echo 0)

  if [ "$ROW" -gt 0 ]; then
    echo "✅ Row for $TODAY already exists. Nothing to do."
    exit 0
  fi
fi

# Insert default row
DEFAULT_REF="Psalm 46:1"
DEFAULT_REFLECTION="God is your refuge today. Breathe, pause, and let His strength steady you."
DEFAULT_PRAYER="Lord, be my refuge and strength today. Amen."

echo "Inserting default row for $TODAY..."

curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/daily_battles" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{
    \"date\": \"${TODAY}\",
    \"verse_ref\": \"${DEFAULT_REF}\",
    \"reflection\": \"${DEFAULT_REFLECTION}\",
    \"prayer\": \"${DEFAULT_PRAYER}\"
  }" > /dev/null

echo "✅ Direct seed complete for $TODAY"
echo ""
echo "Verify with: npm run health"