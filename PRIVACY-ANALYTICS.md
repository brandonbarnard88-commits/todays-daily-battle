# User safety is the key — this is a safe place

**Today's Daily Battle is built so your safety and privacy come first.** What you search stays yours. We never want to know who searched, and we never store what you type. That’s locked in code and policy so this stays a safe place, including if anything is ever breached.

---

## Privacy in stone: search analytics

**This policy is non-negotiable. Do not change it.**

### What we stand for

- **User safety is the priority.** We protect people first—especially in sensitive moments (grief, fear, anxiety, faith).
- **This is a safe place.** Search is private. We do not send who you are or what you typed to anyone.
- **We never send who searched.** No user ID, no email, no IP, no session ID, no identifier of any kind with search analytics.
- **We never send raw search query text.** What you type in the search box never leaves your device in a way we can read or store. We only send topic labels (e.g. “hope”, “anxiety”) when you use a quick topic—and only as anonymous counts.

If analytics or any system is ever compromised, there is nothing that could identify who searched or what they typed. **Your search is yours.**

### How it is enforced in code

1. **Only `trackSearchAnalytics(eventName, params)`** may be used for search-related analytics. It is defined in `script.js` with a strict allowlist.
2. **Allowed event names:** `quick_search`, `search_query` only.
3. **Allowed parameters:** `topic` (string, e.g. "hope", "anxiety") and `search_type` (string, e.g. "keyword"). No other keys are passed through. Any attempt to pass `query`, `user_id`, `email`, or anything else is **stripped** and never sent.
4. All search analytics call sites use `trackSearchAnalytics()`, not `trackEvent()`, for search events.

So even if someone later adds `query: input` or `user_id: x` to a call, `trackSearchAnalytics()` will not forward them. Only `topic` and `search_type` can ever be sent.

### Do not

- Add a `query` or `search_term` parameter to search analytics.
- Send any user identifier (user_id, email, client_id, etc.) with search events.
- Bypass `trackSearchAnalytics()` by calling `trackEvent('quick_search', ...)` or `trackEvent('search_query', ...)` with extra params.
- Relax the allowlist in `trackSearchAnalytics()`.

### Allowed

- Sending `topic` (e.g. "hope", "free will") so we can see which topics are searched most—anonymous counts only.
- Sending `search_type: 'keyword'` for non-topic searches so we get aggregate counts only.

---

*User safety is the key. This document and the code in script.js (`trackSearchAnalytics`) are the single source of truth. Last updated 2026.*
