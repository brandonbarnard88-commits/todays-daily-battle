# “Complete” standard for one language (Today’s Daily Battle)

Use this as the **release gate** before calling a locale “shipped.” Pilots may exist below this bar; they should be labeled honestly in copy and navigation.

## 1. Hub

- **URL:** e.g. `/pt/`, `/fr/` — folder + `index.html`, with `_redirects` clean paths if used elsewhere.
- **Above the fold:** Clear promise: what is in-language, what opens in **English** with **KJV** in Bible tools.
- **Discovery:** Obvious links to every in-language mood/tool page you claim for that locale (card grid + compact buttons is fine).
- **Daily verse:** Honest path to `verse.html` (EN/KJV) plus optional fixed anchor verse in the hub’s Scripture tradition.

## 2. Mood / topic depth

- For each **paired** English topic you want globally reachable, either:
  - A **full mood page** in that language (named public-domain or licensed tradition on-page), or
  - An explicit **“not yet”** or link to EN — never a silent 404.
- **No fake localization:** If the UI is English, say so on the landing line (shell pattern).

## 3. Tool reality (plans, wall, reader, kids, etc.)

- **Shell pages** in language that link to the real tool in EN, **or** fully localized tools (rare).
- Same KJV disclaimer where tools show English Bible text.

## 4. Legal & trust

- At minimum: link to `privacy.html` / `terms.html` with a short in-language explanation.
- Prefer **summary + EN canonical** (`hreflang` + `x-default` on binding doc) until full translation is reviewed.

## 5. SEO & edge

- **hreflang:** Reciprocal links only between URLs that exist.
- **sitemap.xml:** Hub + every indexed locale page.
- **`_headers`:** `no-cache` for high-churn HTML (match `test-security.js` list).
- **`_redirects`:** Clean URLs → `.html` where you use extensionless links.
- **Post-deploy:** Purge Cloudflare (`npm run purge:cloudflare:social`) for listed paths in `scripts/cloudflare-purge.mjs`.

## 6. Language switcher

- **`language-switcher.js`:** Correct `enHref` / sibling locales / `aria-current` on hub and pilots.
- **Français** default entry should prefer **`/fr/`** when a French hub exists (not only `/fr/anxiete.html`).

## 7. Tests

- **`test-site.js` / `test-site.py`:** Hub + sample mood pages.
- **`npm run build`**, **`npm run test:site`**, **`npm test`**, **`npm run test:security`** pass.

## 8. Voice & Scripture

- Pastoral, natural, non-hype; **KJV** only where the product is English KJV surfaces.
- On-page Scripture: label tradition (Almeida, Louis Segond, Reina-Valera, etc.).

## Reference implementation

- **Portuguese:** `pt/index.html`, `scripts/write-pt-locale-pages.mjs` (generator for mood + shells + legal summaries).
- **French hub:** `fr/index.html` (links to existing `fr/*.html` pilots; expand with generator or hand pages later).

When a new language matches **1–8**, call it **complete** at the current architecture. Anything less is a **pilot** or **phase 1** — say so on the hub.
