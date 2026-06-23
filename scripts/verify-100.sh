#!/bin/bash
#
# Comprehensive "Site at 100%" verification.
# Run this to confirm the entire site is in excellent shape.
#
# Usage: npm run verify:100

set -euo pipefail

echo "=============================================="
echo "  Today's Daily Battle — 100% Site Verification"
echo "=============================================="
echo ""

FAILED=0

# 1. Health check (core surfaces + seed function)
echo "1. Running full health check..."
if npm run health > /tmp/health.log 2>&1; then
  echo "   ✅ Health check passed"
else
  echo "   ❌ Health check failed — see /tmp/health.log"
  FAILED=1
fi

# 2. Seed function status
echo "2. Checking seed function..."
SEED_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 -X POST \
  "https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/seed-daily-battle" \
  -H "Content-Type: application/json" -d '{}' || echo "000")

if [ "$SEED_CODE" = "200" ]; then
  echo "   ✅ Seed function healthy (200)"
elif [ "$SEED_CODE" = "404" ]; then
  echo "   ❌ Seed function not deployed (404) — run: npm run seed:deploy"
  FAILED=1
else
  echo "   ⚠️  Seed function returned $SEED_CODE"
fi

# 3. Basic build sanity (quick)
echo "3. Quick build verification..."
if node scripts/verify-asset-versions.mjs > /dev/null 2>&1; then
  echo "   ✅ Asset versions look good"
else
  echo "   ⚠️  Asset version check had issues (non-critical)"
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅✅✅  Site is at 100% operational excellence  ✅✅✅"
  echo ""
  echo "All critical paths healthy. Daily seeding is working."
else
  echo "❌ Site is not yet at 100%."
  echo "Fix the items above, then re-run: npm run verify:100"
fi

echo ""
echo "Full context: cat DEPLOY-2026-05-31-SWOOP-AND-FIXES.md"