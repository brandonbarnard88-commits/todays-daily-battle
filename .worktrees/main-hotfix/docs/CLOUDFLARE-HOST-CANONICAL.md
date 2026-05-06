# Canonical host: www ↔ apex (Cloudflare)

The site’s HTML canonical URLs use **`https://todaysdailybattle.com`** (apex). For SEO and consistent analytics, **only one hostname** should return `200` for public pages; the other should **301 or 308** to the canonical host.

Static `_redirects` on Cloudflare Pages applies to **paths on the same hostname**; **cross-hostname** redirects are configured in **Cloudflare** for the zone.

## Recommended: Redirect Rules (Dashboard)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → select **todaysdailybattle.com**.
2. **Rules** → **Redirect Rules** → **Create rule**.
3. **Rule name:** e.g. `Canonical apex (SEO)`.
4. **When incoming requests match:** Custom filter expression:
   - Field: **Hostname**
   - Operator: **equals**
   - Value: `www.todaysdailybattle.com`
5. **Then:** **URL redirect** — **Dynamic** — Expression:
   - `concat("https://todaysdailybattle.com", http.request.uri.path)`
   - Status code: **301** (or **308** if you prefer preserving method strictly).
6. **Deploy** and verify:
   - `curl -sI https://www.todaysdailybattle.com/` → `Location: https://todaysdailybattle.com/`
   - `curl -sI https://todaysdailybattle.com/` → `200` on apex.

If you prefer **www** as canonical instead, invert the rule (redirect apex → www) and update `canonical` links + `Sitemap:` in `robots.txt` to match.

## Alternative: Bulk Redirects

**Bulk Redirects** (account-level list) can map `https://www.todaysdailybattle.com/*` → `https://todaysdailybattle.com/$1` with 301. Useful if you manage many zones the same way.

## Verify after deploy

- [ ] Both hosts serve over HTTPS without certificate errors.
- [ ] Chosen canonical host returns 200 for `/` and a sample deep link.
- [ ] Non-canonical host returns 301/308 with correct `Location` header.
- [ ] `sitemap.xml` and `robots.txt` `Sitemap:` URL use the canonical host.
