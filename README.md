# Today's Daily Battle

[![QA Smoke](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/qa-smoke.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/qa-smoke.yml)
[![Site Offline Test](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/site-offline-test.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/site-offline-test.yml)
[![Live CSP](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/live-csp.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/live-csp.yml)
[![Playwright](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/brandonbarnard88-commits/todays-daily-battle/actions/workflows/playwright.yml)

Static web app for scripture-first daily encouragement, prayer, and study tooling.

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
