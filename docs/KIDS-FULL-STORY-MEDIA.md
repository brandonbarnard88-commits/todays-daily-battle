# Kids full-story video + read-along (Bible Story Library)

End-to-end checklist for shipping **native `<video>` + WebVTT** on `/kids/corner.html`. Paths match `kids/kids-full-story-assets.js` (generated from `kids/kids-battle.js` story keys).

**Animate one story at a time:** full checklist (all keys, filenames, suggested first five) — [`KIDS-STORY-ANIMATION-QUEUE.md`](./KIDS-STORY-ANIMATION-QUEUE.md). Refresh after catalog edits: `npm run kids:generate-animation-queue`.

**Read + quiz (no video required):** `kids/kids-read-quiz-data.js` defines `TDB_KIDS_READ_QUIZ` for **every** `bibleStories` key (currently **171**), wired on `/kids/corner.html` in the story modal.

- **Regenerate** after editing `kids/kids-battle.js` story text (`narration`, `kidContext`, `kjvRef`, panels): `npm run kids:generate-read-quiz`
- **Hand-tuned** packs (higher-quality copy + quizzes): edit `kids/read-quiz-handcrafted.cjs` (e.g. `david`, `noah`, `jonah`, `daniel`, `fallOfJericho` + `jerichoWalls`), then run the same command so the big file picks them up.

### Hand-tuned batches (3–5 stories at a time)

Use this when you (or a collaborator) ship **custom** paragraphs, quizzes, and art prompts—without overwriting the big generated file by hand.

1. **Keys** — Must match `bibleStories` **camelCase** exactly. Use [`KIDS-STORY-ANIMATION-QUEUE.md`](./KIDS-STORY-ANIMATION-QUEUE.md) so names line up (e.g. Jericho → `fallOfJericho` and/or `jerichoWalls`; storm → `jesusCalmsStorm`; Samaritan → `goodSamaritan`).
2. **Where to edit** — Add or replace entries in **`kids/read-quiz-handcrafted.cjs`**, not in `kids/kids-read-quiz-data.js` (that file is **output** of `npm run kids:generate-read-quiz`).
3. **Field names** — Each question uses **`choices`** (four strings) and **`correctIndex`** (0–3), plus **`correctFeedback`** / **`wrongFeedback`**. If your draft says `options` / `correct`, rename to match.
4. **Copy** — `paragraphs`: 4–6 short strings is fine (~300–500 words total is a good target). Keep **`kjvRef`** in sync with the story (e.g. `Joshua 6`).
5. **AI prompts** — Put five strings in **`imagePrompts`** (for Leonardo / Bing / etc.); they are **metadata** unless you also export images.
6. **Optional pictures in the modal** — After you export images, upload under **`/media/kids-stories/`** and add **`readAlongImages`**: an array of up to **five** paths like `"/media/kids-stories/fall-of-jericho-1.jpg"`. The read-along block shows them above the story text (paths are restricted to that folder for safety). Naming tip: **kebab-case** + `-1` … `-5` (see `media/kids-stories/README.md`).
7. **Ship** — Run `npm run kids:generate-read-quiz`, bump `CACHE_NAME` in `service-worker.js` if needed, `npm run build`, deploy. Smoke **`/kids/corner.html`** → open story → read + quiz (+ images if set).
8. **Stars** — A story is still counted **viewed** when the modal opens (`addViewedStory`). Finishing the quiz does **not** yet unlock a separate star; say if you want quiz-complete gating later.

## File layout

| File | Role |
|------|------|
| `/media/kids-stories/{key}.mp4` | H.264, web-compressed (primary) |
| `/media/kids-stories/{key}.webm` | Optional smaller sibling |
| `/media/kids-stories/{key}.vtt` | UTF-8 WebVTT read-along |
| `/media/kids-stories/{kebab}-1.jpg` … `-5.jpg` (optional) | Read-along stills; list paths in pack **`readAlongImages`** |

Example for **David**: `david.mp4`, `david.vtt` (keys use camelCase in JS, kebab-case filenames).

## Production workflow (hand-drawn or your editor of choice)

1. **Animate** — e.g. Krita, Pencil2D, OpenToonz, or your existing pipeline. Keep tone kid-safe and faithful; third-party/AI clips are reference only unless you own the output.
2. **Export** — MP4 (H.264) + AAC audio if any; target **~50–150 MB** for long stories after compression.
3. **Compress** — HandBrake or FFmpeg (e.g. 720p–1080p, CRF ~23–28, 30 fps) for mobile.
4. **Captions** — Aegisub: load MP4, time cues to **action beats**, export **WebVTT** UTF-8 no BOM. Repo `media/kids-stories/david.vtt` is a starter; retime to picture.
5. **Upload** — Place files on the **same host/CDN** as the site so URLs resolve as `https://todaysdailybattle.com/media/kids-stories/david.mp4` (must return **200** and play in-browser).
6. **Style** — Caption chrome lives in CSS: `kids/corner.html` uses `.kids-full-story-video::cue { … }` (limited `::cue` support across browsers).

## Enable native player for a story

Only after **MP4 + VTT** return **200** on production (empty seed avoids a broken player):

1. Edit `scripts/generate-kids-full-story-assets.js` → `FULL_STORY_LIVE_KEYS_SEED = ['david']` (append more keys later: `'noah'`, …).
2. Run `npm run kids:generate-full-story-assets` (or `node scripts/generate-kids-full-story-assets.js`).
3. `npm run build` → deploy.
4. Smoke: `/kids/corner.html` → story → **CC on** → Network tab: **200** on `.mp4` and `.vtt`.

To **disable** again, set seed to `[]`, regenerate, build, deploy.

## Hub vs library

- **`/kids/?v=hub20260321`** (or `/kids/` after cache settles) — **Pick a path**: loops vs full stories.
- **`/kids/corner.html`** — Bible Story Library (full-story modal).

## Cache / PWA

- Service worker: bump `CACHE_NAME` in `service-worker.js` when static HTML/CSS must refresh for all users.
- Cloudflare: `npm run purge:cloudflare` (needs real `CF_API_TOKEN` in `.env`) or dashboard **Purge Everything** after deploys.

## Legal / quality

- Do not commit **large** `.mp4` / `.webm` by accident — see `media/kids-stories/README.md` and `.gitignore`.
- Scripture quotes in VTT: prefer **KJV** where shown as verse text (site standard).
