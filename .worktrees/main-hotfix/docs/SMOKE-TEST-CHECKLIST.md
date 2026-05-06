# Quick smoke test (5–10 min)

**Pages:** index.html, church.html, wins-report.html, pricing.html  
**Modes:** Light and dark (toggle or system preference)  
**Viewport:** Desktop + resize to mobile (~375px)

## Checks

- [ ] **Buttons** — Look identical across pages (padding, radius, focus outline).
- [ ] **Cards** — Consistent shadow and radius (`.card`, verse card, prayer list, pricing cards).
- [ ] **Spacing** — Even across sections; no odd gaps or cramped blocks.
- [ ] **Dark mode** — Feels cohesive; cards use dark background, borders readable.
- [ ] **Mobile** — Everything stacks cleanly; touch targets ≥44px; no horizontal scroll.

## Run locally

```bash
python3 -m http.server 8765
# Open http://localhost:8765/index.html, church.html, wins-report.html, pricing.html
```
