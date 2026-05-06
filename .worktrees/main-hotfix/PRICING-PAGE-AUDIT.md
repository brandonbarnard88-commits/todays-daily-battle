# Pricing Page Deep-Dive Audit

**Page:** `/pricing.html`  
**Date:** 2026-03-15  
**Scope:** SEO, accessibility, structure, CTAs, dead ends.

---

## Summary

The pricing page is clean, honest, and emphasizes "Free is enough for real practice—paid just adds tools." Core KJV features stay 100% free. Paid tiers are optional for power users, preachers, or groups.

---

## SEO

| Item | Status |
|------|--------|
| Meta description | ✅ Present (150 chars) |
| Canonical | ✅ `https://todaysdailybattle.com/pricing.html` |
| Title | ✅ "Pricing • Today's Daily Battle" |
| Open Graph | ✅ og:title, og:description, og:url, og:image |
| Twitter card | ✅ summary_large_image |

---

## Accessibility (Post-Fix)

| Element | aria-label |
|---------|------------|
| Sign Up | ✅ "Create account" |
| Log In | ✅ "Log in to your account" |
| Forgot password | ✅ "Reset forgotten password" |
| Log Out | ✅ "Log out" |
| Subscribe Supporter $9/mo | ✅ "Subscribe to Supporter plan at $9 per month" |
| Subscribe Supporter $90/yr | ✅ "Subscribe to Supporter plan at $90 per year" |
| Battle Pro monthly | ✅ "Subscribe to Battle Pro at $19 per month, first month free" |
| Battle Pro yearly | ✅ "Subscribe to Battle Pro at $190 per year" |
| Military $5/mo | ✅ "Subscribe to Battle Pro Military at $5 per month" |
| Military $50/yr | ✅ "Subscribe to Battle Pro Military at $50 per year" |
| Church $29/mo | ✅ "Subscribe to Church plan at $29 per month" |
| Church $290/yr | ✅ "Subscribe to Church plan at $290 per year" |
| Become a Supporter | ✅ "Become a Supporter and subscribe" |
| Start Searching | ✅ "Go to home and start searching verses" |
| Encourage Someone | ✅ "Post encouragement on the message board" |
| Notify Me | ✅ "Notify me when Battle Pro launches" |
| Buy me a coffee | ✅ "Support the site — Buy me a coffee" |
| Clear local data | ✅ "Clear all data stored on this device" |
| Open menu | ✅ "Open menu" |

---

## Structure

- **Skip link:** ✅ `#main-content`
- **Main landmark:** ✅ `<main id="main-content">`
- **Nav:** ✅ `aria-label="Main"`
- **Sidebar:** ✅ `aria-label="Site navigation"`
- **Auth section:** ✅ `id="auth-section"` for Sign in link target

---

## CTAs & Dead Ends

| CTA | Target | Status |
|-----|--------|--------|
| Subscribe buttons | Stripe checkout or `showNoCheckoutNote()` | ✅ No dead ends |
| Start Searching | `/` | ✅ Valid |
| Encourage Someone | `message.html` | ✅ Valid |
| Join the Battle Plan | `index.html#newsletter` | ✅ Valid (section added) |
| Sign in | `#auth-section` | ✅ Valid |
| Footer links | About, FAQ, Privacy, Terms, etc. | ✅ All valid |

---

## Recommendations

1. **Keyboard nav:** Ensure all Subscribe buttons are reachable and activatable via keyboard (native `<button>` elements—already compliant).
2. **Focus order:** Logical tab order; auth inputs before buttons.
3. **Screen reader:** Run NVDA/VoiceOver to verify tier cards and feature lists are announced clearly.
4. **Color contrast:** Verify tier card borders and CTA buttons meet WCAG AA (4.5:1 for text).

---

*Audit completed as part of site-wide SEO/accessibility improvements.*
