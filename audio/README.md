# Offline Verse Audio (MP3)

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

### Optional: human-narrated guide (same slot)

| File | Description |
|------|-------------|
| `mobius-guided-human.mp3` | Same purpose and rough length as `mobius-guided-10min.mp3`, but read by a human voice. When this file is deployed under `/audio/`, Möbius shows a second radio choice ("Human narrator") for the deep meditation timer. |

Record or commission separately; keep KJV-adjacent pacing calm and plain (no hype). Mono MP3, 128kbps or similar is fine.

**Flagship path:** One strong human read of this track (same slot as the 10-minute guide) unlocks the radio on Möbius automatically via `HEAD /audio/mobius-guided-human.mp3`. Offline: add the same filename under `/audio/` in your deploy and ensure your service worker / CDN cache includes it once the file exists.

**Owner step:** The app cannot ship a real human voice from code—add `mobius-guided-human.mp3` locally or from your studio, then deploy. Full checklist: `docs/HUMAN-AUDIO-MILESTONE.md`.
