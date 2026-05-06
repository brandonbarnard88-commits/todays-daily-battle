-- =============================================================================
-- Seed church prayer requests so the wall feels alive.
-- Run after supabase-church-groups.sql and supabase-church-prayer-wall.sql.
-- Replace GROUP_UUID with a real UUID from: SELECT id FROM church_groups LIMIT 1;
-- =============================================================================

-- Manual insert (replace GROUP_UUID with your church group id from church_groups table):
/*
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at) VALUES
  ('GROUP_UUID', 'seed1', 'Pray for peace in Ukraine', now()),
  ('GROUP_UUID', 'seed2', 'Healing for my dad', now()),
  ('GROUP_UUID', 'seed3', 'Pray for rain in Texas', now() - interval '2 hours'),
  ('GROUP_UUID', 'seed4', 'Strength for my mom', now() - interval '4 hours'),
  ('GROUP_UUID', 'seed5', 'Wisdom for our leaders', now() - interval '6 hours'),
  ('GROUP_UUID', 'seed6', 'Our youth group', now() - interval '8 hours'),
  ('GROUP_UUID', 'seed7', 'Family going through loss', now() - interval '12 hours');
*/

-- Auto-insert into first group (run if you have at least one church group):
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at)
SELECT id, 'seed-church-1', 'Pray for peace in Ukraine', now() FROM public.church_groups LIMIT 1;
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at)
SELECT id, 'seed-church-2', 'Healing for my dad', now() - interval '2 hours' FROM public.church_groups LIMIT 1;
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at)
SELECT id, 'seed-church-3', 'Pray for rain in Texas', now() - interval '4 hours' FROM public.church_groups LIMIT 1;
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at)
SELECT id, 'seed-church-4', 'Strength for our family', now() - interval '6 hours' FROM public.church_groups LIMIT 1;
INSERT INTO public.church_prayer_requests (group_id, anon_id, text, created_at)
SELECT id, 'seed-church-5', 'Our youth group', now() - interval '8 hours' FROM public.church_groups LIMIT 1;
