# Standard of Excellence (site-wide)

**Purpose:** Hold the **Kids’ Corner bar** (calm, warm, consistent, KJV-honest) as the default for **every** page on todaysdailybattle.com. This doc is the internal standard for design, copy, and shells. It does not replace the non‑negotiables in [NORTH-STAR-PRINCIPLES.md](./NORTH-STAR-PRINCIPLES.md); it **extends** them with experience quality and rollout discipline.

---

## 1. Experience rules (every page)

- **Quiet porch with God** — The first impression should feel like a still moment on a porch: unhurried, human, **never busy** or “dashboard noisy.”
- **Visual warmth** — Prefer **paper / cream / soft sun-wash** where it fits the story (e.g. hubs, welcome, long reads). For **adult study tools** and focus-heavy UIs, use the **calm dark** language already in the system—**warm**, not cold tech gray.
- **Delight & polish** — At least one **small, thoughtful** touch when it fits: gentle feedback, a human line, a clear “done” or rest moment—not gimmicks, not noise. Polish means **clarity and care**, not more widgets.
- **Consistency** — Same **header rhythm**, **footer**, **typography scale**, **spacing tokens**, and **offline behavior** as the rest of the site (see [ELITE-POLISH.md](./ELITE-POLISH.md) for technical baselines).
- **Copy tone** — Warm, humble, **Scripture-honoring**—like a caring friend at dawn, not a product pitch. No hype, no empty reassurance.
- **KJV only. No noise. No pressure.** — No alternate translations; no gamified shame; no clutter that competes with the Word.

**Security, privacy, and accessibility** stay as in `SECURITY.md`, `PRIVACY-ANALYTICS.md`, and project rules—this standard is **in addition to** those, not instead of them.

### 1.1 What “quiet porch” means in practice

- **One breath before the list** — Headline and one honest line of context before chips, links, or controls; the page never opens with a wall of choices.
- **Generous space** — Breathing room between sections; no dense grids that read like a spreadsheet unless the task truly requires it.
- **Predictable calm** — Motion and color support rest (subtle transitions); nothing flashes, shouts, or nags.
- **Scripture first when Scripture is the point** — The Word or plan content leads; UI chrome recedes.
- **Same door out** — Footer and nav behave the same as everywhere else; users never feel trapped in a different product.

### 1.2 Visual rules (warmth, typography, spacing)

- **Warmth** — Favor **soft gold / cream / blue-gray** accents over pure utility grays; keep contrast **readable** in both light and **calm dark** modes (see existing `.dark-mode` and glass patterns in `styles.css`).
- **Typography** — **One clear hierarchy** per page: page title → section label → body. No orphan font sizes; match existing site stacks (e.g. display vs body) already used on the homepage and verse flows.
- **Spacing** — Use **consistent section rhythm** (padding/margins that match `content-inner` / glass patterns). On mobile, preserve **44px+** tap targets and no horizontal scroll (see [ELITE-POLISH.md](./ELITE-POLISH.md)).
- **Adults vs kids** — Kids’ pages may use the **Kids World** pastoral shell where appropriate. **Adult** tools stay **mature and quiet**—no Little Shepherd or child-forward art unless the page is clearly family-bridging (see §2).

---

## 2. University shell system (maintenance lever)

**Goal:** Avoid one-off “hero and footer” drift by using **2–3 reusable page shells** and only swapping **main content** and page-specific options.

| Shell | Role | Typical pages (examples) |
|--------|------|----------------------------|
| **Main Porch** | Welcome, read, and orient—light, story-forward, uncluttered. | Home, Verse of the Day, About, high-level Explore entry points. |
| **Tool** | Focused work—reading, search, study, progress—adult-appropriate visual weight, still warm. | Battle plans, My Study, Reader, Bible Tool hubs, **non-kids** flows. |
| **Print** | Print-first layout, clean margins, no dark background bleed, minimal chrome. | One-page prints, pack generators, kids activity sheet pattern. |

**Implementation note (for builders):** Shells are **conventions**—shared `app-shell` / `top-bar` / `content-inner` patterns, shared CSS entry points (`styles.css` + role-specific CSS), and the same footer include. A future step is to document **class names and required landmarks** per shell in a short addendum or Storybook-style snippet list; the **rollout** can move pages into these buckets incrementally (see §4).

**Kids vs adults — mascot rule:** **Little Shepherd** and kids pasture language stay in **Kids** paths and family lanes. **Adult** pages use **mature, quiet imagery and language** (verse, light, waymarks)—not the kids mascot, unless a page is explicitly a cross-link “for your family” callout with clear context.

---

## 3. Prioritized rollout (attack plan)

Do in this order so impact and learning compound.

### Step 1 — Core pages (do these first)

1. **Homepage**
2. **Plans** — especially “Find your plan” and first-run clarity
3. **Verse of the Day** + full **verse** experience
4. **About**
5. **My Study** / **Progress**

### Step 2 — Battle plans (the heart of the site)

- Every **7-day (and similar) battle plan** reading experience should feel as **thoughtful and human** as Kids’ Corner: clear day rhythm, restful layout, helpful empty/error copy, KJV-honest tone.

### Step 3 — Tools & long-tail

- **Search** (results, empty, errors)
- **Prayer wall** / **journal** and quiet states
- **Topic** pages
- **Printables** hub and generators
- **Seasonal / one-page** prints (align **Print shell**)
- **International** versions — start from **shared templates**, then locale copy

---

## 4. Practical checklist (each page you touch)

Ask:

1. In the **first 5 seconds**, does it feel **calm and warm** (right mode for the task)?
2. Is there at least one **small delight** or human moment (where it doesn’t feel forced)?
3. Is **Little Shepherd** (or kids-only pasture UI) **only** where it belongs?
4. Do **type, spacing, header/footer**, and **offline** behavior **match** the standard above?
5. Would a **tired person** feel **more rested**, not more judged or sold?

If any answer is no, fix before shipping.

---

## 5. Related docs

- [NORTH-STAR-PRINCIPLES.md](./NORTH-STAR-PRINCIPLES.md) — fixed foundations
- [ELITE-POLISH.md](./ELITE-POLISH.md) — technical polish baseline
- [POLISH-RELEASE-GUIDE.md](./POLISH-RELEASE-GUIDE.md) — release discipline (if used for a given change)

**Change control:** When a shell convention or global pattern changes, update this file in the **same** change (or follow-up) so the standard stays true.

---

*Last updated: 2026-04-27 — expanded with “quiet porch” practice, visual rules, and Step 1–3 attack plan (Core → Battle plans → Tools & long-tail).*
