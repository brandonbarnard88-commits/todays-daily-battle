-- =============================================================================
-- Seed a few prayers so the counter feels alive ("Join N warriors right now")
-- Run once in Supabase SQL Editor. Uses your project (service role or postgres).
-- =============================================================================

INSERT INTO public.prayers (intent, family_name, session_id, created_at)
VALUES
  ('Pray for rain in Texas', NULL, 'seed-texas-1', now() - interval '2 hours'),
  ('Healing for grandma', 'A family', 'seed-family-2', now() - interval '4 hours'),
  ('Peace in Ukraine', NULL, 'seed-ukraine-1', now() - interval '6 hours'),
  ('Strength for my dad', NULL, 'seed-dad-1', now() - interval '8 hours'),
  ('Prayed for peace in Memphis', NULL, 'seed-memphis-1', now() - interval '12 hours'),
  ('Grateful for today', NULL, 'seed-grateful-1', now() - interval '1 day'),
  ('Family health', 'The Smiths', 'seed-family-1', now() - interval '1 day'),
  ('Lord, thank you for today', NULL, 'seed-thank-1', now() - interval '2 days'),
  ('For peace and strength in the battle', 'A household', 'seed-strong-1', now() - interval '2 days'),
  ('Lord, help me stay grounded today', NULL, 'seed-grounded-1', now() - interval '3 days');

-- Check: SELECT count(*) FROM public.prayers;
-- Counter will show current total. "Join N warriors right now" updates automatically.
