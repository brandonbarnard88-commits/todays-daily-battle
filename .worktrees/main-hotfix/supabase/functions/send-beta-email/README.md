# send-beta-email

Sends a welcome email with invite code when a family signs up for Kids Battle Beta.

## Trigger

Called by the client (`kids-beta.html`) after successful insert to `kids_beta_waitlist`. Fire-and-forget — no UI block on failure.

## Request

```
POST /functions/v1/send-beta-email
Content-Type: application/json

{ "email": "parent@example.com", "code": "ABC123" }
```

## Secrets (Supabase Dashboard → Edge Functions → send-beta-email → Secrets)

| Secret | Description |
|--------|-------------|
| `MAILGUN_API_KEY` | Mailgun Private API key (Dashboard → Sending → API keys) |
| `MAILGUN_DOMAIN` | Your Mailgun sending domain (e.g. `mg.todaysdailybattle.com`) |
| `MAILGUN_FROM` | From address (e.g. `Kids Battle <noreply@mg.todaysdailybattle.com>`) |

## Deploy

```bash
supabase functions deploy send-beta-email
```

Then add the three secrets above in the Supabase Dashboard.

## EU region

If using Mailgun EU, change the URL in `index.ts` to `https://api.eu.mailgun.net/v3/...`.
