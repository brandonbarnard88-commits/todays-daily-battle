# Email sending setup (daily verse + weekly recap)

The site collects emails for **daily verse** and **newsletter** in Supabase (`newsletter_signups`; optional `daily_opt_in` / `weekly_opt_in`). To actually send emails, you need a sender and a scheduled job.

## 1. Choose a sender

Use one of:

- **Resend** — [resend.com](https://resend.com), simple API, good free tier.
- **SendGrid** — [sendgrid.com](https://sendgrid.com).
- **Mailchimp / ConvertKit** — if you prefer a full email-marketing tool.

## 2. Supabase Edge Function: send-reminders

The repo references a **send-reminders** Edge Function that can send daily verse and weekly recap emails.

1. **Create the function** (if not already present) under `supabase/functions/send-reminders/`.
2. **Secrets** (Supabase Dashboard → Edge Functions → Secrets):
   - For **Resend:** `RESEND_API_KEY` (from Resend dashboard).
   - For **SMTP:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
3. In the function, implement:
   - Read today’s verse from `daily_battles` (or your verse source).
   - Read recipients from `newsletter_signups` where `daily_opt_in = true` (daily) or `weekly_opt_in = true` (weekly).
   - Call Resend API (or SMTP) to send one email per recipient with the verse and a short message.

## 3. Schedule the job

- **Supabase:** In Dashboard → Edge Functions → send-reminders, add a **cron trigger** (e.g. daily at 6:00 AM for daily verse; weekly for recap).
- **External cron:** Use [cron-job.org](https://cron-job.org) or similar to `POST` to your function URL on a schedule, with a body like `{ "type": "daily" }` or `{ "type": "weekly" }`. Secure the endpoint (e.g. secret header or Supabase anon key).

## 4. Database

Ensure `newsletter_signups` has:

- `email` (required)
- `daily_opt_in` (boolean, optional)
- `weekly_opt_in` (boolean, optional)
- `created_at` (optional)

See `supabase-newsletter-columns.sql` or your migration for the exact schema.

## 5. Frontend

The site already has:

- **Daily verse email** — input + submit on the homepage; stores signup (and optional `daily_opt_in`) in Supabase.
- **Newsletter** — signup form (e.g. at `#newsletter`); stores in `newsletter_signups`.

No frontend changes are required to “wire” sending; you only need the backend (Edge Function + sender + cron) as above.

## Quick checklist

- [ ] Sender chosen (Resend / SendGrid / SMTP).
- [ ] `send-reminders` Edge Function implemented and deployed.
- [ ] Secrets set in Supabase for the function.
- [ ] Cron (or external) triggers daily and/or weekly.
- [ ] `newsletter_signups` (and optional columns) exist and are used by the function.
