# Topic Pages 503 — Deploy Verification

If `/topic-anxiety.html`, `/topic-parenting.html`, or other topic pages return **503 Service Unavailable**:

## 1. Verify build output

**Cloudflare Dashboard** → **Workers & Pages** → your project → **Deployments** → latest deploy:

- Click **View build** or **Build output**
- Confirm these files exist in the output:
  - `topic-anxiety.html`
  - `topic-fear.html`
  - `topic-forgiveness.html`
  - `topic-grief.html`
  - `topic-hope.html`
  - `topic-parenting.html`
  - `topic-strength.html`
  - `index.html`
  - `script.js`
  - `service-worker.js`
  - `_redirects`
  - `_headers`

## 2. Build output directory

**Settings** → **Builds & deployments**:

| Setting | Must be |
|---------|---------|
| Build command | `npm run build` |
| Build output directory | `dist` |

If output dir is `.` or blank, Cloudflare may serve the wrong files. Change to `dist`.

## 3. Redeploy

- **Deployments** → **Trigger deploy** → **Clear cache and deploy** (if available)
- Or: push a small commit to trigger a new build
- Wait 1–2 minutes

**If placeholders still show old values (…, —) after deploy:**

- **Cloudflare Dashboard** → **Caching** → **Configuration** → **Purge Everything**
- Then trigger another deploy (or wait 1–2 min for purge to propagate)
- Users: DevTools → Application → Service Workers → Unregister all → Hard refresh (Ctrl+Shift+R)

## 4. Test URLs

Try both with and without `.html` (some hosts serve extensionless):

- https://todaysdailybattle.com/topic-anxiety.html
- https://todaysdailybattle.com/topic-anxiety (no .html — _redirects rewrites to .html)
- https://todaysdailybattle.com/topic-parenting.html
- https://todaysdailybattle.com/topic-hope.html

Should return **200** with HTML content.

**Smoke test after deploy:**
```bash
curl -I https://todaysdailybattle.com/topic-anxiety
```
Should return `HTTP/2 200` (or `HTTP/1.1 200`).

## 5. If still 503

- **Build logs**: Check for errors (e.g. "Failed to copy", missing files)
- **Cloudflare WAF / Rules**: Any rule blocking `.html` or `/topic-*` paths?
- **Direct file**: Try `https://your-project.pages.dev/topic-anxiety.html` (Pages preview URL) — if that works, the issue may be custom domain or cache

## 6. Confirm _redirects is applied

**Cloudflare Pages** → **Deployments** → **Latest deploy** → **Build logs**:

- Search for `_redirects`, `redirects file`, or `Applied redirects` — should mention finding/processing it and how many rules
- If no mention → file placement issue: must be at repo root as `_redirects` (no folder, no extension), and `build-copy-static.js` copies it to `dist/` root

## 7. Force clean redeploy + purge

1. Make a tiny dummy change (e.g. add a space/comment in `_redirects` or `index.html`) → commit/push to trigger fresh build
2. After deploy finishes: **Purge Everything** again
3. Wait 1–2 min (Cloudflare edge propagation)
4. Test: `curl -I https://todaysdailybattle.com/topic-anxiety` (look for `HTTP/1.1 200 OK`; if 503, logs will tell why)

## 8. Cloudflare-specific tweaks

- **Settings** → **Build & deployments** → **Single-page application** toggle: Turn **ON** if off (can improve rewrite handling)
- **Custom domain**: Ensure no conflicting Page Rules (Caching → Configuration or Rules → Page Rules) override `/topic-*` paths
- **Cache level**: Set to **Bypass** temporarily for `/topic-*` via Page Rule if needed, then revert after test

## 9. Fallback workaround if stuck

Rename files: e.g. `topic-anxiety.html` → `anxiety/index.html` (create `/anxiety/` folder in `dist/`). Update links in `index.html` to `/anxiety/`. Serves naturally at `/anxiety` without redirects. Push/redeploy/purge → test `/anxiety`.
