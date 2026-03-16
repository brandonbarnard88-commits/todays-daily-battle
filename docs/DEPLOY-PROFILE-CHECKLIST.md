# Deploy & Verify — Profile, Copy Button, Phase 4, Google Form

**Run this checklist after pushing. For full walkthrough, see [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md).**

---

## Pre-deploy

- [ ] `npm run build` — passes
- [ ] `npm run test:site` — all checks pass
- [ ] `npm run test:security` — defense checks pass
- [ ] Supabase: Run `supabase-profile-family-groups.sql` (if not done)
- [ ] Supabase: Run `supabase-profile-kid-loop-progress.sql` (Phase 4)

---

## Deploy

- [ ] Commit & push all changes
- [ ] `npm run build` → deploy dist/ to Cloudflare Pages (or your host)

---

## Post-deploy verification

### 1. Header & auth
- [ ] Sign in → header shows "Welcome, [name] · Account · Log Out"
- [ ] Click Account → lands on `/profile.html`
- [ ] Sign out → header reverts to "Sign In · Sign Up"
- [ ] Cross-tab: sign in on Tab A → Tab B header updates

### 2. Profile page
- [ ] Add kid (name + age) → appears in list
- [ ] Remove kid → disappears
- [ ] Create group → invite code appears
- [ ] Copy Code button → code copies, button shows "✓ Copied!" (green) for 2s
- [ ] Join group (different account or incognito) → enter code → membership confirmed
- [ ] Save church → info displays, Change shows form

### 3. Mobile
- [ ] Narrow window (480px) → profile sections stack, inputs full-width
- [ ] Copy Code button tappable, no overlap

### 4. Kids Corner Phase 4
- [ ] Sign in + add kid in profile
- [ ] Visit kids-corner.html → "Track progress for:" dropdown visible
- [ ] Select kid → earn star → switch device/kid → star persists

### 5. Edge cases
- [ ] Invalid invite code → "Code not found" or similar
- [ ] Supabase down / RPC missing → clear error message (e.g. "Could not generate invite code")

---

## Quick commands

```bash
npm run build
npm run test:site
npm run test:security
```

---

**Done?** Profile feature is live. Next: [Google Form setup](GOOGLE-FORM-SETUP.md) or [Phase 4 kid progress](PHASE-4-KID-PROGRESS.md).
