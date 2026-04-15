# submit-prayer

Edge Function that verifies a Cloudflare Turnstile token and inserts a Quick Pray into `prayers` using the service role. This prevents spam and bot abuse on the prayer wall.

## Request

- **Method:** POST
- **Body (JSON):** `{ turnstile_token: string, intent: string, family_name?: string, session_id?: string }`
- **Response:** `{ ok: true }` (200) or `{ error: string, code?: string }` (4xx/5xx)

## Secrets (Supabase Dashboard → Edge Functions → submit-prayer → Secrets)

| Secret | Description |
|--------|-------------|
| `TURNSTILE_SECRET_KEY` | From [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile → your widget → Secret key |
| `SUPABASE_URL` | Your project URL (e.g. `https://xxxx.supabase.co`) — often set at project level |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API → service_role key (so the function can insert into `prayers`) |

## Client setup

1. In [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) create a widget (e.g. "Managed" or "Non-interactive").
2. In `config.js` set `TDB_CONFIG.TURNSTILE_SITE_KEY` to the widget’s **site key** (public).
3. Deploy: `supabase functions deploy submit-prayer`
4. Set the three secrets above.

When `TURNSTILE_SITE_KEY` and `SUBMIT_PRAYER_URL` are set, the Quick Pray form will show the Turnstile widget and submit via this function. If either is missing, the prayer stays local on the device and does **not** fall back to direct Supabase insert.
