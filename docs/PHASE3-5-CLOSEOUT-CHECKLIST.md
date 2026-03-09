# Phase 3-5 Closeout Checklist

Use this to finish push verification, scheduling, and observability in one pass.

## Phase 3 - Subscription Verification

- [ ] In `config.js`, set `VAPID_PUBLIC_KEY` to your real public VAPID key.
- [ ] Confirm `PUSH_SUBSCRIBE_URL` points to `/functions/v1/save-push-subscription`.
- [ ] Confirm `PUSH_UNSUBSCRIBE_URL` points to `/functions/v1/remove-push-subscription`.
- [ ] Open site, enable **8 AM streak reminder**, allow notifications.
- [ ] Verify a row is created in `public.push_subscriptions`.
- [ ] Disable reminder once and verify subscription removal path works.

## Phase 4 - Daily Automation

- [ ] Run SQL: `supabase-push-daily-verse-cron.sql` (replace placeholders first).
- [ ] Confirm cron job exists in `cron.job` table.
- [ ] Manual trigger:
  - `curl -X POST "https://rixsnhpwrlbvvymkfamj.supabase.co/functions/v1/send-daily-verse-push" -H "x-cron-secret: <your_secret>"`
- [ ] Confirm response returns `ok: true`.

## Phase 5 - Monitoring / Reliability

- [ ] Run SQL: `supabase-push-send-logs.sql`.
- [ ] Confirm `send-daily-verse-push` writes run logs to `public.push_send_logs`.
- [ ] Validate recent run:
  - `status` in (`ok`, `empty`, `error`)
  - `sent_count`, `failed_count`, `pruned_count` populate
- [ ] Add dashboard bookmark/query for quick status:
  - `select * from public.push_send_logs order by created_at desc limit 20;`

## Security Follow-up

- [ ] Rotate VAPID keys (they were used in terminal/history during setup).
- [ ] Update Supabase secrets with rotated keys.
- [ ] Re-deploy `send-daily-verse-push --no-verify-jwt`.
- [ ] Re-test curl endpoint with `x-cron-secret`.
