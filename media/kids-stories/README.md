# `/media/kids-stories/`

Hosts **full-length Bible story** assets for the Bible Story Library (`/kids/corner.html`): **`{story-key}.mp4`**, optional **`{story-key}.webm`**, **`{story-key}.vtt`**.

- **Filenames** use **kebab-case** matching keys in `kids/kids-full-story-assets.js` (e.g. `david` → `david.mp4`, `david.vtt`).
- **Large video files** (`.mp4`, `.webm`) are **gitignored** — upload via your deploy host/CDN, not the git repo, unless you use **Git LFS** and know the tradeoffs.
- **`.vtt`** captions can live in git (small text); retime in Aegisub to match your final MP4.

See **`docs/KIDS-FULL-STORY-MEDIA.md`** for the full activation checklist.
