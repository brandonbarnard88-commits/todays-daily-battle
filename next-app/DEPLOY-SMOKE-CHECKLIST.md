# Next app — deploy notes, Cloudflare, and gentle preview checks

Run **`npm run check`** in `next-app/` (same as **`npm run lint && npm run build`**) before any deploy.

---

## Cloudflare: Pages vs Workers Static Assets (2026 context)

**Cloudflare Pages** remains an excellent fit for this pilot: static export to `out/`, clean URLs via `public/_redirects`, no server. **Workers Static Assets** is another path (often cited for new static-heavy projects with tighter Workers integration). **No migration required** unless you later want unified Workers + KV/R2/D1 next to the same deploy. Staying on Pages is simpler and matches our calm, static-first setup.

---

## Cloudflare Pages — project settings (second pilot project)

| Field | Value |
|-------|--------|
| **Project name** | e.g. `todaysdailybattle-next` or `tdb-next-pilot` |
| **Production branch** | `cursor/verse-breakdowns-verse-room` (pilot) or `main` after merge |
| **Root directory** | **`next-app`** (recommended) |
| **Build command** | `npm ci && npm run build` |
| **Build output directory** | **`out`** |
| **Node version** | Set **`NODE_VERSION`** = `20` or `22` (Production + Preview) to match local |

If the Pages project uses **repo root** instead of `next-app`:

- **Build command:** `cd next-app && npm ci && npm run build`
- **Output directory:** `next-app/out`

Optional env: **`NEXT_PUBLIC_MAIN_SITE_ORIGIN`** = `https://todaysdailybattle.com` (classic site / deep links from `getMainSiteOrigin()`).

---

## Cloudflare Pages — build caching (recommended)

In the Pages project: **Settings → Builds → Build caching** (wording may vary slightly). **Enable** dependency/build caching so Cloudflare reuses `node_modules` and related layers between deploys. Typical win: shorter builds on repeat pushes (helpful with large static assets such as `kjv-full.json`).

---

## Cloudflare — Cache Rules (optional CDN polish, no app code)

These are **dashboard** rules; tune if your plan supports them. They complement the service worker (edge vs device cache).

**Intent**

1. **Long TTL for hashed build assets** — filenames under `/_next/static/` include content hashes; safe to cache aggressively at the edge.
2. **Moderate TTL for the KJV JSON** — large file; refresh on a sane cadence while still benefiting from CDN.

**Example pattern** (adjust names to match your zone UI):

| Rule | When / URI | Behavior |
|------|-------------|----------|
| **A** | Path starts with `/_next/static/` | Edge cache TTL: **1 year** (or “respect origin” if you set long cache headers) |
| **B** | Path equals `/kjv-full.json` | Edge cache TTL: **30 days** (stale-while-revalidate style behavior at the edge, if available in your rule builder) |

**Note:** Exact clicks vary by Cloudflare dashboard version. If a rule targets “all HTML,” avoid a blanket **1 year** on `/` — keep long TTLs for **hashed assets** and the **JSON** file specifically.

---

## Service worker (summary)

`public/sw.js` (registered from `RegisterServiceWorker` in the root layout):

- **Precache:** `offline.html`, `manifest.webmanifest`, `favicon.ico` (best-effort).
- **Stale-while-revalidate:** `GET /kjv-full.json` — respond from cache immediately when present; refresh in the background when online.
- **Cache-first + background refresh:** `/_next/static/*`, manifest, favicon, offline page.
- **Navigation:** network-first; cache successful HTML for repeat offline visits; if offline and no cached page, serve **`/offline.html`** (calm, humble copy).

Legacy caches (`tdb-kjv-v1`, etc.) are cleared on activate.

---

## Local smoke (after `npm run build`, e.g. `npx serve out`)

1. **Peace on load** — `/`, `/verse`, `/reader?book=Isaiah&chapter=54`. Calm typography, no layout jump, no console errors.
2. **Mobile thumb reach** — 375px width: nav tappable; reader controls reachable.
3. **Print from `/reader`** — Print preview: banner + KJV + breakdowns where catalog matches; chrome hidden.
4. **Offline / KJV** — Load `/reader` once online (so `kjv-full.json` caches). DevTools → **Offline** → reload: chapter text from cache **or** calm offline messaging in the reader shell.
5. **Offline / navigation** — With **no** prior visit to a page, go offline and open a **new** URL: expect **`/offline.html`** (gentle copy). After visiting pages online, those HTML documents may open from cache offline.
6. **My Study** — Save a verse; `/mystudy`; filter; **Export JSON**; **Import backup** (duplicates skipped).
7. **Add to Home** — Dismiss “Not now”; reload; prompt stays dismissed (`localStorage`).
8. **Clean URLs** — `/verse`, `/reader`, `/plans/fear` (not only `.html` paths).

---

## Gentle 10-minute side-by-side heart check

*(Phone first, then desktop. Compare pilot preview URL vs `https://todaysdailybattle.com` — same calm posture, no pressure.)*

1. **Peace on load** — Open the homepage on both. Does the pilot still give you that immediate “I’m home” warmth, or does anything feel louder, busier, or less gentle than the live site?
2. **Mobile breathing room** — Same pages on narrow width. Are nav, reader controls, and verse cards easy to reach with one thumb? Does it still feel calm and spacious?
3. **Verse companionship** — Open any verse path (home, `/verse`, `/calm`, `/family`). Expand the breakdowns. Does the real-talk, kid realTalk, and quiet prayer nudge feel like a gentle friend sitting with you — or is anything too much?
4. **Print takeaway** — From `/reader`, open a chapter and print preview. Does the banner + KJV + breakdowns look like something you’d quietly keep in a Bible or on the fridge?
5. **Offline steadiness** — Load `/reader` once online; then go offline (DevTools or airplane mode) and reload. Does it still feel like a safe quiet place (cached chapter or calm fallback)?
6. **Daily anchor flow** — `/calm`, `/plans`, `/family`. Does today’s anchor surface naturally and feel like the same gentle rhythm as the home verse?
7. **PWA comfort** — Manifest (`/manifest.webmanifest`) and service worker. Does “Add to Home” still feel optional and non-pushy?
8. **Overall humility** — Spend 60 quiet seconds on the homepage with no task. Does it still feel like the same humble, sacred space — or note one small thing that feels different?
9. **Classic links** — If you set `NEXT_PUBLIC_MAIN_SITE_ORIGIN`, tap any link that should hit the classic site. Does it land on `https://todaysdailybattle.com`?
10. **Gut check** — After the above, does the pilot feel like a deeper, gentler version of your quiet place — or is there one thing to soften before merging?

---

## Quick regression (URLs)

- `/plans`, `/plans/fear`, `/calm`, `/family`, `/mystudy`, `/prayer-wall`, `/memorize` — each loads.
- Query params preserved: `/reader?book=Psalm&chapter=23`.
- HTTPS: lock icon; no mixed-content warnings in the console.
