# weekly-story-email

Sends "This week's Kids Battle story" to all parents in `kids_beta_waitlist` where `used=true`.

**Schedule:** Sundays 9AM UTC (one story per week, 52 stories per year).

**Env:** Reuse `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` from other Kids Battle functions.

## Invoke manually

```bash
curl -X POST "https://<project-ref>.supabase.co/functions/v1/weekly-story-email" \
  -H "Authorization: Bearer <anon-or-service-role-key>"
```

## Cron setup

### Option A: External cron (cron-job.org, GitHub Actions, etc.)

Create a cron job that runs **Sundays 9AM UTC** (`0 9 * * 0`):

```
POST https://<project-ref>.supabase.co/functions/v1/weekly-story-email
Authorization: Bearer <service_role_key>
```

Use [cron-job.org](https://cron-job.org) or similar: create HTTP job, set schedule to "Every Sunday at 09:00 UTC".

### Option B: Supabase pg_cron + pg_net

If your project has `pg_cron` and `pg_net` enabled:

```sql
-- Enable extensions (if not already)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule: Sundays 9AM UTC
SELECT cron.schedule(
  'weekly-story-email',
  '0 9 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/weekly-story-email',
    headers := '{"Authorization": "Bearer <service_role_key>"}'::jsonb
  );
  $$
);
```

Replace `<project-ref>` and `<service_role_key>` with your values.

## Response

```json
{
  "ok": true,
  "story": "Armor of God",
  "recipients": 42,
  "sent": 42
}
```

## Logs

Check Supabase Dashboard → Edge Functions → weekly-story-email → Logs for send confirmations and errors.
