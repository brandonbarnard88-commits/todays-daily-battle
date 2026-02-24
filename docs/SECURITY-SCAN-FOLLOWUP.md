# Security Scan Follow-Up (Feb 23, 2026)

Re-scan after role/header fixes. **Delta:** Role escalation fixed, HTTPS stable, headers in place. Remaining items below.

---

## Already done (verify if scanner still flags)

| Finding | Status |
|--------|--------|
| **Supabase anon reads** | RLS script was run in Supabase SQL Editor. Verified: anon key returns `[]` on `messages` (curl test). If scanner still reports 200 with data, re-run `supabase-rls-lockdown.sql` or confirm scanner is not cached. |
| **security.txt** | File exists at `/.well-known/security.txt` with Contact, Preferred-Languages, Expires, Canonical. If 404, check deploy and path. |

---

## High – XSS surface in script.js

- **Risk:** Many `innerHTML` / `insertAdjacentHTML` (and similar) sinks; not every path uses `escapeHtml()`.
- **Fix (phased):**
  1. Audit: Search `script.js` for `innerHTML`, `insertAdjacentHTML`, `document.write`. For each, ensure user-controlled data (prayers, notes, messages, search input) is passed through `escapeHtml()` or use `textContent` / `createTextNode` where no HTML is needed.
  2. Optional: Use DOMPurify for rich content (small dependency).
- **Urgency:** Medium–high before large user-generated content.

---

## Medium – CSP `unsafe-inline`

- **Risk:** Inline `<script>` and `<style>` allowed; weakens XSS protection.
- **Fix:** Move inline scripts/styles to external files, or use nonces: `<script nonce="…">` and CSP `script-src 'nonce-…'`. Start with nonces if you keep inline for config/bootstrap.
- **Urgency:** Medium; higher once escaping is solid.

---

## Medium – Access-Control-Allow-Origin: * on HTML

- **Risk:** Some HTML responses send `ACAO: *`; allows cross-origin framing/requests.
- **Fix:** In Cloudflare (Page Rules / Transform Rules), do not set `Access-Control-Allow-Origin: *` for HTML routes. Use `'self'` or omit for same-origin only. Keep CORS only where needed (e.g. API).

---

## Low – package.json / .env / .git

- **Risk:** `/package.json` (or similar) publicly accessible; version/dependency info leak.
- **Fix:** Cloudflare rule to block or return 404 for `/package.json`, `/.env`, `/.git/*` (if any are exposed). Static site may not serve these; confirm and block if they are.

---

## Launch safety (summary)

1. **RLS** – Already run and verified; re-check anon access if scanner still reports it.
2. **XSS** – Audit and harden `innerHTML`/insertAdjacentHTML paths; use escapeHtml or safe APIs.
3. **CSP** – Tighten with nonces or externalized scripts when feasible.
4. **ACAO** – Restrict to same-origin (or specific origins) for HTML.
5. **security.txt** – Already present; ensure path is correct after deploy.

After RLS confirmation and a focused XSS pass, the site is in good shape for production.
