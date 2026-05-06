# Church Verification — Outline

**Goal:** When a user links their church in profile (church name, location, pastor_email), optionally verify the connection by sending a confirmation email to the pastor.

---

## Current State

- **Table:** `profile_user_churches` (user_id, church_name, church_location, pastor_email, verified)
- **verified:** `false` by default; no flow to set `true` yet
- **Profile page:** User can save church info; "Change" to edit

---

## Verification Flow (Proposed)

### 1. User saves church with pastor_email

- Profile page → Save Church (name, location, pastor email)
- Row upserted with `verified = false`

### 2. Edge function: `verify-church-request`

**Trigger:** Called when user saves church with pastor_email (or via a "Request verification" button).

**Input:**
- `user_id` (from JWT)
- `church_id` or `user_id` (to identify the row)

**Logic:**
1. Fetch `profile_user_churches` row for user
2. If no `pastor_email`, return `{ ok: false, reason: 'no_pastor_email' }`
3. Generate a one-time token (e.g. `crypto.randomUUID()` or signed JWT, store in `church_verification_tokens` with expiry 7 days)
4. Send email to `pastor_email` with:
   - Subject: "Verify church connection — Today's Daily Battle"
   - Body: "A member listed [church_name] as their church. Confirm this connection: [Verify link]"
   - Verify link: `https://todaysdailybattle.com/verify-church.html?token=XXX`
5. Return `{ ok: true, message: 'Verification email sent' }`

### 3. Verification page: `verify-church.html`

- Reads `?token=XXX`
- Calls Edge function `verify-church-confirm` with token
- Function: validates token, sets `verified = true` on the row, deletes token
- Page shows: "Church connection verified. Thank you!"

### 4. Database additions

**Table: `church_verification_tokens`**
```sql
CREATE TABLE church_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: service_role only
```

**Edge functions:**
- `verify-church-request` — sends email, creates token
- `verify-church-confirm` — validates token, sets verified, deletes token

### 5. Email delivery

- **Option A:** Supabase Auth `sendEmail` (if available for custom templates)
- **Option B:** Resend / SendGrid / Mailgun — add API key to Edge Function secrets
- **Option C:** Supabase Edge + `fetch` to transactional email API

---

## Implementation Order

1. Create `church_verification_tokens` table
2. Edge function `verify-church-request` (token + email send)
3. Edge function `verify-church-confirm`
4. `verify-church.html` page
5. Profile page: add "Request verification" button when pastor_email present and verified=false
6. Wire profile save to optionally trigger verification request (or keep as manual button)

---

## Security Notes

- Token single-use, short expiry (7 days)
- Only pastor_email receives the link; user cannot self-verify
- RLS on `profile_user_churches` unchanged; verification is a trust signal, not an auth gate

---

## Future Enhancements

- Pastor dashboard: list of members who linked the church
- Church directory: public list of verified churches (opt-in)
- Bulk verification: pastor verifies multiple members at once
