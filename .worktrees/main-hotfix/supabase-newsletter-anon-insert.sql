-- =============================================================================
-- Allow anonymous INSERT on newsletter_signups (open signup for daily verse / Battle Plan)
-- Run in Supabase SQL Editor AFTER supabase-rls-lockdown.sql.
-- This lets visitors sign up for "Get tomorrow's verse emailed?" and "Join the Battle Plan"
-- without logging in. Anon still cannot SELECT (no reading other rows).
-- =============================================================================

GRANT INSERT ON public.newsletter_signups TO anon;

DROP POLICY IF EXISTS "newsletter_signups_insert_anon" ON public.newsletter_signups;
CREATE POLICY "newsletter_signups_insert_anon"
  ON public.newsletter_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verify: From client with anon key, insert a row (e.g. from incognito signup form).
-- Anon SELECT should still return [] or 403 (no policy for anon SELECT).
