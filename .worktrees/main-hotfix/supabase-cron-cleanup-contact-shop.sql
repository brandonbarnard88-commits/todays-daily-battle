-- =============================================================================
-- Daily cleanup: contact_messages + shop_waitlist older than 90 days
-- Aligns with privacy.html retention language.
--
-- Prerequisites:
--   - Tables exist (supabase-contact-messages.sql, supabase-shop-waitlist.sql)
--   - pg_cron enabled on your Supabase project (Dashboard → Database → Extensions,
--     or SQL below). Paid plans / supported regions only for pg_cron—check docs.
--
-- Run once in Supabase SQL Editor. Safe to re-run after uncommenting unschedule.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- If you need to replace this job later, run first (use jobid from cron.job):
-- SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'cleanup-old-contact-shop';

SELECT cron.schedule(
  'cleanup-old-contact-shop',
  '0 0 * * *',  -- daily at midnight (server time — usually UTC on Supabase)
  $$
  DELETE FROM public.contact_messages
  WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM public.shop_waitlist
  WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

-- Verify: SELECT * FROM cron.job WHERE jobname = 'cleanup-old-contact-shop';
