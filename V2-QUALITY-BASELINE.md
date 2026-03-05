# V2 Quality Baseline (Hard Gate)

This is the non-negotiable release standard for Today's Daily Battle v2.

## Core Standard

- God-tier elite quality only.
- Zero tolerance for cheap, rushed, generic, or placeholder outcomes.
- Applies to the full product: legacy (`v1`) and new work (`v2`).
- If a part is below bar, it is leveled up, not justified.
- Only exception: layman's terms wording in verse breakdown content.

## Definition of Done (Must All Be True)

- Security hardening is preserved or improved.
- UX is clear, calm, mobile-ready, and accessible.
- Copy is specific, meaningful, and non-generic.
- Visual quality is intentional, coherent, and polished.
- No feature/tool/entry-point regressions.
- No temporary hacks, fake links, or placeholder leftovers in shipped paths.

## Security Gate (Required)

- Prefer `textContent`/DOM APIs over `innerHTML`.
- Any dynamic HTML path must use explicit escaping/sanitization.
- No secrets committed (service role key, Stripe secret key, Turnstile secret).
- Admin access is role-based (`app_metadata.role === 'admin'`), not obscurity.
- RLS assumptions remain intact for Supabase-backed flows.

## Accessibility + Mobile Gate (Required)

- Keyboard reachability and visible focus states.
- Semantic labels/roles and meaningful `aria-label` text.
- Contrast remains readable in dark mode.
- Small-phone and standard-mobile layout verified.
- Tap targets remain at least ~44px where interactive.

## Product Quality Gate (Required)

- No bland/cliche filler copy.
- Error states are graceful and actionable (retry/fallback where appropriate).
- Interaction quality feels smooth on low-end mobile devices.
- Existing tools remain discoverable and functional.
- Homepage quick-search hero and topic chips remain intact.

## Test Gate (Required Before Marking Complete)

Run all:

- `npm run quality:gate`
- `npm run quality:gate:full` (includes smoke, when environment/browser allows)

Pass criteria:

- No failed checks.
- New warnings are fixed or explicitly documented with rationale.

## Legacy Level-Up Rule

- Touching an area requires improving subpar nearby quality in the same pass.
- "Pre-existing" is never a reason to leave weak quality unchanged.
- If you must explain why something is acceptable, improve it until explanation is unnecessary.

## Final Response Requirement

Every completion update must include:

- What was changed.
- What was verified (tests/checks/manual).
- Any remaining risk, explicitly.
