# Next Steps Plan (March 2026)

Quick reference for what to tackle after the Kids Corner polish + streak celebration toast.

---

## Just Shipped

- **Streak celebration toast** — On `progress.html` load, if `tdb-longest-streak` increased, show "+1 to your streak! 🔥" (or "+N" for larger jumps).
- **Streak toast on plans.html** — Same toast when marking a day complete and longest increases.
- **Voice pause/resume (Kids Corner)** — "Tap to hear" is now a play/pause toggle (▶ / ⏸); `speechSynthesis.pause()` / `resume()` with aria-pressed and icon updates.
- **Voice pause/resume (plans.html)** — "Listen" on plan day cards now toggles Pause/Resume.
- **Voice pause/resume (homepage)** — Daily verse read-aloud button now supports pause/resume; icon toggles speaker ↔ pause; aria-pressed updates.
- **Gentle nudge** — "Missed yesterday? Here's a quick reset verse" on homepage when last visit >1 day ago; curated reset verses (Psalm 51:10, Lamentations 3:22-23, etc.); gold toast, 7s duration.

---

## Recommended Next (by impact / effort)

### 1. ~~Voice pause/resume (Kids Corner)~~ — Done ✅

### 2. Streak celebration on plans.html
- **What:** When user completes a day and streak increases, show same "+1 to your streak! 🔥" toast on plans page (not just progress).
- **Why:** Immediate feedback where the action happens; progress.html is a separate visit.
- **Effort:** Low — plans.html already updates `tdb-longest-streak`; add toast on that path.

### 3. ~~Gentle nudge for missed day~~ — Done ✅

### 4. Wins Report / shareable graphics
- **What:** Tease 2026 Wins Report with mockups; "You prayed through X battles," shareable streak graphic.
- **Why:** High perceived value for Pro; strong share/word-of-mouth.
- **Effort:** High — design + build + integrate with existing stats.

### 5. ~~Voice controls site-wide~~ — Done ✅
- Kids Corner modal, plan day cards, and homepage daily verse all have pause/resume.

---

## Suggested Order

1. ~~Streak toast on plans.html~~ — Done ✅
2. ~~Voice pause/resume (Kids Corner)~~ — Done ✅
3. ~~Gentle nudge~~ — Done ✅
4. ~~Voice controls site-wide~~ — Done ✅
5. **Wins Report** (when ready for larger feature)

---

*Last updated: March 15, 2026*
