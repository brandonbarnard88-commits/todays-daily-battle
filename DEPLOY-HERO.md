# Get the hero + quick-search buttons on live

The **repo** already has the right homepage:

1. **Search hero** — Big centered input ("Search by emotion or verse", placeholder "Hope, fear, John 3:16…") + Search button at the top.
2. **Quick-search row** — "Try a topic — tap any button to load verses" + tappable buttons: FREE WILL, Hope, Fear, Peace, Gratitude, Loneliness, Guilt, Strength, then Heartache, Grief, Anxiety, Forgiveness, Patience, Anger, Joy, Addiction, Trauma, Relationships, Jesus Said, Parenting, Finances, Spiritual Warfare, Sleep & Rest, Marriage.
3. **Verse card** — Right below: daily verse, "Let's Make America God's Again" inside the card, tap for meaning, Pray, "Built while sick…" byline.
4. **Tagline** — "Less scroll, more soul."
5. **Accordions** — "More search options & topics" and "Today's tools" (collapsed by default).

If **todaysdailybattle.com** doesn’t show that, the site is not serving this `index.html`. Use this checklist.

---

## 1. Confirm the source file

In the repo, open **index.html** and search for:

- `QUICK-SEARCH-HERO-V2`

You should see a comment and the search-hero block near the top of `<main>`. If that’s there, the source is correct.

---

## 2. Commit and push

```bash
git add index.html styles.css script.js build-copy-static.js
git status
git commit -m "Hero + quick-search row; deploy verification"
git push
```

Use the branch Cloudflare builds from (usually `main`).

---

## 3. Cloudflare Pages settings

In **Cloudflare Dashboard → Workers & Pages → your project → Settings → Builds & deployments**:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

If "Build output directory" is empty or not `dist`, the live site will not use the built files. Set it to **dist** and save.

---

## 4. Trigger a clean build

- **Deployments** tab → open the latest deployment → **Retry deployment**.
- Enable **Clear build cache** so the new build uses the latest repo.

Wait for the build to finish. In the **Build log**, search for:

- `Copied index.html (hero + quick-search row) to dist/`

If you see that, the build copied the correct `index.html` into `dist/`.

---

## 5. Verify on the live site

Open **https://todaysdailybattle.com/** and:

1. **View Page Source** (e.g. right‑click → View Page Source, or Ctrl+U / Cmd+U).
2. In the source, search for: **QUICK-SEARCH-HERO-V2**

- **If you find it** — The correct `index.html` is live. Do a hard refresh (Cmd+Shift+R or Ctrl+Shift+R). You should see the search hero and quick-search buttons at the top.
- **If you don’t find it** — The live site is still serving an old or wrong file. Then:
  - Confirm the branch and repo connected to Cloudflare are the ones you pushed to.
  - Confirm Build output directory is **dist** (step 3).
  - Check the build log for errors and for the "Copied index.html" line (step 4).

---

## 6. If it still doesn’t show

- **Different repo or branch:** In Cloudflare, check which repo and branch the project uses. Push to that branch.
- **Build not run:** If "Build command" is empty, Cloudflare may serve files without building. Set Build command to `npm run build` and Build output directory to `dist`.
- **Caching:** After a good deploy, try a hard refresh or an incognito window.

Once View Source on the live URL contains **QUICK-SEARCH-HERO-V2**, the hero and quick-search row are the ones from this repo.
