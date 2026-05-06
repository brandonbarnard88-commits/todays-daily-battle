-- =============================================================================
-- Seed prayers table with a few rows (admin only — run after supabase-prayers.sql)
-- Run in Supabase SQL Editor. Safe to run multiple times (inserts new rows).
-- =============================================================================

-- Insert 5 sample rows so "Total prayers" shows real data. Optional: set intent.
INSERT INTO public.prayers (intent, created_at)
VALUES
  ('peace', now() - interval '5 minutes'),
  ('strength', now() - interval '4 minutes'),
  ('healing', now() - interval '3 minutes'),
  ('gratitude', now() - interval '2 minutes'),
  ('hope', now() - interval '1 minute');

-- After this, get_total_prayer_count() will return at least 5 (plus any from quick-pray).
-- No anon exposure: RLS allows only SELECT (count) and INSERT; no personal data in these rows.
