# Cloudflare Reliability Bypass (Required for External Audits)

Use this when external scanners/reporting tools show:

- `Reliability score: 0`
- `Success rate: 0%`
- `p95 response time: 20s`
- `sitemap.xml` returning a Cloudflare challenge page instead of XML

This is usually caused by WAF/Bot challenge behavior on machine-readable public files.

---

## Goal

Never challenge or block these public files:

- `/robots.txt`
- `/sitemap.xml`
- `/sitemap-*.xml`
- `/manifest.json`
- `/build-date.txt`

These endpoints must return immediately for scanners, crawlers, and uptime probes.

---

## Cloudflare Dashboard Steps

1. Open **Cloudflare Dashboard** for `todaysdailybattle.com`.
2. Go to **Security** -> **WAF** -> **Custom rules**.
3. Click **Create rule**.
4. Name: `Reliability - skip challenge public files`
5. Expression (copy/paste exactly):

```txt
(http.request.uri.path eq "/robots.txt")
or (http.request.uri.path eq "/sitemap.xml")
or starts_with(http.request.uri.path, "/sitemap-")
or (http.request.uri.path eq "/manifest.json")
or (http.request.uri.path eq "/build-date.txt")
```

6. Action: **Skip**
7. In "Skip options", skip all challenge/bot layers available in your plan:
   - Managed Challenge / JS Challenge
   - Bot Fight / Super Bot Fight
   - Browser Integrity Check
   - Any custom WAF rules that can challenge these paths
8. Save and deploy.

If your dashboard supports host filtering, include both hosts:

- `todaysdailybattle.com`
- `www.todaysdailybattle.com`

---

## Optional Hardening (Recommended)

Add a second custom rule for uptime monitors to prevent false negatives:

- Match a trusted user-agent list (your monitor providers)
- Scope only to `/`, `/robots.txt`, `/sitemap.xml`, `/manifest.json`
- Action: **Skip challenge** (not full allow for all traffic)

---

## Verification (must pass)

From two networks (home + mobile hotspot), run:

```bash
curl -I https://todaysdailybattle.com/robots.txt
curl -I https://todaysdailybattle.com/sitemap.xml
curl -I https://www.todaysdailybattle.com/sitemap.xml
curl -I https://todaysdailybattle.com/manifest.json
curl -I https://todaysdailybattle.com/build-date.txt
```

Expected:

- HTTP 200
- `content-type: text/plain` for `robots.txt`
- `content-type: application/xml` (or `text/xml`) for sitemap
- no Cloudflare challenge HTML body
- response times well below multi-second challenge delays

---

## Why This Fix Matters

External black-box tools do not reliably complete browser challenge flows. If challenge pages are returned for core crawl files, reliability scoring collapses even while the site appears "fine" in a normal browser.

