-- =============================================================================
-- Seed a few prayers so the counter feels alive ("Join 11 warriors right now")
-- Run once in Supabase SQL Editor. Uses your project (service role or postgres).
-- =============================================================================

INSERT INTO public.prayers (intent, family_name, session_id, created_at)
VALUES
  ('Prayed for peace in Memphis', NULL, 'seed-memphis-1', now() - interval '5 minutes'),
  ('Grateful for today', NULL, 'seed-grateful-1', now() - interval '12 minutes'),
  ('Family health', 'The Smiths', 'seed-family-1', now() - interval '25 minutes');

-- Check: SELECT count(*) FROM public.prayers;
-- Counter will show current total (e.g. 9 + 3 = 12). "Join N warriors right now" updates automatically.
