# Cloudflare Redirect Rules Fallback (Prayer Wall + Clean URLs)

If `_redirects` rules (even with `200!`) are overridden by Cloudflare Pages' automatic clean-URL 308 redirects, use **Redirect Rules** or **Transform Rules** in the Cloudflare dashboard. These run at the edge and take precedence.

## Recommended: Transform Rule (URL Rewrite) - Preferred for 2026

1. Cloudflare Dashboard → **Rules** → **Transform Rules** → **Create rule**
2. **Rule name**: `Prayer Wall clean URL rewrite (200)`
3. **When incoming requests match**:
   - Custom filter expression:
     ```
     (http.request.uri.path eq "/prayer-wall" or http.request.uri.path eq "/prayer-wall/" or http.request.uri.path eq "/prayer-wall.html")
     ```
4. **Then**:
   - **Action**: Rewrite to static path
   - **Path**: `/prayer-wall.html`
   - Preserve query string: **On** (critical for `?tab=with-others`)
   - Status code: Serve as **200 OK** (no redirect)

Place this rule high in the list (before any catch-all or 404 rules).

## Alternative: Legacy Page Rule (if Transform not available)

1. **Rules** → **Page Rules** → **Create Page Rule**
2. URL pattern: `todaysdailybattle.com/prayer-wall*`
3. Settings:
   - **URL Forwarding** → Forwarding URL (301 or 200 if available)
   - Or use "Static" / rewrite behavior to `/prayer-wall.html` with 200 status.

## Quick _redirects fallback (highest priority, add at very top of file)

```
/prayer-wall.html /prayer-wall.html 200!
/prayer-wall /prayer-wall.html 200!
/prayer-wall/ /prayer-wall.html 200!
```

Then:
- `npm run build`
- Deploy
- Purge cache for `/prayer-wall*` in Cloudflare

## Verification commands

```bash
curl -I https://todaysdailybattle.com/prayer-wall
curl -I -A "Googlebot" https://todaysdailybattle.com/prayer-wall
curl -I https://todaysdailybattle.com/prayer-wall.html
```

Look for **HTTP/2 200** (not 301/308/503). The response should contain the full prayer wall HTML with the noscript block visible in source.

After the rule is active, re-test the tabbed UI, seed prayers, offline strip, and privacy inspector. The site can then be marked "complete and clean."

Updated: April 12, 2026 (post-CSP + noscript pass)
