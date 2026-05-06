# Auth (Supabase) — Today's Daily Battle

Quick reference for sign-in, sign-up, and password reset. See **SUPABASE-SYNC-TABLES.md** for RLS and **docs/SECURITY-CHECKLIST-PRE-LAUNCH.md** for launch security.

---

## "Invalid credentials" — usually unverified email

Supabase returns **"Invalid credentials"** for both wrong password and **unverified email** (no separate "email not confirmed" message). Default hosted Supabase sends a confirmation email on signup; until the user clicks the link, login fails with "invalid credentials."

**Tell users:**
- *"Check your inbox for the verification link (and spam)."*
- Or use **Forgot password?** — the reset email link also confirms the address so they can set a new password and sign in.

**In the app:** After an invalid-credentials error we show a toast, the status message, **Resend verification email**, and **Forgot password?** so users can either verify or reset.

**Quick test:** Incognito → Sign up with new email → open verification link → Sign in. If it still fails, use Forgot password and complete the reset flow.

**Dashboard:** Supabase → **Authentication → Logs** to see attempts (e.g. "email not confirmed" or failed sign-in).

**Reset your own email (e.g. in console):**
```javascript
// In browser console on your site (Supabase client in scope) or via SDK:
supabase.auth.resetPasswordForEmail('your@email.com', { redirectTo: 'https://todaysdailybattle.com/reset.html' })
// Then check inbox → set new password on reset.html → log in.
```

---

*Last updated Feb 2026.*
