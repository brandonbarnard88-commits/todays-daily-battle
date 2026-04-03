# Site complete — internal checklist (April 2026)

Use before a major share or launch milestone. Not a substitute for automated tests.

## Automated (required before merge)

- [ ] `npm run build`
- [ ] `npm run test:security`
- [ ] `npm test` (includes homepage search wiring guard + `test-site.py`)
- [ ] `npm run test:site` (reads `dist/` — run **after** build)

## Navigation (if you edit partials)

- [ ] `node scripts/sync-primary-site-nav.mjs`
- [ ] Confirm `yearly-rhythm.html` has `nav-year-round` + `aria-current` where expected
- [ ] Confirm `year-at-a-glance.html` has `nav-year-at-a-glance` + `aria-current` on that page

## Manual smoke (pick device + desktop)

- [ ] Home: verse of the month loads; **Listen (KJV)** speaks or shows unavailable gracefully
- [ ] Home: “What’s new — Spring 2026” year-round line reads well
- [ ] `year-at-a-glance.html`: print note + buttons at ~360px width feel breathable
- [ ] `yearly-rhythm.html`: memory grid and links
- [ ] `church-sharing-kit.html#csk-memory-verse-activities`: print CTA + hint

## Content / policy

- [ ] No secrets in repo; `config.js` remains gitignored as intended
- [ ] User-facing copy stays KJV-first and calm (no hype terms per site rules)

## Optional

- [ ] Real-device pass on iOS Safari + one Android Chrome width (~360px)
- [ ] Ship bulletin/newsletter from `docs/SITE-COMPLETE-ANNOUNCEMENT-DRAFT.md` when ready
