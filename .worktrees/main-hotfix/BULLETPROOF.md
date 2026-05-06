# Bulletproof checklist — todaysdailybattle.com

Run through this when you want the site rock-solid: errors handled, links working, mobile fast, offline supported, secure, streaks friendly, search never blank, analytics in place, backup documented, polish done.

---

## 1. Error handling

- **API fails (daily verse):** Fallback verse is **John 3:16**; message: "Today's verse didn't load from the server. Try again later—or you're seeing a fallback verse (John 3:16)." Plus **Try again** button that re-runs `renderDailyBattleCard()`.
- **Bible not loaded:** Card shows "Bible data not loaded" + Try again.
- **Network lost (prayer count / last prayer):** One automatic retry after 2–2.5s; then show "—" until next poll.

---

## 2. 404s and broken links

- **Test every page:** Run `node test-site.js` with a local server on port 8765 (`python3 -m http.server 8765` in another terminal). Fix any FAIL.
- **Internal links:** Check nav (Home, Search, Verse of the Day, Prayer Wall, Wins Report, Church, Pricing), footer, and in-page links (terms.html, privacy.html, contact.html, pricing.html).

---

## 3. Mobile / 3G

- **No lag on 3G:** Keep payloads small; verse card loads once. Images use Unsplash CDN; consider `loading="lazy"` on images if you add more.
- **Compress images:** Use WebP or optimized formats for any new assets; Unsplash URLs can use `&q=80` or similar.

---

## 4. Offline support

- **Service worker** caches: `/`, core HTML/CSS/JS, `kjv.json`, `daily_battles` API responses when requested.
- **Pro users:** Prefetch last 7 days of verses via **Offline prefetch** (script.js: `prefetchOfflineVerses`). Run once when online to fill cache.
- **Everyone:** Once a day is loaded, it’s cached; offline reload shows last cached verse (or John 3:16 if nothing cached).

---

## 5. Security (input sanitization)

- **Prayer wall / quick-pray / message board:** All user text is passed through `sanitizeUserInput()` then `truncateForDb()`. Strips `<script>`, `on*=`, `javascript:`, and HTML tags before save.
- **CSP** in HTML limits script/style sources. No raw user HTML rendered.
- **HTTPS** enforced by host (Cloudflare/Vercel/Netlify).

---

## 6. Streaks: pause, don’t wipe — Resume button

- **Missed a day:** Streak count goes to 0 but **past dates are not wiped**. Message: "Streak paused—we didn't wipe your progress. Tap **Resume** to start a new streak."
- **Resume** button (id `daily-battle-resume-btn`) calls `startChallenge()` so they start Day 1 again without losing history.

---

## 7. Search-by-emotion: no blank results

- **Extra emotions in MEANING_MAP:** gratitude, loneliness, guilt, overwhelm, jealousy, rest (plus existing hope, love, peace, fear, etc.).
- **Fallback:** If no verses match, show hope/love/peace topic verses; if still empty, show **John 3:16** so search never returns a blank list.
- **Quick topics** include Gratitude, Loneliness (and existing Grief, Anxiety, Hope, Love, etc.).

---

## 8. Analytics

- Use existing **`trackEvent(eventName, params)`** for GA4 (see .cursorrules). Examples: `verse_click`, `pro_signup`, `milestone_reached`, `share_daily_battle`.
- **Search:** Use **`trackSearchAnalytics(eventName, params)`** only—no raw query or user identity (see PRIVACY-ANALYTICS.md).
- Optional: Plausible or other privacy-friendly analytics; keep config in config.js (gitignore’d).

---

## 9. Backup (Supabase)

- **Daily DB backup:** In Supabase Dashboard → **Project → Database → Backups**, confirm scheduled backups are on (default for Pro; check plan).
- **Export manually:** Database → Backups → "Download backup" or use `pg_dump` if you have DB URL.
- **Critical tables:** `prayers`, `daily_battles`, `messages`, `newsletter_signups`, auth users. RLS and policies are in repo (`supabase-*.sql`).

---

## 10. Polish: favicon, meta, SEO

- **Favicon:** `link rel="icon" href="/icon.svg"` in index.html.
- **Meta title:** "Today's Daily Battle — The Bible Companion You'll Use Every Day" (or variant from LAUNCH-ASSETS.md).
- **Meta description:** "Daily KJV verse, prayer, and streak tracker to fight your battles—less scroll, more soul. Free."
- **OG/Twitter:** title, description, image set in index.html. Tweak per LAUNCH-ASSETS.md §2 if you want different SEO copy.

---

## Quick test script

1. **Local:** `python3 -m http.server 8765` → in another terminal `node test-site.js`. All OK?
2. **Bad internet:** Throttle to Slow 3G in DevTools → reload → verse should still show (fallback or cached).
3. **Offline:** DevTools → Network → Offline → reload → should show cached verse or fallback.
4. **Streak:** Start Day 1 → skip a day (or change date) → see "Streak paused" and **Resume** → tap Resume → Day 1 again.
5. **Search:** Type a random string → should get at least John 3:16 or hope/love/peace verses, never blank.

If anything breaks, fix from this doc and SITE-GUARD.md, then re-run tests.
