# Secrets Page Unlock

## Unlock Steps

1. **Konami code**
   - Click anywhere on the page background (not inside a search box)
   - Press: ↑ ↑ ↓ ↓ ← → ← → B A
   - → Toast: "You found a hidden blessing!"

2. **Search "secrets"**
   - Type `secrets` in any search bar (homepage, Bible Tool, Team Toolkit, etc.)
   - Press Enter or click Search
   - → Redirects to `/secrets.html`
   - → Unlock now persists on that device, so the breadcrumb page remains available after the first successful unlock

## Tips

- **Focus:** Click page background first (Konami ignores input fields)
- **Order:** Konami → then search
- **Disabled?** Clear `localStorage.easterEggsEnabled` if set to `'0'`

## Secrets Page Progression

- **1st visit:** Quick-door breadcrumbs
- **2nd visit:** Core-page and route-chain breadcrumbs
- **3rd visit:** Full breadcrumb map, family/kids trails, legendary hints, and confetti

## Notes

- The page now marks some hints as `Found` when the current device has already seen the related moment.
- Some moments persist in `localStorage`; others remain same-session or time-based on purpose.
