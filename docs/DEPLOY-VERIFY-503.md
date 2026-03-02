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

## 5. If still 503

- **Build logs**: Check for errors (e.g. "Failed to copy", missing files)
- **Cloudflare WAF / Rules**: Any rule blocking `.html` or `/topic-*` paths?
- **Direct file**: Try `https://your-project.pages.dev/topic-anxiety.html` (Pages preview URL) — if that works, the issue may be custom domain or cache

## 6. _redirects (optional)

The `_redirects` file rewrites `/topic-anxiety` → `/topic-anxiety.html` (200). If `/topic-anxiety.html` works but `/topic-anxiety` 503s, the redirect may be misconfigured. Cloudflare Pages supports Netlify-style `_redirects` in the build output root.
