# Kids full-story video + read-along (Bible Story Library)

End-to-end checklist for shipping **native `<video>` + WebVTT** on `/kids/corner.html`. Paths match `kids/kids-full-story-assets.js` (generated from `kids/kids-battle.js` story keys).

## File layout

| File | Role |
|------|------|
| `/media/kids-stories/{key}.mp4` | H.264, web-compressed (primary) |
| `/media/kids-stories/{key}.webm` | Optional smaller sibling |
| `/media/kids-stories/{key}.vtt` | UTF-8 WebVTT read-along |

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
