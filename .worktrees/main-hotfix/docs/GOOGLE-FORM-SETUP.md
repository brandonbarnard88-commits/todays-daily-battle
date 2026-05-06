# Google Form Setup — Loop Feedback

**Goal:** Collect structured mismatch reports from the Kids Corner "Report mismatch" button. The banner ("Loop lookin' funny? ⚠ Tell us quick—new stories Sundays! 😄") and button are live; this activates the Google Form flow.

---

## Step 1: Create the form

1. Go to [forms.google.com](https://forms.google.com) → **Blank form**
2. **Title:** Kids Corner Animation Feedback
3. **Description:** Help us make Bible stories even better for kids! Tell us if a loop doesn't match the story.

---

## Step 2: Add questions

| # | Type | Question | Required? | Notes |
|---|------|----------|-----------|-------|
| 1 | Dropdown | Which story? | Yes | Add all 36 options below |
| 2 | Paragraph | What's wrong / mismatched? (e.g., "No stone flies", "Tone too silly") | No | |
| 3 | Short answer | Your email (if you want a reply) | No | |
| 4 | Checkbox | This feels urgent / high priority | No | Single option |

---

## Step 3: Dropdown options (copy-paste)

Add each as a separate option in the "Which story?" dropdown:

```
1 - David vs Goliath (david-slingshot)
2 - Noah Ark (noah-ark)
3 - Jonah Whale (jonah-whale)
4 - Daniel and the Lions (daniel-lions)
5 - Esther Crown (esther-crown)
6 - Joseph and the Coat (joseph-coat)
7 - Samson and the Pillars (samson-pillars)
8 - Ruth Gleans (ruth-glean)
9 - Baby Moses Basket (baby-moses)
10 - Jericho Walls Tumble (jericho-walls)
11 - Lazarus Rise (lazarus-rise)
12 - Jesus Calms the Boat (jesus-boat)
13 - Moses Sea-Split (moses-sea)
14 - Burning Bush (burning-bush)
15 - Ten Plagues (ten-plagues)
16 - Manna from Heaven (manna-falls)
17 - Ten Commandments (ten-commandments)
18 - Elijah Fire on Carmel (elijah-fire)
19 - Elisha Oil Pots (elisha-oil)
20 - Fiery Furnace Three (fiery-furnace)
21 - Naaman Washed Clean (naaman-wash)
22 - Creation Day One (creation-light)
23 - Adam and Eve Garden (adam-eve-garden)
24 - Tower of Babel (tower-babel)
25 - Abraham and Isaac (abraham-isaac)
26 - Jacob Dream Ladder (jacob-ladder)
27 - Joseph in Prison (joseph-prison)
28 - Joseph Pharaoh Dream (joseph-pharaoh)
29 - Moses Basket Found (moses-found)
30 - Passover Door (passover-door)
31 - Pillar of Fire (pillar-fire)
32 - Water from the Rock (water-rock)
33 - Golden Calf (golden-calf)
34 - Twelve Spies (twelve-spies)
35 - Bronze Serpent (bronze-serpent)
36 - Balaam Donkey (balaam-donkey)
```

---

## Step 4: Form settings

- **Collect email addresses?** No (we have optional email question)
- **Confirmation message:** "Thanks! We'll review and improve the loops soon. 🙌"

---

## Step 5: Get viewform URL and entry IDs

1. Click **Send** → copy the **link** (e.g. `https://docs.google.com/forms/d/e/1FAIpQLS.../viewform`)
2. Submit a **test response** (fill each field)
3. Go to **Responses** → **Link to Sheets** (creates a spreadsheet)
4. Or: Open the form in a new tab, fill it, submit → inspect the URL or use browser dev tools to see the `entry.XXXXX` params in the form action
5. **Easier method:** Use [this guide](https://support.google.com/docs/answer/2839588) — the prefill URL format is `viewform?usp=pp_url&entry.123456789=value`. Get entry IDs from the form's HTML source or by inspecting the submitted form request.

**Entry ID format:** `entry.123456789` (numbers vary per question)

---

## Step 6: Edit loop-feedback-config.js

Open `loop-feedback-config.js` in the project root. Replace `null` with your config (fill in your values):

```javascript
window.LOOP_FEEDBACK_FORM = {
  url: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
  storyEntry: 'entry.XXXXXXXXX',   // dropdown "Which story?"
  commentEntry: 'entry.YYYYYYYYY'  // paragraph "What's wrong?"
};
```

**Required:** `url`, `storyEntry`  
**Optional:** `commentEntry` (if omitted, comment won't be prefilled but user can still type)

Save the file and rebuild. No need to edit `script.js`.

---

## Step 7: Verify

1. Go to [todaysdailybattle.com/kids-corner](https://todaysdailybattle.com/kids-corner)
2. Click **⚠ Report mismatch** on any loop card
3. Form opens in new tab with story prefilled
4. Submit → confirmation message appears

---

## Reference

- Config example: `docs/LOOP-FEEDBACK-FORM-CONFIG.example.js`
- Audit doc: `docs/KIDS-LOOPS-AUDIT.md`
