# Purge Cache Now (No API Token Needed)

**Use this if you don't have Cloudflare API tokens.** Takes ~2 minutes.

## Steps

1. **Go to Cloudflare:** https://dash.cloudflare.com  
2. **Select your domain:** Click **todaysdailybattle.com** in the left sidebar  
3. **Open Caching:** Click **Caching** in the left menu  
4. **Purge:** Click **Configuration** → **Purge Everything** → **Purge Everything** (confirm)  
5. **Wait:** 30–60 seconds  
6. **Test:** Open https://todaysdailybattle.com in incognito, hard refresh (Cmd+Shift+R)

Done. New content should appear.

---

**If Caching isn't visible:** Your domain might be on Cloudflare Pages only (no zone). In that case: **Workers & Pages** → your project → **Deployments** → **Trigger deploy** on the latest. That forces a fresh build.

---

**Verify code locally (no purge needed):** `npm run build && npm run test:mobile:local` — runs mobile smoke test against local dist. Use this to confirm search/quick topics work before worrying about live site.
