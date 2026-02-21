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
  // Optional: POST uncaught errors here (e.g. Sentry or your backend). Payload: { message, stack, url }.
  ERROR_REPORT_URL: ''
};
