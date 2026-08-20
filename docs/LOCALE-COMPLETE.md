# Locale “complete” standard — Today’s Daily Battle

Use this as the **release gate** before calling a language **shipped** (not “pilot”). Anything below the bar must be labeled honestly on the hub.

---

## Four hubs (Mar 2026)

| Hub URL | Locale | Tier (honest label) | Notes |
|---------|--------|---------------------|--------|
| `/pt/` | Portuguese | **Closest to complete** | Eight Almeida mood doors + tool shells + legal summaries; strongest grid. |
| `/fr/` | French | **Deep pilot** | Many Louis Segond mood doors + tool shells; legal still points to EN. |
| `/es/` | Spanish | **Solid hub** | Reina-Valera 1909 moods + root tool shells; legal → EN. |
| `/id/` | Indonesian | **Honest pilot** | Three KJV + ID pilots (kecemasan, harapan, ketakutan); most site UI remains EN. |

**Fifth hub** (when ready): strong candidates include **Arabic** (reach in difficult places) and **Tagalog** (large church presence; anxiety + hope pilots already exist outside the hub pattern).

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
| 7 | **Switcher** | `language-switcher.js`: hubs `aria-current`; **Español** → `/es/`, **Français** → `/fr/`, **Português** → `/pt/`, **Bahasa Indonesia** → `/id/`; hope cluster → `/esperanza.html` (ES), not only Explore |
| 8 | **Tests** | `npm run build`, `npm run test:site -- --offline`, `npm test`, `npm run test:security` |

---

## Reference depth (Mar 2026) — PT / FR / ES / ID

| Layer | Portuguese | French | Spanish | Indonesian (pilot) |
|--------|------------|--------|---------|-------------------|
| Hub | `/pt/` | `/fr/` | `/es/` | `/id/` |
| Moods (tradition on-page) | ansiedade, esperança, medo, força, paz, solidão, culpa, sobrecarga (Almeida) | anxiété, espoir, peur, colère, tristesse, pardon, force, paix, solitude, culpabilité, débordé (Louis Segond) | ansiedad, esperanza, miedo, ira, duelo, perdón, fuerza, paz, soledad, culpa, agobio (Reina-Valera 1909) | kecemasan, harapan, ketakutan (KJV on-page + ID support copy) |
| Tool entry shells | `/pt/planos`, `mural`, `leitor`, `crianças` | `/fr/plans`, `mural`, `lecteur`, `enfants` | `/planes`, `muro`, `lector`, `ninos` (root) | — (tools link to EN) |
| Legal summaries | `/pt/privacy`, `/pt/terms` | Link from hub to EN canonical | Link from hub to EN canonical | Link from hub to EN canonical |

---

## Tone & Scripture (non-negotiable)

- **Pastoral, calm, specific** — quiet friend at dawn; no hype, no prosperity/politics framing.
- **KJV** only where English product surfaces show English Bible text; label it.
- **On-page Scripture** must name tradition + public-domain note where applicable (Almeida, Louis Segond, Reina-Valera 1909, etc.).
- **No fake localization** — if the UI is English, the shell page must say so before the CTA.

---

## Switcher & maps (when you add a paired URL)

1. Add or extend objects in **`language-switcher.js`**: `PT_TO_FR`, `PT_TO_ES`, `PT_TO_ZH`, `FR_TO_EN`, `FR_TO_ES`, `FR_TO_PT`, `ES_TO_FR`, `ES_TO_PT`, `ES_TO_EN`, `EN_TO_ES`, and hope-path `isHopeEquivalentPath()` if it is a hope door.
2. Extend **`isSpanishTopical()`** for new **root** `lang="es"` pages (mood + shells).
3. Add **`isFrenchToolShell()`** (or equivalent) when adding FR-only shells so `aria-current` and ID/TL defaults stay sane.
4. Wire **`_redirects`**, **`_headers`**, **`sitemap.xml`**, **`scripts/cloudflare-purge.mjs`**, **`test-security.js`** (`cacheHygienePaths`, Spanish `302` needles, purge list), **`test-site.js`**.

---

## Checklist: add one FR/ES mood page (generator)

1. Edit **`scripts/render-fr-es-mood-pages.mjs`**: extend `frRelatedCore` / `esRelatedCore` if the new URL should appear on every mood grid; append a `frPages` / `esPages` entry (`enPath`, `extraHreflang`, Louis Segond / Reina-Valera quotes).
2. Run **`npm run render:fr-es-moods`** (writes HTML from the script — do not hand-edit generated shells long-term).
3. **`language-switcher.js`**: `FR_TO_EN`, `FR_TO_ES`, `FR_TO_PT`, `ES_TO_FR`, `ES_TO_PT`, `ES_TO_EN`, `EN_TO_ES`; extend **`isFrenchExtraMoodPilot()`** and **`isSpanishTopical()`**; add **`esHref()`** self-canonical basename if root ES.
4. Reciprocal **`hreflang`** on the English topic page when a pair exists.
5. **`_redirects`**: for root ES moods, add `/slug` → `/slug.html?tdb_cb=…` `302` (same `tdb_cb` generation as siblings).
6. **`_headers`**: `no-cache` blocks for `/slug.html`, `/slug`, and `/fr/slug.html` + `/fr/slug` as applicable.
7. **`sitemap.xml`**, **`scripts/cloudflare-purge.mjs`**, **`test-security.js`**, **`test-site.js`**, hub grids on **`fr/index.html`** / **`es/index.html`**, **`explore.html`** if it is a major entry point.

## Checklist: add one ID pilot page (hand shell)

1. **Fast start:** `npm run scaffold:id-pilot -- <slug> <topic-foo.html> "<title>"` copies **`id/ketakutan.html`** → **`id/<slug>.html`** with URL + EN pair rewrites (you edit verses, `hreflang`, related links).
2. Or add **`id/nama.html`** by hand from **`id/kecemasan.html`** / **`id/ketakutan.html`**: KJV in the breakdown, honest “tools are EN” copy, `hreflang` only where real pairs exist.
3. **`language-switcher.js`**: `ID_TO_EN`, `EN_TO_ID`, `ID_TO_ES`, `ES_TO_ID` as needed; **`isIndonesianTopical()`** + **`applyAriaCurrent()`** `indo` branch; **`idHref()`** early return for the new path.
4. **`_headers`** + **`sitemap.xml`** + **`cloudflare-purge.mjs`** + **`test-security.js`** (`cacheHygienePaths` + purge assertions) + **`test-site.js`**.
5. **`id/index.html`** hub card + **`explore.html`** language list when discoverability matters.

---

## Generators

| Command | Output |
|---------|--------|
| `npm run render:fr-es-moods` | FR mood depth (`peur`, `force`, `paix`, `colere`, `tristesse`, `pardon`) + ES root moods (`miedo`, `soledad`, `culpa`, `agobio`, `ira`, `duelo`, `perdon`) |
| `npm run render:locale-parity` | `esperanza.html`, FR tool shells, ES tool shells |
| `node scripts/write-pt-locale-pages.mjs` | Portuguese moods + shells + legal summaries |
| `npm run scaffold:id-pilot -- <slug> <topic.html> "<title>"` | Copy **`id/ketakutan.html`** → **`id/<slug>.html`** with safe URL/topic rewrites (manual finish required) |

Shared switcher row: **`scripts/lib/lang-switcher-inner.mjs`**.

---

## Hubs — daily verse (UX)

- Canonical **daily** verse is always **`/verse.html`** (EN UI, KJV). Hubs must **not** pretend a fixed on-page verse replaces that calendar.
- **PT / FR / ES / ID** hubs use a **two-column layout** (`tdb-hub-daily-split`): left = clear CTA to **`/verse.html`** + what to expect (EN UI, KJV text); right = **welcome anchors** in local tradition (or KJV + ID gloss on **`/id/`**).
- The **right column** rotates among **three** fixed anchor verses **once per UTC day** (`data-tdb-hub-daily-rotate` + `script.js` `initHubDailyAnchorRotate`) for gentle variety — still not the calendar verse.
- Stable section ids for deep links: `#pt-hub-daily-verse`, `#fr-hub-daily-verse`, `#es-hub-daily-verse`, `#id-hub-daily-verse`.

---

## Bahasa Indonesia (`id/`) — hub live (pilot)

**Why:** Large church presence; **`id/kecemasan.html`**, **`id/harapan.html`**, and **`id/ketakutan.html`** anchor the hub.

**Shipped (pilot, not “complete”):**

- Hub: **`/id/`** + `id/index.html`, `_redirects` `200!` like other locale hubs; honest copy about KJV-on-pilot + English tools.
- Mood pages: **three** pilots; expand with the same shell + breakdown pattern when ready.
- Switcher: **`isIndonesianHub()`**, default **Bahasa Indonesia** link → `/id/`; maps align with ES/FR/PT hubs for cross-picks.
- **Not “complete”** until the ship gate grid matches PT depth (more moods, tool shells, local legal summaries if claimed).

Other strong candidates when you are ready: **Arabic**, **Tagalog**, **Hindi**, **Swahili**, **Russian** (see `explore.html#languages` for existing pilots).

---

When a locale matches the **ship gate**, call it **complete**. Anything less is **pilot** or **phase 1** — say so on the hub.
