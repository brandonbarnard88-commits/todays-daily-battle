# Verification email not arriving (Supabase Auth)

Supabase sends sign-up and password-reset emails. If users don't get them, fix these in the **Supabase Dashboard** (your project → **Authentication**).

---

## 1. Redirect URLs (required for links to work)

1. Go to **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add (if missing):
   - `https://todaysdailybattle.com`
   - `https://todaysdailybattle.com/`
   - `https://todaysdailybattle.com/reset.html`
   - `https://todaysdailybattle.org`
   - `https://todaysdailybattle.org/`
   - `https://todaysdailybattle.org/reset.html`
3. Save.

Without these, the confirmation link in the email may point to the wrong place or be rejected.

**Optional:** In `config.js` set `AUTH_REDIRECT_BASE: 'https://todaysdailybattle.com'` so signup/reset emails always use this origin even when the app is opened from another URL (e.g. localhost or a different domain).

---

## 2. Default Supabase email (often goes to spam)

Supabase’s built-in email uses a shared sending domain. Mail often lands in **spam** or is rate-limited.

- Ask users to **check spam/junk** and add the sender to contacts.
- For reliable delivery, use **custom SMTP** (step 3).

---

## 3. Custom SMTP (recommended for production)

1. In Supabase: **Project Settings** (gear) → **Authentication** → **SMTP Settings**.
2. Enable **Custom SMTP** and fill in your provider (e.g. SendGrid, Mailgun, Resend, or your host’s SMTP).
3. Save. New verification and password-reset emails will send via your SMTP.

Example providers:

- [Resend](https://resend.com) – simple API, good free tier  
- [SendGrid](https://sendgrid.com) – free tier available  
- [Mailgun](https://www.mailgun.com) – free tier available  

Use the **SMTP** credentials from the provider (host, port, user, password). Supabase docs: [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

---

## 4. Optional: allow login without verification

If you want users to log in **before** confirming email (no verification email required):

1. **Authentication** → **Providers** → **Email**.
2. Turn **off** “Confirm email”.
3. Save.

New signups can log in immediately; no verification email is sent. (You can turn “Confirm email” back on later when SMTP is set up.)

---

## 5. Resend verification (already in the app)

After signup, if the user didn’t get the email, they see **“Resend verification email”**. Clicking it calls `supabase.auth.resend({ type: 'signup', email })`. That sends the same email again (still subject to spam/SMTP behavior above).

---

## Quick checklist

| Check | Where |
|-------|--------|
| Redirect URLs include `https://todaysdailybattle.com`, `https://todaysdailybattle.org`, and `.../reset.html` for each | Auth → URL Configuration |
| Users checked spam/junk | — |
| Custom SMTP configured (recommended) | Project Settings → Auth → SMTP |
| Or: “Confirm email” off for instant login | Auth → Providers → Email |
