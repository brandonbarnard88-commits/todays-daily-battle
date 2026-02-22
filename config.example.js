/**
 * Optional config for Today's Daily Battle.
 * Copy this file to config.js and set your values.
 * config.js is optional: if missing, script.js uses built-in defaults.
 * Add config.js to .gitignore if you don't want to commit keys.
 */
window.TDB_CONFIG = {
  // Supabase project URL (e.g. https://xxxx.supabase.co)
  SUPABASE_URL: 'https://your-project-ref.supabase.co',
  // Supabase anon (publishable) key — keep RLS enabled
  SUPABASE_ANON_KEY: 'your-anon-key',
  // Sole admin: set exactly one email. Only this account gets Admin panel and Master badge.
  MASTER_EMAIL: 'your@email.com',
  // Or use first entry of MASTER_EMAILS as the only admin (legacy)
  MASTER_EMAILS: ['your@email.com'],
  // 60-second walkthrough video URL (e.g. Loom). If set, "Watch the 60-second walkthrough" links here.
  WALKTHROUGH_VIDEO_URL: '',
  // Stripe Payment Link URLs (pricing page). If all set, Subscribe buttons open checkout.
  STRIPE_SUPPORTER_MONTHLY_URL: '',
  STRIPE_SUPPORTER_YEARLY_URL: '',
  STRIPE_CHURCH_MONTHLY_URL: '',
  STRIPE_CHURCH_YEARLY_URL: '',
  CF_ANALYTICS_TOKEN: '',
  GOOGLE_SITE_VERIFICATION: '',
  BATTLE_MUG_URL: '',
  // Optional: POST uncaught errors here (e.g. Sentry or your backend). Payload: { message, stack, url }.
  ERROR_REPORT_URL: '',
  // Web Push: VAPID public key for 8 AM streak notifications. Generate with: npx web-push generate-vapid-keys
  VAPID_PUBLIC_KEY: '',
  // Optional: POST push subscription to this URL when user opts in (Start Day 1). Your backend stores it to send 8 AM notifications.
  PUSH_SUBSCRIBE_URL: '',
  // Stats page (stats.html): password to view private dashboard. If empty, stats page shows "Set STATS_PASSWORD in config.js".
  STATS_PASSWORD: ''
};
