#!/bin/bash
# One-time setup: writes config.js with your Supabase URL, anon key, and admin email.
# Run from project root:  bash setup-config.sh   or  sh setup-config.sh
# Your values stay in your terminal only.

cd "$(dirname "$0")"

echo "Enter your Supabase values (from Dashboard → Project Settings → API)."
echo ""
read -p "SUPABASE_URL (e.g. https://xxxx.supabase.co): " SUPABASE_URL
read -p "SUPABASE_ANON_KEY (anon public key): " SUPABASE_ANON_KEY
read -p "MASTER_EMAIL (your admin email): " MASTER_EMAIL

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$MASTER_EMAIL" ]; then
  echo "Missing a value. Run again and fill all three."
  exit 1
fi

# Escape single quotes for use inside single-quoted JS strings
escape() { echo "$1" | sed "s/'/\\\\'/g"; }
URL_ESC=$(escape "$SUPABASE_URL")
KEY_ESC=$(escape "$SUPABASE_ANON_KEY")
EMAIL_ESC=$(escape "$MASTER_EMAIL")

cat > config.js << EOF
/**
 * Optional config for Today's Daily Battle.
 * Add config.js to .gitignore — do not commit keys.
 */
window.TDB_CONFIG = {
  SUPABASE_URL: '$URL_ESC',
  SUPABASE_ANON_KEY: '$KEY_ESC',
  MASTER_EMAIL: '$EMAIL_ESC',
  MASTER_EMAILS: ['$EMAIL_ESC'],
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: ''
};
EOF

echo "config.js written. Reload the site and try signing in."
