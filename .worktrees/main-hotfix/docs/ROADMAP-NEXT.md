# Next Priorities — Today's Daily Battle

**Context:** 96–98% done. Core loop rock-solid. Offline/sync/polish in place. March 2026 Battle Pro launch horizon.

---

## Recommended order (next 1–4 weeks)

### 1. Church Center Realtime — **Do first**

**Why:** Biggest gap in teased Church/Team tier. Turns static page into collaborative hub. Leverages existing Supabase (auth, sync, RLS). Differentiates from solo devotionals. Realtime is natural after offline/sync.

- **Effort:** Medium (3–7 days, phased).
- **Impact:** High — Church/Team revenue path, real community feel.

**Scope:**
- Live prayer list adds/marks (onSnapshot).
- Basic group progress (e.g. "% prayed today" or "X prayed this week").
- Admin verse setter (pastors update daily verse live).
- Offline grace note ("Changes sync when online").

*See `CHURCH-REALTIME-PLAN.md` for phased implementation. Phase 1 (realtime listener) is in place; Phase 2+ pending.*

---

### 2. Wins Report v2 — **Do after Church Realtime**

**Why:** v1 hook is live; shareable graphic + richer stats boost virality and Pro premium feel before March.

- **Effort:** Low–medium (2–5 days).
- **Impact:** High for joy + organic growth (shares → referrals).

**Scope:**
- Simple Canvas/SVG graphic (streak, tagline, serene background).
- "Download image" or enhanced copy with graphic URL.
- 1–2 extra stats (e.g. top 3 topics if tracked).

---

### 3. Quick wins / polish (parallel or between 1 & 2)

- GA on church: `church_page_view`, `church_prayer_added`, `church_verse_viewed`.
- SW: cache more pages if needed (e.g. `reading-plan.html`, `topic-*.html`).
- Accessibility: ARIA live regions on dynamic lists, screen-reader pass on Church Center.
- Optional: "Short share" variant on Wins Report copy.

---

## Why not other things first

- Full premium devotionals → higher effort, less foundational.
- Advanced sermon/lesson editors → deferred to March/Pro.
- Major redesign → unnecessary; Phase 1 polish is cohesive.
- New features outside roadmap → risk diluting focus.

---

## Summary

**Start Church Center realtime** — highest leverage: group value, Church/Team tier excitement, Supabase realtime, "wow" for beta/pastor outreach.

Alternatives: **Wins Report v2** (quicker win) or **quick wins** (GA, SW cache, a11y) before diving deep.
