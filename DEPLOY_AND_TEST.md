# Deploy and test (todaysdailybattle.com)

## Message you can send to inspectors / testers

**Updates:**
> The site has been updated with new quick topics (Addiction, Trauma), Listen and KJV Audio in the Featured section, and audio controls. If you don't see them, do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or try in a private/incognito window. If it still looks old, the latest build may not be deployed yet.

**Featured verse:**
> For the Featured verse not showing: we've added better error handling and a "Try again" that reloads the Bible and daily verse. After the next deploy, if the verse still doesn't appear, clicking "Try again" on that section should either show the verse or a clear error message.

---

## Hosting / getting the deploy live

Your repo doesn’t have a host config file (no `netlify.toml`, `vercel.json`, etc.), so the live site is likely one of:

- **Netlify** – Connect the GitHub repo in Netlify dashboard; deploys usually run on every push to `main`. Check **Deploys** → latest should be “Published.”
- **Vercel** – Same idea: connect repo, auto-deploy on push. Check **Deployments** → latest commit “Ready.”
- **Cloudflare Pages** – Connect repo or upload; **Deployments** tab shows build status.
- **GitHub Pages** – Repo **Settings → Pages** → source branch (e.g. `main`). Build can take 1–2 min. Check **Actions** tab if you use a workflow.
- **Other** – FTP, cPanel, or a custom server: you have to upload or pull the latest files yourself after each push.

**If deploy isn’t automatic:** Push to `main`, then in the host’s dashboard trigger a new deploy (e.g. “Deploy site” / “Redeploy”) so the latest commit is built and published.

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
