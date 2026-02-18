# Send Reminders Edge Function

This edge function sends daily or weekly reminder emails using Microsoft 365 SMTP.

## Required Environment Variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMTP_HOST` (example: smtp.office365.com)
- `SMTP_PORT` (example: 587)
- `SMTP_USER` (brandon@todaysdailybattle.com)
- `SMTP_PASS` (Microsoft 365 password or app password)
- `SMTP_FROM` (sender email)

## Usage

Send a daily reminder:

```
curl -X POST https://<project>.functions.supabase.co/send-reminders \
  -H "Content-Type: application/json" \
  -d '{"type":"daily"}'
```

Send a weekly reminder:

```
curl -X POST https://<project>.functions.supabase.co/send-reminders \
  -H "Content-Type: application/json" \
  -d '{"type":"weekly"}'
```
