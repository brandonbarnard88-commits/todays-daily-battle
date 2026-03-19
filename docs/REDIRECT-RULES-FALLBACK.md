# Cloudflare Redirect Rules Fallback (Donation Paths)

If `_redirects` in Cloudflare Pages isn't applying (propagation delay, build quirk, or platform mismatch), use **Redirect Rules** in the Cloudflare dashboard. These run at the edge and apply immediately.

## Setup

1. **Cloudflare Dashboard** → your zone (todaysdailybattle.com) → **Rules** → **Redirect Rules**
2. **Create rule** → **Create Redirect Rule**
3. Use the values below.

---

## Rule 1: /donate, /stripe, /support, /donations (exact)

| Field | Value |
|-------|-------|
| **Rule name** | Donation paths → Buy Me a Coffee |
| **When incoming requests match** | Custom filter expression |
| **Expression** | `(http.request.uri.path eq "/donate" or http.request.uri.path eq "/stripe" or http.request.uri.path eq "/support" or http.request.uri.path eq "/donations")` |
| **Then** | Dynamic redirect |
| **Type** | Permanent (301) |
| **URL** | `https://buymeacoffee.com/todaysdailybattle` |
| **Preserve query string** | Off (or On if you want `?` params passed through) |

---

## Rule 2: /donations/* (wildcard)

| Field | Value |
|-------|-------|
| **Rule name** | Donations wildcard → Buy Me a Coffee |
| **When incoming requests match** | Custom filter expression |
| **Expression** | `starts_with(http.request.uri.path, "/donations/")` |
| **Then** | Dynamic redirect |
| **Type** | Permanent (301) |
| **URL** | `https://buymeacoffee.com/todaysdailybattle` |

---

## Alternative: Single rule with regex

If your plan supports it, one rule can cover all:

**Expression:**
```
(http.request.uri.path eq "/donate" or http.request.uri.path eq "/stripe" or http.request.uri.path eq "/support" or http.request.uri.path eq "/donations" or starts_with(http.request.uri.path, "/donations/"))
```

---

## Order

Place these rules **above** any catch-all 404 rules so they match first.

---

## Verification

After saving, test in incognito:

- https://todaysdailybattle.com/donate → 301 → buymeacoffee.com/todaysdailybattle
- https://todaysdailybattle.com/donations/test → 301 → buymeacoffee.com/todaysdailybattle

DevTools → Network → check for `301` status and `Location` header.
