# seed-daily-battle

Ensures today's row exists in `daily_battles`. If there is no row for today, inserts one with a default verse (Psalm 46:1).

## Deploy

```bash
supabase functions deploy seed-daily-battle
```

## Secrets

Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (usually set automatically in Supabase). No extra secrets required.

## Schedule

Call once per day, e.g. at midnight UTC:

- **Supabase Cron:** In Dashboard → Edge Functions → seed-daily-battle, add a cron trigger with schedule `0 0 * * *` (daily at 00:00 UTC).
- **External cron:** `curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/seed-daily-battle" -H "Authorization: Bearer YOUR_ANON_OR_SERVICE_KEY"`

Response: `{ "ok": true, "date": "YYYY-MM-DD", "action": "inserted" | "already_exists" }`
