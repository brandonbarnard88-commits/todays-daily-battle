# Avatar Asset Checklist

Drop-in guide for the hero roster.

The avatar engine now supports full-roster lookup from `characters.json`.
If you search a character name (for example `Isaiah`, `Deborah`, `Nehemiah`),
the app auto-builds a hero profile with portrait fallback and `.riv` path.

## 1) Portrait files (already wired)

These are now referenced in `bible-character-avatars.json`:

- `icons/avatar-portrait-moses.svg`
- `icons/avatar-portrait-david.svg`
- `icons/avatar-portrait-esther.svg`
- `icons/avatar-portrait-ruth.svg`
- `icons/avatar-portrait-paul.svg`

Current files are safe placeholders so the UI works immediately.
Replace each file with your final art using the same filename.

For other characters, use:

- `icons/avatar-portrait-<character-slug>.svg`

If no custom portrait is present, the app auto-falls back to stage portraits.

## 2) Rive animation files (next drop-in)

Add these files at site root:

- `moses.riv`
- `david.riv`
- `esther.riv`
- `ruth.riv`
- `paul.riv`

For any other character in `characters.json`, use:

- `<character-slug>.riv`

Examples:

- `isaiah.riv`
- `deborah.riv`
- `nehemiah.riv`

The avatar system auto-loads each `.riv` from the `rive` field in
`bible-character-avatars.json`.

If a `.riv` is missing, the app falls back to static portrait and shows a
status hint in the Daily Tile.

## 3) Topic mapping now active

- `courage` -> David
- `love` -> Ruth
- `harvest` -> Ruth
- `leadership` -> Moses
- `boldness` -> Esther
- `mission` -> Paul

## 4) Optional quality spec for final exports

- Portrait size target: 1024x1024 or 2048x2048 source art
- Vector-friendly silhouette and thick outlines
- Transparent background
- Keep face/robe silhouette readable at 122x122 circle crop

