# Live site not showing hero / quick-search buttons — fix in 5 steps

Your **repo** already has the correct homepage: search hero, full quick-topic row (Hope, Fear, Peace, Gratitude, Loneliness, Guilt, Strength + all others), verse card with America + byline, then accordions. The live site is serving an **old or different** `index.html`.

Do these steps in order.

---

## Step 1: Confirm the source has the hero

In your repo, open **index.html** and search for: **id="query"** or **QUICK-SEARCH-HERO**

You should see the search input and the search-hero block near the top of `<main>`. If you see it, the source is correct. The problem is deploy or cache, not code.

---

## Step 2: Commit and push everything

```bash
cd /path/to/todaysdailybattle-site
git status
git add index.html styles.css script.js build-copy-static.js
git commit -m "Hero + quick-search row + accordions (ensure deploy uses this)"
git push origin main
```

Use the **exact branch** Cloudflare builds from (usually `main`). After pushing, wait for Cloudflare to finish the new build.

---

## Step 3: Cloudflare Pages — build settings

**Cloudflare Dashboard → Workers & Pages → your project → Settings → Builds & deployments**

- **Build command:** must be `npm run build`
- **Build output directory:** must be `dist`

If "Build output directory" is empty or not `dist`, the live site will **not** use the built files. Set it to **dist**, save, then go to Step 4.

---

## Step 4: Force a clean build

- **Deployments** tab → open the **latest** deployment
- Click **Retry deployment**
- Turn **ON** "Clear build cache"
- Run the retry

When the build finishes, open the **Build log** and search for: **Copied index.html**

You should see: `Copied index.html (hero + quick-search row) to dist/`. If you see that, the correct file was copied into `dist/`.

---

## Step 5: Verify on the live site

Open **https://todaysdailybattle.com/** in your browser.

1. **View Page Source** (right-click → View Page Source, or Ctrl+U / Cmd+U).
2. In the source, search for: **id="query"** or **id="quick-actions-hero"**

- **If you FIND it** → The right `index.html` is live. Do a **hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows). You should then see the search hero and quick-search buttons at the top.
- **If you DO NOT find it** → The live site is still serving the wrong file (or CDN cache). Then:
  - Confirm the **branch** connected in Cloudflare is the one you pushed to (Step 2).
  - Confirm again that **Build output directory** is `dist` (Step 3).
  - Check the build log for **errors** and for the "Copied index.html" line (Step 4).

---

## Optional: Build locally to confirm

On your machine:

```bash
npm run build
```

Then open **dist/index.html** in a text editor and search for **id="query"** or **id="quick-actions-hero"**. If it’s there, the build is correct and the only issue is getting Cloudflare to use this build (Steps 3–4).

---

## Cache busting (if hero still missing after deploy)

GitHub Pages and Cloudflare cache aggressively. If View Source shows the hero but the page looks broken:

1. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **DevTools:** Application → Storage → "Empty cache and hard reload"
3. **Incognito/private window:** Tests without cache
4. **Bump service worker:** In `service-worker.js`, change `CACHE_NAME` (e.g. `tdb-static-20260301`) and redeploy so returning visitors get fresh assets

---

**Summary:** The quick-search row and hero are already in the repo and in the build output when the build runs. Getting them on live is about making sure the latest code is pushed, the build runs, and Cloudflare serves the **dist** folder. The View Source check tells you immediately if the right file is live.
