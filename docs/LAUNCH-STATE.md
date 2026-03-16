# Launch State — Final Double-Check

Verified summary of current state, what's left, and why you're launch-ready once those four items are done.

---

## Current state (verified)

- **Core product:** Fully live and polished — daily verse, streaks, prayers, search/topics, Wins Report v2 (graphic/share/download), Church Center basics with realtime add/mark.
- **Offline:** SW caches all key pages (daily, wins-report, church, reading-plan, topics); 7-day prefetch/auto for Pro; reconnect sync + toast.
- **Sync:** UI accurate ("Synced" vs "Saved"), cross-device flow solid.
- **Security/Privacy:** Headers in place, admin email hidden, privacy page clear, ARIA labels in repo (ship on next deploy).
- **Accessibility:** Zoom allowed, skip link, ARIA on dynamic areas, focus-visible — good baseline.
- **Analytics:** Strong coverage (page views, adds, downloads, church interactions).
- **Polish:** Global vars ensure consistent buttons/cards/spacing/dark mode across pages.

---

## What's left (the four gatekeepers)

Everything else is done. These are the final steps.

| # | Item | Where / how | Secures / enables | Time |
|---|------|-------------|-------------------|------|
| 1 | Run `supabase-rls-lockdown.sql` | Supabase Dashboard → SQL Editor → paste script → Run | DB locked — anon blocked, users only see/edit own data | 2–5 min |
| 2 | Deploy Firebase functions + set config | `firebase login` → `firebase use --add` → `cd firebase-functions && npm install` → `firebase deploy --only functions`; then set FIREBASE_* and FCM_SUBSCRIBE_URL in config.js | Secure push; FCM tokens server-side; 9 AM verse live | 10–20 min |
| 3 | Test push on a device | Toggle on → Allow permission → check Firestore push_tokens; optionally test with "every minute" schedule | Confirms end-to-end delivery | 5–15 min |
| 4 | Push to main → Deploy | git push to main → Cloudflare Pages auto-deploys | ARIA and latest code live | 1–5 min |

---

## What this final push secures / enables

- **Security:** RLS + hidden admin + headers = locked DB/auth, no client escalation, no public admin targeting.
- **Privacy:** Users own their data; anon blocked; push tokens stored securely server-side.
- **UX:** Daily 9 AM verse nudge (opt-in), offline verses/prayers, installable PWA — habit locked in.
- **Accessibility:** ARIA labels live (post-deploy) + zoom = inclusive for all users.
- **Growth:** Push notifications + Wins Report sharing = organic reach.

---

## You're launch-ready once these are done

After #1–4 + push:

- Site is secure, private, accessible, offline-capable, push-enabled, and polished.
- No blockers remain.
- You can share with beta testers, pastors, social groups, or announce publicly.

---

## Suggested next actions (pick one)

1. **Do #1 (RLS SQL) right now** — highest security win, takes ~5 minutes.
2. **Do #2 (Firebase deploy)** if you're ready to enable push.
3. **Test push** if you want to see it work end-to-end.
4. **Draft announcement** — use the drafts in LAUNCH-GUIDE.md or ask for a short social/email/blog version.

Exact step-by-step for each item is in **docs/LAUNCH-GUIDE.md**. For RLS walkthrough, device test checklist, and beta invite copy, see **docs/BETA-LAUNCH-GUIDE.md**.

---

## Quick final reality check

- You are **launch-viable today** once the four items are completed (low–medium effort, ~1–2 hours total if things go smoothly).
- The site already delivers a complete free experience plus meaningful Supporter/Pro perks.
- Security/privacy/accessibility foundations are in place (headers, RLS pending run, ARIA pending deploy, offline reliable).
- UX is polished and cohesive (global vars, realtime prayer basics, Wins v2 graphic/share).

After the four steps you can confidently share the link with beta testers, pastors, social groups, or announce publicly.

**Suggested immediate next action:** Pick one from the list above and do it today. Start with **#1 (RLS SQL)** — highest security ROI, &lt;10 min.
