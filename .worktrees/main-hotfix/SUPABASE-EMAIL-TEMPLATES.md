# Supabase Auth: Custom SMTP & Email Templates

Configure **custom SMTP** (Microsoft 365 primary, Resend fallback) and **custom email templates** for confirmation and password reset in the Supabase Dashboard. Supabase replaces `{{ .ConfirmationURL }}` (and `{{ .Email }}`, `{{ .SiteURL }}`) automatically.

**Do not commit SMTP passwords or app passwords to the repo.** Set them only in Supabase Dashboard or environment secrets.

---

## 1. SMTP setup

### Primary: Microsoft 365

1. **Supabase Dashboard** → **Project Settings** (gear) → **Authentication** → **SMTP Settings**.
2. Enable **Custom SMTP**.
3. Fill in:
   - **Host:** `smtp.office365.com`
   - **Port:** `587`
   - **Username:** `support@todaysdailybattle.com`
   - **Password:** Use a [Microsoft 365 App Password](https://support.microsoft.com/en-us/account-billing/using-app-passwords-with-apps-that-don-t-support-two-step-verification-5896ed9b-4263-e681-128a-a6f2979a7944) (not your normal account password). Store it only in the Dashboard; do not put it in the repo.
4. **Sender email:** `support@todaysdailybattle.com` (or same as username).
5. Save and send a test (e.g. sign up with a test address).

If M365 has delivery issues (spam, rate limits, or TLS errors), use Resend below.

### Fallback: Resend

If Microsoft 365 fails or is unreliable:

1. Create an account at [Resend](https://resend.com) and add/verify your domain.
2. In Resend: **API Keys** → create key; copy it.
3. **Supabase** → **Project Settings** → **Authentication** → **SMTP Settings**.
4. Resend’s SMTP (from their docs):
   - **Host:** `smtp.resend.com`
   - **Port:** `587`
   - **Username:** `resend`
   - **Password:** your Resend API key
   - **Sender:** e.g. `support@todaysdailybattle.com` (must be a verified domain in Resend).
5. Save and test again.

---

## 2. Email templates (Dashboard)

Go to **Authentication** → **Email Templates**. Edit **Confirm signup** and **Reset password**. Paste the subjects and bodies below. Supabase uses [Go templates](https://supabase.com/docs/guides/auth/auth-email-templates); the only placeholder you need for the link is `{{ .ConfirmationURL }}`.

---

### Confirmation (signup) email

**Template:** Confirm signup  

**Subject:**
```
Confirm your Daily Battle account — start fighting today
```

**Body (HTML)** — paste into the template editor:
```html
<h1>Welcome, warrior!</h1>
<p>You're one click from syncing your streak and joining the battle. Click below to verify:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm & Log In</a></p>
<p>If the link doesn't work, copy-paste: {{ .ConfirmationURL }}</p>
<p>Less scroll, more soul. Let's go.</p>
<p>— Today's Daily Battle Team</p>
```

**Plain-text fallback** (for clients that don’t support HTML; use if your dashboard has a plain-text field):
```
Welcome, warrior!

You're one click from syncing your streak and joining the battle. Open this link to verify:

{{ .ConfirmationURL }}

If the link doesn't work, copy-paste the URL above into your browser.

Less scroll, more soul. Let's go.

— Today's Daily Battle Team
```

---

### Reset password email

**Template:** Reset password  

**Subject:**
```
Reset your Daily Battle password
```

**Body (HTML)**:
```html
<h1>Reset time</h1>
<p>Click to set a new password:</p>
<p><a href="{{ .ConfirmationURL }}">Set New Password</a></p>
<p>If the link doesn't work, copy-paste: {{ .ConfirmationURL }}</p>
<p>Stay strong.</p>
<p>— Today's Daily Battle Team</p>
```

**Plain-text fallback:**
```
Reset time

Click to set a new password. Open this link:

{{ .ConfirmationURL }}

If the link doesn't work, copy-paste the URL above into your browser.

Stay strong.

— Today's Daily Battle Team
```

---

## 3. Placeholders (Supabase replaces these)

| Placeholder | Meaning |
|------------|--------|
| `{{ .ConfirmationURL }}` | Full URL to confirm signup or reset password (use in `<a href="...">` and in copy-paste line). |
| `{{ .Email }}` | User’s email (optional, for personalization). |
| `{{ .SiteURL }}` | Site URL from Auth → URL Configuration. |

Do **not** put spaces inside the braces; use `{{ .ConfirmationURL }}` exactly.

---

## 4. Redirect URLs

Ensure **Authentication** → **URL Configuration** → **Redirect URLs** includes:

- `https://todaysdailybattle.com`
- `https://todaysdailybattle.com/reset.html`
- (and same for `.org` if used)

So confirmation and reset links land on your site. See **VERIFICATION-EMAIL-TROUBLESHOOTING.md** for the full list.

---

## 5. Optional: Management API

To set templates via API (e.g. in CI), use the [Management API](https://supabase.com/docs/guides/auth/auth-email-templates) PATCH `config/auth` with keys such as:

- `mailer_subjects_confirmation`
- `mailer_templates_confirmation_content`
- `mailer_subjects_recovery`
- `mailer_templates_recovery_content`

Escape quotes in JSON (e.g. `\"` inside HTML strings). The HTML bodies above can be minified to a single line for the API.

---

*Last updated Feb 2026.*
