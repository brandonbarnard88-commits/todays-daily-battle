# Cloudflare Pages: Cache Purge + Deploy (when site shows old version)

If git push succeeded but live site still shows old content (no gold search bar, no commentary modal):

## 0. Service worker (most common cause)

The PWA service worker **precaches HTML** (index.html, bible-tool.html, etc.). Returning users get old cached HTML even after Cloudflare purge.

**Fix:** Bump `CACHE_NAME` in `service-worker.js` (e.g. `tdb-static-20260301` → `tdb-static-20260302`), commit, and deploy. New SW installs and fetches fresh HTML. Do this whenever you deploy HTML/CSS changes that must show immediately.

## 1. Purge cache + redeploy

1. Log into **Cloudflare Dashboard** → **Workers & Pages**
2. Open your project (e.g. todays-daily-battle)
3. Go to **Deployments** tab
4. Click **Trigger deploy** (or **Redeploy**)
5. If available: choose **Clear cache and deploy site**
6. If not: go to **Caching** → **Configuration** → **Purge Everything** (nukes all cache)
7. Or: **Caching** → **Configuration** → turn on **Development Mode** (disables cache for 3 hours)

## 2. Verify build output directory

**Settings** → **Builds & deployments** (or **Build configuration**):

| Setting | Must be |
|---------|---------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

If output dir is `.` or blank, Cloudflare may serve the wrong files. Change to `dist`.

## 3. After deploy (1–2 min)

1. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
2. **F12** → **Console**: Look for `Search bar v2 loaded` — if yes, script is in
3. **F12** → **Network**: Filter by JS — `header-search-bar.js` and `commentary.json` should be **200 OK** (no 404)
4. Type "John" in search bar → dropdown + modal should appear

## 4. If still broken

- Check **Deployments** → latest deploy → **View build logs** for errors
- Ensure `scripts/header-search-bar.js`, `commentary.json`, `verse-search-dropdown.js` are in the repo and in `build-copy-static.js` rootFiles/scriptFiles
