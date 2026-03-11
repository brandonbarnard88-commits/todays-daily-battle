# Search Expansion Samples

Sample expanded keyword sets for test queries. Used to verify and refine MEANING_MAP, ACTION_MAP, FEELING_NEED_MAP, OUTCOME_MAP, REACTION_MAP, and PROMISE_MAP.

## Test Queries

### "put on armour"

- **Raw tokens:** put, on, armour
- **Expansion:** `armour` → REACTION_MAP.stand → stand, stood, withstanding, armour, armor
- **Expected expanded terms:** armour, armor, stand, stood, withstanding, put
- **Map keys hit:** reaction:armour (via reverse lookup), reaction:stand
- **Reaction boost:** Verses containing stand, armour, withstanding get +1 score

### "flee youthful lusts"

- **Raw tokens:** flee, youthful, lusts
- **Expansion:** `flee` → REACTION_MAP.flee → flee, fled, fleeing, escape, avoid
- **Expected expanded terms:** flee, fled, fleeing, escape, avoid, youthful, lusts
- **Map keys hit:** reaction:flee
- **Reaction boost:** Verses with flee, escape, avoid get +1 score

### "giving up"

- **Raw tokens:** giving, up (or compound givingup)
- **Expansion:** `givingup` → FEELING_NEED_MAP → persevere, endure, hope, run, faint, weary, strength, patience, finish, race
- **Expected expanded terms:** persevere, endure, hope, run, faint, weary, strength, patience, finish, race, giving, up
- **Map keys hit:** feeling:givingup

### "overwhelmed"

- **Raw tokens:** overwhelmed
- **Expansion:** FEELING_NEED_MAP.overwhelmed → peace, rest, cast, care, burden, yoke, easy, light
- **Expected expanded terms:** overwhelmed, peace, rest, cast, care, burden, yoke, easy, light
- **Map keys hit:** feeling:overwhelmed
- **Reaction boost:** Verses with cast, care (from REACTION_MAP.cast) get +1 if matched

### "stand firm"

- **Raw tokens:** stand, firm
- **Expansion:** `stand` → REACTION_MAP.stand → stand, stood, withstanding, armour, armor
- **Expected expanded terms:** stand, stood, withstanding, armour, armor, firm
- **Map keys hit:** reaction:stand
- **Reaction boost:** Strong—Ephesians 6:13–14, 1 Corinthians 16:13 rank higher

### "I will never leave thee"

- **Raw tokens:** i, will, never, leave, thee (or compound neverleave)
- **Expansion:** `neverleave` → PROMISE_MAP → forsake, leave, with, presence, abide
- **Expected expanded terms:** forsake, leave, with, presence, abide, never, thee
- **Map keys hit:** promise:neverleave

### "God will provide"

- **Raw tokens:** god, will, provide
- **Expansion:** `provide` → PROMISE_MAP → supply, need, according, riches, glory, giveth, daily, bread
- **Map keys hit:** promise:provide

### "heal my heart" / "God heals"

- **Raw tokens:** heal, my, heart (or god, heals)
- **Expansion:** `heal` → PROMISE_MAP → heal, healed, healing, restore, whole, cleansed, bind, wounds
- **Map keys hit:** promise:heal

### "protect me" / "God protects"

- **Raw tokens:** protect, me (or god, protects)
- **Expansion:** `protect` → PROMISE_MAP → defence, fortress, shield, deliver, preserve, shadow, refuge, strong
- **Map keys hit:** promise:protect

### "guide my steps"

- **Raw tokens:** guide, my, steps
- **Expansion:** `guide` → PROMISE_MAP → guide, lead, path, way, counsel, direct, teach, shepherd
- **Map keys hit:** promise:guide

## Verification

Run `npm run test:site` — search logic tests assert phrase search, synonym expansion, and fallback verses.

To manually verify expansion, search from the homepage or bible-tool and check the "Expanded for:" tag under results.
