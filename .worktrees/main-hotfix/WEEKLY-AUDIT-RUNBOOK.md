# Weekly Audit Runbook (V2)

Run this once per week or before major releases.

## 1) Execute the hard gate

- `npm run quality:gate`
- `npm run quality:gate:full` (if browser automation is available)

## 2) Verify quality standards

- Review user-facing copy for generic/placeholder tone.
- Check mobile layouts (small-phone + standard-mobile).
- Verify keyboard and focus behavior on critical flows.
- Confirm no feature discoverability regressions.

## 3) Security checks

- Run `npm run test:security` and confirm warnings remain 0 (or document exactly why not).
- Spot-check dynamic DOM insertions touched during the week.
- Confirm no secret keys/tokens were introduced in tracked files.

## 4) Legacy level-up rule

- For every area touched this week, improve nearby weak UX/copy/visual quality in the same pass.
- Do not defer known issues as "later" without explicit issue tracking.

## 5) Release note template

- What changed:
- What was verified:
- Remaining risks:
- Follow-up tasks:
