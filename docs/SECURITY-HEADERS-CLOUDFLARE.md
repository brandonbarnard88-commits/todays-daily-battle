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
| `Content-Security-Policy` | *(single line below)* |

**Content-Security-Policy (copy exactly, one line):**

```
default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://www.gstatic.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.supabase.co https://todaysdailybattle.com https://todaysdailybattle.org https://plausible.io https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://fonts.googleapis.com https://fonts.gstatic.com https://js.stripe.com https://*.stripe.com https://challenges.cloudflare.com https://static.cloudflareinsights.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://plausible.io https://www.google-analytics.com https://api.stripe.com; worker-src 'self' blob:; frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com
```

---

## Step 3: HSTS Preload (optional, after 24h)

After Step 1 has been live for 24+ hours, submit: **https://hstspreload.org/?domain=todaysdailybattle.com**

Wait for inclusion in browser preload lists (~2 weeks). After that you’re committed to HTTPS for the domain.

---

## Step 4: Verify

- **https://securityheaders.com/?q=todaysdailybattle.com** — aim for A or A+ after Step 1 + 2.
- Browser DevTools → Network → select a document → Response Headers: confirm all five headers are present.
