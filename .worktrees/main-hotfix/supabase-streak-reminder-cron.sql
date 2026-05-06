-- Streak reminder email cron (daily 8AM UTC).
-- Requires pg_cron + pg_net. Run in Supabase SQL Editor.
-- Replace <PROJECT_REF> and <SERVICE_ROLE_KEY> before running.
-- =============================================================================

-- Enable extensions (Supabase may already have these)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- To remove: SELECT cron.unschedule('streak-reminder-email');

-- Schedule: 0 8 * * * = daily 8AM UTC
SELECT cron.schedule(
  'streak-reminder-email',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/streak-reminder-email',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    )
  ) AS request_id;
  $$
);
