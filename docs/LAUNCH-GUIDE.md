# Launch Guide — Exact Steps

You're one normal deploy + three quick actions from launch. This doc has the exact steps. For a **verified current-state summary** and the four gatekeepers in one table, see **LAUNCH-STATE.md**. For **ready-to-paste announcement drafts** (Twitter, email, beta invite, pastor invite), see **LAUNCH-ANNOUNCEMENTS.md**.

---

## What’s left (summary)

| Step | Action | Result |
|------|--------|--------|
| 1 | Run `supabase-rls-lockdown.sql` in Supabase | Locks DB: no anon access, own-data only |
| 2 | Deploy Firebase functions | Activates 9 AM verse push |
| 3 | Set Firebase config + FCM URL in `config.js` | Enables toggle + token send |
| 4 | (Optional) Test push on real device | Confirm 9 AM verse arrives |

---

## 1. Exact Supabase SQL run steps

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Left sidebar: **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase-rls-lockdown.sql` from this repo (project root).
5. Copy its **entire contents** and paste into the SQL Editor.
6. Click **Run** (or Cmd/Ctrl+Enter).
7. Check for green success or any errors. If a policy/table is missing, the script may show "relation does not exist" for that part—fix or comment out that section, then re-run the rest.

**Result:** RLS is on for `daily_battles`, `messages`, `message_reports`, `newsletter_signups`, `saved_verses`, `saved_collections`, `saved_verse_collections`. Anon can’t read/write; authenticated users only see their own rows.

---

## 2. Firebase deploy command line

From your **project root** (not inside `firebase-functions/`):

```bash
# One-time: install Firebase CLI if you haven’t
# npm install -g firebase-tools

# Login (one-time)
firebase login

# Link this folder to your Firebase project (one-time)
firebase use --add
# Pick your project and optionally give it an alias (e.g. default)

# Deploy only functions
cd firebase-functions
npm install
cd ..
firebase deploy --only functions
```

After deploy, note the URL for `savePushToken`, e.g.:

`https://us-central1-YOUR_PROJECT.cloudfunctions.net/savePushToken`

Use that as `FCM_SUBSCRIBE_URL` in `config.js`.

**Optional env for 9 AM verse:** In Firebase Console → Functions → sendDailyVerseNotification → Environment variables (or `firebase functions:config:set`), set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` so the job can fetch today’s verse from Supabase.

---

## 3. Push test (toggle → permission → token)

**Manual check:**

1. Deploy the site with Firebase config and `FCM_SUBSCRIBE_URL` set in `config.js`.
2. On a **real phone or desktop** (HTTPS), open the site and go to the streak / notification section.
3. Turn **on** the “8 AM streak reminder” (or push) toggle.
4. When prompted, click **Allow** for notifications.
5. **Verify token was sent:**  
   - Option A: In Firebase Console → Firestore → `push_tokens` — a new document should appear.  
   - Option B: In your backend logs for `savePushToken`, confirm a 200 and that the token was stored.
6. **Verify 9 AM push:** Wait until 9 AM (America/Chicago) or temporarily change the schedule in `sendDailyVerseNotification.js` to “every minute” for testing, deploy, then wait 1 minute and check that the notification appears.

**Quick console check (token exists):**  
In the browser console on the site, after enabling the toggle and granting permission:

```javascript
// If you expose the token for debugging (don’t in production):
// navigator.serviceWorker.ready.then(r => r.pushManager.getSubscription()).then(s => console.log(s));
// Or just confirm no errors and check Firestore.
```

---

## 4. Launch announcement (draft)

**Short (social / email):**

> **Today’s Daily Battle is live.** One verse, one moment, every day—less scroll, more soul. Search by topic, get the daily battle, and save verses that hit. Free. [todaysdailybattle.com](https://todaysdailybattle.com)

**Slightly longer (blog / landing):**

> **We’re live.** Today’s Daily Battle is the Bible companion built for real life: topic search, today’s verse and prayer, streaks, and tools for families and pastors. Install the app for offline verses and optional 9 AM reminders. Everything you need in minutes, not hours. [Try it free →](https://todaysdailybattle.com)

---

## What this secures

- **Security:** Headers + hidden admin + RLS → no client-side escalation, no public admin targeting, DB locked down.
- **Privacy:** Users control their own data; anon blocked.
- **UX:** Offline verses/prayers, push reminders, installable PWA—daily habit sealed.
- **Accessibility:** Zoom + ARIA (after deploy) → screen-reader friendly.

---

## Next steps (order)

1. **Push to main** → Cloudflare Pages deploys → ARIA and current site ship.
2. **Run RLS SQL** → DB secure.
3. **Deploy Firebase functions + set config** → push live.
4. **Test push** → confirm 9 AM verse arrives.

After that, you’re launch-ready.

---

## Supabase SQL Editor — screenshot-friendly steps

1. Go to supabase.com/dashboard and open your project.
2. Left sidebar → **SQL Editor**.
3. Click **+ New query**.
4. Open `supabase-rls-lockdown.sql` in your editor, select all, copy.
5. Paste into the SQL Editor, click **Run** (or Cmd/Ctrl+Enter).
6. Green = success. Red = read error (e.g. relation does not exist).

---

## Firebase deploy — common issues

- **Permission denied:** Run `firebase login`.
- **No project active:** Run `firebase use --add`.
- **Node error:** Use Node 18+.
- **No tokens in Firestore:** Check FCM_SUBSCRIBE_URL; toggle on and allow permission.
- **9 AM not firing:** Check function logs; for testing use schedule every minute.

---

## Suggested next actions (pick one)

1. Do #1 (RLS SQL) now. 2. Do #2 (Firebase deploy). 3. Test push. 4. Use **LAUNCH-ANNOUNCEMENTS.md** for drafts.
