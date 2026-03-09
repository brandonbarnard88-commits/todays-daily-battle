# Kids Battle Batch Reel

Build one 3-minute reel from all generated 5-second clips.

## Defaults (from `reel-batch-config.json`)

- Clip length: `5s`
- Crossfade between clips: `0.4s`
- Target reel length: `180s`
- Max clips in reel: `36`
- Framing: vertical `1080x1920`
- Mood bed: quiet instrumental (`media/music/quiet-piano-strings.mp3`)
- Look: subtle slow pan/zoom + warm color + soft dust texture

## Folder setup

- Source clips: `media/kids-battle/clips`
- Music bed: `media/music/quiet-piano-strings.mp3`
- Output reel: `media/kids-battle/reels/kids-battle-batch-reel.mp4`

## Run

```bash
npm run reel:batch
```

Night profile:

```bash
npm run reel:batch:night
```

## Notes

- Clips are sorted by filename and the first N are used.
- If you have more than 36 clips, run multiple reels or raise `max_clips`.
- Crossfade can be tuned with `crossfade_s` in `reel-batch-config.json` (recommended `0.3-0.5`).
- Use `profiles.night` in `reel-batch-config.json` for cooler grade + softer zoom.
- If your clips include useful spoken audio, this script currently mutes clip audio and uses only music.
- Requires local `ffmpeg` installed and available in PATH.

