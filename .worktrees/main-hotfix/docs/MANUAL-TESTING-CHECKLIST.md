# Manual testing checklist

Use this when you run the site locally (or on staging) before a deploy. Run through the flows that matter most for launch. For visual consistency, use **docs/SMOKE-TEST-CHECKLIST.md** in addition.

## Run locally

```bash
# From project root
npx serve -l 3782
# Or: python3 -m http.server 3782
```

Open **http://localhost:3782/** (or the port you chose).

---

## 1. Home & navigation

- [ ] **Home** — index loads; hero, search box, and “Less scroll, more soul” visible.
- [ ] **Skip link** — Tab once; “Skip to main content” appears; Enter jumps to main content.
- [ ] **Header nav** — Home, Search, Verse of the Day, Prayer Wall, Wins Report, Church Center, Pricing all go to the right page.
- [ ] **Menu (mobile)** — Resize to ~375px; open menu (≡); sidebar opens; all nav links work.
- [ ] **Footer** — No visible “Footer” heading; “Site links” is sr-only. Links: About, FAQ, Pricing, Shop, Privacy, Terms, Suggest a topic, Contact all work.

---

## 2. Search & daily battle

- [ ] **Search** — Type a topic (e.g. “hope”) and hit Search; results show verses.
- [ ] **Quick topics** — Click “Hope”, “Anxiety”, etc.; results update.
- [ ] **Today’s Battle** — Click “Today’s Battle”; daily verse/block appears.
- [ ] **Privacy note** — “Your search is private” and Privacy link are visible under search.

---

## 3. Auth (sign up / log in)

- [ ] **Sign up** — Enter email + password → Sign Up; toast or message says to check email (if confirmation is on).
- [ ] **Log in** — After verifying (or if already verified), Log in with same email/password; session persists on refresh.
- [ ] **Log out** — Log out; form shows Sign Up / Log In again.
- [ ] **Forgot password** — Forgot password? opens flow; reset email received if configured.
- [ ] **Streak / account** — When signed in, streak or account indicator appears near header/sidebar as expected.

See **docs/E2E-AUTH-TEST.md** (if present) or Supabase Auth docs for full signup→verify→login in two browsers.

---

## 4. Pricing & Stripe

- [ ] **Pricing page** — pricing.html loads; Free, Supporter, Battle Pro, Military, Church cards visible.
- [ ] **Stripe links** — If config has Stripe links: click a plan CTA; redirects to Stripe Checkout (or shows “add link to config” message if not set).
- [ ] **Success return** — After test checkout (e.g. card 4242…), return URL with `?success=1` (and `&military=1` for military) shows thank-you / “Welcome Home” message.
- [ ] **Footer** — Privacy link and analytics note present.

See **docs/STRIPE-LIVE-CHECKLIST.md** for test mode and webhook.

---

## 5. Key pages (no 404s)

- [ ] **About** — about.html
- [ ] **FAQ** — faq.html
- [ ] **Privacy** — privacy.html (includes “Payments” and Stripe line)
- [ ] **Terms** — terms.html
- [ ] **Contact** — contact.html
- [ ] **Verse of the Day** — verse.html
- [ ] **Message Board** — message.html
- [ ] **Church Center** — church.html
- [ ] **Kids Corner** — coloring.html, kids-corner.html

---

## 6. Home page sections

- [ ] **Prayer counter** — “Total prayers: …” shows a number or “Loading…” then updates.
- [ ] **Invite** — Scroll to “Invite a friend”; enter nickname, “Copy my link” copies a link (or shows feedback). Deep link `/#invite-section` scrolls to that section.
- [ ] **Newsletter** — “Weekly Encouragement & Daily Verse” section; enter email, toggle daily/weekly, choose time; Submit; status message appears (success or error).
- [ ] **Stories of Hope** — Testimonials carousel (if present); “Share your victory” mailto link works.
- [ ] **Prayer wall** — Add a one-line request; it appears in the list (local).
- [ ] **Prayer list** — Add a name/intention; it appears in the list (local).

---

## 7. Mobile & PWA

- [ ] **Viewport** — No horizontal scroll at 375px; buttons and inputs are tappable.
- [ ] **Add to Home Screen** — If PWA install is shown, “Add to Home Screen” works (or “Not now” dismisses).
- [ ] **Offline** — If you have a service worker: go offline; offline banner appears; previously viewed content still accessible where designed.

---

## Quick pass (5 min)

If time is short: do **§1** (home + nav + footer), **§2** (search + one quick topic), **§5** (open Privacy, Pricing, Contact), and **§6** (invite copy, newsletter submit once). Then run **docs/SMOKE-TEST-CHECKLIST.md** for visuals.

---

**After testing:** Note any broken links or missing copy in this doc or in an issue, then fix before deploy.
