# Send Reminders Edge Function

Sends **daily** or **weekly** emails to Battle Plan subscribers. Daily emails include today's verse from `daily_battles`; weekly uses the same verse + reflection. Recipients are read from `newsletter_signups` where `daily_opt_in` or `weekly_opt_in` is true.

## Sender: SMTP (current)

Uses Deno SMTP (e.g. Microsoft 365, Gmail, SendGrid SMTP).

### Required secrets

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_HOST` (e.g. smtp.office365.com)
- `SMTP_PORT` (587)
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM` (sender email)

## Alternative: Resend API

To use [Resend](https://resend.com) instead of SMTP, replace the `sendEmail` implementation in `index.ts` with a fetch to `https://api.resend.com/emails` and set `RESEND_API_KEY` in secrets. The request body and recipient list logic stay the same.

## Schedule (cron)

- **Daily verse:** Call once per day (e.g. 6:00 AM) with `{ "type": "daily" }`.
- **Weekly recap:** Call once per week with `{ "type": "weekly" }`.

Use Supabase Dashboard → Edge Functions → Cron, or an external cron (e.g. cron-job.org) that POSTs to your function URL with `Authorization: Bearer <anon_or_service_key>` and body `{"type":"daily"}` or `{"type":"weekly"}`.

## Usage

```bash
# Daily
curl -X POST https://<project>.supabase.co/functions/v1/send-reminders \
  -H "Content-Type: application/json" -H "Authorization: Bearer <key>" \
  -d '{"type":"daily"}'

# Weekly
curl -X POST ... -d '{"type":"weekly"}'
```
