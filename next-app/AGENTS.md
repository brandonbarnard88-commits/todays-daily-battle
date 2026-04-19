<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Today’s Daily Battle (this folder)

- **KJV only** — no other translations in UI or copy.
- **Static export** — `output: "export"`; no server-only APIs in app code.
- **Before merge / deploy:** run **`npm run check`** (`lint` + `build`). See **`DEPLOY-SMOKE-CHECKLIST.md`** for preview QA and post-merge Cloudflare steps.
- **Cloudflare Pages (Next export):** production branch should be **`main`** (pilot work merged there).
- **Verses:** use **`<TDBVerseBreakdown />`** wherever verse companion text appears; canon lives in `data/canon-daily-verse.json`.
