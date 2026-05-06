# Full-Site Test Checklist — Every Button, Every Page

Use this to verify **every button and every page** works. Run automated tests first, then manual checks.

---

## Automated (run first)

```bash
# Terminal 1: start server
python3 -m http.server 8765

# Terminal 2: run full-site test
cd /path/to/todaysdailybattle-site
python3 test-site.py
```

All lines should show `OK`. Fix any `FAIL` or `WARN` before manual testing.

---

## 1. Home (index.html)

| Action | Expected |
|--------|----------|
| **Search** (empty) | Click Search → "Type a topic, keyword…" message |
| **Search** "hope" | Topic verses + guidance |
| **Search** "John 3:16" | Single verse |
| **Quick topic** FREE WILL, Hope, Fear, Peace, … (all buttons) | Each loads verses into #output and scrolls into view |
| **Pray** (quick pray) | Add intention, click Pray → "Added!" / sync |
| **Voice pray** (hero) | Opens voice input or feedback |
| **Today's Battle** (accordion) | Loads daily verse card |
| **Share today's verse** | Share sheet or copy |
| **Sign Up / Log In / Forgot** | Auth modal or redirect |
| **Menu** (sidebar toggle) | Opens sidebar; nav links go to correct page |
| **Add family** | Family name modal |
| **Help** (?) | Help modal |
| **Promo dismiss** | Banner hides |
| **Clear Filters** | Testament/Book reset |

---

## 2–10. Core pages

- **verse.html** — Verse loads; auth works.
- **study.html** — Add note, Save verse, Export PDF, Share link.
- **reader.html** — Book/Chapter, Open Chapter, Listen, KJV Audio; URL params apply.
- **church.html** — Prayer list Add/Mark Prayed; Assign reading (if pastor).
- **sermon.html** — Save/Load Draft, Print, PDF, Email, Copy.
- **pastor-toolkit.html** — Build from topic → opens sermon with content.
- **team-toolkit.html** — All links/buttons work.
- **resources.html** — Use Template → sermon with template.
- **message.html** — Post Message, Sort, Amen.

---

## 11–18. Other pages

- **reading-plan.html** — 7-day / Custom plan; Start; check-offs.
- **bible-study.html** — Study list, Start.
- **coloring.html** — Story, color/brush, Clear, Download, Print.
- **kids-corner.html** — Activities load.
- **shop.html** — Products/links.
- **wins-report.html** — Report or Pro gate.
- **pricing.html** — Subscribe/Notify; Terms/Privacy links.
- **about.html, faq.html, contact.html** — Content and footer links.

---

## 19. Topic pages (topic-*.html)

- topic-anxiety, topic-fear, topic-forgiveness, topic-grief, topic-hope, topic-parenting, topic-strength — Content + nav.

---

## 20. Admin, Reset, 404

- **admin.html** — Master only; Export/Health.
- **reset.html** — Reset flow or message.
- **404** — 404 page with link home.

---

## Footer & global

- Every page: **Terms** and **Privacy** in footer; **Sidebar** opens; **Auth** works where present.
- No console errors on load or button click (Home, Pricing, Reader, Sermon).
- Mobile: no horizontal scroll; touch targets usable.

---

*After deploy: hard refresh and run test-site.py against production URL (change BASE in script).*
