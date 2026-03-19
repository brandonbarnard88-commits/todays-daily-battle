/**
 * Optional config for Today's Daily Battle.
 * Copy this file to config.js and set your values.
 * Before production: replace SUPABASE_URL and SUPABASE_ANON_KEY with values from Supabase Dashboard (Settings → API).
 * config.js is optional: if missing, script.js uses built-in defaults.
 * Add config.js to .gitignore if you don't want to commit keys.
 *
 * ── QUICK SETUP GUIDE ──────────────────────────────────────────────────────
 *
 * 1. Google Analytics 4 (GA4)
 *    a. Go to https://analytics.google.com → Admin → Create Property → Web
 *    b. Add your site URL (https://todaysdailybattle.com) and timezone
 *    c. In "Data Streams", copy the Measurement ID (starts with G-)
 *    d. Paste it below: GA_MEASUREMENT_ID: 'G-XXXXXXXXXX'
 *    Events already tracked automatically (no extra code needed):
 *      - page_view (on every load)
 *      - daily_mood_checkin (mood: 'hope' | 'peace' | etc.)
 *      - prayer_wall_add, prayer_list_add
 *      - quick_search, search_query
 *      - share_daily_battle, share_daily_battle_image
 *      - streak_started, milestone_reached
 *      - bible_study_start, plan_view, upgrade_click
 *
 * 2. Google Search Console (GSC) — for submitting your sitemap + monitoring rank
 *    a. Go to https://search.google.com/search-console → Add Property
 *    b. Choose "URL prefix" → enter https://todaysdailybattle.com/
 *    c. Under "Other verification methods" → HTML tag → copy the content value
 *       e.g. content="abc123xyz" → paste only the value (not the full tag)
 *    d. Paste it below: GOOGLE_SITE_VERIFICATION: 'abc123xyz'
 *    e. After verifying, go to Sitemaps → add: https://todaysdailybattle.com/sitemap.xml
 *    f. Request indexing on key pages: /, /topic-anxiety.html, /topic-fear.html, etc.
 *
 * 3. Cloudflare Web Analytics (optional, privacy-first, no cookies)
 *    a. Cloudflare Dashboard → Analytics → Web Analytics → Add a site
 *    b. Copy the beacon token (32-char hex string)
 *    c. Paste it below: CF_ANALYTICS_TOKEN: 'your-32-char-token'
 *
 * ───────────────────────────────────────────────────────────────────────────
 */
window.TDB_CONFIG = {
  // Supabase project URL (e.g. https://xxxx.supabase.co)
  SUPABASE_URL: 'https://your-project-ref.supabase.co',
  // Supabase anon (publishable) key — keep RLS enabled
  SUPABASE_ANON_KEY: 'your-anon-key',
  // Optional: force email confirmation/reset links to this origin (e.g. https://todaysdailybattle.com). If unset, redirect uses current page origin.
  AUTH_REDIRECT_BASE: '',
  // Admin is determined server-side only. In Supabase Dashboard: Auth > Users > [user] > set app_metadata to { "role": "admin" }. Do not put admin email in client config.
  // Reserved: optional walkthrough URL if you add #walkthrough-wrap markup; homepage does not ship this by default.
  WALKTHROUGH_VIDEO_URL: '',
  // Stripe Payment Link URLs (pricing page). If all set, Subscribe buttons open checkout.
  // Supporter: $5/mo, $50/yr. Battle Pro: $10/mo, $100/yr. Church: $10/mo, $100/yr.
  STRIPE_SUPPORTER_MONTHLY_URL: '',
  STRIPE_SUPPORTER_YEARLY_URL: '',
  STRIPE_BATTLEPRO_MONTHLY_URL: '',
  STRIPE_BATTLEPRO_YEARLY_URL: '',
  // Military honored rate: Battle Pro $5/mo, $50/yr (create separate Stripe Payment Links; set tier metadata to battle_pro in Stripe).
  STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK: '',
  STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK: '',
  STRIPE_CHURCH_MONTHLY_URL: '',
  STRIPE_CHURCH_YEARLY_URL: '',
  // Same keys with _LINK suffix also work (e.g. STRIPE_SUPPORTER_MONTHLY_LINK).
  STRIPE_SUPPORTER_MONTHLY_LINK: '',
  STRIPE_SUPPORTER_YEARLY_LINK: '',
  STRIPE_BATTLEPRO_MONTHLY_LINK: '',
  STRIPE_BATTLEPRO_YEARLY_LINK: '',
  STRIPE_BATTLEPRO_MILITARY_MONTHLY_LINK: '',
  STRIPE_BATTLEPRO_MILITARY_YEARLY_LINK: '',
  STRIPE_CHURCH_MONTHLY_LINK: '',
  STRIPE_CHURCH_YEARLY_LINK: '',
  CF_ANALYTICS_TOKEN: '',
  GA_MEASUREMENT_ID: '',
  PLAUSIBLE_DOMAIN: '',
  GOOGLE_SITE_VERIFICATION: '',
  BATTLE_MUG_URL: '',
  HERO_TAGLINE_URL: '',
  // Analytics: set CF_ANALYTICS_TOKEN (Cloudflare Web Analytics), GA_MEASUREMENT_ID (Google Analytics 4), and/or PLAUSIBLE_DOMAIN (e.g. todaysdailybattle.com) for Plausible. Search Console: set GOOGLE_SITE_VERIFICATION.
  // Optional: POST uncaught errors here (e.g. Sentry or your backend). Payload: { message, stack, url }.
  ERROR_REPORT_URL: '',
  // Web Push: VAPID public key for 8 AM streak notifications. Generate with: npx web-push generate-vapid-keys
  VAPID_PUBLIC_KEY: '',
  // Optional: POST push subscription to this URL when user opts in (Start Day 1). Your backend stores it to send 8 AM notifications.
  PUSH_SUBSCRIBE_URL: '',
  // Optional: POST endpoint to remove push subscription when user opts out.
  PUSH_UNSUBSCRIBE_URL: '',
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
  // Optional: POST FCM token here when user opts out so backend can stop sends.
  FCM_UNSUBSCRIBE_URL: '',
  // Stats page (stats.html): password to view private dashboard. If empty, stats page shows "Set STATS_PASSWORD in config.js".
  STATS_PASSWORD: ''
};
