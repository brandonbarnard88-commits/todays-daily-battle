# Abuse protection (Quick Pray)

Quick Pray is protected by **Cloudflare Turnstile** so the prayer wall and counter aren’t flooded by bots or abuse.

## How it works

- When **Turnstile is configured** (see below), the Quick Pray form shows a small verification widget. On submit, the client sends the Turnstile token plus the intention to the **submit-prayer** Edge Function. The function verifies the token with Cloudflare and, if valid, inserts into `prayers` using the service role.
- When **Turnstile is not configured** or the user is offline, the prayer is saved **locally on the device only**. It does not write to `public.prayers`, the shared wall, or shared counters until the protected path is available and the user submits again.
- `public.prayers` is locked down at the database level: `anon` and `authenticated` do not get direct table access. Public prayer wall reads, counts, and Amen taps go through SECURITY DEFINER RPCs only.

## Setup (one-time)

1. **Create a Turnstile widget**  
   [Cloudflare Dashboard](https://dash.cloudflare.com) → **Turnstile** → Add site → choose widget type (e.g. Managed or Non-interactive). Copy the **Site key** (public) and **Secret key**.

2. **Frontend**  
   In `config.js` set:
   ```js
   window.TDB_CONFIG.TURNSTILE_SITE_KEY = 'your-site-key';
   ```
   `SUBMIT_PRAYER_URL` is set automatically from `SUPABASE_URL` in config.

3. **Deploy the Edge Function**
   ```bash
   supabase functions deploy submit-prayer
   ```

4. **Set secrets** (Supabase → Edge Functions → submit-prayer → Secrets):
   - `TURNSTILE_SECRET_KEY` = your Turnstile **secret** key  
   - `SUPABASE_URL` = your project URL  
   - `SUPABASE_SERVICE_ROLE_KEY` = from Supabase → Settings → API → service_role  

Details: **supabase/functions/submit-prayer/README.md**

## User experience

- User sees the Turnstile widget under the Pray button (dark theme).
- If they tap Pray without completing verification: toast *"Complete the verification below, then tap Pray."*
- After a successful submit, the widget resets so they can pray again.
- If verification fails or expires: the prayer stays private on the device and the user is asked to complete the check and tap Pray again for shared prayer.

## Silent / offline behavior

- The **offline queue** remains local-only. It preserves prayer text privately on the device, but it does not auto-flush to `public.prayers` in the background.
- The **Silent offering** is local-only. It no longer writes to the shared wall or shared counters without the protected submit path.
