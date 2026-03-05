-- Weekly Church Roundup email cron (Mondays 9AM UTC).
-- Requires pg_cron + pg_net. Run in Supabase SQL Editor.
-- Replace <PROJECT_REF> and <SERVICE_ROLE_KEY> before running.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- To remove: SELECT cron.unschedule('weekly-church-roundup');

-- Schedule: 0 9 * * 1 = Mondays 9AM UTC
SELECT cron.schedule(
  'weekly-church-roundup',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/weekly-church-roundup',
    body := '{}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    )
  ) AS request_id;
  $$
);
