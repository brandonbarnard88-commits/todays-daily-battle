# Push Live Runbook

Use this for reliable daily operations and fast recovery.

## Project

- Supabase project ref: `rixsnhpwrlbvvymkfamj`
- Sender endpoint: `https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/send-daily-verse-push`

## One-Time Setup

1. Run SQL in Supabase SQL Editor:
   - `supabase-push-subscriptions.sql`
   - `supabase-failed-prayer-attempts.sql`
   - `supabase-push-send-logs.sql`
   - `supabase-push-health-rpc.sql`
   - `supabase-push-daily-verse-cron.sql` (replace placeholders first)
2. Deploy functions:
   - `save-push-subscription`
   - `remove-push-subscription`
   - `send-daily-verse-push --no-verify-jwt`
3. Set function secrets (real values only):
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT`
   - `PUSH_CRON_SECRET`

## Manual Send Test

```bash
curl -X POST "https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/send-daily-verse-push" \
  -H "x-cron-secret: <your_real_push_cron_secret>"
```

Expected:
- `{"ok":true,...}` and counts for `sent/failed/pruned`

## Health Queries

Recent sender runs:

```sql
select created_at, date_key, status, sent_count, failed_count, pruned_count, error_message
from public.push_send_logs
order by created_at desc
limit 20;
```

Active cron jobs:

```sql
select jobid, jobname, schedule, active
from cron.job
where jobname ilike '%daily-verse-push%'
order by jobid desc;
```

Current subscriptions:

```sql
select count(*) as total_subscriptions from public.push_subscriptions;
```

Stats page panel:

- Open `/stats.html` and log in with `STATS_PASSWORD`.
- New cards show latest push status and sent count from `get_push_health_latest()` RPC.

## Troubleshooting

- `401 Unauthorized` from sender:
  - Wrong/missing `x-cron-secret` header.
- `Invalid JWT`:
  - Redeploy sender with `--no-verify-jwt`.
- `Placeholder secrets detected`:
  - Replace fake secret values (e.g. `YOUR_...`, `REAL_...`) in Supabase secrets.
- `Could not find table push_subscriptions`:
  - Run `supabase-push-subscriptions.sql`.
- `Vapid public key should be 65 bytes long`:
  - Regenerate valid keys via `npx web-push generate-vapid-keys`.

## Security Hygiene

- Rotate VAPID keys if they were pasted in terminal/chat history.
- After rotation:
  1. update secrets
  2. redeploy sender
  3. run manual send test again
