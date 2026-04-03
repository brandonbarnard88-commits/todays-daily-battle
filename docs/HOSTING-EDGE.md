# Hosting: Cloudflare + Vercel (simplify when ready)

The site is **static output in `dist/`** (`npm run build`). Authoritative security headers for Pages are **`_headers`** (copied into `dist/` on build). `vercel.json` headers are kept in sync via `npm run sync:vercel-headers` during build.

## Why things feel “stuck” sometimes

If **Cloudflare proxies (orange cloud)** an origin that is **not** Cloudflare Pages (e.g. Vercel), you can get **two caching layers** plus dashboard rules. `_headers` already sets **`no-cache`** on high-churn HTML paths; a zone **Purge Everything** (or `npm run purge:cloudflare`) fixes edge mismatch when it happens.

## Console errors: `email-decode.min.js` / `getAttribute is not a function`

That file is **not** from this repo. Cloudflare injects it when **Scrape Shield → Email Address Obfuscation** is on. It rewrites `mailto:` links at the edge; the decoder sometimes throws because `childNodes[0]` is a **text node** (no `getAttribute`), especially with normal markup like `<a href="mailto:…">text</a>`.

**Fix (recommended):** Cloudflare Dashboard → **Scrape Shield** → **Email Address Obfuscation** → **Off** for `todaysdailybattle.com`. Policy and contact pages already publish **support@todaysdailybattle.com** plainly; obfuscation adds little and pollutes the console.

## Option A — Single host: **Cloudflare Pages** (recommended for this repo)

1. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → Connect the **same Git repo** you use today.
2. Build settings: **Build command** `npm run build`, **Build output directory** `dist`.
3. Production branch: `main` (or your default).
4. Custom domain: attach **www** / apex per [CLOUDFLARE-HOST-CANONICAL.md](./CLOUDFLARE-HOST-CANONICAL.md).
5. When Pages is the only host, you can **pause or detach Vercel** from the custom domain to avoid double deploys.
6. **Optional CLI** (after `wrangler login` or `CLOUDFLARE_API_TOKEN`):

   ```bash
   CF_PAGES_PROJECT_NAME=your-project-name npm run deploy:cf-pages
   ```

7. **`wrangler.toml`** at repo root documents `pages_build_output_dir = "dist"` for Wrangler / docs parity.

8. **Optional cloud text-to-speech (Listen)** — `functions/api/tts.js` is served as **`POST /api/tts`** on Pages (legacy **`POST /api/elevenlabs-tts`** uses the same handler). Set **`ELEVENLABS_API_KEY`** and **`ELEVENLABS_VOICE_ID`** as **encrypted** project variables or `wrangler pages secret put` (see `.env.example` comments). Without them, the endpoint returns **503** and the site keeps **device** speech synthesis. **Vercel-only** deploys do not run this function unless you add an equivalent server route.

Workers (Turnstile, geo, etc.) stay on Cloudflare; align routes with your Pages project.

## Option B — **Vercel** stays origin; Cloudflare **DNS only** (grey cloud)

1. Cloudflare DNS → records for the site → toggle **proxy off** (grey cloud) for the hostnames pointing at Vercel.
2. Traffic goes to Vercel directly; **zone cache no longer sits in front** of HTML (big reduction in “purge to see HTML” issues).
3. You give up orange-cloud CDN/WAF on that hostname; Vercel’s edge handles delivery.

## Optional: GitHub → Pages deploy

Workflow **`.github/workflows/deploy-cloudflare-pages.yml`** runs on **`workflow_dispatch`** and on **push to `main`** when a Pages-capable token is set. Add secrets:

- `CLOUDFLARE_API_TOKEN` — Pages write (or broader account token you trust)
- `CLOUDFLARE_ACCOUNT_ID`
- `CF_PAGES_PROJECT_NAME` — exact Pages project name

Do **not** enable a second automatic production deploy on every push until you’ve decided to **stop** auto-deploying elsewhere, or you’ll publish twice.

## Purge on push

`.github/workflows/purge-cloudflare-on-push.yml` purges the **zone** after each push to `main` when `CF_ZONE_ID` + `CF_API_TOKEN` are set. If you move to **Pages-only**, consider switching to **Pages cache invalidation** or trimming purges—see `scripts/cloudflare-purge.mjs` and `npm run purge:cloudflare:social` for lighter touches.

## Production parity checklist (after every meaningful deploy)

Use this when “GitHub is right but the site feels old.”

1. **Confirm one authoritative publish path** for the live hostname (Pages **or** Vercel **or** another origin)—avoid two systems both claiming production without a documented rule.
2. **Run a green deploy** (`npm run build` locally; then GitHub **Deploy Cloudflare Pages (manual)** or your connected Git build; wait for success).
3. **Purge edge cache** if HTML/JS still looks stale: Cloudflare **Caching → Purge Everything** once, or `npm run purge:cloudflare` / `purge:cloudflare:social` with real `CF_API_TOKEN` in `.env` or Actions secrets.
4. **Spot-check in a private window**: `/` (hero + breakdown order), `/coloring.html` (Color & Tell bundle + `kids/color-and-tell.js` version), `/verse-image.html` (supporter flow).
5. **Service worker**: after big asset changes, a normal reload may still show old shells; hard refresh or “clear site data” once if PWA users report ghosts.
