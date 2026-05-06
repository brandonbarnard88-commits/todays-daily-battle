# Möbius studio audio — export spec (human replacements)

Replace these two files in place; **no code changes**. Paths are from the repo root.

| File | Role | Target length | UI coupling |
|------|------|----------------|-------------|
| `audio/mobius-breathe-human.mp3` | Optional layer on **Begin calm path** (three breathing rounds) | **~60–95 s** | Does not need to match ring timing to the second; may end before or after the rounds. |
| `audio/mobius-guided-human.mp3` | **Deep meditation (10 min)** alternate track | **~9:45–10:15** (585–615 s) | Timer is **600 s**; `ended` fires cleanup. Too short ends the session early; too long gets cut when the timer hits zero—avoid. |

## Tone & content

- **Quiet friend at dawn** — warm, direct, no hype. Match `docs/MOBIUS-BREATHE-HUMAN-SCRIPT.md` and `docs/mobius-guided-audio-script.md` unless you intentionally revise copy in the same spirit.
- **KJV** where Scripture is quoted (e.g. 2 Timothy 1:7, Genesis 5:24).
- **No music required.** If you use a bed, keep it under the voice and unobtrusive.

## Technical export

- **Container:** MP3 (MPEG-1 Layer 3).
- **Channels:** **Mono** preferred (smaller, consistent on phones). Stereo is acceptable if summed/mastered for mono-safe playback.
- **Sample rate:** 44.1 kHz or 48 kHz (encode will work; site does not assume a rate).
- **Bitrate:** **96–160 kbps** CBR or sensible VBR; voice-only mono is fine at **128 kbps**.
- **Loudness:** Aim for comfortable phone playback — roughly **-16 to -20 LUFS integrated** for spoken word (no brick-wall clipping). Leave **~0.5–1 s** of silence at file start if needed to avoid clicks; optional short fade-out at end.

## File naming (deploy)

Exact public URLs:

- `https://yoursite.com/audio/mobius-breathe-human.mp3`
- `https://yoursite.com/audio/mobius-guided-human.mp3`

After export, overwrite the files in **`audio/`**, run **`npm run build`**, confirm **`dist/audio/`** contains them.

## QA before deploy

1. **Local:** Möbius → enable **Spoken guide** → **Begin calm path** → hear start/stop around breathing phase.
2. **Deep Walk:** Choose **Spoken narrator (alternate)** → play full session on a phone; confirm level is listenable on speaker.
3. **Automated:** `npm run verify:mobius-audio` (duration + mono sanity).

## ffmpeg quick checks (optional)

With `ffmpeg` installed:

```bash
ffmpeg -hide_banner -i audio/mobius-breathe-human.mp3 -f null - 2>&1 | head -20
ffmpeg -hide_banner -i audio/mobius-guided-human.mp3 -f null - 2>&1 | head -20
```

Confirm **Duration** in the stderr line matches your intent.

## Privacy (user-facing)

Static files only — same class as other `/audio/` clips; nothing is uploaded for listening.

See also: `docs/HUMAN-AUDIO-MILESTONE.md`, `audio/README.md`.
