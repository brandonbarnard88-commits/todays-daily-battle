# Story Library — art + Q&A audit

Run: `node scripts/audit-story-library-art-qa.mjs --strict`

## Latest (coloring complete)

| Check | Result |
|-------|--------|
| Library stories | **427** |
| Stories with Color & Tell art | **427 (100%)** |
| Wrong-art mismatches | **0** |
| Quiz packs | **413** |
| Quiz answer issues | **0** |
| Quiz foreign contamination | **0** |

### What was generated
95 new full-page coloring JPGs under `/coloring-pages/` (house style line art), plus remaps to existing pages, so every library story key resolves to a real coloring image.

Regenerate map health anytime with the audit script.
