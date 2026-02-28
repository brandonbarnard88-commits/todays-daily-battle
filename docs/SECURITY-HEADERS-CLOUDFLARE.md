# Security Headers — Cloudflare Transform Rules (Priority 1 & 2)

Use this when you configure headers in **Cloudflare Dashboard → Rules → Transform Rules → HTTP Response Headers** (not Pages `_headers`). One rule for the whole site.

---

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
default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://www.gstatic.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.supabase.co https://todaysdailybattle.com https://todaysdailybattle.org https://plausible.io https://www.googletagmanager.com https://js.stripe.com; style-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://fonts.googleapis.com https://js.stripe.com https://challenges.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://plausible.io https://www.google-analytics.com https://api.stripe.com; worker-src 'self' blob:; frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com
```

---

## HSTS Preload (optional)

After this has been live for 24+ hours, submit: https://hstspreload.org/?domain=todaysdailybattle.com  

Then wait for inclusion in browser preload lists (~2 weeks). After that you’re committed to HTTPS for the domain.

---

## Check

- https://securityheaders.com/?q=todaysdailybattle.com — aim for A+ after deploy.
- Browser DevTools → Network → select a document → Response Headers: confirm all five headers are present.
