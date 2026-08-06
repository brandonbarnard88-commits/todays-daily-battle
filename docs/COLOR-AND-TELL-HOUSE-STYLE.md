# Color & Tell — House Style (locked)

**Purpose:** One visual language for every Color & Tell page — gentle, KJV-rooted, device-local, ages 3–10, printable + on-screen. Matches the quiet porch voice of Today's Daily Battle.

**Canonical fields:** `colorPrompt` in `kids/bible-story-tool-index.js` and the **Coloring Page Prompt** section in matching `kids/stories/*-package.md` files. Keep those in sync when you add or regenerate art.

**Not for live site AI:** Prompts are builder/human-curation tools. The live site never generates devotionals or coloring art for users.

---

## Master prompt (copy-paste; keep the style block identical every time)

```
Black and white coloring book page for Christian children, clean vector-style line art.

Subject: [INSERT SCENE HERE]

Style requirements:
- Thick, bold, consistent black outlines (3–5 px visual weight)
- Large, simple, closed shapes that are easy for little hands or digital fill
- Generous white space between elements
- Minimal internal detail — no tiny patterns, no cross-hatching, no texture
- Pure black lines only on pure white background
- Flat 2D illustration, no perspective tricks
- Friendly, warm, peaceful, respectful tone (never cartoonish, never scary, never irreverent)
- Suitable for ages 3–8 (or note if for older kids)
- Centered composition with room for a short KJV verse at the bottom if needed
- High contrast, print-ready at 300 DPI, letter size (8.5×11)

Technical constraints (critical):
- No shading, no gray tones, no gradients, no halftone, no soft edges
- No color of any kind
- No background scenery unless it is extremely simple and large
- Closed outlines only (no gaps so flood-fill works)
- Clean edges, no anti-aliased fringes

Mood: calm, gentle, wonder-filled, “Little Shepherd” feel — God’s story is the bright part.
```

## Negative prompt (always include)

```
shading, shadows, gradients, gray, grayscale, color, texture, crosshatching, stippling, noise, watermark, text, signature, photorealistic, 3d, realistic, scary, violent, detailed background, small details, thin lines, broken outlines
```

---

## Two strength levels (use consistently)

**Littles (ages 3–6)** — add to the style section:

```
Extra-thick outlines, very large simple shapes, almost no internal lines, maximum white space, preschool coloring page
```

Tag in stored prompts: `Age band: Littles (ages 3–6).`

**Older kids (ages 7–10)** — add:

```
Slightly more detail, medium-bold outlines, a few clear internal shapes that are still easy to color, still clean and uncluttered
```

Tag in stored prompts: `Age band: Older kids (ages 7–10).`

---

## Stored `colorPrompt` format

Each `colorPrompt` string is a compact, copy-paste-ready single paragraph that always includes:

1. Opening house line (`Black and white coloring book page…`)
2. `Age band: Littles…` or `Age band: Older kids…`
3. `Subject: …` (scene only — no color words like “green hills” or “soft moonlight”)
4. Hard style + technical constraints (black lines, closed shapes, no gray/gradients)
5. Mood line
6. `Avoid: …` (negative list)

Do **not** ask for soft light, soft hills, green grass, moonlight, bright rainbow color, dim lamps, or other cues that invite gray or color.

---

## Generation checklist (review before shipping)

Use this every time before dropping new line art into `coloring-pages/` or a story package.

### Prompt & source
- [ ] Used the house master (or a specialized variant below) — style block unchanged
- [ ] Age band matches the story (Littles vs Older kids)
- [ ] Subject has no color/gray cues (“soft light,” “green hills,” “moonlight,” etc.)
- [ ] Negative prompt was included for the generation pass

### Line quality (zoom 200%)
- [ ] Pure black lines on pure white — no gray pixels, no soft anti-aliased fringes
- [ ] Line weight consistent (thick/bold; not thin hairlines mixed with thick)
- [ ] Outlines fully closed — flood-fill / digital color will not leak
- [ ] No shading, gradients, texture, cross-hatching, or stippling

### Composition (kid + print)
- [ ] Large closed shapes — easy for little hands or on-screen fill
- [ ] Generous white space; not crowded
- [ ] Background absent or extremely simple and large
- [ ] Tone: calm, warm, respectful — never scary, violent, or irreverent
- [ ] Works at letter size (8.5×11) and on a phone screen

### Sequence pages (`-s1`…`-s4`)
- [ ] Same character description block used for every panel
- [ ] Figures recognizable across panels
- [ ] Each panel stands alone as a coloring page

### Verse-footer pages
- [ ] Bottom ~25% is empty white space (no art crowding the band)
- [ ] No text, signature, or watermark in the image — KJV is added in HTML/print separately

### Export & ship
- [ ] Prefer SVG for on-site Color & Tell; PNG only when needed (transparent or pure white)
- [ ] Filename matches story map (`story-s1.svg` … `story-s4.svg` or single hero asset)
- [ ] `colorPrompt` / package prompt still matches the scene that shipped
- [ ] Quick smoke on `/coloring.html?story=…` (fill + print if applicable)

Generate 2–3 variations when unsure; keep the cleanest line weight and biggest closed areas.

---

## Specialized variants (builder use)

Stored `colorPrompt` fields stay on the full house format. Use these shorter variants when running a generation tool. All remain fully house-compliant.

### 1. Grok Imagine–optimized

```text
Black and white coloring book page for Christian children, clean vector-style line art.

Subject: [SCENE DESCRIPTION]

Style: thick bold black outlines, large simple closed shapes, generous white space, minimal internal detail, pure black lines on pure white background, flat 2D, friendly warm peaceful respectful tone, ages 3-8, high contrast, print-ready.

Hard rules: no shading, no gray tones, no gradients, no soft edges, no texture, no color, no busy background, closed outlines only, no anti-aliased fringes.

Mood: calm, gentle, wonder-filled. God’s story is the bright part.
```

**Negative (always append):**  
`shading, shadows, gradients, gray, grayscale, color, texture, crosshatching, soft edges, photorealistic, 3d, detailed background, thin lines, broken outlines, watermark, text`

Add the Littles or Older kids line when the age band matters for that story.

### 2. Multi-panel / story-sequence  
*(Color & Tell slideshows — `-s1`, `-s2`, `-s3`, `-s4`)*

```text
Black and white coloring book page, single panel of a multi-panel Bible story sequence for children.

Panel: [s1 / s2 / s3 / s4] of [STORY NAME]
Subject: [SPECIFIC MOMENT FOR THIS PANEL]

Style: thick bold black outlines, large simple closed shapes, generous white space, minimal internal detail, pure black lines on pure white background, flat 2D, consistent character design across the sequence, friendly warm peaceful respectful tone, ages 3-8.

Hard rules: no shading, no gray tones, no gradients, no soft edges, no texture, no color, no busy background, closed outlines only.

Keep characters simple and recognizable from panel to panel. Leave clear space so the panel can stand alone as a coloring page.
```

**Usage tip:** Generate each panel with the exact same character description block so the figures stay consistent across the slideshow.

**Hybrid Color → Story (live for Creation + Jesus & the children):** Four SVG panels drive Color & Tell (short KJV under each panel). Coloring stays the hands-on core; Watch My Story works after **one** saved scene. Full-page JPGs may remain for print pack sheets, but they are not part of the digital Watch sequence. See `kids/stories/creation-package.md` and `kids/stories/jesus-children-package.md`.

### 3. KJV verse footer

```text
Black and white coloring book page for Christian children, clean vector-style line art.

Subject: [SCENE DESCRIPTION]

Style: thick bold black outlines, large simple closed shapes, generous white space, minimal internal detail, pure black lines on pure white background, flat 2D, friendly warm peaceful respectful tone, ages 3-8, high contrast, print-ready.

Layout: main illustration centered in the upper 75% of the page. Leave a clean horizontal band at the bottom for a short KJV verse (do not render any text — leave empty white space only).

Hard rules: no shading, no gray tones, no gradients, no soft edges, no texture, no color, no busy background, closed outlines only, no anti-aliased fringes, no text of any kind.
```

**Negative:** same as the Grok Imagine version.  
Add the KJV reference and text in the page HTML / print CSS — never bake verse text into the artwork.

### 4. Hybrid Color → Story print one-pager (master)

Use this when generating a **single US Letter page** that is both a coloring sheet and a simple story infographic (2×2 panels + title + big idea). For the on-site Color & Tell tabs, still generate **separate** `-s1`…`-s4` panels with variant 2 above so each scene can be painted and saved alone.

```text
Create a clean, printable colorable Bible story infographic for kids ages 4–10 in a gentle, calm style.

Layout:
- Vertical US Letter (8.5 x 11) portrait page
- Soft cream or pure white background
- Thick, bold black outlines only (no gray shading, no filled blacks, no gradients)
- Large open colorable areas, minimal tiny details
- 4 sequential story panels arranged in a clear 2x2 grid (or vertical stack if needed)
- Soft rounded panel borders
- Generous white space so the page feels calm, not crowded

Style:
- Simple, friendly line art (think classic children’s Bible coloring book mixed with light educational diagram)
- Warm, approachable characters (not cartoonish or hyper-cute)
- Clear sequential storytelling that a child can follow left-to-right, top-to-bottom
- No scary or intense facial expressions

Content structure:
1. Top banner: Story title in large friendly lettering + one short KJV phrase underneath
2. Four sequential panels that tell the core story in order
3. Bottom strip: “One big idea” in simple words + a short memory line from the KJV

Important rules:
- Pure black line art on white/cream only — ready for crayons or markers
- No text inside the panels except very short optional labels if helpful
- Keep all text large and readable
- Make every major element big enough for little hands to color easily
- Overall feeling: quiet, welcoming, Scripture-centered, not busy or commercial

Story to illustrate: [INSERT STORY NAME AND KEY MOMENTS]
Key short KJV line for the top: “[INSERT SHORT VERSE OR PHRASE]”
One big idea for the bottom: “[INSERT SIMPLE BIG IDEA]”

Strictly black line art only. No gray fills, no color, no shading.
```

**Ready story slots (swap into the three brackets):**

| Story | Panels (order) | Top KJV | One big idea |
|-------|----------------|---------|--------------|
| Jesus & the children | (1) Families bring children / disciples push back (2) Jesus calls them near (3) Jesus welcomes & blesses (4) Open arms — of such is the kingdom | “Suffer the little children to come unto me” | Jesus welcomes little ones |
| Creation | (1) Light in darkness (2) Sky & waters (3) Land, plants, trees (4) Sun, moon, living creatures & people; rest in the bottom strip | “Behold, it was very good” | God made everything good |
| David & Goliath | (1) Goliath shouting (2) David with sling & stones (3) Stone released (4) Goliath fallen — God’s help | “The battle is the Lord’s” | Small faith + God is enough |
| Daniel in the lions’ den | (1) Daniel praying (2) Lowered into the den (3) Calm among the lions (4) King finds him safe | “My God hath sent his angel, and hath shut the lions’ mouths” | God is with us when we are afraid |
| Empty tomb | (1) Sealed tomb & guards (2) Stone rolled away (3) Empty tomb / grave clothes (4) Women hear “He is risen” | “He is not here: for he is risen” | Jesus is alive |

**Live digital hybrid (Color & Tell tabs):** Every Color & Tell story uses separate SVG panels (`-s1`…`-s4`, or 2 for life-lesson stories) with short KJV under each scene, a One big idea, and Watch-after-one — see `kids/color-and-tell.js` and `kids/color-and-tell-hybrid-copy.json`. Prefer Mark 10 order on digital Jesus panels (bring → rebuke → suffer → kingdom). **Print storyboard** on the coloring page builds a blank 2×2 letter sheet in the browser (no PDF server). Use this one-pager master when regenerating combined line-art sheets.

**Consistency tips:** Keep the layout block identical every time; only change the three story fields. Generate high-res. If the tool adds shade or color, re-run with the strict black-line closing line.

To refresh stored prompts after editing subjects in `scripts/rewrite-color-prompts.mjs`:

```bash
node scripts/rewrite-color-prompts.mjs
```

---

## Example subjects (safe porch tone)

**Jesus & the children (Safe) — Littles**  
`Jesus sitting among several children of different ages, gentle and kind expression, open arms, simple robes, children looking at him with joy, simple hillside or ground under them`

**Creation (Wonder) — Littles**  
`Simple scene of the sixth day of Creation: animals and birds around a man and woman (Adam and Eve) looking up in wonder, large sun as a simple circle in the sky, big simple shapes, peaceful garden feeling`

**David & Goliath (Brave) — Older kids**  
`Young David standing bravely with a simple sling, looking up at a large but not terrifying Goliath, both figures clear and bold, minimal background`

**Daniel in the lions’ den (Courage) — Littles**  
`Daniel kneeling peacefully in prayer while large friendly-looking lions sit calmly around him, simple stone den walls, calm and trusting mood`

**Empty tomb / Resurrection (Hope) — Littles**  
`Empty tomb with the large stone rolled away, morning light as simple line rays only (no gray fill), one or two simple angels or just the open doorway, peaceful and hopeful atmosphere`
