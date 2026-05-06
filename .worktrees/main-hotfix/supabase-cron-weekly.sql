-- Weekly newsletter cron setup (Friday 7 PM local-time aware).
-- Run in Supabase SQL Editor.
-- Replace <PROJECT_REF>, <SERVICE_ROLE_KEY>, and <LOCAL_TZ>.
-- Example timezone: America/Chicago

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Optional cleanup if re-running:
-- SELECT cron.unschedule('weekly-battle-newsletter-local');

/*
  Why hourly?
  pg_cron schedules in DB timezone (often UTC). To keep this "Friday 7 PM local",
  we ping hourly and let the function send only at local Friday 19:00 based on tz.
*/
SELECT cron.schedule(
  'weekly-battle-newsletter-local',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/weekly-newsletter',
    body := jsonb_build_object(
      'subject', 'This Week''s Battle - You Showed Up',
      'template', 'newsletter-template-weekly.html',
      'send_if_local', jsonb_build_object(
        'weekday', 5,        -- Friday
        'hour', 19,          -- 7 PM
        'tz', '<LOCAL_TZ>'   -- e.g. America/Chicago
      )
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    )
  ) AS request_id;
  $$
);

-- Notes:
-- 1) The edge function should gate by send_if_local and de-dupe by week key.
-- 2) Recipients come from newsletter_signups where weekly_opt_in = true.
