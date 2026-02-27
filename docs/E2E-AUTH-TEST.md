# E2E auth test (signup → verification → login → streak across devices)

Run this manually to confirm the full auth flow. If something breaks, use the Cursor prompt at the bottom to debug.

---

## 1. Signup

1. Open the site (e.g. https://todaysdailybattle.com or localhost).
2. Scroll to **“Create account or Log in”** or use the header **“Sign up free”**.
3. Enter a **new** email and a password (e.g. 8+ chars).
4. Click **Sign up free** (or **Create account**).
5. **Expected:** Message like “Check your email to confirm” or “Account created—check your inbox.”

**If you see:** “Auth is still loading” → Supabase client not ready. Prompt: *Debug Supabase client init and ensure ensureSupabaseLoaded() resolves before signup.*

**If you see:** “Invalid email” or no feedback → Check browser console for errors. Prompt: *Debug signup button handler and setAuthStatus in script.js; ensure email/password are read and Supabase signUp is called.*

---

## 2. Email verification

1. Open the inbox for the email you used.
2. Find the **Confirm your mail** (or similar) email from Supabase/your SMTP.
3. Click the confirmation link.

**If no email:** Check spam. Ensure **Redirect URLs** in Supabase (Auth → URL Configuration) include your site and `https://yoursite.com/reset.html`. See **VERIFICATION-EMAIL-TROUBLESHOOTING.md**.

**If the link 404s or fails:** Redirect URL or `AUTH_REDIRECT_BASE` in config may be wrong. Prompt: *Debug auth redirect: AUTH_REDIRECT_BASE and Supabase redirect URLs so confirmation link lands on the right page.*

---

## 3. Login

1. After clicking the confirmation link, you should land on the site (often already logged in).
2. If not, go to the homepage and click **Log in**.
3. Enter the same email and password → **Log in**.

**Expected:** Header shows **Log Out** (and optional “Battle Pro: Active” if applicable). No “Sign up free” / “Log in” in the auth strip.

**If login fails:** “Invalid email or password” after confirming → Try password reset (Forgot password?) or check Supabase Auth → Users that the user exists and is confirmed. Prompt: *Debug Supabase Auth login flow: session after signUp/confirm, getSession, and detectSessionInUrl.*

---

## 4. Streak saves (same browser)

1. While logged in, open **Today’s Battle** and trigger a streak (e.g. **Start Day 1** or use the daily verse so streak increments).
2. Note the streak count (e.g. “Streak: 1 day”).
3. **Log out** (header **Log Out**).
4. **Log in** again with the same account.

**Expected:** Streak is still there (e.g. “Streak: 1 day”). Data is loaded from Supabase `user_sync_data` (sync_key = `streak`).

**If streak resets:** Sync on login may not be running or may be failing. Prompt: *Debug streak sync: on login load user_sync_data for streak from Supabase and write to localStorage; ensure sync pull runs after auth state change.*

---

## 5. Streak across incognito / another browser

1. In **Browser A** (where you’re logged in with a streak), note the streak count.
2. Open **Browser B** (or an incognito window). Go to the same site.
3. **Log in** with the same email/password.
4. Open **Today’s Battle** / homepage.

**Expected:** Streak in Browser B matches Browser A (synced from Supabase).

**If streak is 0 or missing:** Sync on login in the new session may not be loading `user_sync_data`, or RLS may be blocking. Prompt: *Debug cross-device streak sync: fetch user_sync_data for auth.uid() on load when session exists; ensure RLS allows SELECT for authenticated user.*

---

## If still glitchy — Cursor prompt

Copy and paste (fill in the bracketed part if you have a specific error):

```
Debug [specific error or screen] in Supabase auth flow for todaysdailybattle.com.
Stack: Vanilla JS, Supabase Auth (email/password), script.js with signup/login,
detectSessionInUrl, getAuthRedirectBase, reset.html for password reset. Sync uses
user_sync_data (streak, prayer_list, etc.). Ensure signup → email verification →
login → streak persists across incognito/browser. Reference VERIFICATION-EMAIL-TROUBLESHOOTING.md and SUPABASE-SYNC-TABLES.md.
```

---

## Quick checklist

| Step | What to check |
|------|----------------|
| Signup | Form submits, “check email” or success message |
| Verification | Email received, link works, lands on site |
| Login | Log in with same email/password, session sticks |
| Streak same browser | Log out → log in, streak still there |
| Streak incognito/other browser | New session, log in, streak matches |
