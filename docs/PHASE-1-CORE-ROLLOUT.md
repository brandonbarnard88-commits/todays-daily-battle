# Phase 1 — Core pages (rollout)

**Benchmark:** [STANDARD-OF-EXCELLENCE.md](./STANDARD-OF-EXCELLENCE.md)  
**Order:** Home &rarr; Plans &rarr; Verse of the Day + full verse &rarr; About &rarr; My Study / Progress  

Use the **checklist in §4** of the standard on every pass.

| # | Area | Primary files | Status |
|---|------|---------------|--------|
| 1 | **Homepage** | `index.html` (inline critical + hero; `script.js` for search&mdash;do not break [homepage feel search](../.cursor/rules/homepage-feel-search.mdc)) | **Polish layered:** warmer, more personal porch copy + `tdb-porch-ingress--warm` sun-wash card (dark + calm-cream light, soft top highlight). |
| 2 | **Plans** | `plans.html` | **Polish layered:** inviting `plans-porch-ingress` line (italic, warm panel) + `plans-hero--soar-dawn` sun-wash border and light-mode paper. |
| 3 | **Verse of the Day + full verse** | `verse.html` | Next: first-screen calm, typographic hierarchy, offline strip consistency. |
| 4 | **About** | `about.html` | Next: align opening copy rhythm with Main Porch shell; keep honest tone. |
| 5 | **My Study / Progress** | `mystudy.html`, `mystudy.css`, `progress.html` | Next: tool-shell warmth (calm dark), no new pressure copy; progress stays &ldquo;quiet marker&rdquo; language. |

## Practical notes for builders

- **Homepage search:** after edits, run `npm run test` (includes homepage search wiring guard) and `npm run test:site`.
- **Dist:** if your workflow ships `dist/`, run `npm run build` and verify.
- **Scope:** improve warmth and order of reading; do **not** remove tools, quick topics, or protected `#main-search` / `#quick-actions-hero` blocks (see project rules).

*Last updated with Phase 1 kickoff: homepage + plans hero ingress lines.*
