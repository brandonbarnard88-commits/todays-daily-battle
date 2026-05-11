# send-broadcast

Owner-triggered broadcast email to newsletter subscribers. Called from the Admin → Email tab.

## Setup (one-time)

1. **Create a free Resend account** at [resend.com](https://resend.com) — 3,000 emails/month free.
2. **Verify your sending domain** in the Resend dashboard (e.g. `todaysdailybattle.com`).
3. **Get your API key** from Resend → API Keys.
4. **Add secrets** in Supabase Dashboard → Settings → Edge Functions → Secrets:
   - `RESEND_API_KEY` — your Resend API key
   - `BROADCAST_FROM_EMAIL` — e.g. `brandon@todaysdailybattle.com` (must be verified domain)
   - `BROADCAST_FROM_NAME` — e.g. `Brandon — Today's Daily Battle`
   - `SUPABASE_SERVICE_ROLE_KEY` — already in your project secrets

5. **Deploy:**
   ```bash
   supabase functions deploy send-broadcast --no-verify-jwt
   ```

## Usage

POST from the Admin page (owner-console.js handles auth automatically):

```json
{
  "subject": "What's new on the porch",
  "body": "Full email text here...",
  "segment": "all",
  "test_email": "brandon@example.com"
}
```

- `segment`: `"all"` | `"weekly"` | `"daily"` — defaults to `"all"`
- `test_email`: if present, sends ONLY to that one address and returns immediately

## Response

```json
{ "sent": 234, "failed": 0, "total": 234 }
```

Every broadcast is logged to `owner_audit_log` automatically.
