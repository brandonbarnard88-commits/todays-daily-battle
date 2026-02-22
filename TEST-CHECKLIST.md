# Site test checklist (manual)

Use this when you want to **test the site hard** in a real browser.

## Before you start
- Start local server: `python3 -m http.server 8765` (or use your host)
- Or open the live site (e.g. https://todaysdailybattle.com)

---

## 1. Search
- [ ] **Empty search** – Click Search with no input → friendly “Type a topic…” message
- [ ] **selfless** – Type `selfless`, Search → love topic verses (1 Cor 13:4, John 3:16, etc.) + “God loves you with a love that never gives up…”
- [ ] **hope** – Topic verses + guidance
- [ ] **John 3:16** – Single verse result
- [ ] **Gibberish** (e.g. `xyzzz`) – Fallback message + hope/love/peace verses (never blank)
- [ ] **Quick topics** – Click “Love”, “Hope”, “Anxiety” → correct topic results

## 2. Auth (if Supabase configured)
- [ ] Sign up with email → no console errors
- [ ] Log in → session persists on refresh
- [ ] Forgot password → flow works or shows message
- [ ] Log out → clears session
- [ ] Cross-device: sign in on second tab/device → streak, favorites, notes persist (if synced)

## 3. Tools (all working, not just copy)
- [ ] **Pastor Toolkit build-from-topic** – pastor-toolkit.html → enter topic (e.g. hope) → "Build toolkit & open Sermon Builder" → redirects to sermon.html with outline/title/theme filled
- [ ] **Sermon Builder** – Save Draft, Load Draft, Print/PDF, Email sermon, Copy for Sharing; "Pastor Toolkit" with no prior search shows friendly message
- [ ] **Resources templates** – resources.html → "Use Template" on any template → opens sermon.html with template applied
- [ ] **Church Center** – Prayer list: Add, Mark Prayed (works even before joining a church). Assign reading (pastors). My assigned reading + Mark complete
- [ ] **Message board** – Post Message → appears in list; sort; Amen
- [ ] **Reader** – Book + chapter → verse text; Listen, KJV Audio
- [ ] **Coloring** – Story dropdown, color/brush, Clear, Download, Print; Kids Daily Prompt + Mark Done
- [ ] **Study** – Add note, Save verse, collections, Export PDF, Share link

## 4. Sharing & engagement
- [ ] **Send to a friend** – Daily battle → "Send to a friend" → mailto with verse, ref, link
- [ ] **Share image** – verse + link correct
- [ ] **Share to X / Facebook** – Hashtags and site link present
- [ ] **Themed plans** – Victory Over Fear, Lent 2026 → Start → plan loads; check-offs work

## 5. Key pages
- [ ] **Terms** (`terms.html`) – Full ToS, footer link works from any page
- [ ] **Pricing** – Subscribe / Notify me, “By subscribing you agree to Terms and Privacy” link
- [ ] **Study** – Notes list, add note, Private checkbox, Export PDF
- [ ] **Verse of the Day** – Card loads (or fallback verse)
- [ ] **Church** – Verse of the day, prayer list, assign reading (localStorage)
- [ ] **Sermon** – Print/PDF label, Email sermon
- [ ] **Reading plan** – 7-day plan, Custom plan (days + Generate)

## 6. Footer & nav
- [ ] Every page has **Terms** in footer next to Privacy
- [ ] Sidebar opens (Menu), all nav links go to correct page
- [ ] Dark mode toggle works

## 7. Mobile / responsive
- [ ] Homepage search and quick topics usable on narrow width
- [ ] Sidebar works (hamburger)

---

## Quick automated run
```bash
python3 -m http.server 8765   # in one terminal
python3 test-site.py         # in another
```
All lines should show `OK`.
