#!/bin/bash
#
# Ultra-simple one-command wrapper to deploy the seed function.
# This is the final missing piece.
#
# Just run:
#   ./deploy-seed.sh
#
# Advanced (non-interactive):
#   SUPABASE_SERVICE_ROLE_KEY=eyJ... ./deploy-seed.sh
#
# It will guide you through everything (or use the key from the environment).

set -euo pipefail

echo "================================================================"
echo "  Today's Daily Battle — Final Deployment Step"
echo "  Deploying seed-daily-battle Edge Function"
echo "================================================================"
echo ""

if [ -f "./scripts/deploy-seed-function.sh" ]; then
  exec ./scripts/deploy-seed-function.sh
else
  echo "Error: Could not find scripts/deploy-seed-function.sh"
  echo "Please run from the project root (todaysdailybattle-site)."
  exit 1
fi
