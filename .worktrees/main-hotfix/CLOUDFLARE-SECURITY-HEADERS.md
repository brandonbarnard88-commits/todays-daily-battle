# Cloudflare: CSP & security headers (fortress set)

Strict CSP and extra security headers for todaysdailybattle.com. Set these in **Cloudflare** so they apply to all responses.

**If your site went black** (styles/scripts blocked), see **CLOUDFLARE-CSP-FIX.md** first. This doc adds a full “fortress” header set once the site is loading correctly.

---

## Where to set headers

- **Rules** → **Transform Rules** → **Modify Response Header** (or **Response Header Modification**).
- Use **one rule per header** or a single rule that sets multiple headers, depending on your plan. Below we list each header and a single combined approach.

---

## 1. Content-Security-Policy (CSP)

Only **one** place should set CSP (Cloudflare **or** your HTML meta, not both with conflicting values). Prefer Cloudflare so you can change it without redeploying.

**Suggested value** (allows your current scripts, styles, Supabase, Turnstile, fonts, images):

```
default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://www.gstatic.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://*.supabase.co https://challenges.cloudflare.com https://todaysdailybattle.com; style-src 'self' 'unsafe-inline' 'nonce-tdb2025' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; worker-src 'self' blob:; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; upgrade-insecure-requests
```

- **Condition:** All incoming requests, or **Hostname** equals `todaysdailybattle.com`.
- **Action:** Set header **Content-Security-Policy** to the string above (one line, no line breaks).
- If you already have a working CSP from **CLOUDFLARE-CSP-FIX.md**, ensure `frame-src` includes `https://challenges.cloudflare.com` for Turnstile, and keep `style-src`/`script-src` as needed.

---

## 2. X-Content-Type-Options

Prevents MIME sniffing (e.g. treating a text response as script).

- **Header name:** `X-Content-Type-Options`  
- **Value:** `nosniff`

---

## 3. X-Frame-Options

Reduces clickjacking risk. Use **DENY** unless you embed your site in an iframe on the same origin.

- **Header name:** `X-Frame-Options`  
- **Value:** `DENY`  
- (If you need to embed on the same site only, use `SAMEORIGIN`.)

---

## 4. Referrer-Policy

Controls how much URL is sent in the `Referer` header on links/navigation.

- **Header name:** `Referrer-Policy`  
- **Value:** `strict-origin-when-cross-origin`

---

## 5. Permissions-Policy (optional)

Restricts browser features (camera, mic, etc.). Safe default:

- **Header name:** `Permissions-Policy`  
- **Value:** `camera=(), microphone=(), geolocation=()`

---

## One rule to set all of them

If your plan allows multiple headers in one rule:

1. **Rules** → **Transform Rules** → **Modify Response Header** → **Create rule**.
2. **Name:** e.g. `Security headers - fortress`.
3. **When:** All incoming requests (or Hostname equals `todaysdailybattle.com`).
4. **Then:** Add each header:

   | Set header        | To value |
   |-------------------|----------|
   | Content-Security-Policy | (the long CSP string above) |
   | X-Content-Type-Options  | nosniff |
   | X-Frame-Options        | DENY |
   | Referrer-Policy        | strict-origin-when-cross-origin |
   | Permissions-Policy     | camera=(), microphone=(), geolocation=() |

5. **Deploy** / Save.

If you must use **one header per rule**, create five separate rules with the same condition and one header each.

---

## After changing

1. **Caching** → **Configuration** → **Purge Everything**.
2. Test in an incognito window: homepage, Quick Pray, pricing, one search.
3. Open DevTools → **Network** → select the document request → **Response Headers** and confirm the new headers are present.

If anything breaks (e.g. script or style blocked), adjust CSP in that rule (often `script-src` or `style-src`). See **CLOUDFLARE-CSP-FIX.md** for troubleshooting.
