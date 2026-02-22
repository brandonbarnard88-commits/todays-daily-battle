# seed-daily-battle

Ensures today's row exists in `daily_battles`. If there is no row for today, inserts one with a default verse (Psalm 46:1).

## Deploy

```bash
supabase functions deploy seed-daily-battle
```

## Secrets

Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (usually set automatically in Supabase). No extra secrets required.

## Schedule

Call once per day so "today" always has a row.

### Option A: Supabase Cron (Dashboard)
- Edge Functions → seed-daily-battle → add cron trigger.
- **Midnight UTC:** `0 0 * * *`
- **6:00 AM UTC (verse ready by US morning):** `0 6 * * *`

### Option B: External cron (e.g. cron-job.org, GitHub Actions)
1. Get your function URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/seed-daily-battle`
2. Get an anon or service_role key from Supabase Dashboard → Settings → API.
3. Run daily:
```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/seed-daily-battle" \
  -H "Authorization: Bearer YOUR_ANON_OR_SERVICE_KEY" \
  -H "Content-Type: application/json"
```
Replace `YOUR_PROJECT_REF` and `YOUR_ANON_OR_SERVICE_KEY`. In cron-job.org: create a job, set URL to the function URL, method POST, add header `Authorization: Bearer <key>`, schedule daily.

**Response:** `{ "ok": true, "date": "YYYY-MM-DD", "action": "inserted" | "already_exists" }`
