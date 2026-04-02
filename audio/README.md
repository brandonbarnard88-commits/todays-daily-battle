# Offline Verse Audio (MP3)

Möbius loads **`mobius-guided-10min.mp3`**, **`mobius-guided-human.mp3`**, and **`mobius-breathe-human.mp3`** only after a **`HEAD` check** succeeds (`data-tdb-src` in `mobius.html`), so missing files do not cause load-time **404** noise in the console. Drop real files into `audio/` and deploy to enable playback.

## Möbius human narration (highest-leverage polish)

Two files drive the **premium** Möbius experience. Replace the bundled placeholders (often macOS “Samantha” / system TTS renders) with **your own calm human studio reads** when ready—same filenames, same paths:

| File | Role |
|------|------|
| `mobius-guided-human.mp3` | ~10 min alternate for **Deep meditation** (timer ~600s) |
| `mobius-breathe-human.mp3` | ~1–2 min optional guide beside **Begin calm path** breathing |

After export: drop into `audio/`, run **`npm run verify:mobius-audio`**, then **`npm run build`** and deploy. Spec: `docs/MOBIUS-STUDIO-AUDIO-SPEC.md`. Scripts: `docs/mobius-guided-audio-script.md`, `docs/MOBIUS-BREATHE-HUMAN-SCRIPT.md`.

---

Add these MP3 files for offline TTS fallback when users tap "Listen" without internet:

| File | Verse | Suggested length |
|------|-------|------------------|
| `psalm-23-1.mp3` | "The LORD is my shepherd; I shall not want." | 10–15s |
| `john-3-16.mp3` | "For God so loved the world..." | 15–20s |
| `philippians-4-6.mp3` | "Be careful for nothing; but in every thing by prayer..." | 15–20s |
| `joshua-1-9.mp3` | "Be strong and of a good courage..." | 15–20s |
| `isaiah-41-10.mp3` | "Fear thou not; for I am with thee..." | 15–20s |

**How to create:**
- Record yourself reading the KJV verse
- Or use TTS (ElevenLabs, Google TTS, etc.) and export as MP3
- Keep clips short (10–20 seconds)

**Fallback:** If a verse has no MP3, the app falls back to `psalm-23-1.mp3`.

---

## Möbius Guided Meditation (10 min)

| File | Description |
|------|-------------|
| `mobius-guided-10min.mp3` | 10-minute guided meditation for Möbius Loop Text mode. Script: `docs/mobius-guided-audio-script.md` |

When present, the "Deep meditation (10 min)" button plays this audio and syncs the countdown.

### Deep Walk — alternate spoken track (same slot as 10-minute guide)

| File | Description |
|------|-------------|
| `mobius-guided-human.mp3` | Same purpose and **~10 minute** length as `mobius-guided-10min.mp3`. The repo ships a **macOS Samantha** (system TTS) render plus trailing silence so the timer stays aligned; replace with a **human studio read** anytime (same filename). When deployed, Möbius shows a second radio choice (**Spoken narrator (alternate)**). |

Script source: `docs/mobius-guided-audio-script.md` (condensed into `scripts/mobius-guided-human-say-input.txt` for generation). Keep KJV-adjacent pacing calm and plain (no hype). Mono MP3, ~96 kbps is fine for length.

**Regenerate (macOS):** `npm run audio:mobius-guided` — uses `say`, `afconvert`, and `ffmpeg-static` (pads to ~600s). Full checklist: `docs/HUMAN-AUDIO-MILESTONE.md`.

### Calm-path breathing guide (Text mode v2)

| File | Description |
|------|-------------|
| `mobius-breathe-human.mp3` | Short **spoken** guide beside the three slow breathing rounds before 2 Timothy 1:7 repetitions (same visual ring/timers). The repo ships a calm **macOS Samantha** (system TTS) render so the feature works out of the box; replace this file with a **human studio read** anytime (keep the same filename). |

**Length / shape:** Roughly one to two minutes is enough for a gentle intro plus cues through three in/hold/out cycles; it does not need to lock-step every second with the UI. Plain tone, no hype (same posture as the 10-minute guide).

**Suggested spoken script:** `docs/MOBIUS-BREATHE-HUMAN-SCRIPT.md`

**Regenerate (macOS):** `npm run audio:mobius-breathe` — uses `scripts/mobius-breathe-human-say-input.txt`, `say`, `afconvert`, and `ffmpeg-static`. WAV-only encode: `node scripts/encode-mobius-breathe-wav-to-mp3.mjs`.

**Privacy:** Same as other static MP3s—fetch and decode on device; no upload of listening or voice.

**Studio human replacements:** `docs/MOBIUS-STUDIO-AUDIO-SPEC.md` — after export, run **`npm run verify:mobius-audio`** (duration + channel check).
