-- Daily verse push cron for Supabase Edge Function.
-- Requires pg_cron + pg_net. Run in Supabase SQL Editor.
-- Replace <PROJECT_REF> and <PUSH_CRON_SECRET> before running.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove existing job if needed:
-- SELECT cron.unschedule('daily-verse-push-7am-cst');

-- 7:00 AM America/Chicago:
-- CST (UTC-6) -> 13:00 UTC
-- CDT (UTC-5) -> 12:00 UTC
-- Pick one based on season or update seasonally.
SELECT cron.schedule(
  'daily-verse-push-7am-cst',
  '0 13 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-daily-verse-push',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', '<PUSH_CRON_SECRET>'
    )
  ) AS request_id;
  $$
);
