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
3. **Allowed parameters:** `topic`, `search_type`, `map_keys`, `semantic_blended`, `blended_count`, `blended_topics`, `heartfelt_template_used` (string, e.g. "pair:fear,loneliness" or "default"—which blended message fired), `default_rate` (0 or 1—1 if the query fell to the generic default message, 0 if a topic/blend matched), `verse_count_returned` (number 1–30—how many verses were returned), `used_default_verses` (0 or 1—1 if the curated hope set padded or filled the results). All are anonymous labels only—never raw query text. No other keys are passed through. Any attempt to pass `query`, `user_id`, `email`, or anything else is **stripped** and never sent.
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
- Sending `map_keys` (e.g. `["reaction:stand","feeling:overwhelmed"]`) so we can spot common expansion patterns and refine maps—anonymous semantic labels only, never raw query text.
- Sending `semantic_blended`, `blended_count`, `blended_topics`, and `heartfelt_template_used` (e.g. "pair:fear,loneliness" or "default") when topic blending occurs—anonymous labels only, to surface common pairs and which tailored messages fire most.
- Sending `default_rate` (0 or 1) so we can measure % of searches that fall to the generic default—helps prioritize phrase/topic additions. No raw query is ever sent.
- Sending `verse_count_returned` (number) and `used_default_verses` (0 or 1) to see how often the hope set is padding and how many verses users typically receive—aggregate counts only.

---

*User safety is the key. This document and the code in script.js (`trackSearchAnalytics`) are the single source of truth. Last updated 2026.*

---

## Non-search product events (`trackEvent`)

**Search** stays on `trackSearchAnalytics` only (see above). For everything else, use `trackEvent(eventName, params)` from `script.js` / `analytics-loader.js`, and **never** send raw private text, full journal bodies, or free-typed prayer content.

### Verse study overlay (`verse-study.js`)

| Event | Params (allowed) |
|-------|------------------|
| `tdb_verse_study_open` | `{}` |
| `tdb_verse_study_close` | `{}` |
| `tdb_verse_study_listen` | `{}` |
| `tdb_verse_study_listen_stop` | `{}` |
| `tdb_verse_study_listen_repeat` | `{}` |
| `tdb_verse_study_narration_pref` | `{ kind: 'rate', rate: 'very_slow' \| 'slow' \| 'normal' }` \| `{ kind: 'phrase_pause', on: 0 \| 1 }` \| `{ kind: 'repeat', on: 0 \| 1 }` \| `{ kind: 'ambient', mode: 'soft' \| 'off' }` \| `{ kind: 'ambient_level', level: 1–10 }` |
| `tdb_verse_study_related_jump` | `{}` (user opened a related verse inside the overlay) |
| `tdb_verse_study_save_mystudy` | `{ ok: boolean }` |
| `tdb_verse_study_memorize` | `{ ok: boolean }` |
| `tdb_verse_study_journal` | `{ ok: boolean }` |
| `tdb_verse_study_print` | `{ ok: boolean }` |

Do **not** add verse reference or verse text to these calls.

### Word study sheet (`word-study.js`)

| Event | Params (allowed) |
|-------|------------------|
| `tdb_wordstudy_open` | `{}` |
| `tdb_wordstudy_run` | `{ hits: number }` (concordance hit count, aggregate) |
| `tdb_wordstudy_save_mystudy` | `{ ok: boolean }` |

### Memorize (`memorize.js`)

| Event | Params (allowed) |
|-------|------------------|
| `memorize_print_cards` | `{ count: number }` |
| `memorize_export` | `{ format: 'txt' \| 'md' \| 'json' }` |

### What God has done (`what-god-has-done.js`)

| Event | Params (allowed) |
|-------|------------------|
| `wghd_open` | `{ entry_count: number }` |
| `wghd_entry_save` | `{ count: number, edit: boolean }` |
| `wghd_entry_remove` | `{ remaining: number }` |
| `wghd_clear_all` | `{}` |
| `wghd_export` | `{ format: string, entry_count: number }` |

### Daily quiet time (inline on `daily-quiet-time.html`)

| Event | Params (allowed) |
|-------|------------------|
| `dqt_gentle_invitation` | `{ slug: string }` (preset invitation id, not user text) |
| `dqt_invite_open_wordstudy` | `{ slug: string }` |

### Reader / chapter listen (`script.js`)

| Event | Params (allowed) |
|-------|------------------|
| `chapter_reader_listen` | `{ book: string, chapter: string }` (structural labels only) |
| `chapter_reader_listen_stop` | `{}` |

### Home / verse page / church (aggregate only)

| Event | Params (allowed) |
|-------|------------------|
| `verse_page_save_my_verses` | `{}` |
| `verse_page_listen` | `{}` |
| `hero_save_my_verses` | `{}` |
| `plain_meaning_toggle` | `{ action: 'expand' \| 'collapse' }` |
| `share_todays_verse` | `{ source: 'home' \| 'org_golden_rule' }` |
| `church_verse_viewed` | `{}` |
| `church_verse_set` | `{}` |

### Kids / family daily verse strip (`kids-corner-daily-verse.js`)

| Event | Params (allowed) |
|-------|------------------|
| `kids_corner_daily_verse` | `{}` |
| `family_hub_daily_verse` | `{}` |

When adding new `trackEvent` names, append them here with allowed keys. **Never** log verse body text, journal text, or search queries in `trackEvent`.
