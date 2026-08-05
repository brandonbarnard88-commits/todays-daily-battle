# script.js surfaces (home / plans / church)

**Why:** `script.js` is the shared interaction stack (~40k lines). A hard split in one PR is high-risk; surfaces give clear entry points and load policy while shared logic stays in one place for now.

## Surfaces

| Surface | Entry | Shared stack | Surface-specific |
|---------|-------|--------------|------------------|
| **home** (The Grove) | `core-home.js` + `js/surfaces/home.js` | `script.js` on intent/idle | Hero first-paint, Ask, Grove UI in `index.html` |
| **plans** (The Paths) | `js/surfaces/plans.js` then `script.js` | `script.js` module | `plans-builder.js`, plan data extensions |
| **church** | `js/surfaces/church.js` then `script.js` | `script.js` module | `church/church.js`, church CSS |

## Runtime flag

Each surface sets:

```js
window.TDB_SURFACE = 'home' | 'plans' | 'church'
window.TDB_SURFACE_META = { id, name, pathHints, ... }
```

Shared code may branch lightly on `TDB_SURFACE` (prefer feature detection / DOM presence first).

## Future extraction (post-freeze)

After the 90-day feature freeze, preferred order:

1. Extract pure data maps (topics, phrase tables) to `js/data/`  
2. Extract search engine to `js/search/`  
3. Extract home-only mount helpers to `js/home/`  
4. Keep auth/supabase and verse core shared  

Do **not** start that extraction during Grove-only freeze unless a critical bug forces it.
