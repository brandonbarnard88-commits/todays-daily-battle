# Launch Checklist — Gaps & Fixes (Quick List)

Everything else is live and tight; no major holes. You're **launch-ready** once these 3–4 steps land.

**Before deploy:** Run **docs/MANUAL-TESTING-CHECKLIST.md** (home, nav, auth, pricing, key pages). Use **docs/SMOKE-TEST-CHECKLIST.md** for visual consistency. For full legal + technical lockdown (no weak spots), see **docs/LOCKDOWN.md**.

---

1. **Run `supabase-rls-lockdown.sql` in Supabase**  
   → Secures DB (no anon access; users only see their own data).

2. **Deploy Firebase functions**  
   In `firebase-functions/`: `npm install` → `firebase deploy --only functions`  
   → Activates 9 AM verse push.

3. **Redeploy the site (including index.html with ARIA labels)**  
   → Accessibility fixes are already in the repo; a normal deploy ships them.

4. **Set Firebase config in `config.js` + FCM URL**  
   Fill `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, and `FCM_SUBSCRIBE_URL` (your deployed `savePushToken` URL).  
   → Enables the notification toggle to send tokens and receive 9 AM push.

5. **Optional:** Test push on a device (toggle on → grant permission → confirm token is sent and notification received).

---

Triple-checked: polish holds. Launch-ready once steps 1–4 are done.
