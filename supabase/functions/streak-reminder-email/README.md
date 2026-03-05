# streak-reminder-email

Sends "Keep the Streak Going!" to parents whose kid missed yesterday (kid_streaks.last_day < yesterday UTC).

**Schedule:** Daily 8AM UTC.

**Prerequisites:**
- `kid_streaks` table (run supabase-kid-streaks.sql)
- Client sync: kids-battle.js calls `upsert_kid_streak` on load and when kid taps "I Did It Today!"

**Env:** MAILGUN_..., SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

## Manual test

```bash
curl -X POST "https://<project>.supabase.co/functions/v1/streak-reminder-email" \
  -H "Authorization: Bearer <service_role_key>"
```

## Cron (cron-job.org or pg_cron)

Schedule: `0 8 * * *` (daily 8AM UTC).
