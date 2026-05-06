# Kids Corner Loops Audit – todaysdailybattle.com

**Goal**: Identify which of the 36 unlocked .webm loops mismatch their Bible story (wrong actions, props, characters, tone, etc.) so we can replace them accurately.

**Fix = replace the .webm file** in `/assets/loops/` (same filename; no code changes).

**Note:** Sequences are 10–15s blueprints only—adjust timing slightly for perfect seamless loop (end pose ≈ start pose).

---

## Status

| Item | Status |
|------|--------|
| 36 pre-drafted sequences | Done |
| Future sequences (David/Ark, Good Samaritan, Prodigal Son, etc.) | Done |
| Best practices + Quality elevation principles | Done |
| Single-loop polish pass template + 4 worked examples (David, Jonah, Burning Bush, Fiery Furnace) | Done |
| Report mismatch button (mailto + Google Form–ready) | Done |
| Banner (Variant B live) | Done |
| Google Form setup guide + config template | Done |
| Social nudge drafts | Done |
| **Remaining:** Create Google Form → share URL + entry IDs → paste config into script.js | Your action |

---

## Instructions for Auditor

Please watch on the live site: **https://todaysdailybattle.com/kids-corner**

- Play each loop 2–3 times (with sound if possible).
- Focus on first 3–5 seconds: Is the story instantly recognizable?
- Note key Bible moments: Are they shown accurately?
- Keep notes concise but specific.
- Fill one row per story; start with the top 6 priorities.

---

## Spot-check questions

1. **Recognizable in 3–5s?** (Yes/No – Does a kid instantly know the story from the opening?)
2. **Key actions/props accurate?** (E.g., David slings stone? Jonah swallowed by big fish/whale? Lions around Daniel? Ark in Noah?)
3. **Tone fit?** (Bouncy/fun OK for kids, but not too silly/goofy for serious moments like Fiery Furnace, Abraham/Isaac, or Ten Plagues.)
4. **Loop smoothness?** (Seamless repeat? No jarring cuts or awkward timing?)
5. **Generic/reused assets?** (Does it feel like the same animation reused across unrelated stories?)

---

## Report Mismatch note

Each loop card has a small "⚠ Report mismatch" button. When users click it, they can add optional details—it opens mailto:support@todaysdailybattle.com by default. To switch to Google Form: create the form, get the viewform URL and entry IDs, then set `LOOP_FEEDBACK_FORM` in script.js (see comment block in the loop library init). Prefilled form opens in new tab.

---

## Google Form setup guide

**Create the form** (forms.google.com → Blank form):

- **Title:** Kids Corner Animation Feedback
- **Description:** Help us make Bible stories even better for kids! Tell us if a loop doesn't match the story.
- **Questions:**
  - Dropdown (required): "Which story?" — Add all 36 options (see list below).
  - Paragraph (optional): "What's wrong / mismatched? (e.g., 'No stone flies', 'Tone too silly')"
  - Short answer (optional): "Your email (if you want a reply)"
  - Checkbox (optional): "This feels urgent / high priority"
- **Settings:** Collect email addresses? No. Confirmation: "Thanks! We'll review and improve the loops soon. 🙌"

**Dropdown options** (add each as a separate option; format: `N - Title (slug)`):

1 - David vs Goliath (david-slingshot), 2 - Noah Ark (noah-ark), 3 - Jonah Whale (jonah-whale), 4 - Daniel and the Lions (daniel-lions), 5 - Esther Crown (esther-crown), 6 - Joseph and the Coat (joseph-coat), 7 - Samson and the Pillars (samson-pillars), 8 - Ruth Gleans (ruth-glean), 9 - Baby Moses Basket (baby-moses), 10 - Jericho Walls Tumble (jericho-walls), 11 - Lazarus Rise (lazarus-rise), 12 - Jesus Calms the Boat (jesus-boat), 13 - Moses Sea-Split (moses-sea), 14 - Burning Bush (burning-bush), 15 - Ten Plagues (ten-plagues), 16 - Manna from Heaven (manna-falls), 17 - Ten Commandments (ten-commandments), 18 - Elijah Fire on Carmel (elijah-fire), 19 - Elisha Oil Pots (elisha-oil), 20 - Fiery Furnace Three (fiery-furnace), 21 - Naaman Washed Clean (naaman-wash), 22 - Creation Day One (creation-light), 23 - Adam and Eve Garden (adam-eve-garden), 24 - Tower of Babel (tower-babel), 25 - Abraham and Isaac (abraham-isaac), 26 - Jacob Dream Ladder (jacob-ladder), 27 - Joseph in Prison (joseph-prison), 28 - Joseph Pharaoh Dream (joseph-pharaoh), 29 - Moses Basket Found (moses-found), 30 - Passover Door (passover-door), 31 - Pillar of Fire (pillar-fire), 32 - Water from the Rock (water-rock), 33 - Golden Calf (golden-calf), 34 - Twelve Spies (twelve-spies), 35 - Bronze Serpent (bronze-serpent), 36 - Balaam Donkey (balaam-donkey)

**Get entry IDs:** Submit a test response → View responses → Link to Sheets. To prefill: fill form once manually → copy URL from browser address bar → extract `entry.XXXXX` params.

**Plug into script.js:** See `docs/LOOP-FEEDBACK-FORM-CONFIG.example.js` for the exact block. Replace `LOOP_FEEDBACK_FORM = null` with your config.

---

## Banner variants & A/B plan

**Variant A (direct):** "Spot something off? ⚠ Tap to tell us—new stories Sundays!"

**Variant B (playful, live):** "Loop lookin' funny? ⚠ Tell us quick—new stories Sundays! 😄"

**To swap:** Edit `kids-corner.html` — replace the text inside `.kids-corner-report-banner`.

**A/B test:** If reports stay low after 1–2 days, try Variant B for a week. Compare GA4 `loop_mismatch_report` events before/after. Or: use day-of-week (e.g., Mon/Wed/Fri = A, Tue/Thu/Sat = B) and track which days get more reports.

**Visibility check:** If banner doesn't show—incognito refresh, clear cache, check dev tools for CSS overrides. Ensure `.kids-corner-report-banner` has no `display:none` from parent. Add `z-index: 1` if it's behind other elements.

---

## Social nudge (draft for X / social)

**Long:** Kids Corner just got 36 short Bible story loops—David, Noah, Jonah, Daniel & more. Bright, bouncy, replayable. Spot something off? Tap ⚠ to help us make 'em perfect. New stories every Sunday. 🙌 todaysdailybattle.com/kids-corner

**Short:** 36 Bible cartoon loops for kids—David, Noah, Jonah & more. See a mismatch? Tap ⚠ to report. New stories Sundays. todaysdailybattle.com/kids-corner 🙌

**Hashtag-ready:** Kids Corner has 36 Bible loops for kids! Spot a mismatch? ⚠ Tap to report & help improve. New Sundays → todaysdailybattle.com/kids-corner 🙌 #BibleForKids

---

## Audit table (add rows as needed for all 36)

| # | Story Title | Bible Ref | What's Shown in First 5s? (main action/characters) | Core Iconic Moment Present? (Yes/No + note) | Mismatch Details | Priority (1–5) | Notes / Suggested Fix Ideas |
|---|-------------|-----------|----------------------------------------------------|---------------------------------------------|------------------|---------------|-----------------------------|
| 1 | David vs Goliath | 1 Samuel 17:49 | | | | 5 | |
| 2 | Noah Ark | Genesis 7:7 | | | | 5 | |
| 3 | Jonah Whale | Jonah 1:17 | | | | 5 | |
| 4 | Daniel and the Lions | Daniel 6:22 | | | | 4 | |
| 5 | Moses Sea-Split | Exodus 14:21 | | | | 4 | |
| 6 | Jericho Walls Tumble | Joshua 6:20 | | | | 4 | |
| 7 | Esther Crown | Esther 4:14 | | | | 3 | |
| ... | (Continue for remaining 30 as time allows) | ... | ... | ... | ... | ... | ... |

**Next**: After filling (even just top 6–10), share mismatches here or email them. We'll draft exact replacement sequences from there.

**Google Sheet alternative**: Copy the table into Sheets for easier sorting/filtering. Add an "Auditor Name/Date" column if multiple people help.

---

## Starter 12 (week 0) — highest visibility

| # | Story Title | Bible Ref | .webm Filename | What's Wrong / Mismatch | Priority | Fix |
|---|-------------|-----------|----------------|-------------------------|----------|-----|
| 1 | David vs Goliath | 1 Samuel 17:49 | david-slingshot.webm | | 5 | |
| 2 | Noah Ark | Genesis 7:7 | noah-ark.webm | | 5 | |
| 3 | Jonah Whale | Jonah 1:17 | jonah-whale.webm | | 5 | |
| 4 | Daniel and the Lions | Daniel 6:22 | daniel-lions.webm | | 5 | |
| 5 | Esther Crown | Esther 4:14 | esther-crown.webm | | 4 | |
| 6 | Joseph and the Coat | Genesis 37:3 | joseph-coat.webm | | 4 | |
| 7 | Samson and the Pillars | Judges 16:30 | samson-pillars.webm | | 4 | |
| 8 | Ruth Gleans | Ruth 2:2 | ruth-glean.webm | | 3 | |
| 9 | Baby Moses Basket | Exodus 2:5 | baby-moses.webm | | 4 | |
| 10 | Jericho Walls Tumble | Joshua 6:20 | jericho-walls.webm | | 5 | |
| 11 | Lazarus Rise | John 11:43-44 | lazarus-rise.webm | | 4 | |
| 12 | Jesus Calms the Boat | Mark 4:39 | jesus-boat.webm | | 4 | |

---

## Week 1 (13–24)

| # | Story Title | Bible Ref | .webm Filename | What's Wrong / Mismatch | Priority | Fix |
|---|-------------|-----------|----------------|-------------------------|----------|-----|
| 13 | Moses Sea-Split | Exodus 14:21 | moses-sea.webm | | 5 | |
| 14 | Burning Bush | Exodus 3:2 | burning-bush.webm | | 4 | |
| 15 | Ten Plagues | Exodus 12:29 | ten-plagues.webm | | 3 | |
| 16 | Manna from Heaven | Exodus 16:15 | manna-falls.webm | | 3 | |
| 17 | Ten Commandments | Exodus 20:1-2 | ten-commandments.webm | | 3 | |
| 18 | Elijah Fire on Carmel | 1 Kings 18:38 | elijah-fire.webm | | 4 | |
| 19 | Elisha Oil Pots | 2 Kings 4:6 | elisha-oil.webm | | 3 | |
| 20 | Fiery Furnace Three | Daniel 3:25 | fiery-furnace.webm | | 4 | |
| 21 | Naaman Washed Clean | 2 Kings 5:14 | naaman-wash.webm | | 3 | |
| 22 | Creation Day One | Genesis 1:3 | creation-light.webm | | 4 | |
| 23 | Adam and Eve Garden | Genesis 2:15 | adam-eve-garden.webm | | 3 | |
| 24 | Tower of Babel | Genesis 11:4 | tower-babel.webm | | 3 | |

---

## Week 2 (25–36)

| # | Story Title | Bible Ref | .webm Filename | What's Wrong / Mismatch | Priority | Fix |
|---|-------------|-----------|----------------|-------------------------|----------|-----|
| 25 | Abraham and Isaac | Genesis 22:12 | abraham-isaac.webm | | 5 | |
| 26 | Jacob Dream Ladder | Genesis 28:12 | jacob-ladder.webm | | 3 | |
| 27 | Joseph in Prison | Genesis 39:21 | joseph-prison.webm | | 3 | |
| 28 | Joseph Pharaoh Dream | Genesis 41:39-40 | joseph-pharaoh.webm | | 3 | |
| 29 | Moses Basket Found | Exodus 2:10 | moses-found.webm | | 3 | |
| 30 | Passover Door | Exodus 12:13 | passover-door.webm | | 3 | |
| 31 | Pillar of Fire | Exodus 13:21 | pillar-fire.webm | | 3 | |
| 32 | Water from the Rock | Exodus 17:6 | water-rock.webm | | 3 | |
| 33 | Golden Calf | Exodus 32:4 | golden-calf.webm | | 3 | |
| 34 | Twelve Spies | Numbers 13:27 | twelve-spies.webm | | 3 | |
| 35 | Bronze Serpent | Numbers 21:9 | bronze-serpent.webm | | 3 | |
| 36 | Balaam Donkey | Numbers 22:28 | balaam-donkey.webm | | 3 | |

---

## Pre-drafted loop sequences (10–15s)

Use these as blueprints in your animation tool (After Effects, etc.). Keep consistent: bright hand-drawn, bouncy movements, gold shine accents, 10–15s total, seamless loop (end flows back to start), ukulele/SFX compatible. Adjust after mismatch reports come in.

### 1. David vs Goliath (1 Samuel 17:49)

| Time | Action |
|------|--------|
| 0–4s | Young David (shepherd tunic, sling) approaches giant armored Goliath (mocking pose). |
| 4–8s | David loads stone, spins sling → releases (whoosh SFX). |
| 8–12s | Stone hits forehead → Goliath staggers/falls face-down (thud). |
| 12–15s | Israelites cheer, David victorious (gold shine) → loop to approach. |

### 2. Noah Ark (Genesis 7:7)

| Time | Action |
|------|--------|
| 0–4s | Animals march two-by-two up ramp into large wooden ark. |
| 4–8s | Noah/family wave last in → door closes, rain starts (pitter-patter SFX). |
| 8–12s | Waters rise, ark floats safely. |
| 12–15s | Rainbow peeks, animals peek out happily → loop to marching. |

### 3. Jonah Whale (Jonah 1:17)

| Time | Action |
|------|--------|
| 0–4s | Jonah flees → thrown overboard in storm (splash/thunder). |
| 4–9s | Great fish (biblical whale-like, wide mouth) swallows whole (gulp). |
| 9–13s | Jonah prays inside belly (hopeful gold light). |
| 13–15s | Fish spits onto shore, Jonah praises → loop to fleeing. |

### 4. Daniel and the Lions (Daniel 6:22)

| Time | Action |
|------|--------|
| 0–4s | Daniel prays in dark den → fierce lions approach (growl). |
| 4–8s | Lions lie down peacefully (angel glow protects, gold shine). |
| 8–12s | King watches amazed → Daniel safe. |
| 12–15s | Daniel praises, lions calm/yawn → loop to praying. |

### 5. Esther Crown (Esther 4:14)

| Time | Action |
|------|--------|
| 0–4s | Esther in royal robe → Mordecai urges her bravely. |
| 4–8s | Esther prays/decides ("for such a time") → gold shine glow. |
| 8–12s | Approaches throne → king extends scepter. |
| 12–15s | Victory/celebration → loop to royal approach. |

### 6. Joseph and the Coat (Genesis 37:3)

| Time | Action |
|------|--------|
| 0–4s | Joseph in colorful coat → brothers jealous. |
| 4–8s | Brothers plot → strip coat, throw into pit. |
| 8–12s | Traders pass → coat dipped in blood (sad moment). |
| 12–15s | Joseph dreams hopeful (stars bow) → loop to coat pride. |

### 7. Samson and the Pillars (Judges 16:30)

| Time | Action |
|------|--------|
| 0–4s | Blindfolded Samson led into Philistine temple. |
| 4–8s | Prays for strength → pushes two pillars (strain SFX). |
| 8–12s | Pillars crack/crumble → temple collapses (crash). |
| 12–15s | Victory implied (gold shine burst) → loop to pushing. |

### 8. Ruth Gleans (Ruth 2:2)

| Time | Action |
|------|--------|
| 0–4s | Ruth in fields gleaning leftover grain humbly. |
| 4–8s | Boaz notices/kindly offers protection/food. |
| 8–12s | Ruth gathers happily → loyalty to Naomi shown. |
| 12–15s | Blessing/gold shine → loop to gleaning. |

### 9. Baby Moses Basket (Exodus 2:5)

| Time | Action |
|------|--------|
| 0–4s | Baby Moses in reed basket on Nile → hidden by mother. |
| 4–8s | Pharaoh's daughter finds → opens basket compassionately. |
| 8–12s | Miriam watches → suggests Hebrew nurse (Moses' mom). |
| 12–15s | Baby safe/happy → loop to basket floating. |

### 10. Jericho Walls Tumble (Joshua 6:20)

| Time | Action |
|------|--------|
| 0–4s | Israelites march around walls with ark/trumpets (horn SFX). |
| 4–8s | Seventh circle → trumpet blast, shout. |
| 8–12s | Walls crack/crumble (rumble/crash). |
| 12–15s | Victory cheer inside city → loop to marching. |

### 11. Lazarus Rise (John 11:43-44)

| Time | Action |
|------|--------|
| 0–4s | Jesus at tomb → calls "Lazarus, come out!" (echo). |
| 4–8s | Stone rolls → Lazarus emerges wrapped/alive. |
| 8–12s | Unwraps → amazement/cheer. |
| 12–15s | Jesus praised, joy → loop to calling. |

### 12. Jesus Calms the Boat (Mark 4:39)

| Time | Action |
|------|--------|
| 0–4s | Disciples in storm-tossed boat → fear/waves crash. |
| 4–8s | Jesus sleeps → wakes, rebukes wind/waves ("Peace!"). |
| 8–12s | Storm stops instantly → calm sea. |
| 12–15s | Disciples amazed → loop to storm start. |

### 13. Moses Sea-Split (Exodus 14:21)

| Time | Action |
|------|--------|
| 0–4s | Israelites trapped → Moses raises staff. |
| 4–9s | East wind → waters divide into walls (whoosh/splash). |
| 9–13s | Cross dry ground between walls. |
| 13–15s | Waters close on army → loop to raising staff. |

### 14. Burning Bush (Exodus 3:2)

| Time | Action |
|------|--------|
| 0–4s | Moses with sheep → spots bush in bright flames (unconsumed). |
| 4–8s | Approaches → God calls name (gold rays, pulse). |
| 8–12s | Removes sandals → mission revealed (glory burst). |
| 12–15s | Bows in reverence → loop to spotting. |

### 15. Ten Plagues (Exodus 12:29)

| Time | Action |
|------|--------|
| 0–4s | Pharaoh refuses → plagues begin (frogs, locusts flash). |
| 4–8s | Final plague (darkness, death angel passes). |
| 8–12s | Pharaoh lets go → Israelites leave. |
| 12–15s | Freedom/joy → loop to refusal. |

### 16. Manna from Heaven (Exodus 16:15)

| Time | Action |
|------|--------|
| 0–4s | Grumbling in desert → morning dew. |
| 4–8s | Dew gone → manna flakes appear (sparkle). |
| 8–12s | Gather/taste (sweet) → praise. |
| 12–15s | Manna falls again → loop to grumble. |

### 17. Ten Commandments (Exodus 20:1-2)

| Time | Action |
|------|--------|
| 0–4s | Moses on Sinai → cloud/thunder (gold rays). |
| 4–8s | God speaks → tablets written (law flashes). |
| 8–12s | Moses receives → descends in awe. |
| 12–15s | People wait, tablets glow → loop to ascend. |

### 18. Elijah Fire on Carmel (1 Kings 18:38)

| Time | Action |
|------|--------|
| 0–4s | Elijah vs prophets → altar prepared. |
| 4–8s | Prays → fire falls from heaven (whoosh). |
| 8–12s | Altar consumed → people turn to God. |
| 12–15s | Victory/cheer → loop to prayer. |

### 19. Elisha Oil Pots (2 Kings 4:6)

| Time | Action |
|------|--------|
| 0–4s | Widow in need → Elisha instructs pour oil. |
| 4–8s | Pots fill miraculously (pour SFX). |
| 8–12s | Oil stops when full → debt paid. |
| 12–15s | Joy/thanks → loop to pouring. |

### 20. Fiery Furnace Three (Daniel 3:25)

| Time | Action |
|------|--------|
| 0–4s | Three refuse idol → thrown into furnace (flames). |
| 4–9s | King sees four walking unharmed (angel gold shine). |
| 9–13s | Praise inside fire → flames harmless. |
| 13–15s | Emerge untouched → loop to refusal. |

### 21. Naaman Washed Clean (2 Kings 5:14)

| Time | Action |
|------|--------|
| 0–4s | Naaman leprous → Elisha says dip in Jordan. |
| 4–8s | Dips seven times → skin healed. |
| 8–12s | Returns praising God. |
| 12–15s | Joy/clean → loop to dipping. |

### 22. Creation Day One (Genesis 1:3)

| Time | Action |
|------|--------|
| 0–4s | Dark void → "Let there be light!" (gold burst). |
| 4–8s | Light separates darkness → day/night. |
| 8–12s | Creation shapes begin. |
| 12–15s | God sees good → peaceful glow → loop to void. |

### 23. Adam and Eve Garden (Genesis 2:15)

| Time | Action |
|------|--------|
| 0–4s | God forms Adam → places in Eden garden. |
| 4–8s | Eve created → together in beauty. |
| 8–12s | Walk with God (gold shine presence). |
| 12–15s | Harmony → loop to garden. |

### 24. Tower of Babel (Genesis 11:4)

| Time | Action |
|------|--------|
| 0–4s | People build tall tower → prideful. |
| 4–8s | God confuses languages → chaos. |
| 8–12s | Scatter across earth. |
| 12–15s | God's plan → loop to building. |

### 25. Abraham and Isaac (Genesis 22:12)

| Time | Action |
|------|--------|
| 0–4s | Abraham/Isaac climb mountain → altar built. |
| 4–8s | Knife raised → angel stops (ram provided). |
| 8–12s | Sacrifice ram → blessing promised. |
| 12–15s | Faith rewarded (gold shine) → loop to climb. |

### 26. Jacob Dream Ladder (Genesis 28:12)

| Time | Action |
|------|--------|
| 0–4s | Jacob sleeps with stone pillow → dreams ladder to heaven. |
| 4–8s | Angels ascend/descend → God promises land/blessing. |
| 8–12s | Wakes in awe → anoints stone. |
| 12–15s | Vow to God → loop to dream. |

### 27. Joseph in Prison (Genesis 39:21)

| Time | Action |
|------|--------|
| 0–4s | Joseph imprisoned → God with him (gold shine). |
| 4–8s | Interprets dreams for cupbearer/baker. |
| 8–12s | Favor in prison → hope. |
| 12–15s | God's plan → loop to interpreting. |

### 28. Joseph Pharaoh Dream (Genesis 41:39-40)

| Time | Action |
|------|--------|
| 0–4s | Pharaoh dreams cows/plants → Joseph called. |
| 4–8s | Interprets famine → advises store grain. |
| 8–12s | Made ruler → prepares Egypt. |
| 12–15s | Wisdom honored → loop to dream. |

### 29. Moses Basket Found (Exodus 2:10)

| Time | Action |
|------|--------|
| 0–4s | Pharaoh's daughter finds basket → baby cries. |
| 4–8s | Compassion → adopts as son. |
| 8–12s | Miriam suggests nurse → Moses' mom cares. |
| 12–15s | Moses grows safe → loop to finding. |

### 30. Passover Door (Exodus 12:13)

| Time | Action |
|------|--------|
| 0–4s | Blood on doorposts → death angel passes over. |
| 4–8s | Israelites ready → eat lamb/hurry. |
| 8–12s | Freedom begins. |
| 12–15s | Protection/joy → loop to blood marking. |

### 31. Pillar of Fire (Exodus 13:21)

| Time | Action |
|------|--------|
| 0–4s | Israelites travel → pillar of cloud by day. |
| 4–8s | Night → pillar of fire guides/protects. |
| 8–12s | God's presence constant. |
| 12–15s | Safe journey → loop to cloud. |

### 32. Water from the Rock (Exodus 17:6)

| Time | Action |
|------|--------|
| 0–4s | Thirsty people grumble → Moses strikes rock. |
| 4–8s | Water gushes out abundantly. |
| 8–12s | Drink/refresh → praise. |
| 12–15s | God's provision → loop to striking. |

### 33. Golden Calf (Exodus 32:4)

| Time | Action |
|------|--------|
| 0–4s | People impatient → make golden calf idol. |
| 4–8s | Dance/worship falsely. |
| 8–12s | Moses descends → breaks tablets (anger). |
| 12–15s | Repentance call → loop to making calf. |

### 34. Twelve Spies (Numbers 13:27)

| Time | Action |
|------|--------|
| 0–4s | Spies enter Promised Land → giant grapes. |
| 4–8s | Report fear/giants → Caleb/Joshua faithful. |
| 8–12s | People doubt → wander consequence. |
| 12–15s | Faith vs fear → loop to grapes. |

### 35. Bronze Serpent (Numbers 21:9)

| Time | Action |
|------|--------|
| 0–4s | Snakes bite complainers → Moses prays. |
| 4–8s | Bronze serpent on pole lifted. |
| 8–12s | Look/faith → healed. |
| 12–15s | God's mercy → loop to lifting. |

### 36. Balaam Donkey (Numbers 22:28)

| Time | Action |
|------|--------|
| 0–4s | Balaam rides donkey → angel blocks path. |
| 4–8s | Donkey speaks/warns → Balaam angry. |
| 8–12s | Angel revealed → blessing instead of curse. |
| 12–15s | God's intervention → loop to riding. |

---

## Future / Week 3+ sequences (when unlocked)

### David and the Ark (2 Samuel 6)

| Time | Action |
|------|--------|
| 0–4s | David dances joyfully leading ark procession (music/celebration). |
| 4–8s | Uzzah touches ark to steady → struck down (sudden stop). |
| 8–12s | David fears → blesses Obed-Edom's house instead. |
| 12–15s | Ark returns safely → praise/gold shine → loop to dancing. |

### Good Samaritan (Luke 10:25-37)

| Time | Action |
|------|--------|
| 0–4s | Man beaten/robbed on road → priest/Levite pass by. |
| 4–8s | Samaritan stops → bandages, pours oil/wine. |
| 8–12s | Takes to inn → pays for care ("love your neighbor"). |
| 12–15s | Mercy shown → loop to road scene. |

### Prodigal Son (Luke 15:11-32)

| Time | Action |
|------|--------|
| 0–4s | Younger son demands inheritance → leaves home. |
| 4–8s | Squanders in wild living → pigs/famine hunger. |
| 8–12s | Returns repentant → father runs/hugs/celebrates (feast). |
| 12–15s | Joy/restoration → loop to leaving. |

### Jesus Feeds 5000 (John 6:11)

| Time | Action |
|------|--------|
| 0–4s | Crowd hungry → boy offers five loaves and two fish. |
| 4–8s | Jesus blesses → breaks and gives to disciples. |
| 8–12s | Disciples distribute → baskets fill (miracle sparkle). |
| 12–15s | All fed, twelve baskets left → praise/gold shine → loop. |

### Loaves and Fishes / Feeding (Matthew 14:19)

| Time | Action |
|------|--------|
| 0–4s | Jesus with disciples → crowd gathers. |
| 4–8s | Takes loaves/fish → looks to heaven, blesses. |
| 8–12s | Breaks and gives → everyone eats (abundance). |
| 12–15s | Baskets of leftovers → wonder → loop. |

### Jairus' Daughter Raised (Mark 5:41-42)

| Time | Action |
|------|--------|
| 0–4s | Jairus pleads → Jesus goes to house. |
| 4–8s | Mourners weep → Jesus says "She is not dead, but sleepeth." |
| 8–12s | Takes hand → "Talitha cumi" → girl rises (gold shine). |
| 12–15s | Amazement/joy → loop to pleading. |

### Zacchaeus (Luke 19:5)

| Time | Action |
|------|--------|
| 0–4s | Zacchaeus in sycamore tree → crowd below. |
| 4–8s | Jesus looks up → "Zacchaeus, make haste, come down." |
| 8–12s | Zacchaeus climbs down joyfully → Jesus invites himself. |
| 12–15s | Hospitality/repentance → loop to tree. |

### Lost Sheep (Luke 15:5)

| Time | Action |
|------|--------|
| 0–4s | Shepherd counts sheep → one missing. |
| 4–8s | Leaves ninety-nine → searches (hills, valleys). |
| 8–12s | Finds sheep → carries on shoulders (rejoice). |
| 12–15s | Returns home → celebration → loop to counting. |

---

## Best practices for short kids Bible animations (10–15s loops)

- **Front-load recognition** — Show the core iconic moment within first 3–5s so kids instantly know the story (e.g., bush flaming but not burning, David slinging stone). Prioritize the Bible's most memorable visual even if it compresses other parts.
- **Keep accurate & respectful** — Stick close to Bible details; use reverent tone for serious moments (Burning Bush, Fiery Furnace); avoid excessive goofiness in awe/worship scenes.
- **Bright, simple, engaging visuals** — Vibrant colors, clean hand-drawn style, bouncy movements; subtle gold shine for "holy" feel without overwhelming.
- **Short & seamless loop** — Plan end to flow into start (match poses/poses, onion skinning for smooth transition); 10–15s max.
- **Kid-friendly pacing & SFX** — Slow enough for young viewers; pair with playful ukulele + gentle SFX (whoosh, glow hum, cheer); no scary/intense effects.
- **Faith-affirming climax** — Build to positive/celebratory end (praise, victory, wonder) → loop back; reinforces Scripture message.
- **Test for clarity** — Does a child recognize the story from first few seconds? Is it memorable/educational? Pair with "Hear verse" for deeper tie-in.
- **Batch & iterate** — Template: setup → iconic action → resolution → loop; use reports/audit feedback to refine; backup originals before overwrite.

---

## Quality elevation principles (for re-exports)

Apply these when re-exporting .webm files to make loops more engaging, professional, and kid-captivating.

### Core principles

- **Enhance bounciness & life** — Use squash/stretch on impacts, anticipation/overshoot on actions (e.g., sling wind-up snap in David). Follow-through (hair/clothes jiggle). Ease in/out curves (not linear).
- **Front-load even stronger** — Make the Bible's most memorable visual dominant in first 2–3s (e.g., massive unburning flames, stone mid-flight). Immediate gold shine/glow burst on holy moments.
- **Polish line work & consistency** — Thicker character outlines, thinner backgrounds; reuse same character designs across loops. Onion skinning for proportions; subtle gradients for depth.
- **Better SFX & audio sync** — Align whoosh/cheer/gulp exactly to keyframe peaks; add light percussion on bouncy beats. Layer gentle reverb on cheers.
- **Seamless loop perfection** — End pose = start pose; test 20× loop preview—no jumps. Use 24–30 frame overlap blend if needed.
- **Color & shine upgrades** — Soft pastels for calm stories, bold for action; animate gold shine pulse/rays on divine moments (glow + particle hints).
- **Engagement boosters** — Wide-eye awe, victory smiles; subtle parallax layers or gentle camera push-in on climax. 720p–1080p, under 5MB per loop for fast load.

### Implementation plan

1. **Batch re-works** — Start with top 6–10 (David, Noah, Jonah, Daniel, Moses Sea-Split, Jericho). Use drafted sequences as base, layer these upgrades.
2. **Tool tips (After Effects)** — Graph Editor for bouncy easing (Easy Ease + overshoot). Duik/rubberhose for limb bounce. Glow + CC Light Rays for gold shine. Audio preview sync while keyframing.
3. **Test rigorously** — Testing checklist: Incognito browser (desktop + mobile), loop 20× seamless? Loads under 3s? Story clear in 3s? Feels fun + reverent?
4. **Future-proof** — Create "loop template" comp: base layers (bg, character rig, shine overlay, SFX track) to duplicate for new Sundays.

### Visual inspiration

- BibleProject clips (clean 2D, symbolic shine on divine moments)
- Superbook / VeggieTales shorts (bouncy cartoon energy, squash/stretch)
- Modern AI-assisted Bible animations (consistent characters, smooth loops)

Adapt their polish (smooth easing, glow effects, consistent characters) to your hand-drawn style—avoid copying exact assets.

### Single-loop polish pass (step-by-step)

When elevating one specific loop (e.g., #1 David, #3 Jonah, #14 Burning Bush):

1. **Identify pain point** — What feels off? (stiff sling, flat flames, missing gulp bounce, etc.)
2. **Bounciness** — Add squash/stretch on impacts; anticipation/overshoot on main action (e.g., sling wind-up → snap); follow-through on hair/clothes. Graph Editor: Easy Ease + overshoot.
3. **Front-load** — Make the iconic moment dominant in first 2–3s (bigger scale, gold shine burst).
4. **SFX sync** — Align whoosh/cheer/gulp to exact keyframe peaks; light percussion on bouncy beats.
5. **Shine/glow** — Animate gold pulse/rays on faith moments (Glow + CC Light Rays).
6. **Loop check** — End pose = start pose; test 20× preview—no jumps.
7. **Test** — Incognito (desktop + mobile), loads under 3s? Story clear in 3s? Feels fun + reverent?

### Worked example: #1 David vs Goliath (pain point: sling throw feels stiff, no overshoot)

1. **Identify** — Stone release lacks anticipation; hit lacks squash/stretch.
2. **Bounciness** — Add wind-up (David leans back slightly before spin, 0.5s stretch). Overshoot: sling arm extends past release point 2–3 frames before settling. Goliath fall: squash on impact (compress vertically), then stretch as he rebounds.
3. **Front-load** — Scale up stone in flight (2–3s) so it's clearly visible; add motion blur trail.
4. **SFX sync** — Whoosh at frame of release (not before); thud at frame of impact; cheer starts 0.5s after Goliath hits ground.
5. **Shine/glow** — Gold burst at moment of victory (David raises arms); subtle pulse on stone as it flies.
6. **Loop check** — End frame: David in same pose as 0s (walking toward Goliath); use 12–15 frame overlap blend.
7. **Test** — Incognito, mobile, 20× loop—no jump, story clear in 3s.

### Worked example: #3 Jonah Whale (pain point: swallow lacks impact, no big gulp bounce or inside prayer moment)

1. **Identify** — Fish swallow feels flat; no inside-belly prayer moment; tone too silly for repentance.
2. **Bounciness** — Fish mouth: stretch open (anticipation) → snap shut (gulp) with squash on close. Jonah: slight overshoot as he's pulled in; inside belly: gentle bounce as he settles to pray.
3. **Front-load** — Make fish rise from water more dramatic (scale up, 2–3s); mouth visible and prominent before swallow.
4. **SFX sync** — Big gulp at exact frame of mouth close; splash when Jonah hits water; inside: muffled hum/glow pulse.
5. **Shine/glow** — Inside belly: dark but hopeful gold rays from above (God's presence); Jonah's prayer pose with subtle glow.
6. **Loop check** — End: Jonah on shore praising → loop to fleeing/running (same pose as 0s).
7. **Test** — Incognito, mobile, 20× loop—swallow feels impactful, prayer moment clear, reverent tone.

### Worked example: #14 Burning Bush (pain point: flames feel static, missing holy pulse/glow)

1. **Identify** — Flames static; no holy pulse; Moses approach feels flat; awe moment missing shine.
2. **Bounciness** — Flames: gentle pulse (expand/contract) every 1–2s; leaves stay green (unconsumed). Moses: slight overshoot as he stops, then steps back in awe.
3. **Front-load** — Bush engulfed in bright flames (no burning) in first 2s; scale up flames so they dominate frame.
4. **SFX sync** — Soft crackle/hum at flame pulse; gentle "whoosh" when God speaks (gold rays appear).
5. **Shine/glow** — Gold rays/glow pulse from bush when God calls name; Moses removes sandals—gold burst at that moment; CC Light Rays on divine presence.
6. **Loop check** — End: Moses bows → loop to spotting bush (same pose as 0s).
7. **Test** — Incognito, mobile, 20× loop—flames feel alive, holy presence clear, reverent awe.

### Worked example: #20 Fiery Furnace Three (pain point: no clear fourth figure, flames too tame)

1. **Identify** — Fourth figure (angel/God's presence) not visible; flames too harmless/boring; protection glow weak.
2. **Bounciness** — Flames: dynamic swirl, not static; three walk with confident stride (overshoot on steps). Fourth figure: gentle pulse/glow.
3. **Front-load** — Four figures in furnace (not three) visible in first 2–3s; fourth figure with distinct gold/angel glow.
4. **SFX sync** — Roar of fire at furnace entry; calm hum inside when four walk; king's amazed reaction—cheer or gasp.
5. **Shine/glow** — Fourth figure: angel-like gold glow, rays protecting three; flames part around them; no harm.
6. **Loop check** — End: three emerge untouched → loop to refusal/being thrown in (match pose).
7. **Test** — Incognito, mobile, 20× loop—fourth figure clear, flames intense but not scary, protection obvious.

---

## Fixing mismatches (concise workflow)

1. **Audit** — Share doc with helper → they watch top stories, fill table (first 5s, iconic yes/no, mismatches, priority).
2. **Collect feedback** — Monitor email/GA4 from ⚠ Report button → note specific issues (e.g., "no flames on bush").
3. **Replace** — Backup old .webm → re-edit/export new using drafted sequence → overwrite same filename in `/assets/loops/` → deploy & clear cache.
4. **Test** — View in incognito → confirm match, smooth loop, fast load; run `npm run test`, `npm run test:site`.
5. **Repeat** — Do 3–5 per batch; add new weekly ones with template checklist.

---

## Export preset (for new/replacement loops)

- Format: WebM (VP8/VP9)
- Resolution: 720p or 1080p
- 30fps
- 10–15s, loop seamless (last frame ≈ first)
- Style: bright hand-drawn, bouncy, gold shine

---

## Note

`/assets/loops/` in the repo is empty; loops may be served from CDN or another host.  
Replace files where they’re actually deployed (e.g. Cloudflare Pages static assets).

**Next step for you**: Share this doc/link with 1–2 trusted people (family, friend, church member) who can view the site today. Ask them to spend 30–60 min on it.
