# Kids full Bible story videos (read-along)

The Kids Story Library (`/kids/corner.html`) supports **one complete animated video per story** (roughly **3–7 minutes**), with **WebVTT** captions for read-along text. Short **Bible Loops** are no longer part of this page.

## Files

| Asset | Suggested path | Notes |
|--------|----------------|--------|
| Video (H.264) | `/media/kids-stories/{slug}.mp4` | Primary for Safari / iOS |
| Video (WebM) | `/media/kids-stories/{slug}.webm` | Optional; VP9 for smaller size |
| Read-along | `/media/kids-stories/{slug}.vtt` | **WebVTT** subtitles (timed lines) |
| Poster | `/kids/panel-*-1.svg` or PNG/WebP | Optional `poster` in catalog |

## Register a story

Edit `kids/kids-full-story-assets.js` and add an entry to `FULL_STORY_MEDIA` whose **key** matches `kids-battle.js` (`david`, `noah`, `jonah`, etc.):

```js
david: {
  mp4: '/media/kids-stories/david-goliath.mp4',
  webm: '/media/kids-stories/david-goliath.webm',
  captionsVtt: '/media/kids-stories/david-goliath.vtt',
  poster: '/kids/panel-david-1.svg'
},
```

Until an entry exists, the modal uses **comic panels** and an optional **YouTube** preview button (`videoId` in story data).

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
