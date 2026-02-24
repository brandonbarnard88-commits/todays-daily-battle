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
  // Admin is determined server-side only. In Supabase Dashboard: Auth > Users > [user] > set app_metadata to { "role": "admin" }. Do not put admin email in client config.
  // 60-second walkthrough video URL (e.g. Loom). If set, "Watch the 60-second walkthrough" links here.
  WALKTHROUGH_VIDEO_URL: '',
  // Stripe Payment Link URLs (pricing page). If all set, Subscribe buttons open checkout.
  STRIPE_SUPPORTER_MONTHLY_URL: '',
  STRIPE_SUPPORTER_YEARLY_URL: '',
  STRIPE_CHURCH_MONTHLY_URL: '',
  STRIPE_CHURCH_YEARLY_URL: '',
  CF_ANALYTICS_TOKEN: '',
  GA_MEASUREMENT_ID: '',
  GOOGLE_SITE_VERIFICATION: '',
  BATTLE_MUG_URL: '',
  // Analytics: set CF_ANALYTICS_TOKEN (Cloudflare Web Analytics) and/or GA_MEASUREMENT_ID (Google Analytics 4). Search Console: set GOOGLE_SITE_VERIFICATION to the meta content value.
  // Optional: POST uncaught errors here (e.g. Sentry or your backend). Payload: { message, stack, url }.
  ERROR_REPORT_URL: '',
  // Web Push: VAPID public key for 8 AM streak notifications. Generate with: npx web-push generate-vapid-keys
  VAPID_PUBLIC_KEY: '',
  // Optional: POST push subscription to this URL when user opts in (Start Day 1). Your backend stores it to send 8 AM notifications.
  PUSH_SUBSCRIBE_URL: '',
  // Firebase Cloud Messaging (daily 9 AM verse push). From Firebase Console > Project settings > General > Your apps.
  FIREBASE_API_KEY: '',
  FIREBASE_AUTH_DOMAIN: '',
  FIREBASE_PROJECT_ID: '',
  FIREBASE_STORAGE_BUCKET: '',
  FIREBASE_MESSAGING_SENDER_ID: '',
  FIREBASE_APP_ID: '',
  // Web Push key from Firebase Console > Project settings > Cloud Messaging > Web Push certificates (optional; used by getToken).
  FIREBASE_VAPID_KEY: '',
  // POST FCM token here when user opts in (same backend can store tokens for 9 AM send).
  FCM_SUBSCRIBE_URL: '',
  // Stats page (stats.html): password to view private dashboard. If empty, stats page shows "Set STATS_PASSWORD in config.js".
  STATS_PASSWORD: ''
};
