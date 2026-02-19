# Deploy and test (todaysdailybattle.com)

## Message you can send to inspectors / testers

**Updates:**
> The site has been updated with new quick topics (Addiction, Trauma), Listen and KJV Audio in the Featured section, and audio controls. If you don't see them, do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or try in a private/incognito window. If it still looks old, the latest build may not be deployed yet.

**Featured verse:**
> For the Featured verse not showing: we've added better error handling and a "Try again" that reloads the Bible and daily verse. After the next deploy, if the verse still doesn't appear, clicking "Try again" on that section should either show the verse or a clear error message.

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
