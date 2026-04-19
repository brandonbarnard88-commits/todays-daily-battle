# Next app — smoke checklist (local + Cloudflare preview)

Run **`npm run build && npm run lint`** in `next-app/` before any deploy.

## Local (`npm run dev` or `npx serve out` after build)

1. **Peace on load** — Open `/`, `/verse`, `/reader?book=Isaiah&chapter=54`. Calm typography, no layout jump, no console errors.
2. **Mobile thumb reach** — 375px width: nav links tappable; reader book/chapter selects and prev/next reachable without awkward stretch.
3. **Print from `/reader`** — Print preview: banner line “Today’s Daily Battle — … — KJV”, verse text + dt/dd breakdowns where catalog matches; nav/buttons hidden.
4. **Offline verse loading** — Load `/reader` once online; DevTools → Offline; reload same chapter: KJV text from cache or calm offline message; `sw.js` caches `/kjv-full.json` after first fetch.
5. **My Study** — Save a verse from home; open `/mystudy`; filter; **Export JSON**; **Import backup** same file (duplicates skipped).
6. **Add to Home** — Dismiss “Not now”; reload; prompt stays dismissed (localStorage). (Full install flow optional.)
7. **Legacy `.html` parity** — On **preview host**, open one old static path you still serve (e.g. `/verse.html` or `/reader.html` from the main site) and confirm it still resolves if your Pages project mirrors those files; for **Next-only preview**, at least confirm `/verse` and `/reader` clean URLs load.

## Cloudflare Pages preview URL

Repeat 1–6 on the **preview** domain. Spot-check **HTTPS**, **manifest** (`/manifest.webmanifest` loads), and **service worker** registration in Application tab.

## Quick regression

- `/plans`, `/plans/fear`, `/calm`, `/family`, `/mystudy`, `/prayer-wall`, `/memorize` — each loads.
- Query params preserved: `/reader?book=Psalm&chapter=23`.
