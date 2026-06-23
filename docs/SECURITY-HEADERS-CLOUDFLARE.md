# Security Headers — Cloudflare (HTTPS + Headers)

Do **Step 1** first so the site always serves over HTTPS. Then the Transform Rules (Step 2) apply on every response. Rescan securityheaders.com after each step.

---

## Step 1: Force HTTPS (Page Rule) — do this first

Forces all `http://` requests to redirect to `https://`. Without this, securityheaders.com may hit HTTP and not see your headers; grade stays lower.

**Cloudflare Dashboard → Rules → Page Rules → Create Page Rule**

| Field | Value |
|-------|--------|
| **URL** | `http://todaysdailybattle.com/*` (or `http://*.todaysdailybattle.com/*` if you use subdomains) |
| **Setting** | Always Use HTTPS → **On** |
| **Action** | Save and Deploy |

After 24h live, go to **https://hstspreload.org** and submit `todaysdailybattle.com`. Takes ~2 weeks to land in browser preload lists—locks HTTPS forever, no more HTTP scan fails.

---

## Step 2: Security Headers (Transform Rules)

Use **Cloudflare Dashboard → Rules → Transform Rules → HTTP Response Headers** (not Pages `_headers`). One rule for the whole site.

## Rule

**Name:** `Security Headers - Daily Battle`

**When incoming requests match:**  
- Field: *URI Path*  
- Operator: *matches*  
- Value: `*`  
(Or: *Hostname* equals `todaysdailybattle.com` if you prefer.)

**Then Set static header — add these (overwrite if present):**

| Header Name | Header Value |
|-------------|--------------|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=(), usb=()` |
| `Content-Security-Policy` | *(single line below)* |

**Optional (for A+):** If your Transform Rules also set **Expect-CT** or **X-XSS-Protection**, remove them—they’re deprecated. CSP covers XSS; HSTS makes Expect-CT redundant. Then rescan securityheaders.com.

**Content-Security-Policy (copy exactly, one line):**

```
default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://www.gstatic.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.supabase.co https://todaysdailybattle.com https://todaysdailybattle.org https://plausible.io https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://fonts.googleapis.com https://fonts.gstatic.com https://js.stripe.com https://*.stripe.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://plausible.io https://www.google-analytics.com https://www.google.com https://api.stripe.com; worker-src 'self' blob:; frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com
```

---

## Step 3: HSTS Preload (optional, after 24h)

After Step 1 has been live for 24+ hours, submit: **https://hstspreload.org/?domain=todaysdailybattle.com**

Wait for inclusion in browser preload lists (~2 weeks). After that you’re committed to HTTPS for the domain.

---

## Troubleshooting: `verify-live-csp` / `npm run test:live-csp` fails on X-Frame-Options

**Symptom:** `expected: DENY` but `got: SAMEORIGIN` on `https://todaysdailybattle.com` (and/or `www`).

**Cause:** A **zone-level** Cloudflare rule or legacy setting is setting **`X-Frame-Options: SAMEORIGIN`**, which overrides the **`DENY`** value from **Pages `dist/_headers`**. CSP may still match (including `frame-ancestors 'none'`), but live header parity tests require **`X-Frame-Options` to match the repo**.

**Fix:**

1. **Rules → Transform Rules → Modify response header** — edit or remove any rule that sets `X-Frame-Options` to `SAMEORIGIN`. Set it to **`DENY`** (same as the table in Step 2 above), or remove the header action so only `_headers` applies.
2. **Security → Settings** — check for any automatic response header that forces framing policy; align with **`DENY`**.
3. **Caching → Purge Everything**, wait a minute, then run:

   `npm run test:live-csp`

---

## Step 4: Verify

- **https://securityheaders.com/?q=https://todaysdailybattle.com** — aim for A or A+. With Permissions-Policy added and deprecated headers removed, you should hit A+.
- **When A+ shows:** Site footers already say **"A+ Security – Powered by Cloudflare"** (index.html, pricing.html, bible-study.html). Submit to **https://hstspreload.org/?domain=todaysdailybattle.com** (after 24h HTTPS) for permanent browser enforcement.
- Browser DevTools → Network → select a document → Response Headers: confirm HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are present.
