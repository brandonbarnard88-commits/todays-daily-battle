# Rate Limiting Notes

## Current Protection

**submit-prayer** (Supabase Edge Function) already enforces per-IP rate limiting:

- **Limit:** 30 requests per 60 seconds per IP
- **Storage:** `rate_limit` table in Supabase (hashed IP keys, no raw IP storage)
- **Response:** 429 with `code: "rate_limited"` when exceeded

See `supabase/functions/submit-prayer/index.ts` and `HARDENING-DEPLOY.md`.

## Cloudflare Worker (Optional)

Prayer submissions go **directly to Supabase** (`*.supabase.co/functions/v1/submit-prayer`), not through your site’s origin. Cloudflare cannot rate limit those URLs unless you proxy them.

If you ever add a proxy path (e.g. `/api/prayer` → Supabase), a Cloudflare Worker could enforce a stricter limit (e.g. 5 req/min) before forwarding. For now, the Edge Function’s 30/min limit is sufficient.

## Tightening the Limit

To reduce from 30 to 5 requests per minute, edit `supabase/functions/submit-prayer/index.ts`:

```ts
const PRAYER_RATE_LIMIT_MAX = 5;  // was 30
```

Redeploy: `supabase functions deploy submit-prayer`
