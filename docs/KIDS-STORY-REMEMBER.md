# Kids Story Remember (Hear → Remember → Color)

**Goal:** Kids love the story, *keep* it, and want another — without scoreboard shame.

## Flow (library story modal)

1. **Hear** — read-along panels / paragraphs (existing)
2. **Remember** — “What happened next?” order game (`kids-story-remember.js`)
3. **Questions** — soft multiple-choice from `kids-read-quiz-data.js` (heading: “Remember with me!”)
4. **Color (optional)** — secondary CTAs after success; “Pick another story!” is primary

## Files

| File | Role |
|------|------|
| `kids/kids-story-remember-data.js` | Handcrafted beats for 16 flagship stories |
| `kids/kids-story-remember.js` | Sequence UI (tap order, gentle retry) |
| `kids/kids-story-remember.css` | Look & feel |
| `kids/kids-corner.js` | Mounts remember between read-along and questions |

Auto-fallback: if a story has no handcrafted beats, captions from `readAlongSections` become the order cards (3–4 parts).

## Principles

- No points, lives, or “you failed”
- Wrong order: shake + reset + “Almost! Try again”
- Skip to questions always available
- Color stays available; not the only next step
- Offline after first load (static JS)

## How to add a flagship pack

Add a key under `TDB_KIDS_STORY_REMEMBER` matching `TDB_BIBLE_STORIES` / read-quiz keys, with 3–4 short `beats[].label` lines kids can tap.
