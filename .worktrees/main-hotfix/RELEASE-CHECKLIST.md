# Release Checklist (Security-First)

Security for users and builders comes first. Run this checklist before each production push.

## 1) Local build and tests

- [ ] `npm run build`
- [ ] `npm run test:site`
- [ ] Confirm output: "All checks passed."

## 2) Secrets and config guard

- [ ] No `service_role`, Stripe secret, or Turnstile secret committed.
- [ ] `config.js` contains only public values (anon/site/public keys).
- [ ] `.env`/private secrets are not staged.

## 3) Supabase schema + RLS

- [ ] Run `supabase-rls-lockdown.sql` in Supabase SQL Editor.
- [ ] Confirm `user_prayers` table exists with required columns:
  - `user_id uuid`
  - `created_at timestamptz`
  - `village_code text`
- [ ] Confirm RLS is enabled and forced for `user_prayers`.
- [ ] Confirm policies enforce `auth.uid() = user_id` for select/insert/update.

## 4) RLS verify (zero trust)

- [ ] With anon key, query `user_prayers` returns no private rows (`[]` or 403).
- [ ] With authenticated user token, only own rows are visible.
- [ ] Confirm village aggregation does not expose user identity fields.

## 5) Mobile smoke tests

- [ ] Pray button:
  - overlay appears ("God heard this.")
  - overlay duration is ~3s
  - counter increments only after overlay completes
- [ ] Prayer badge:
  - bottom-right badge updates
  - tap opens modal
  - close button, backdrop tap, and Escape all close cleanly
- [ ] Catch-up carousel:
  - appears when 5+ missed days exist
  - uses avatar progression (not default character)
  - progresses by auto-play and swipe

## 6) Offline/PWA safety

- [ ] `service-worker.js` cache version bumped for release.
- [ ] New critical assets are precached (`pray.js`, `streak.js`, `daily-tile.js`, `cartoon.js`, modal/highlights files).
- [ ] Reload once after deploy to validate fresh service-worker activation.

## 7) Git hygiene and rollback

- [ ] Keep commits scoped (security/data, UI, content).
- [ ] Tag release commit in notes.
- [ ] Record rollback command:
  - `git revert <release_commit_hash>`
  - `git push origin main`

---

If any security check fails, stop release and fix before push.
