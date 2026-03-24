# Battle Plan authoring (KJV)

Use this when drafting a **new** reading plan or revising days. Scripture on the site is **King James Version only**. Devotional lines (`plain`, `today`, `action`, `prayer`) stay in the site’s voice: warm, direct, no hype, no prosperity/politics fluff.

## Where it lands in code

| Piece | File | Notes |
|--------|------|--------|
| Shared day stacks (battle10–40, pain arc, capstones) | `plans-data.js` | Export via `TDB_PLANS_BATTLE_SHARED`; keep `max` in sync with real array lengths. |
| Plan registry + most 7-day plans | `plans.html` (inline `PLANS` object) | Each plan is one entry: metadata + `days` array. |
| Library UI rows | `plans.html` | `<a href="plans.html?plan=…" data-plan="…">` must match `PLANS` keys. |
| SEO list | `plans.html` JSON-LD | `numberOfItems` and `itemListElement` — update when you add/remove a public plan. |
| Offline cache | `service-worker.js` | Already lists `plans-data.js`; no change unless you split files. |

Progress is stored locally as **`localStorage`** keys shaped like `tdb-plan-{id}-day` (see each plan’s `key` field — usually `tdb-plan-{id}-day`).

---

## Plan metadata (required)

When you add a plan, define these on the `PLANS` entry:

- **`id`** — URL slug: `plans.html?plan=thisid`. Lowercase, no spaces (e.g. `peace`, `painwontquit`).
- **`icon`** — Single emoji or Unicode escape (e.g. `'\uD83E\uDE79'`).
- **`label`** — Short title shown in the list.
- **`desc`** — One–two sentences; shows under the title.
- **`key`** — Prefix for stored progress; convention `tdb-plan-{id}-day`.
- **`max`** — **Must equal** `days.length` (the UI and streak logic assume this).

---

## One day = one object

Each day is a single JavaScript object with **exactly** these string fields:

| Field | Purpose |
|--------|---------|
| `title` | Short day heading. |
| `ref` | Human-readable reference (e.g. `Matthew 11:28`). |
| `text` | **Full KJV verse text** for that day (can be multi-verse; keep it accurate). |
| `speaker` | Who’s speaking / context (one short phrase). |
| `plain` | Plain-language paraphrase or anchor meaning. |
| `today` | Reflection prompt for “today.” |
| `action` | One concrete step. |
| `prayer` | Short closing prayer (often ends with “Amen.”). |

Escape apostrophes in JS strings with `\'` (or use a template that you paste through your editor safely).

---

## Markdown draft template (copy below the line)

Draft in Markdown first, then translate each `### Day N` block into one `{ … }` object in `plans.html` or `plans-data.js`.

```markdown
# PLAN DRAFT — replace with working title

## Metadata (for PLANS entry)
- id: myplanid
- icon: 🕊️
- label: Short label for the list
- desc: One or two calm sentences on who this is for.
- key: tdb-plan-myplanid-day
- max: 7

---

### Day 1
- title:
- ref: (KJV reference)
- text: |
    (Paste full KJV verse(s) here — will become one JS string.)
- speaker:
- plain:
- today:
- action:
- prayer:

### Day 2
- title:
- ref:
- text: |
- speaker:
- plain:
- today:
- action:
- prayer:

### Day 3
(Repeat through max days.)
```

---

## Patterns already in the repo

1. **Standalone N-day plan** — All days inline in `plans.html` under `PLANS.gratitude`-style entries (`days: [ … ]`).
2. **Reused slices + capstones** — e.g. `battle30`: `B.common20.concat(B.tail8, [B.preCap30, B.cap30final])`. New shared blocks go in `plans-data.js` and are exposed on `TDB_PLANS_BATTLE_SHARED`.
3. **Dedicated named array** — e.g. `painWontQuit7`: seven objects in `plans-data.js`, then `days: B ? B.painWontQuit7 : []` in `plans.html`.

Before shipping a multi-part plan, **count** concatenated lengths (9+4+7+8+2 = 30, etc.) so `max` and the badge in the list stay truthful.

---

## Checklist before you merge

- [ ] `max === days.length`
- [ ] `id` matches `data-plan` and `?plan=` links
- [ ] KJV `text` double-checked against a reliable KJV source
- [ ] New plan row added to the plans library section (if public)
- [ ] JSON-LD `ItemList` in `plans.html` head updated (`numberOfItems`, new `ListItem`)
- [ ] Any special routing (e.g. moat banner / deep links) — search `plans.html` for an existing plan’s `id` and mirror patterns
- [ ] `npm run build` and `npm run test:site` (plans page is covered in offline checks)

---

## Minimal JS object example (after drafting)

```javascript
{ title: 'Come unto me', ref: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
  speaker: 'Jesus — to the worn-out crowd', plain: 'He invites the exhausted, not the sorted-out.',
  today: 'Where are you carrying weight alone?', action: 'Say out loud: "Jesus, I\'m tired. I come."',
  prayer: 'Lord, I come. Give me rest. Amen.' }
```

For questions about tone and wording, match existing plans in `plans.html` and `plans-data.js` and the site rules (KJV-only, calm, specific).
