# Hero flow deploy check

The **source** `index.html` has the intended hero flow:

1. **Search hero** — large centered input ("Search by emotion or verse", placeholder "Hope, fear, John 3:16…"), Search button  
2. **Quick emotion row** — 7 tappable buttons: Hope, Fear, Peace, Gratitude, Loneliness, Guilt, Strength  
3. **Verse card** — daily verse, "Let's Make America God's Again", tap for meaning, Pray, "Built while sick…" byline  
4. **Tagline** — "Less scroll, more soul."  
5. **Accordions** — "More search options & topics", "Today's tools", etc. (default closed)

Build copies **root** → **dist** (`npm run build` = `build-config.js` + `build-copy-static.js`). So the same `index.html` and `styles.css` in the repo are what end up in `dist/` when Cloudflare runs the build.

## If the live site doesn’t show search hero + quick buttons

1. **Confirm source**  
   In the repo, open `index.html` and search for `search-hero` or `HERO-FLOW`. You should see the comment and the search-hero block near the top of `<main>`.

2. **Commit and push**  
   Ensure `index.html` and `styles.css` are committed and pushed to the branch Cloudflare builds from (usually `main`).

3. **Cloudflare Pages**  
   - **Build command:** `npm run build`  
   - **Build output directory:** `dist`  
   - **Retry deployment** (and optionally **Clear build cache**) so the latest commit is built.

4. **Verify deployed file**  
   On the live site: **View Page Source** (or open `https://todaysdailybattle.com/` and view source). Search for `HERO-FLOW` or `search-hero`. If you see the comment and the search-hero div, the correct `index.html` is deployed.

5. **Hard refresh**  
   Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) to avoid cached HTML/CSS.

If the source has the hero but the live site still doesn’t after a clean deploy, the build may be failing or the output directory may not be `dist`. Check the build logs in Cloudflare **Deployments** → latest → **Build log**.
