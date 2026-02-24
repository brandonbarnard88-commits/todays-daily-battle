# Deploy & verify (≈3 min)

## 1. Update Cloudflare Pages

**Dashboard → Pages → your project → Settings → Builds & deployments**

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Save**

## 2. Trigger redeploy

- **Deployments** tab → **Retry deployment** on the latest  
  **or** push a commit (e.g. small change in `index.html`).
- Wait 1–2 minutes.

## 3. Verify

- **Deployments → latest → Build output** → search for `topic-anxiety.html` → should be listed.
- Open incognito:
  - https://todaysdailybattle.com/topic-anxiety.html
  - or https://todaysdailybattle.com/topic-anxiety
- Page should load (anxiety verses, pray buttons, etc.).

**If it loads:** Topic pages live—site’s complete.

**If still 503:**

- Check build logs for "file not copied" or "dist empty".
- Share logs and we can tweak `build-copy-static.js`, push, and redeploy.
