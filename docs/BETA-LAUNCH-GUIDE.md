# Beta Launch Guide — Today's Daily Battle

**Last updated:** March 15, 2026

Step-by-step checklist to go from current state to beta launch (share with 5–10 people).

---

## Must-Do Before Beta (~15–30 min total)

### 1. Run RLS SQL in Supabase (~7–8 min)

**What it does:** Row Level Security ensures anon users can't read personal data; authenticated users only see their own rows. Prayers keep anon INSERT (quick-pray) and anon SELECT (verse echo + prayer wall) via the follow-up script.

**Steps:**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **SQL Editor** (left sidebar)
2. **First script:** Paste contents of `supabase-rls-lockdown.sql` → **Run**
3. Look for green "Query executed successfully" (or similar). If errors, note line/table and fix (common: missing policy names or copy-paste syntax)
4. **Second script:** New query tab → paste `supabase-prayers-anon-read.sql` → **Run** → confirm success

**Post-run checks:**

| Check | How |
|-------|-----|
| Anon blocked on messages | Incognito → Prayer Wall / Message Board → empty or "You're alone with Him" |
| Verse echo / prayer wall work | Incognito → tap ♥ → count updates, no 403. Anon can read public prayers. |
| Auth still works | Log in → sync status "Synced", progress loads. Private data only when logged in. |

---

### 2. Device Test on Phone (~10 min)

Use your phone (iPhone or Android). Add to Home Screen first for best PWA behavior.

**Add to Home Screen:** Open https://todaysdailybattle.com → Share → Add to Home Screen (or menu → Add to Home) → confirm icon appears.

**Offline (airplane mode):**

- [ ] Open app from home screen → daily verse loads from cache (no error)
- [ ] Voice: Tap read-aloud on homepage verse → plays (cached). Kids modal (?story=daniel) → Tap to hear works
- [ ] Progress: Mark a day complete on a plan → streak toast shows → close/reopen → progress persists
- [ ] Wins: wins.html → stats show last-known values
- [ ] Prayer wall: View/add prayer → saves locally

**Online:**

- [ ] Homepage: Daily verse loads fresh, gentle nudge (if simulated last-seen yesterday), voice pause/resume works
- [ ] Plans: Mark day complete → streak toast ("+1/+N to your streak! 🔥")
- [ ] Kids Corner: Search "noah" → entry shows → modal opens → Tap to hear plays/pauses/resumes
- [ ] Wins: Stats update → Copy My Wins → paste → year dynamic, "God is faithful" present
- [ ] Easter: plans.html → teaser/banner → dismiss once → reload → gone
- [ ] Auth: Log in/out → sync status UI updates, private data only visible when logged in

**Edge cases:**

- [ ] Switch days on plan → voice cancels cleanly
- [ ] Background app → reopen → voice resumes or stops gracefully
- [ ] Low battery/data → offline fallback message appears

If anything fails, note the behavior (e.g., "offline voice silent") for debugging.

---

### 3. Firebase Functions + Config (~15 min, optional for beta)

Only needed if you want 9 AM push notifications. If skipping: defer and launch without push. If doing: deploy functions → set env vars (Supabase URL/key, FCM) → test one push. See **LAUNCH-GUIDE.md** for exact steps.

---

### 4. Final Deploy (~2 min)

- Commit any last tweaks (if you made changes during testing)
- `git push origin main`
- Wait 1–2 min for Cloudflare Pages auto-deploy
- Purge cache (Cloudflare → Caching → Purge Everything)
- Hard refresh (Cmd+Shift+R / Ctrl+F5) → confirm latest (wins.html year, voice toggle, nudge)

---

## Beta Share (After Blockers)

Send to 5–10 trusted people (family, church, recovery group).

**Short invite:**

> Hey! Built a quiet daily Scripture site during recovery—no ads, no tracking, offline-first. One verse + real talk + action each day, plans, kids stories, progress tracking. Would love your thoughts: [todaysdailybattle.com](https://todaysdailybattle.com) — try for a few days. Does it feel encouraging? Any bugs/missing things? Thanks—means a lot. 🙏

**More variations:** personal/recovery-group, church/small group, ultra-short — see full list below.

---

## Post-Beta Priorities (based on feedback)

- Pro Wins Report graphic/export
- 2–3 new Kids stories (Good Samaritan, Prodigal Son, Resurrection)
- Voice rate slider (0.8x–1.2x) + auto-pause timer
- Shop "Coming soon" page
- Walkthrough video
- More prominent PWA prompt
- Mood picker → verse suggestion
- Battle Buddy pairing

---

## Beta Invite Copy — Full Variations

### Short (text / DM)

> Hey! Built a quiet daily Scripture site during recovery—no ads, no tracking, offline-first. One verse + real talk + action each day, plans, kids stories, progress tracking. Would love your honest thoughts: [todaysdailybattle.com](https://todaysdailybattle.com) — try for a few days. Does it feel encouraging? Any bugs or missing things? Thanks—means a lot. 🙏

### Personal / recovery-group (close friends)

> Hey [name], been working on this little site called Today's Daily Battle during my recovery time. It's just one KJV verse a day with some real talk, action steps, and prayer—no noise, no tracking, works offline. Added plans, kids stories, and progress tracking too. Would really value your honest feedback—does it help, encourage, or feel off anywhere? Link: [todaysdailybattle.com](https://todaysdailybattle.com) — no pressure, just trying to make something useful. Thanks for being part of this journey with me. ❤️

### Church / small group

> Hi everyone, put together a simple daily Scripture tool called Today's Daily Battle—one KJV verse each day with commentary, action, and prayer. No ads, no tracking, works offline, has plans (7–40 days), kids stories with audio, progress tracking, and a wins summary. Would love a few of you to try it for a week and share what works/what could be better. Link: [todaysdailybattle.com](https://todaysdailybattle.com) — thanks for any time/feedback, it's all for encouragement. 🙏

### Recovery / support group

> I built a quiet daily Scripture site during recovery—Today's Daily Battle. One verse, real talk, no hype. Works offline, no ads, no tracking. Has plans for fear, peace, strength, plus kids stories. Would love your honest feedback: [todaysdailybattle.com](https://todaysdailybattle.com) — try it for a few days. Does it feel helpful? Any bugs? Thanks. 🙏

### Ultra-short (one-liner)

> Built a quiet daily Scripture site—no ads, offline-first. One verse + real talk each day. Feedback welcome: [todaysdailybattle.com](https://todaysdailybattle.com) 🙏

---

## Related Docs

- **LAUNCH-STATE.md** — four gatekeepers summary
- **LAUNCH-GUIDE.md** — full launch steps (Firebase, push test)
- **LAUNCH-ANNOUNCEMENTS.md** — public announcement drafts
- **SITE-STATUS-FULL.md** — full inventory and what's left
