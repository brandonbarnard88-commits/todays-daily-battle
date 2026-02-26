# Security: Fortress mode

Checklist to harden todaysdailybattle.com to a high standard — no political reference intended; treat this as “lock it down” for a production devotional site taking payments and user data.

---

## 1. Cloudflare (first line of defense)

| Item | Where | Action |
|------|--------|--------|
| **WAF** | Security → WAF | Enable **Security Level** at least “Medium”; consider “High” if you see abuse. |
| **Bot Fight Mode** | Security → Bots | Turn on **Bot Fight Mode** (free) to challenge likely bots. |
| **Rate limiting** | Security → WAF → Rate limiting rules | Add a rule: e.g. “Quick Pray / submit” path (if you expose a path) or by URI path for `/functions/v1/submit-prayer` at Cloudflare (if proxied). Alternatively rate limit at Supabase Edge Function. |
| **DDoS** | Already on by default | Keep **Under Attack** mode available; enable only if you’re under attack. |
| **CSP / headers** | Rules → Transform Rules | Use a strict **Content-Security-Policy**; allow only what you need. See **CLOUDFLARE-CSP-FIX.md**. Add **X-Content-Type-Options: nosniff**, **X-Frame-Options: DENY** (or SAMEORIGIN if you need iframes), **Referrer-Policy: strict-origin-when-cross-origin**. |
| **Stripe webhook** | Optional | If your Stripe webhook is public (Supabase URL), you can’t easily IP-allowlist at Cloudflare without a Worker. Rely on **signature verification** (you already do) and keep **STRIPE_WEBHOOK_SECRET** secret. |

---

## 2. Abuse protection (prayer / forms)

| Item | Status | Action |
|------|--------|--------|
| **Quick Pray** | Turnstile + submit-prayer | Ensure **TURNSTILE_SITE_KEY** and **TURNSTILE_SECRET_KEY** are set; deploy **submit-prayer**. See **ABUSE-PROTECTION.md**. |
| **Silent offering / offline queue** | Direct insert | Optional: add Turnstile or rate limit later if those become spam targets. |
| **Other forms** | — | Add Turnstile (or rate limit) to any other public submit (newsletter, contact, etc.). |

---

## 3. Supabase

| Item | Action |
|------|--------|
| **RLS** | Confirm **prayers**: anon = SELECT + INSERT only (or INSERT only via submit-prayer and remove anon INSERT). No anon UPDATE/DELETE. **profiles**: only service_role (and your backend) can update `tier`. |
| **Secrets** | Never put **service_role** in client code. Rotate **SUPABASE_SERVICE_ROLE_KEY** if ever exposed. |
| **Edge Functions** | submit-prayer, stripe-webhook, create-checkout-session: only required secrets; no logging of tokens or keys. |
| **Database** | Restrict DB access to Supabase dashboard + local CLI; use strong password and 2FA on Supabase account. |

---

## 4. Stripe

| Item | Action |
|------|--------|
| **Webhook** | Signature verification with **STRIPE_WEBHOOK_SECRET** (you have this). Never skip verification. |
| **Live mode** | Use **live** keys only in production; keep test keys for staging. |
| **Keys** | **STRIPE_SECRET_KEY** and **STRIPE_WEBHOOK_SECRET** only in Supabase secrets (and Stripe Dashboard). Rotate if compromised. |
| **Dashboard** | Enable 2FA; restrict team access; enable fraud and radar tools when live. |

---

## 5. Application

| Item | Action |
|------|--------|
| **Config** | No **service_role**, Stripe secret, or Turnstile **secret** in **config.js** or HTML. Only public keys (anon, Turnstile site key, Stripe publishable if used). |
| **Escaping** | Any user-generated content (prayer intent, names) rendered in HTML must be escaped to prevent XSS. |
| **HTTPS** | Enforce HTTPS (Cloudflare SSL/TLS: Full or Full Strict). |

---

## 6. Monitoring and response

| Item | Action |
|------|--------|
| **Uptime** | Use UptimeRobot or similar to ping the site and Stripe webhook URL; alert on down. |
| **Supabase** | Set usage alerts (MAU, egress) so you notice spikes or abuse. |
| **Stripe** | Monitor failed payments and webhook failures in Dashboard. |
| **Logs** | Periodically check Supabase Edge Function logs (submit-prayer, stripe-webhook) for errors or odd traffic. |

---

## Quick “fortress” order

1. **Cloudflare:** WAF Medium+, Bot Fight Mode, security headers (CSP + X-Content-Type-Options, etc.).  
2. **Turnstile:** Finish **ABUSE-PROTECTION.md** setup so Quick Pray is protected.  
3. **Supabase:** Audit RLS (prayers + profiles); confirm no anon UPDATE/DELETE where it shouldn’t be.  
4. **Stripe:** Confirm webhook verification and live/test key separation.  
5. **Monitoring:** Add one uptime check and one Supabase usage alert.

After that you’re in strong shape for an indie devotional site with payments and user data.
