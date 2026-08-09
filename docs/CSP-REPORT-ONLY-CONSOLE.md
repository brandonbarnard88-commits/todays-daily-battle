# CSP `[Report Only]` console noise

## What you are seeing

Safari/Chrome log lines like:

```text
[Report Only] Refused to load https://todaysdailybattle.com/….js
  because it does not appear in the script-src directive…
```

**Report Only means the browser is not blocking the resource for real.**  
It is evaluating a **second** policy (`Content-Security-Policy-Report-Only`) that is often **stale** at Cloudflare, while the **enforced** `Content-Security-Policy` (from this repo’s `_headers`) already allows same-origin scripts via `'self'`.

## Quick check

```bash
curl -sI https://todaysdailybattle.com/kids/corner | grep -i content-security
```

You should see **`content-security-policy:`** with `script-src 'self' 'nonce-tdb2025s' …`.  
If you **do not** see `content-security-policy-report-only:` on the wire but still get `[Report Only]` in DevTools: try **incognito**, disable extensions, hard-refresh.

## Fix (Cloudflare dashboard)

1. **Rules → Transform Rules → Modify Response Header**  
   Find any rule that sets **`Content-Security-Policy-Report-Only`**.
2. **Preferred:** **Delete** that rule (one enforced CSP only).  
   **Or:** set Report-Only to the **exact same string** as  
   `CLOUDFLARE-CSP-COPY-PASTE.txt` / `_headers` `Content-Security-Policy`.
3. **Caching → Configuration → Purge Everything** (or purge HTML).
4. Re-open the site and confirm console noise is gone.

Also check **Security** features that inject managed CSP/report-only policies.

## Repo policy

Authoritative CSP lives in **`_headers`** (Cloudflare Pages) and is mirrored in  
`functions/_middleware.js` and `vercel.json` (via sync).  
Do not leave a second, older Report-Only policy at the edge.

## If something is actually broken (red Network failures)

Then the **enforced** CSP is wrong. Compare failed URL host to `script-src` / `connect-src` / `worker-src` in `_headers` and add only the needed host, then redeploy.
