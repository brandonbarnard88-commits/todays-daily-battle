# Kids full Bible story videos (read-along)

The Kids Story Library (`/kids/corner.html`) supports **one complete animated video per story** (roughly **3–7 minutes**), with **WebVTT** captions for read-along text. Short **Bible Loops** are no longer part of this page.

## Files

| Asset | Suggested path | Notes |
|--------|----------------|--------|
| Video (H.264) | `/media/kids-stories/{slug}.mp4` | Primary for Safari / iOS |
| Video (WebM) | `/media/kids-stories/{slug}.webm` | Optional; VP9 for smaller size |
| Read-along | `/media/kids-stories/{slug}.vtt` | **WebVTT** subtitles (timed lines) |
| Poster | `/kids/panel-*-1.svg` or PNG/WebP | Optional `poster` in catalog |

## Catalog (all stories)

`kids/kids-full-story-assets.js` lists **every** top-level story key from `kids/kids-battle.js` (currently **171** unique keys). Each entry uses predictable paths:

| Field | Pattern |
|--------|---------|
| `mp4` | `/media/kids-stories/{kebab-key}.mp4` |
| `webm` | `/media/kids-stories/{kebab-key}.webm` |
| `captionsVtt` | `/media/kids-stories/{kebab-key}.vtt` |

**Kebab-case** is derived from the camelCase key (e.g. `goliathChallenge` → `goliath-challenge`). Digits stay in the slug (`alphaOmega2` → `alpha-omega2`).

### Turn on full video for a story

1. Upload the three files (or at least `.mp4` + `.vtt`) under `/media/kids-stories/` using the slug names above.
2. Add the **exact** story key string to `FULL_STORY_LIVE_KEYS` in `kids/kids-full-story-assets.js` (e.g. `'david', 'noah'`). Nothing plays until the key is listed—this avoids mass 404s before media exists.
3. Optional: add `poster` on that story’s object if you want a custom still (otherwise the modal keeps panel/YouTube behavior as today).

After full site-wide rollout, you can replace `FULL_STORY_LIVE_KEYS` with `new Set(Object.keys(FULL_STORY_MEDIA))` so any uploaded file set goes live.

### Regenerate after adding stories to `kids-battle.js`

```bash
node scripts/generate-kids-full-story-assets.js
```

Then re-add any keys you had in `FULL_STORY_LIVE_KEYS` (the generator preserves the empty Set template).

Until a story is in `FULL_STORY_LIVE_KEYS`, the modal uses **comic panels** and an optional **YouTube** preview button (`videoId` in story data).

## WebVTT

Create captions in **Aegisub**, **CapCut**, **Da Vinci Resolve**, or **Premiere**; export **.vtt**. Keep lines short, positive, KJV-accurate, age 4–8 friendly. Example:

```vtt
WEBVTT

00:00:01.000 --> 00:00:04.500
The giant shouted at God's army.

00:00:04.600 --> 00:00:08.000
David trusted the Lord, not the spear.
```

## QA

- Cross-check script and animation against **KJV** (and narrative context).
- Confirm captions match the picture (parents/kids test: “Do the words match what we see?”).

## Hosting size

Target **~50–150 MB** per story (H.264, reasonable bitrate) for phones/tablets; use CDN caching and version query strings when replacing files.
