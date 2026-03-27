# Locale “complete” standard — Today’s Daily Battle

Use this as the **release gate** before calling a language **shipped** (not “pilot”). Anything below the bar must be labeled honestly on the hub.

---

## Tiers

| Tier | Meaning |
|------|--------|
| **Complete** | Meets every row in the ship gate for that locale. |
| **Pilot** | One or more mood/tool pages exist; hub or depth incomplete — say so in copy. |
| **Thin pilot** | Only anxiety/hope (or similar) entry points from Explore — no hub yet. |

---

## Ship gate (one page)

| # | Area | Pass when |
|---|------|-----------|
| 1 | **Hub** | `/xx/` + `index.html`, `_redirects` `200!`, hero states what is in-language vs EN/KJV tools |
| 2 | **Discovery** | Card grid (or equivalent) links to **every** in-language page you claim (moods + tool shells) |
| 3 | **Mood depth** | Core moods covered in local Scripture tradition, or explicit “not yet” + EN link — no silent 404 |
| 4 | **Tool shells** | Same honesty as PT: Portuguese uses `/pt/planos`, `/pt/mural`, etc.; French uses `/fr/plans`, `/fr/mural`, …; Spanish uses root `planes.html`, `muro.html`, … |
| 5 | **Legal** | Link to `privacy.html` / `terms.html` + short in-language note |
| 6 | **SEO / edge** | Reciprocal `hreflang` where paired, `sitemap.xml`, `_headers` no-cache, `_redirects` clean URLs + `?tdb_cb` for Spanish-style cache bust, `cloudflare-purge.mjs` |
| 7 | **Switcher** | `language-switcher.js`: hubs `aria-current`; **Español** → `/es/`, **Français** → `/fr/`, **Português** → `/pt/`; hope cluster → `/esperanza.html` (ES), not only Explore |
| 8 | **Tests** | `npm run build`, `npm run test:site -- --offline`, `npm test`, `npm run test:security` |

---

## Reference depth (Mar 2026) — PT / FR / ES

| Layer | Portuguese | French | Spanish |
|--------|------------|--------|---------|
| Hub | `/pt/` | `/fr/` | `/es/` |
| Moods (tradition on-page) | ansiedade, esperança, medo, força, paz, solidão, culpa, sobrecarga (Almeida) | anxiété, espoir, peur, force, paix, solitude, culpabilité, débordé (Louis Segond) | ansiedad, esperanza, miedo, fuerza, paz, soledad, culpa, agobio (Reina-Valera 1960) |
| Tool entry shells | `/pt/planos`, `mural`, `leitor`, `crianças` | `/fr/plans`, `mural`, `lecteur`, `enfants` | `/planes`, `muro`, `lector`, `ninos` (root) |
| Legal summaries | `/pt/privacy`, `/pt/terms` | Link from hub to EN canonical | Link from hub to EN canonical |

---

## Tone & Scripture (non-negotiable)

- **Pastoral, calm, specific** — quiet friend at dawn; no hype, no prosperity/politics framing.
- **KJV** only where English product surfaces show English Bible text; label it.
- **On-page Scripture** must name tradition + public-domain note where applicable (Almeida, Louis Segond, Reina-Valera 1960, etc.).
- **No fake localization** — if the UI is English, the shell page must say so before the CTA.

---

## Switcher & maps (when you add a paired URL)

1. Add or extend objects in **`language-switcher.js`**: `PT_TO_FR`, `PT_TO_ES`, `PT_TO_ZH`, `FR_TO_EN`, `FR_TO_ES`, `FR_TO_PT`, `ES_TO_FR`, `ES_TO_PT`, `ES_TO_EN`, `EN_TO_ES`, and hope-path `isHopeEquivalentPath()` if it is a hope door.
2. Extend **`isSpanishTopical()`** for new **root** `lang="es"` pages (mood + shells).
3. Add **`isFrenchToolShell()`** (or equivalent) when adding FR-only shells so `aria-current` and ID/TL defaults stay sane.
4. Wire **`_redirects`**, **`_headers`**, **`sitemap.xml`**, **`scripts/cloudflare-purge.mjs`**, **`test-security.js`** (`cacheHygienePaths`, Spanish `302` needles, purge list), **`test-site.js`**.

---

## Generators

| Command | Output |
|---------|--------|
| `npm run render:fr-es-moods` | FR mood depth (`peur`, `force`, `paix`) + ES root moods (`miedo`, `soledad`, `culpa`, `agobio`) |
| `npm run render:locale-parity` | `esperanza.html`, FR tool shells, ES tool shells |
| `node scripts/write-pt-locale-pages.mjs` | Portuguese moods + shells + legal summaries |

Shared switcher row: **`scripts/lib/lang-switcher-inner.mjs`**.

---

## Hubs — daily verse (UX)

- Canonical **daily** verse is always **`/verse.html`** (EN UI, KJV). Hubs keep a **fixed anchor verse** in the local tradition for warmth; they must **not** pretend to replace the calendar.
- Stable section ids for deep links: `#pt-hub-daily-verse`, `#fr-hub-daily-verse`, `#es-hub-daily-verse`.

---

## Fourth language — draft pick: **Bahasa Indonesia** (`id/`)

**Why:** Large church presence, existing **`id/kecemasan.html`** + **`id/harapan.html`** pilots lower the cost of a hub.

**Target URLs (draft):**

- Hub: `/id/` + `id/index.html`, `_redirects` same pattern as `/es/`, `/fr/`, `/pt/`.
- Mood pages: extend beyond anxiety/hope using the same shell + breakdown pattern as ES/FR (pick one public-domain Indonesian Bible tradition and **name it on-page** — do not imply KJV where text is Indonesian).
- Switcher: add `isIndonesianHub()`, maps parallel to `PT_TO_*` / `ES_TO_*` for paired paths.
- **Do not ship** until the ship gate table is green for `id/`.

Other strong candidates when you are ready: **Arabic**, **Tagalog**, **Hindi**, **Swahili**, **Russian** (see `explore.html#languages` for existing pilots).

---

When a locale matches the **ship gate**, call it **complete**. Anything less is **pilot** or **phase 1** — say so on the hub.
