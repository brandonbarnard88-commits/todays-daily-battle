-- Weekly newsletter cron for Friday 7 PM local time.
-- Run in Supabase SQL editor.
-- Replace <PROJECT_REF>, <SERVICE_ROLE_KEY>, and <LOCAL_TZ>.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Optional rerun cleanup:
-- select cron.unschedule('tdb-weekly-newsletter-friday-7pm-local');

select cron.schedule(
  'tdb-weekly-newsletter-friday-7pm-local',
  '0 * * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/weekly-newsletter',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
    ),
    body := jsonb_build_object(
      'send_if_local', jsonb_build_object(
        'weekday', 5,
        'hour', 19,
        'tz', '<LOCAL_TZ>'
      ),
      'email_only', true,
      'include_name_intro', false,
      'one_click_opt_out', true
    )
  ) as request_id;
  $$
);
