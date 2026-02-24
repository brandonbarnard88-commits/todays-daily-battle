# Post-Push Checklist (~2 mins)

After you `git push` and the site redeploys, run through this.

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
