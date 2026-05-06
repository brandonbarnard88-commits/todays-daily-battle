# Phase 2 - VAPID Push + Failure Logs

This phase moves daily verse push to Supabase + Web Push (VAPID) and adds prayer retry failure logs.

## 1) Run SQL

Run these in Supabase SQL Editor:

- `supabase-push-subscriptions.sql`
- `supabase-failed-prayer-attempts.sql`
- `supabase-push-send-logs.sql`

## 2) Deploy Edge Functions

Deploy:

- `save-push-subscription`
- `remove-push-subscription`
- `send-daily-verse-push`

## 3) Set Site Config (`config.js`)

Set:

- `VAPID_PUBLIC_KEY`
- `PUSH_SUBSCRIBE_URL` -> `.../functions/v1/save-push-subscription`
- `PUSH_UNSUBSCRIBE_URL` -> `.../functions/v1/remove-push-subscription`

## 4) Set Supabase Function Secrets

Required for `send-daily-verse-push`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (e.g. `mailto:you@example.com`)
- `PUSH_CRON_SECRET` (recommended)

## 5) Schedule Daily Cron

Call `send-daily-verse-push` daily around 7-8 AM CST (13:00-14:00 UTC depending on DST).

Example request:

- Method: `POST`
- Header: `Authorization: Bearer <PUSH_CRON_SECRET>`

## 6) Verify

1. Enable streak push toggle in UI.
2. Confirm row appears in `push_subscriptions`.
3. Disable toggle; confirm row is removed.
4. Trigger `send-daily-verse-push` manually; verify notification arrives.
5. Force offline prayer insert failures; verify rows in `failed_prayer_attempts`.
6. Confirm send logs exist in `push_send_logs` after each manual/cron run.
