# Page One-Liners (March 2026)

Concise summaries for site pages. Updated to reflect semantic search (FEELING_NEED_MAP, OUTCOME_MAP, REACTION_MAP), plans.html build inclusion, and current live state.

---

## Build Verification

**plans.html** — Included in build. `build-copy-static.js` copies all root `.html` files (except topic-*.html which are force-copied first) via `otherHtml` loop. plans.html is in root, so it is copied to `dist/`. If live site shows minimal/empty, check: hard refresh, deploy pipeline, or redirect `/plans` → `plans.html`.

---

## Core Pages

**Homepage (/)** — Daily verse (rotates; e.g. Romans 8:28, Proverbs 3:5-6) with Real talk / How it lands / Do this breakdown; 7-Day Battle Plan progress (offline); mood selector (30+ emotions); quick tools (Sermon Builder, Bible Tools, Kids Corner); Prayer Wall (local save); semantic search powers mood→verse matching via FEELING_NEED_MAP/OUTCOME_MAP.

**Battle Plans (plans.html)** — Five plans: Battle Distraction, Gratitude, 30-Day Strength, Marriage, 7-Day Peace. Each with day pills, progress bar, reflections, Mark Complete. Progress saves offline. DOMContentLoaded + aria-busy for robust render.

**Bible Tools (bible-tool.html)** — KJV verse lookup, book/chapter/verse picker, Ask the Bible (bible-qa when deployed), Win the Day (3 topic verses), Battle Ready (1 verse + prayer), notes, plan checkboxes. Semantic search: expandKeywords injects MEANING/ACTION/OUTCOME/FEELING_NEED_MAP/REACTION_MAP; "Matching Verses" title; fallback hope/love/peace/strength/faith.

**Kids Corner (kids-corner.html)** — Bible Loop Library: 10–15 sec animated story loops (hand-drawn, ukulele + SFX), 12 starter loops, 160 total; watch 3× + pray to unlock next; Story Stars progress; weekly Sunday drops. Links to coloring, Kids Battle Home.

**Team Toolkit (team-toolkit.html)** — Local-only team tools: Calendar (events, repeat weekly), Attendance, Files (PDF), Prayer Chain, Verse Packs. Set Team ID to share workspace on same device. Church plan ($29–49/mo) adds team logins, branded exports.

**About (about.html)** — Founded by someone during hospital season; mission: meet God in real life via applicable Scripture; free/Supporter/Church tiers; roadmap (Kids Battle Q2, Church Join Hub); contact support@todaysdailybattle.com.

**Pricing (pricing.html)** — Free: search, daily verse, plans, notes, kids, prayer. Supporter: sync, custom plans, emails. Battle Pro: tracking, premium devotionals. Church/Team: team sharing, progress, branding. Stripe checkout; terms + privacy linked.

---

## Other Pages

**Verse of the Day (verse.html)** — Standalone daily verse with share/copy/breakdown.

**Reading Plan (reading-plan.html)** — 7-day plan; distinct from plans.html multi-plan hub.

**Study (study.html)** — Study Workspace for building lessons, verses, notes.

**Message Board (message.html)** — Prayer & Message Board; community prayers, local or synced.

**Pastor Toolkit (pastor-toolkit.html)** — Sermon Builder, topic search, study tools, church management.

**Church (church.html)** — Church Join Hub, Daily for Churches, ministries (Deacons, Sunday School, etc.).

**Contact (contact.html)** — Support form or email.

**FAQ (faq.html)** — Common questions; privacy, sync, pricing.

**Privacy (privacy.html)** — Data policy; Supabase, Stripe, Cloudflare, local storage.

**Terms (terms.html)** — Terms of Service.

**Coloring (coloring.html)** — Kids coloring pages.

**Topic pages (topic-*.html)** — Anxiety, Fear, Hope, Strength, Grief, Forgiveness, Parenting. Key verses, FAQ schema, links to Bible Tool + Prayer Wall.
