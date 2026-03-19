# Post-Push Checklist (~2 mins)

After you `git push` and the site redeploys, run through this.

---

## 0. Force Fresh Content After Deploy (Cache Purge & Refresh)

When deploying new seeds, Möbius enrichments (node cards/verses/prayers), Trusted Types patch, CSP headers, or any dynamic/JS/header change:

**Deploy first** — Push to repo or run deploy → wait for Cloudflare Pages build to finish (Workers & Pages → your project → Builds tab → latest successful).

**Purge cache (Cloudflare):**
- Log in → Workers & Pages (or Cache → Overview) → select your Pages project
- Go to Caching → Configuration (or Cache → Purge Cache)
- Click **Purge Everything** → confirm (invalidates HTML, JS, audio, etc.)

*Alternative (targeted):* Purge by URL — e.g. `https://todaysdailybattle.com/mobius.html`, `script.js`, `index.html`, `message.html`, `audio/mobius-guided-10min.mp3`

**Hard refresh (browser):**
- Open site in incognito/private window
- Right-click reload → **Empty Cache and Hard Reload** (Chrome/Edge) or Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win/Linux)

**Verify:**
- [ ] Prayer wall → 12+ entries (new seeds like "When fear overwhelms—hold me, Lord.", "Calm the storm in my mind.")
- [ ] Möbius → hover/tap nodes → card shows verse (e.g. Isaiah 40:31 for Power), prayer, cross-ref; streak shows encouragement
- [ ] Console: no TrustedHTML errors; `trustedTypes.defaultPolicy` returns object
- [ ] Calm → anxiety input → verses + Möbius button

**CSP header check:** `curl -sI https://todaysdailybattle.com | grep -i content-security-policy` — should include `require-trusted-types-for 'script'; trusted-types default dompurify`

**Same check from repo:** `npm run test:live-csp` (fails if the live document has no CSP or Trusted Types fragment).

**Deeper gate (local):** `npm run quality:gate:browser` — build + Playwright axe on critical pages + core smoke + `test:live-csp` (requires `npx playwright install chromium` once; needs network for the production CSP check).

**If still stale:** Wait 1–5 min; try cache-buster `?v=20260319`; purge again.

Do this before verifying the rest. Otherwise live may lag behind repo.

---

## 1. Site works

**Visit:** https://todaysdailybattle.com

- [ ] Daily verse loads
- [ ] Search works (topic or verse)
- [ ] Quick Pray + voice input work
- [ ] Dark mode and mobile look correct

---

## 2. RLS (anon can’t read data)

**Incognito** → open (replace `YOUR-PROJECT` with your Supabase project ref):

- `https://YOUR-PROJECT.supabase.co/rest/v1/messages?select=*`  
  Use **anon** key in headers: `apikey` + `Authorization: Bearer <anon key>`

- [ ] Response is `[]` or **403** (no rows)

Same check for `daily_battles` and `newsletter_signups` if you want.

---

## 3. Headers

**Dev Tools** → **Network** → select any request → **Headers** tab.

- [ ] **Content-Security-Policy** present and has no `'unsafe-inline'` in script-src/style-src
- [ ] **X-Frame-Options: DENY**
- [ ] **X-Content-Type-Options: nosniff**
- [ ] **Strict-Transport-Security** (HSTS) present

---

## 4. CORS (if you haven’t already)

**Cloudflare** → **Rules** → **Page Rules** (or Transform Rules).

- Add rule for `https://todaysdailybattle.com/*`:
  - Remove `Access-Control-Allow-Origin: *`
  - Set **Access-Control-Allow-Origin:** `https://todaysdailybattle.com` (and `https://www.todaysdailybattle.com` if you use www)

- [ ] Rule saved and active

---

## 5. /package.json blocked

**Visit:** https://todaysdailybattle.com/package.json

- [ ] Returns **404** (if you blocked it in Cloudflare). If you didn’t block it yet, you’ll still get 200 until you add the rule.

---

**Done?** Site is live, RLS is locked, headers and CORS are set, and package.json is hidden if you chose to block it.
