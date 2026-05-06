# Today’s Daily Battle — Next.js pilot

KJV-only, calm, static-export App Router app. Ships to **`next-app/out`** for Cloudflare Pages (`output: "export"`).

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local dev (http://localhost:3000) |
| `npm run lint` | ESLint |
| `npm run build` | Production static export → `out/` |
| `npm run check` | **`lint` + `build`** — run before every deploy |

## Routes (clean URLs)

`/`, `/verse`, `/reader`, `/calm`, `/plans`, `/plans/[slug]`, `/family`, `/mystudy`, `/memorize`, `/prayer-wall`. Rewrites live in `public/_redirects`.

## Deploy (Cloudflare Pages)

Use a **second** Pages project so the main static site stays untouched. Full settings:

| Setting | Value |
|--------|--------|
| **Framework preset** | None (or Next.js if offered — build is custom) |
| **Root directory** | `next-app` *(or repo root, then build command includes `cd`)* |
| **Build command** | `npm ci && npm run build` *(from `next-app` root)* or `cd next-app && npm ci && npm run build` *(from monorepo root)* |
| **Build output directory** | `out` *(if root is `next-app`)* or `next-app/out` *(if root is repo root)* |
| **Environment variables** | Optional: `NEXT_PUBLIC_MAIN_SITE_ORIGIN` = `https://todaysdailybattle.com` (classic reader links) |

After deploy, run **`DEPLOY-SMOKE-CHECKLIST.md`** on the preview URL (includes **post-merge** steps for `main`, optional Cloudflare cache rules, build caching notes, service worker summary, and the **gentle 10-minute side-by-side heart check**).

## Troubleshooting

- **Stale build:** `rm -rf .next out && npm run build`
- **Port in use:** Next may use 3001; see `lsof` on 3000 if needed.

## More

- Smoke checklist: `DEPLOY-SMOKE-CHECKLIST.md`
- Agent notes: `AGENTS.md`
