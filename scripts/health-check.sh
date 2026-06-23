#!/bin/bash
#
# Quick health check for Today's Daily Battle site and critical services.
# Run this anytime to verify the site is healthy.
#
# Usage:
#   ./scripts/health-check.sh
#   npm run health

set -euo pipefail

DOMAIN="https://www.todaysdailybattle.com"
PROJECT_REF="rixsnhpwrlbvvymkfamj"
SEED_FUNC_URL="https://${PROJECT_REF}.supabase.co/functions/v1/seed-daily-battle"

echo "=== Today's Daily Battle — Health Check ==="
echo "Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. Homepage
echo "→ Homepage..."
status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$DOMAIN/" || echo "000")
if [ "$status" = "200" ]; then
  echo "   ✅ Homepage: $status"
else
  echo "   ❌ Homepage: $status"
fi

# 2. Today's verse (critical dynamic content)
echo "→ Today's verse JSON..."
verse=$(curl -s --max-time 6 "$DOMAIN/today-kjv-verse.json" 2>/dev/null | jq -r '.ref + " — " + .text' 2>/dev/null || echo "ERROR")
if [[ "$verse" != "ERROR" && -n "$verse" ]]; then
  echo "   ✅ Today's verse: $verse"
else
  echo "   ❌ Failed to fetch today's verse"
fi

# 3. Swoop / modern UI markers (to confirm latest deploy is live)
echo "→ UI features (swoop)..."
swoop=$(curl -s --max-time 6 "$DOMAIN/" | grep -oE 'swoop-final|tdb-bottom-dock|Why not AI' | wc -l | tr -d ' ')
if [ "$swoop" -ge 3 ]; then
  echo "   ✅ Swoop UI markers present ($swoop signals)"
else
  echo "   ⚠️  Swoop markers: only $swoop detected (may indicate stale cache)"
fi

# 4. Prayer wall (important dynamic surface)
echo "→ Prayer wall..."
pw_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$DOMAIN/prayer-wall" || echo "000")
if [ "$pw_status" = "200" ] || [ "$pw_status" = "308" ]; then
  echo "   ✅ Prayer wall: $pw_status"
else
  echo "   ❌ Prayer wall: $pw_status"
fi

# 5. Seed function (the last remaining infra item)
echo "→ Seed-daily-battle function..."
seed_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 -X POST "$SEED_FUNC_URL" \
  -H "Content-Type: application/json" -d '{}' || echo "000")

if [ "$seed_status" = "200" ]; then
  echo "   ✅ Seed function: $seed_status (healthy)"
elif [ "$seed_status" = "404" ]; then
  echo "   ❌ Seed function: 404 — still not deployed (run: npm run seed:deploy)"
else
  echo "   ⚠️  Seed function: $seed_status"
fi

# 6. Build stamp (helps confirm latest deploy is live)
echo "→ Build stamp..."
build_stamp=$(curl -s --max-time 6 "$DOMAIN/" | grep -o 'tdb build [0-9]*' | head -1 || echo "not found")
if [[ "$build_stamp" != "not found" ]]; then
  echo "   ✅ $build_stamp"
else
  echo "   ℹ️  Build stamp not detected in HTML comment"
fi

# 7. Quick CSP presence check (security)
echo "→ Security headers (CSP)..."
csp=$(curl -sI --max-time 6 "$DOMAIN/" | grep -i 'content-security-policy' | head -1 || echo "")
if [[ -n "$csp" ]]; then
  echo "   ✅ CSP header present"
else
  echo "   ⚠️  CSP header not detected (check _headers / deploy)"
fi

echo ""
echo "=== Summary ==="
echo "Run 'npm run seed:deploy' if the seed function is still failing."
echo "Full context: cat SEED-DEPLOY.md  |  cat DEPLOY-2026-05-31-SWOOP-AND-FIXES.md"
echo ""
echo "Health check complete."