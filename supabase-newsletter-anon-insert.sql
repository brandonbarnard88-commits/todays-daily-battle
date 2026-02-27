-- Allow anonymous (unauthenticated) signups for newsletter / daily verse email.
-- Run this in Supabase SQL Editor if you want "Get the daily verse by email" and
-- newsletter signup forms to work without requiring login.
--
-- Prerequisite: RLS is already enabled on newsletter_signups (e.g. from
-- supabase-rls-lockdown.sql). This only adds anon INSERT.
--
-- Dashboard alternative: In Table Editor → newsletter_signups → RLS policies,
-- add a new policy: Name = newsletter_signups_insert_anon, Role = anon,
-- Command = INSERT, WITH CHECK = true. Then grant: GRANT INSERT ON public.newsletter_signups TO anon;

GRANT INSERT ON public.newsletter_signups TO anon;

CREATE POLICY "newsletter_signups_insert_anon"
  ON public.newsletter_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon still has no SELECT (so they can't read other signups). Authenticated
-- users keep their existing select/insert/update policies (own row by email).
