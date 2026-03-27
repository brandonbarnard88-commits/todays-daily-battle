# “Complete” standard for one language (Today’s Daily Battle)

Use this as the **release gate** before calling a locale “shipped.” Pilots may exist below this bar; label them honestly in copy and navigation.

## One-page checklist (ship gate)

| # | Area | Pass when |
|---|------|-----------|
| 1 | **Hub** | `/xx/` + `index.html`, `_redirects` `200!`, hero states what is in-language vs EN/KJV tools |
| 2 | **Discovery** | Card grid (or equivalent) to every in-language mood page you claim |
| 3 | **Depth** | Mood pages or explicit “not yet” / EN link — no silent 404 |
| 4 | **Tools** | Shells or full UI; KJV disclaimer wherever English Bible shows |
| 5 | **Legal** | Link to `privacy.html` / `terms.html` + short in-language note |
| 6 | **SEO / edge** | `hreflang` reciprocal, `sitemap.xml`, `_headers` no-cache, purge paths |
| 7 | **Switcher** | `language-switcher.js`: hubs get `aria-current`; default **Español** → `/es/`, **Français** → `/fr/`, **Português** → `/pt/` |
| 8 | **Tests** | `npm run build`, `npm run test:site -- --offline`, `npm test`, `npm run test:security` |

## 1. Hub

- **URL:** e.g. `/es/`, `/fr/`, `/pt/` — folder + `index.html`, `_redirects` clean paths.
- **Above the fold:** Clear promise: what is in-language, what opens in **English** with **KJV** in Bible tools.
- **Daily verse:** Honest path to `verse.html` (EN/KJV) plus optional fixed anchor verse in that locale’s Scripture tradition.

## 2. Mood / topic depth

- For each **paired** English topic you want globally reachable: full in-language mood page (named tradition on-page), or explicit “not yet” / EN link — never a silent 404.
- **No fake localization:** If the UI is English, say so (shell pattern).

## 3. Tool reality

- **Shell pages** in language linking to real EN tools, or fully localized tools (rare).
- Same KJV disclaimer where tools show English Bible text.

## 4. Legal & trust

- At minimum: link to `privacy.html` / `terms.html` with a short in-language explanation.
- Prefer **summary + EN canonical** (`hreflang` + `x-default` on binding doc) until full translation is reviewed.

## 5. SEO & edge

- **hreflang:** Reciprocal links only between URLs that exist.
- **sitemap.xml:** Hub + every indexed locale page.
- **`_headers`:** `no-cache` for high-churn HTML (keep in sync with `test-security.js` `cacheHygienePaths`).
- **`_redirects`:** Clean URLs → `.html` where you use extensionless links.
- **Post-deploy:** `npm run purge:cloudflare:social` (paths in `scripts/cloudflare-purge.mjs`).

## 6. Language switcher

- **`language-switcher.js`:** `enHref` / sibling locales / `aria-current` on hubs (`isSpanishHub`, `isFrenchHub`, `isPortugueseHub`, `isLocaleHubCluster` for anxiety defaults).

## 7. Tests

- **`test-site.js` / `test-site.py`:** Hub + sample mood pages.

## 8. Voice & Scripture

- Pastoral, natural, non-hype; **KJV** only where the product is English KJV surfaces.
- On-page Scripture: label tradition (Almeida, Louis Segond, Reina-Valera, etc.).

## Reference implementations

- **Portuguese (deepest):** `pt/index.html`, `scripts/write-pt-locale-pages.mjs` (generator for mood + shells + legal summaries). Imports `scripts/lib/lang-switcher-inner.mjs` for switcher rows.
- **Spanish hub:** `es/index.html` — links to root mood pages: `ansiedad`, `miedo`, `fuerza`, `paz`, `soledad`, `culpa`, `agobio` (Reina-Valera 1960 on-page); same honest EN tool pattern as FR/PT.
- **French hub:** `fr/index.html` — links to `fr/*.html` mood pilots including `peur`, `force`, `paix` (Louis Segond on-page).

## Infrastructure (next smooth step)

- **Generators:** `npm run render:fr-es-moods` → `scripts/render-fr-es-mood-pages.mjs` (FR depth + ES root moods; edit data in that file, re-run). `write-pt-locale-pages.mjs` remains the PT-specific writer.
- **Switcher maps:** `language-switcher.js` — `PT_TO_FR`, `PT_TO_ES`, `PT_TO_ZH`, `FR_TO_EN`, `FR_TO_ES`, `FR_TO_PT`, `ES_TO_FR`, `ES_TO_PT` keep cross-links aligned when you add a paired page.
- **Next:** Extract shared hub partials (hero + grid + daily verse block) only if a fourth hub repeats the same markup without drift.

## After PT / FR / ES feel solid — next locale candidates

Pick one when depth and switcher tests are green. Existing **anxiety + hope** pilots already lower the cost for: **Bahasa Indonesia** (`id/`), **Tagalog** (`tl/`), **Arabic**, **Hindi**, **Russian**, **Swedish**, **Bengali**, **Swahili** (see `explore.html#languages`). For a **fresh hub** at scale, **Indonesian** or **Arabic** often reach the most people still missing a calm front door; match the checklist above before calling it “complete.”

When a new language matches the **checklist**, call it **complete** at the current architecture. Anything less is a **pilot** or **phase 1** — say so on the hub.
