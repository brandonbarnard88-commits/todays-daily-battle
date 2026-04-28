# Today's Daily Battle

[![QA Smoke](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/qa-smoke.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/qa-smoke.yml)
[![Site Offline Test](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/site-offline-test.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/site-offline-test.yml)
[![Live CSP](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/live-csp.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/live-csp.yml)
[![Playwright](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/playwright.yml)

Static web app for scripture-first daily encouragement, prayer, and study tooling.

## North star (non-negotiable)

The product’s fixed foundations are documented in **`docs/NORTH-STAR-PRINCIPLES.md`**: KJV-only, privacy-first and ad-free, offline-first, and practical human-scale battle plans. New work must protect all four.

**Verse UX is also fixed:** see **`docs/VERSE-BREAKDOWN-RULE.md`**. Every verse shown or looked up on the site must follow that structure (reference + full KJV + layman sections + step + prayer) so teaching stays consistent with the porch. Rolling migration priorities live in **`docs/VERSE-BREAKDOWN-MIGRATION-NEXT.md`**.

**Pre-merge to `main`:** see **`docs/CHECKLIST-DEPLOY.md`** (“Before merging a feature branch”). Run `npm run release:check` after `cd api && npm install` (first time only for the API package).

## V2 Quality Gate

- Follow `V2-QUALITY-BASELINE.md` before shipping any change.
- This applies to legacy (`v1`) and new (`v2`) paths with zero-tolerance quality standards.
- Weekly execution guide: `WEEKLY-AUDIT-RUNBOOK.md`
- Current progress + status snapshot: `V2-HARDENING-SUMMARY.md`
- Long-horizon plan: `ROADMAP-TO-PERFECTION.md`

## Core CI

- `QA Smoke`: browser-based critical-path verification.
- `Site Offline Test`: build + offline route/search/prayer checks (`quality:gate`).
- `Live CSP`: production homepage must return `Content-Security-Policy` with Trusted Types + core directives (`npm run test:live-csp`).
- `Playwright`: Calm + prayer seeds + **axe** on critical pages + core smoke, then **live CSP** (`npm run quality:gate:browser` locally after `npx playwright install chromium`; needs network for the final probe).

**Quality target checklist:** `docs/QUALITY-9-ROADMAP.md`

## Action Bible Coverage

- `npm run actionbible` builds `action-bible-365.json`.
- `npm run actionbible:packs` builds `action-bible-weekly-packs.json` for weekly rollout packs.
- The dataset guarantees archive coverage with both `avatarPrompt` and `cartoonPrompt` for every entry, with a minimum of 365 entries.
- Entries are ordered for documentary flow (canonical verse order) and tagged by testament + season.
- `action-bible-workshop.html` provides worksheet mode, family mode, leader dashboard plans, and season mastery checkpoints by age/class hierarchy.
- `quality:gate` now enforces this generation step so coverage cannot drift.

## NPM Warning Fix (devdir)

- If you see `Unknown env config "devdir"`, it is coming from environment config, not this repo.
- Recommended shell fix (zsh):
  - `echo "alias npm='env -u npm_config_devdir -u NPM_CONFIG_DEVDIR npm'" >> ~/.zshrc`
  - `source ~/.zshrc`
- Verify with: `npm config get devdir` (should return `undefined`).

## HTML partial sync scripts

After editing shared partials in `partials/` or when shell chrome drifts, re-run the matching sync (from repo root):

- **`npm run sync:footer`** — canonical site footer + build stamp wiring on tool/shell pages.
- **`npm run sync:shell-parity`** — aligns account nudge (with Restart tour), `styles.css` / `script.js` cache tokens, and related shell assets on calm, plans, memorize, verse-image, mobius, reader, etc. (see `scripts/sync-shell-parity.mjs`).
- **`npm run sync:account-nudge-restart`** — account strip / nudge copy only.
- **`npm run sync:primary-nav`** — primary flyout nav block.
- **`npm run sync:header`** / **`sync:lang-header`** — global header and language row when those partials change.

Then bump any page-specific cache query strings if needed (keep `script.js`, `styles.css`, and `tdb-quiet-luxury.css` query params in sync across shells; update `test-site.js` / `test-site.py` when those tokens change) and run `npm run build` plus `npm run test`, `npm run test:site`, `npm run test:security`.

## Operations & launch

- **Deploy cache, Supabase forms, cron verification, shop launch, Lighthouse:** `docs/SITE-OPS-RUNBOOK.md`
- **Community, shop MVP, perf, discoverability backlog:** `docs/GROWTH-ROADMAP.md`
- **Deploy checklist (cache-bust, tests):** `docs/CHECKLIST-DEPLOY.md`
- **Lighthouse (mobile `/` + `reader.html`):** `LIGHTHOUSE-AUDIT.md` — run `npm run audit:lighthouse:live` after deploy (writes JSON summaries to repo root, gitignored).
