# Quality target (~9.2) — what the repo enforces

This doc ties “elite” shipping to **measurable** checks. Nothing here weakens security.

## Automated (CI / npm)

| Check | Command / workflow | What it proves |
|--------|-------------------|----------------|
| Offline structure + search wiring | `npm run quality:gate` (Python + Node) | Core HTML/JS contracts |
| CSP in repo | `npm run test:security` | `_headers` has Trusted Types + minimal `trusted-types` allowlist |
| **Live CSP** | `npm run test:live-csp` · workflow `live-csp.yml` | Production document response includes CSP (no silent Transform Rule drift) |
| Playwright + **axe** + smoke | `npm run quality:gate:browser` · workflow `playwright.yml` | Critical pages: WCAG scan (see test file for disabled rules) + home search + Bible tool + message shell |

## Local before a big release

1. `npm install` (includes `@axe-core/playwright`)
2. `npx playwright install chromium`
3. `npm run quality:gate:browser`
4. `npm run test:live-csp` (optional if CI already green)
5. `npm run audit:lighthouse:local` (or production Lighthouse) — aim mobile **Performance / A11y / Best practices ≥ 90** where realistic

## Next tightening (optional)

- Remove rules from `AXE_DISABLED` in `tests/a11y-critical.spec.ts` after a contrast + viewport pass
- Self-host/subset Google Fonts if LCP is still borderline
- Extend smoke tests (signed-in flows) without slowing every PR
