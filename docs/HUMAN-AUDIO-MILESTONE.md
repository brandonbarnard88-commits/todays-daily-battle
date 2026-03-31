# Human audio — first milestone (Möbius flagship)

This is the **production checklist** for the first human-narrated track. Technical wiring already exists on Möbius; shipping is **add file + deploy**, not new app logic.

## Goal

One calm, trustworthy **human** read of the same slot as the existing 10-minute guided track, so users can choose **Human narrator** in Möbius Text mode when the file is present.

## What’s already built

- **UI:** Radio choice “Human narrator” appears when `/audio/mobius-guided-human.mp3` is available (see Möbius guided voice fieldset).
- **Element:** `<audio id="mobius-guided-audio-human">` with `<source src="/audio/mobius-guided-human.mp3">`.
- **Copy:** `audio/README.md` — file name, format, and privacy posture.
- **Script reference:** `docs/mobius-guided-audio-script.md` (align human read with the same pacing/sections as the studio track unless you intentionally shorten).

## Recording brief (restrained)

- **Tone:** Plain, slow enough to breathe with; no hype, no therapy-speak, no music required (optional barely-there bed only if it stays under the voice).
- **Text:** Follow the approved script; KJV-adjacent language where the script quotes or paraphrases Scripture—stay consistent with site rules.
- **Format:** Mono or stereo MP3, ~128 kbps, normalized for comfortable phone playback (not brick-wall loud).
- **Length:** Same ballpark as `mobius-guided-10min.mp3` so the timer and flow still make sense.

## Ship checklist

1. Export final file as **`mobius-guided-human.mp3`**.
2. Place under **`audio/mobius-guided-human.mp3`** in the repo (or your CDN equivalent with the same URL path).
3. Run **`npm run build`** and confirm **`dist/audio/mobius-guided-human.mp3`** exists in output (or that your host copies `audio/` as today’s pipeline does for other clips).
4. Verify **offline / PWA:** include the file in the service worker cache set if you cache other `/audio/` assets (match existing pattern).
5. **Live test:** Möbius → Text mode → deep meditation → select Human narrator → play; confirm no network upload (playback is fetch + local decode only).

## Privacy (user-facing truth)

- Audio files are **static assets**; playback does not send the user’s voice or listening content anywhere.
- Keep saying **on-device / nothing uploaded for listening** anywhere Listen/TTS is described; human MP3 is the same class of asset as the existing guided MP3.

## After this milestone

- Plan-day human snippets (Plans) can reuse the same **static file** pattern—one file per day or shared bed + verse read—document each in `audio/README.md` when added.
