-- Weekly story email cron (Sundays 9AM UTC).
-- Requires pg_cron + pg_net. Run in Supabase SQL Editor.
-- Replace <PROJECT_REF> and <SERVICE_ROLE_KEY> before running.
-- =============================================================================

-- Enable extensions (Supabase may already have these)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- To remove: SELECT cron.unschedule('weekly-story-email');

-- Schedule: 0 9 * * 0 = Sundays 9AM UTC
SELECT cron.schedule(
  'weekly-story-email',
  '0 9 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/weekly-story-email',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    )
  ) AS request_id;
  $$
);
