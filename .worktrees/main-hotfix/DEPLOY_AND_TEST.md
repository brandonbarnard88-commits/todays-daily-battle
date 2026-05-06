# Deploy and test (todaysdailybattle.com)

## Current status (from latest audit)

- Local quality gate is passing (`npm run quality:gate`).
- Critical fix applied locally: `index.html` no longer hardcodes `Philippians 4:6` in `#daily-battle-card`.
- `dist/index.html` now correctly uses loading-state markup.
- Production still appears stale until you deploy the latest commit.

---

## Command-by-command release runbook

### 0) Preflight in repo root

```bash
git status -sb
npm run quality:gate
```

Expected:
- Working tree is the state you intend to ship.
- Quality gate fully passes.

### 1) Ensure deploy credentials are available

This repo contains `vercel.json`, so Vercel is an active deploy target.

```bash
npx vercel whoami
```

If not logged in:

```bash
npx vercel login
```

### 2) Commit and push the release

```bash
git add index.html search.js kids/kids-battle.js styles.css kids/kids-battle.css
git commit -m "fix daily verse preload and polish concordance search UX"
git push origin main
```

Notes:
- If you need to include additional changed files, add them explicitly.
- If your host is connected to GitHub, push should trigger deploy automatically.

### 3) Trigger/confirm Vercel production deploy

Option A (dashboard auto-deploy): verify latest push is "Ready".

Option B (CLI manual deploy):

```bash
npx vercel --prod
```

### 4) Verify production immediately

Run from repo root:

```bash
node scripts/verify-deployment-final.mjs
node scripts/verify-verse-rotation.mjs
node scripts/check-deployment.mjs
node scripts/diagnose-search-live.mjs
node scripts/mobile-smoke-test-static.mjs
```

Expected outcomes:
- `verify-deployment-final.mjs`: no hardcoded `Philippians 4:6` in HTML checks.
- `verify-verse-rotation.mjs`: should not remain fixed to one verse across loads.
- `diagnose-search-live.mjs`: pass/no critical failures in search wiring checks.

### 5) Manual browser verification (required)

In a private/incognito window on production:

1. Search `anxiety` from the homepage search bar.
2. Confirm multiple KJV matches appear and strongest verse breakdown renders.
3. Confirm daily verse card loads dynamically (not frozen on one static verse).
4. On Kids page, run a search (`strong`, `peace`) and verify kid summary card renders with age fit + "Try this today".
5. Verify mobile widths (375px and 430px) for no clipping/horizontal overflow.

---

## Message you can send to inspectors / testers

**Updates:**
> The site has been updated with new quick topics (Addiction, Trauma), Listen and KJV Audio in the Featured section, and audio controls. If you don't see them, do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or try in a private/incognito window. If it still looks old, the latest build may not be deployed yet.

**Featured verse:**
> For the Featured verse not showing: we've added better error handling and a "Try again" that reloads the Bible and daily verse. After the next deploy, if the verse still doesn't appear, clicking "Try again" on that section should either show the verse or a clear error message.

---

## Hosting / getting the deploy live

This repo includes `vercel.json`, and deploy can still also be managed in provider dashboards.

Common hosting options:

- **Netlify** – Connect the GitHub repo in Netlify dashboard; deploys usually run on every push to `main`. Check **Deploys** → latest should be “Published.”
- **Vercel** – Repo appears configured for this. Check **Deployments** → latest commit “Ready.”
- **Cloudflare Pages** – Connect repo or upload; **Deployments** tab shows build status.
- **GitHub Pages** – Repo **Settings → Pages** → source branch (e.g. `main`). Build can take 1–2 min. Check **Actions** tab if you use a workflow.
- **Other** – FTP, cPanel, or a custom server: you have to upload or pull the latest files yourself after each push.

**If deploy isn’t automatic:** Push to `main`, then trigger a manual deploy in host dashboard (or `npx vercel --prod` for Vercel).

**Verify it’s live:** View Page Source on todaysdailybattle.com → search for `Addiction`, `Trauma`, `Listen`, `KJV Audio`. If they’re in the HTML, the new build is live.

---

## Checklist after deploy

1. **Deploy** the latest code to todaysdailybattle.com (push to your host and confirm the build completed).

2. **Confirm** the live site is on the new build:
   - Quick topics include **Addiction** and **Trauma**.
   - Featured Today's Battle has **Listen** and **KJV Audio** buttons.
   - Expand "Audio & verse size" and you see read-aloud speed, voice, and Stop.

3. **Test** in a private/incognito window:
   - Run a search (e.g. hope, addiction).
   - Open Featured Today's Battle: verse, reflection, prayer, and Listen/KJV Audio should appear if the verse loaded.
   - If the verse didn’t load, click **Try again** and confirm the card updates (verse or error message).

4. **If the verse still doesn’t load on production:**
   - Open DevTools (F12) → **Console** tab: note any red errors.
   - Open **Network** tab: confirm `script.js`, `index.html`, and `kjv.json` return 200 and that Supabase requests succeed.
   - That will show whether the issue is Bible load, Supabase, or a script error.
