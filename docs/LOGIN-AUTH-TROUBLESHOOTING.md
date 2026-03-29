# Supabase login / auth UI troubleshooting

## Symptom

- Site shows **logged-in state** (header: "Forgot password? Log Out", Battle Pro "Active", streak visible) even on **fresh load** or **incognito**.
- **No signup/login form** — looks like you're already in, but new visitors (or incognito) should see "Log in to save your streak & sync devices" and **Sign up free** / **Log in** buttons.
- Can feel like a **session glitch** or **Supabase hiccup**.

---

## Quick checks (no code)

1. **Incognito/private** — Open https://todaysdailybattle.com. You should see the auth CTA and form. If you see Log Out and no form, the problem is cached/stale session or wrong UI state.
2. **Console (F12 → Console)** — Look for "Supabase auth failed", 500/502, or token/refresh errors.
3. **After signup** — If "check email" appears, verification email may be delayed; check spam and Supabase Dashboard → Auth → Users (confirm email sent).
4. **Force logout** — Click **Log Out** in header → page reload. Should drop to unauth and show email/password + Sign up / Log in.

---

## Supabase-side (common 2026)

- **Outages:** Some US regions had 500s/502s on auth (e.g. Feb 12–28 reports). If project is US-West/East, retry later or check [supabase.com/status](https://supabase.com/status).
- **Browser console: `400` on `authorize`:** Usually Supabase Auth rejecting OAuth because **`redirect_to` is not in Redirect URLs**. Google/Apple then fail to start. Fix: Supabase → Authentication → URL Configuration → add the exact return URLs you use (including `www` vs apex if both exist). The app sends OAuth users to **`/login.html?next=…`** (same as the login page), so allow e.g. `https://todaysdailybattle.com/login.html` or a wildcard your project supports (e.g. `https://todaysdailybattle.com/**`). Also list `https://todaysdailybattle.com/reset.html` for password reset.
- **Redirect URLs:** In Supabase → Authentication → URL Configuration, ensure your site and reset URLs are listed (e.g. `https://todaysdailybattle.com`, `https://todaysdailybattle.com/login.html`, `https://todaysdailybattle.com/reset.html`). Match `AUTH_REDIRECT_BASE` / redirect base used in app.
- **Email provider:** If using Resend/Brevo etc., confirm emails are sending (Auth → Users; test signup).
- **CLI:** `supabase auth status` if you use the CLI, to confirm session/redirect config.

---

## Code fix applied in this repo

1. **Session validation on load**  
   `getSession()` is from local cache. An expired or invalid token can still return a session and show "logged in" with no form. On init we now:
   - Call `getSession()` then **`getUser()`** to validate with the server.
   - If `getUser()` errors or returns no user → **`signOut()`** and treat as unauthenticated → **`updateAuthUI(null)`** so the login/signup form shows.

2. **Logout forces UI to unauth**  
   After **Log Out**, we call **`updateAuthUI(null)`** so the form and CTAs show even if `onAuthStateChange` is delayed.

---

## Cursor prompt for a new agent

Use this when handing off to a new agent to debug further:

```
Debug Supabase login: No form shows.

- On fresh load or incognito, the site shows logged-in state (Log Out, Battle Pro Active, streak) and no signup/login form. It should show "Log in to save your streak & sync devices" and Sign up / Log in buttons.
- We already validate session on load with getUser(); if invalid we signOut and updateAuthUI(null). Logout click also calls updateAuthUI(null).
- Check: script.js auth init (getSession → getUser → updateAuthUI), updateAuthUI(session) for correct show/hide of #auth-section inputs and #logout-btn. Ensure no other code hides the auth form or forces logged-in state. Check console for Supabase/network errors. If session is valid but form still missing, look for CSS (e.g. .hidden) or DOM that hides #auth-section / signup-btn / login-btn.
```

---

## References

- CONFIG.md — Supabase URL/anon key, redirects.
- CLOUDFLARE-SETUP.md — Redirect URLs for auth.
- index.html — `#auth-section`, `#auth-details`, `.daily-battle-signin-cta`, `#signin-nudge-banner`.
