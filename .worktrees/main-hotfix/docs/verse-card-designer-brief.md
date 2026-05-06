# Verse card backgrounds — designer brief (Today’s Daily Battle)

Quiet, KJV-only, privacy-first site. Art should feel like **dawn after a long night**: soft light, restraint, no hype, no stock-photo cheer. **Eagles, lilies, water, fields** may appear only as **faint** elements—verse text stays primary.

## Deliverables (12 templates)

Canonical keys in code: `T01-classic-soar` … `T12-minimal-landscape` (legacy `A-dawn-soar` … `F-cross-shadow` still map to the first six for old saves).

| ID | Key | Name | Pixel size | Aspect | Notes |
|----|-----|------|------------|--------|--------|
| T01 | `T01-classic-soar` | Classic soar | 1080×1080 | 1:1 | Gold → pale blue sky; **very subtle** eagle wing lower corner; safe for white/cream verse type |
| T02 | `T02-gentle-water` | Gentle water reflection | 1080×1350 | ~4:5 | Calm water at sunrise, soft reflection; optional tiny lily or cross |
| T03 | `T03-open-field` | Open field | 1080×1080 | 1:1 | Soft green field at dawn; peaceful, hope/grief friendly |
| T04 | `T04-eagle-flight` | Eagle flight | 1080×1080 | 1:1 | Slightly bolder sunrise; clear but low-contrast wing / flight suggestion |
| T05 | `T05-lily-bloom` | Lily bloom | 1080×1080 | 1:1 | Soft morning light, white lily suggestion (illustrative, not photo-real) |
| T06 | `T06-rock-river` | Rock & river | 1080×1080 | 1:1 | Stable rock, gentle water (Psalm 61:2 mood); calm, not dramatic |
| T07 | `T07-night-peace` | Night peace | 1080×1920 | 9:16 | Deep navy, soft stars or light rays; white or soft gold type |
| T08 | `T08-cross-shadow` | Cross shadow | 1080×1080 | 1:1 | Almost flat field; **barely visible** cross; minimalist |
| T09 | `T09-morning-mist` | Morning mist | 1080×1080 | 1:1 | Misty field, rising sun; **dark ink** verse type on art |
| T10 | `T10-scripture-memory` | Scripture memory | 1080×1080 | 1:1 | Off-white + subtle paper texture; print-friendly; app adds “Memorize & Share” |
| T11 | `T11-family-blessing` | Family blessing | 1080×1080 | 1:1 | Warm parchment, soft floral **border** corners; leave lower area calm for optional note |
| T12 | `T12-minimal-landscape` | Minimal blank | 1200×630 | OG / wide | Very light, almost flat; verse + ref only—user or designer can composite photo on top |

**Optional exports (same art, different crops):** 1080×1920 story crop where the composition allows; 1200×630 for link previews (T12 is native wide).

**Safe zone:** keep **15–20%** clear margin on all sides (no critical detail there)—we draw KJV verse, reference, footer (“Today’s Verse — A Quiet Place”, `todaysdailybattle.com`, KJV).

## File format

- **PNG** (with transparency option where useful) + **JPEG** or **WebP** fallback per template; target **&lt; 2 MB** per full-res file when reasonable.
- Name files under `/assets/verse-templates/`, e.g. `verse-template-t01-classic-soar.webp` … `verse-template-t12-minimal.webp` (we wire paths in `verse-image.js` when assets land).
- **sRGB**, embedded color profile optional.

## Licensing

- **Work for hire** or exclusive license to the site owner.
- **No** unlicensed stock, **no** scraped marketplace art. Original or properly licensed assets only.

---

## Copy-paste: Fiverr / Upwork gig posting

**Title:** Original background art for KJV verse share cards (12 moods, dawn / quiet aesthetic)

**Description:**

We need **twelve** original background images for a Christian devotional site (King James Bible only). Tone: **quiet, reverent, calm**—early morning light, not neon or motivational-poster style. Grouped moods: peace & hope, strength & endurance, comfort & rest, memory & share.

**Specs (exact pixels):**

1. **1080×1080** — Dawn sky: soft gold to pale blue; very subtle wing in one lower corner.  
2. **1080×1350** — Sunrise over still water, soft reflection; minimal.  
3. **1080×1080** — Soft green field at dawn.  
4. **1080×1080** — Bolder sunrise with low-contrast flight / wing suggestion.  
5. **1080×1080** — Soft light, white lily (illustrative).  
6. **1080×1080** — Rock by calm water, restrained palette.  
7. **1080×1920** — Deep night blue, soft stars or faint rays.  
8. **1080×1080** — Minimal; extremely subtle cross.  
9. **1080×1080** — Misty morning field; **must** stay light enough for dark text overlay.  
10. **1080×1080** — Cream / off-white, subtle paper grain; print-friendly.  
11. **1080×1080** — Warm parchment, soft floral corners only; center stays open.  
12. **1200×630** — Near-blank light gradient for social preview / compositing.

**All images:** **15–20%** empty margin on each edge. **No text** in the art—we add text in code.

**Deliver:** WebP + JPEG or PNG per image, full resolution, sRGB.  
**Rights:** Full ownership / work for hire.  
**Revisions:** 1–2 rounds for small adjustments.

---

## Implementation note (developers)

Until assets exist, `verse-image.js` draws **procedural gradients and shapes** on canvas per `bg` key (`soar`, `water_reflection`, `eagle_flight`, `lily_bloom`, `rock_river`, `family_blessing`, `minimal_blank`, etc.). Legacy template keys `A-dawn-soar` … `F-cross-shadow` normalize to T01, T02, T03, T10, T07, T08. When image files exist, add an optional `drawImage` layer in `drawSceneBackground` for each template.
