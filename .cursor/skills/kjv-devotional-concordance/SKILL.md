---
name: kjv-devotional-concordance
description: Delivers KJV-only verse lookup and concordance-driven topic search with clear devotional explanations for adult and kids contexts. Use when the user asks to find/search Bible verses, gives a verse reference, requests KJV breakdowns, or wants search bars to map word meaning, action, and outcome to relevant scripture.
---

# KJV Devotional Concordance

## Purpose

Use this skill to produce KJV-only Bible responses for:
- direct verse references (example: `Philippians 4:6`)
- topic or intent searches (example: `search anxiety and prayer`)
- search-bar behavior design for both main and kids experiences

Keep all output practical, faithful to KJV wording, and easy to apply in daily life.

## Hard Rules

1. Use only King James Version text.
2. Never quote or cite NIV, ESV, or any other translation.
3. Start every response with the verse number in bold (example: `**Philippians 4:6**`).
4. If user says `search` or `find`, use KJV concordance-style matching, show candidate matches, then select the strongest verse.
5. Explanations must be plain-English and devotional, with no fluff.
6. Adult explanation: 3-4 sentences.
7. Add one real-life application tied to modern stress/prayer.
8. For kids context, keep wording age-appropriate, calm, and non-frightening.

## Response Modes

### 1) Verse Reference Mode

Trigger: user provides a verse reference.

Output in this exact order:
1. Bold verse reference line
2. Exact KJV verse text
3. 3-4 sentence plain-English breakdown (devotional + practical)
4. One real-life application for stress/prayer

Template:

```markdown
**<Book Chapter:Verse>**
<Exact KJV text>

<3-4 sentence plain-English devotional breakdown>

Application: <One concrete stress/prayer action for real life>
```

### 2) Search/Find Mode (Concordance-first)

Trigger: user says `search` or `find`, or gives topic words rather than a verse.

Workflow:
1. Parse topic words into:
   - meaning (what the user is feeling/seeking)
   - action (what Scripture calls the person to do)
   - outcome (what God promises/forms)
2. Pull multiple KJV candidate verses that match those terms.
3. Show concise matches list first.
4. Pick the strongest match and provide full breakdown using Verse Reference Mode structure.

Template:

```markdown
**Search Results (KJV Concordance)**
- <Ref 1> — <short KJV phrase>
- <Ref 2> — <short KJV phrase>
- <Ref 3> — <short KJV phrase>

**Strongest Match: <Book Chapter:Verse>**
<Exact KJV text>

<3-4 sentence plain-English devotional breakdown>

Application: <One concrete stress/prayer action for real life>
```

## Kids-safe Variant

Use when request references kids, children, or kids search bar.

Additional rules:
- Keep reading level simple and clear.
- Avoid harsh or scary phrasing unless directly necessary from verse text.
- Explain difficult words in gentle, everyday language.
- Application should be doable by a child with family/church support.

Kids breakdown target:
- 2-3 short sentences, kind tone, practical encouragement.

Kids template:

```markdown
**<Book Chapter:Verse>**
<Exact KJV text>

<2-3 short kid-friendly explanation sentences>

Try this today: <one child-safe prayer or action step>
```

## Search-Bar Implementation Guidance

When this skill is used to implement or improve site search behavior:
1. Keep two experiences:
   - main search: full devotional depth
   - kids search: simplified and kid-safe explanations
2. Parse user input by meaning/action/outcome before verse ranking.
3. Rank by strongest KJV alignment to intent, not keyword count alone.
4. Return multiple relevant KJV references before the primary pick.
5. Produce layman-friendly explanations so users can share the insight easily.
6. Do not remove existing search entry points; improve them in place.

## Quality Check Before Responding

- Starts with bold verse reference
- KJV-only text and references
- Correct mode chosen (reference vs search/find)
- Practical, non-generic explanation
- Includes application step
- Kids mode is gentle and easy to understand
