# Deploy Guide — Profile, Google Form, Phase 4 Kid Progress

**One walkthrough for all three.** Run in order.

---

## Step 1: Supabase SQL (run first)

In [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**:

1. **Profile Family & Groups** (if not already run):
   ```
   Run: supabase-profile-family-groups.sql
   ```
   Creates: `profile_kids`, `profile_bible_study_groups`, `profile_group_members`, `profile_user_churches`, RPCs.

2. **Kid Loop Progress** (Phase 4):
   ```
   Run: supabase-profile-kid-loop-progress.sql
   ```
   Creates: `profile_kid_loop_progress` for per-kid Kids Corner stars.

---

## Step 2: Google Form (optional but recommended)

1. **Create the form** — Follow [docs/GOOGLE-FORM-SETUP.md](GOOGLE-FORM-SETUP.md)
   - Title: Kids Corner Animation Feedback
   - Dropdown: 36 story options (list in doc)
   - Paragraph: "What's wrong / mismatched?"
   - Submit a test response to get entry IDs

2. **Get your values:**
   - Viewform URL: `https://docs.google.com/forms/d/e/YOUR_ID/viewform`
   - storyEntry: `entry.XXXXXXXXX` (dropdown)
   - commentEntry: `entry.YYYYYYYYY` (paragraph)

3. **Edit `loop-feedback-config.js`** — Replace `null` with your config:
   ```javascript
   window.LOOP_FEEDBACK_FORM = {
     url: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
     storyEntry: 'entry.XXXXXXXXX',
     commentEntry: 'entry.YYYYYYYYY'
   };
   ```

4. **Verify:** Kids Corner → click "⚠ Report mismatch" on any loop → form opens with story prefilled.

---

## Step 3: Build & deploy

```bash
npm run build
```

Deploy `dist/` to Cloudflare Pages (or your host). Commit & push your changes first.

---

## Step 4: Post-deploy verification

### Profile & auth
- [ ] Sign in → header: "Welcome, [name] · Account · Log Out"
- [ ] Account → `/profile.html`
- [ ] Add kid, create group, copy code, join group, save church
- [ ] Sign out → header reverts

### Kids Corner Phase 4
- [ ] Sign in + add kid in profile
- [ ] Visit `/kids-corner.html` → see "Track progress for:" dropdown
- [ ] Select kid → earn a star → switch to "This device" → back to kid → star persists

### Google Form (if wired)
- [ ] Kids Corner → Report mismatch → form opens, story prefilled

### Mobile
- [ ] Profile: sections stack, copy button tappable
- [ ] Kids Corner: kid selector usable

---

## Quick reference

| Item | File / Action |
|------|---------------|
| Profile tables | `supabase-profile-family-groups.sql` |
| Kid progress table | `supabase-profile-kid-loop-progress.sql` |
| Google Form config | `script.js` → `LOOP_FEEDBACK_FORM` |
| Deploy output | `dist/` |

---

**All tests passing:** `npm run build && npm run test:site && npm run test:security`
