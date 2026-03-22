# FFmpeg: looping video clips

Concise reference for **trimming**, **repeating** a clip without quality loss where possible, and **re-encoding** when you need smooth timestamps or filters. Use for **5–15s social loops**, **church screens**, **kids apps**, and **always-on displays**. FFmpeg must be installed locally (`ffmpeg -version`).

---

## 1. Prepare / trim a clean segment (optional)

Exact window, **no re-encode** (fast; copies streams as-is):

```bash
ffmpeg -i input.mp4 -ss 00:00:05 -t 00:00:10 -c copy clip.mp4
```

- **Effect:** Writes **10 seconds** starting at **5s** into `clip.mp4`.
- **Quality:** Same as source (stream copy).
- **Caveat:** With `-c copy`, cut points usually snap to **keyframes**, so in/out may shift by a frame or two. For **frame-accurate** trims, put **`-ss` after `-i`** (slower; decodes then encodes) or re-encode the segment.

---

## 2. Fastest repeat — `-stream_loop` (copy when possible)

**No re-encode** if codecs/containers match:

```bash
ffmpeg -stream_loop 4 -i clip.mp4 -c copy looped.mp4
```

- **Counting:** `-stream_loop N` plays **N extra** passes → **N + 1 total** plays (example: `4` → **5** full passes).
- **Infinite:** `-stream_loop -1` repeats forever — useful for **streaming** or piping; **do not** use for a normal output file (size grows without bound).
- **Audio:** Included if present; `-c copy` keeps both streams.

---

## 3. Re-encode for filters / smooth timestamps — `loop` filter + `libx264`

When you need **continuous timestamps**, **filter chains** (e.g. text), or **guaranteed** container timing, re-encode video. Example:

```bash
ffmpeg -i clip.mp4 -vf "loop=loop=4:size=1:start=0" -c:v libx264 -pix_fmt yuv420p -c:a copy looped.mp4
```

- **`loop=loop=4:size=1:start=0`:** Loops a **segment of frames** — here **`size=1`** means **one frame** (handy for a **still** or poster loop). For a **full short clip**, you must set **`size`** to the clip’s **frame count** (or use **section 2** [`-stream_loop`] or **section 4** [`concat`] instead, which is usually simpler).
- **Audio:** `-c:a copy` if the audio already matches length and you did not change duration; otherwise encode audio to match.

**Practical rule:** For **whole-clip** repetition, prefer **section 2** (`-stream_loop`) or **section 4** (`concat`). Use the **`loop`** filter when you are looping a **defined frame range** (e.g. hold last frame, stutter a beat, loop N frames for motion graphics).

---

## 4. Exact repeat count — concat demuxer (no re-encode)

**1.** Create `list.txt` (UTF-8, one line per play-through):

```text
file 'clip.mp4'
file 'clip.mp4'
file 'clip.mp4'
```

**2.** Run:

```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy looped.mp4
```

- **Repetitions** = **number of `file` lines** (three lines → three concatenated plays).
- Paths must be valid from the working directory (or use absolute paths). Escape single quotes inside paths per FFmpeg docs.

---

## Choosing a method

| Goal | Good first choice |
|------|-------------------|
| Fast, same quality, whole clip × N | `-stream_loop` + `-c copy` |
| Exact N repeats, no re-encode, full file each time | `concat` + `list.txt` |
| Filters (drawtext, scale, fade) or fixed timing | Re-encode (`-c:v libx264`, etc.) |
| Infinite to a pipe / stream | `-stream_loop -1` (not for a finite file) |

---

## Pro tips (seamless loops and sanity checks)

- **Seamless loops:** Best results when **first and last frame** match visually (same pose/lighting), or use a **short crossfade** between tail and head in an editor, or a **reverse** segment (`ffmpeg -i clip.mp4 -vf reverse -an rev.mp4` then concat **clip + rev** for symmetric motion — only when it looks natural).
- **Test small:** Use **2–3** repeats and a **short** clip before running long jobs.
- **Keyframe trims:** If a copy-trimmed clip **hiccups** at the loop point, re-trim with `-ss` after `-i` or add a **fade** when re-encoding.

---

## Bible story loop ideas (5–15s clips)

Use as creative briefs for **vertical reels**, **lobby screens**, **story time**, or **kids loops** — keep overlays readable; **KJV** references small if you add text.

1. **Creation / Garden of Eden** — Blooming plants, calm animals, soft light. Overlay line: *Genesis 1 — God saw that it was good.* Calming **~10s** nature loop: repeat with **finite** `-stream_loop` or **concat** for a normal MP4; reserve **`-stream_loop -1`** for **live streaming** or a **pipe** (not for writing a disk file that would grow forever).
2. **Noah’s Ark** — Animals two-by-two, gentle rain, optional **rainbow** fade-in. Seamless **parade** cycle for kids’ rooms or story time.
3. **David & Goliath** — Sling spin, stone flight, small victory beat. Short heroic loop; ref **1 Samuel 17** for youth contexts.
4. **Jesus walks on water** — Rolling waves, slow footsteps, hush moment; line *Peace, be still.* Meditative **ocean** loop for prayer or reflection cuts.
5. **Red Sea** — Parting water, crossing silhouette, dramatic light. Strong for **Exodus** themes (e.g. Easter / Passover adjacent messaging — keep tone reverent, not spectacle-first).
6. **Daniel in the lions’ den** — Lions at rest, Daniel unharmed, stillness. *Trust God* bedtime or devotional loop.
7. **Prodigal son** — Father running, embrace. Warm **forgiveness** cycle; **Luke 15**.
8. **Resurrection morning** — Empty tomb, dawn light, angel hint (reverent, not cartoon-gore). Hope loop for **Easter** lobbies or short **reels**.

---

## Quick combo (trim → loop → text)

Workflow many teams use:

1. Trim a **public-domain** or **licensed** animation to **~10s** (section 1).
2. Repeat for predictable length with **section 2** (`-stream_loop`) or **section 4** (`concat`).
3. Burn in text: either **one pass** (loop input, then filter) or **two passes** (loop to a temp file, then `drawtext` only — easier to debug). Escape fonts and colons per your shell; set `fontfile` to a real path on your machine.

**One pass — repeat clip 10× total, then drawtext** (`-stream_loop 9` = nine extra plays):

```bash
ffmpeg -stream_loop 9 -i clip.mp4 -vf "drawtext=fontfile=/path/to/font.ttf:text='Genesis 1\: God saw that it was good':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=h-40" -c:v libx264 -pix_fmt yuv420p -c:a copy with-text.mp4
```

**Two passes — same result, clearer layers:**

```bash
ffmpeg -stream_loop 9 -i clip.mp4 -c copy looped-temp.mp4
ffmpeg -i looped-temp.mp4 -vf "drawtext=fontfile=/path/to/font.ttf:text='Genesis 1\: God saw that it was good':fontsize=24:fontcolor=white:x=(w-text_w)/2:y=h-40" -c:v libx264 -pix_fmt yuv420p -c:a copy with-text.mp4
```

If you truly need the **`loop`** filter for a **frame-range** effect, set **`size`** / **`start`** from `ffprobe` frame counts—then chain **`drawtext`** after that filter. Export **9:16** for Reels/TikTok (e.g. add **`,scale=1080:1920`** inside the same **`-vf`** chain) when targeting vertical.

---

## See also

- Kids story media pipeline (export, compression, captions): [`KIDS-FULL-STORY-MEDIA.md`](./KIDS-FULL-STORY-MEDIA.md)
- Kids loops audit: [`KIDS-LOOPS-AUDIT.md`](./KIDS-LOOPS-AUDIT.md)
