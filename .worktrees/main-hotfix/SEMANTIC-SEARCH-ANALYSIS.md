# Semantic Search Test - Expected Behavior Analysis

Based on code analysis of `script.js`, here's what we expect for each query:

## Query Processing Pipeline

1. **Typo Correction** - `TYPO_CORRECTION` map fixes common misspellings
2. **Phrase Detection** - `PHRASE_TO_TOKENS` expands known phrases to relevant tokens
3. **Token Expansion** - `QUERY_TO_TOPIC` maps search words to topics
4. **Topic Scoring** - Scores topics based on keywords, synonyms, and semantic matches
5. **Fallback** - If no topic match, performs keyword search with expanded terms

---

## Query 1: "I feel condemned and guilty"

**Expected Processing:**
- Tokens: `feel`, `condemned`, `guilty`
- `QUERY_TO_TOPIC` maps: `guilty` → `guilt`, `condemnation` → `guilt`
- Should resolve to **GUILT topic**

**Expected Verses:**
- Psalms 103:12
- Romans 8:1
- 1 John 1:9
- Psalms 51:10
- Isaiah 43:25

**Relevance:** ✅ High - direct topic match

---

## Query 2: "How do I forgive someone who hurt me?"

**Expected Processing:**
- Tokens: `forgive`, `someone`, `hurt`
- `QUERY_TO_TOPIC` maps: `forgive` → `forgiveness`
- Should resolve to **FORGIVENESS topic**

**Expected Verses:**
- Matthew 6:14
- Ephesians 4:32
- Colossians 3:13
- Matthew 18:21
- Mark 11:25

**Relevance:** ✅ High - direct topic match

---

## Query 3: "I'm overthinking everything and can't sleep"

**Expected Processing:**
- Tokens: `overthinking`, `everything`, `cant`, `sleep`
- `PHRASE_TO_TOKENS`: "cant sleep" → `['sleep', 'peace', 'rest', 'anxiety']`
- `QUERY_TO_TOPIC` maps: `sleep` → `sleep`, `insomnia` → `sleep`
- Should resolve to **SLEEP or ANXIETY topic** (likely sleep due to explicit match)

**Expected Verses (if SLEEP):**
- Psalms 4:8
- Proverbs 3:24
- Psalms 127:2
- Matthew 11:28

**Expected Verses (if ANXIETY):**
- Philippians 4:6-7
- 1 Peter 5:7
- Matthew 6:34

**Relevance:** ✅ High - phrase detection should catch "cant sleep"

---

## Query 4: "selflessness"

**Expected Processing:**
- Single token: `selflessness`
- `QUERY_TO_TOPIC` maps: `selfless` → `love`
- Should resolve to **LOVE topic**

**Expected Verses:**
- 1 Corinthians 13:4-5
- Philippians 2:3-4
- John 13:34
- 1 John 4:19
- Romans 12:10

**Relevance:** ✅ High - semantic mapping exists

---

## Query 5: "healing from trauma"

**Expected Processing:**
- Tokens: `healing`, `trauma`
- `QUERY_TO_TOPIC` maps: `trauma` → `trauma`, `healing` → `trauma`, `heal` → `heal`
- Should resolve to **TRAUMA topic**

**Expected Verses:**
- Psalms 147:3
- Isaiah 61:1
- 2 Corinthians 1:3-4
- Psalms 34:18
- Jeremiah 17:14

**Relevance:** ✅ High - direct topic match

---

## Query 6: "addicted habits keep pulling me"

**Expected Processing:**
- Tokens: `addicted`, `habits`, `keep`, `pulling`
- `QUERY_TO_TOPIC` maps: `addicted` → `addiction`, `addiction` → `addiction`, `bondage` → `addiction`
- Should resolve to **ADDICTION topic**

**Expected Verses:**
- 1 Corinthians 10:13
- John 8:36
- Romans 6:14
- 2 Corinthians 5:17
- Galatians 5:1

**Relevance:** ✅ High - "addicted" directly maps

---

## Query 7: "when I am weak"

**Expected Processing:**
- Tokens: `when`, `weak`
- `PHRASE_TO_TOKENS`: "when im weak" → `['strength', 'weak', 'power']`
- Should resolve to **STRENGTH topic**

**Expected Verses:**
- 2 Corinthians 12:9-10
- Isaiah 40:29-31
- Philippians 4:13
- Psalms 46:1
- Ephesians 6:10

**Relevance:** ✅ High - exact phrase match exists

---

## Query 8: "my children are disobedient"

**Expected Processing:**
- Tokens: `children`, `disobedient`
- `QUERY_TO_TOPIC` maps: `children` → `parenting`, `disobedience` → `obedience`
- Should resolve to **PARENTING topic** (stronger match)

**Expected Verses:**
- Proverbs 22:6
- Ephesians 6:4
- Proverbs 13:24
- Deuteronomy 6:6-7
- Colossians 3:21

**Relevance:** ✅ High - semantic match through "children"

---

## Query 9: "financially broke and stressed"

**Expected Processing:**
- Tokens: `financially`, `broke`, `stressed`
- `QUERY_TO_TOPIC` maps: `stressed` → `anxiety`, `money` → `finances`, `bills` → `finances`
- May resolve to **FINANCES or ANXIETY topic**
- "financially" should weight toward finances

**Expected Verses (if FINANCES):**
- Philippians 4:19
- Matthew 6:33
- Proverbs 3:9-10
- Luke 12:24
- Malachi 3:10

**Expected Verses (if ANXIETY):**
- Philippians 4:6-7
- 1 Peter 5:7
- Matthew 6:34

**Relevance:** ⚠️ Medium-High - depends on scoring between finances/anxiety

---

## Query 10: "fearful and anxious"

**Expected Processing:**
- Tokens: `fearful`, `anxious`
- `QUERY_TO_TOPIC` maps: `fearful` → `fear`, `anxious` → `anxiety`
- Should resolve to **FEAR or ANXIETY topic** (both scored equally)
- Fear may win as it's checked first in topic list

**Expected Verses (if FEAR):**
- Isaiah 41:10
- 2 Timothy 1:7
- 1 John 4:18
- Psalms 34:4
- Psalms 27:1

**Expected Verses (if ANXIETY):**
- Philippians 4:6-7
- 1 Peter 5:7
- Matthew 6:34
- Psalms 94:19

**Relevance:** ✅ High - both are direct topic matches

---

## Known Weaknesses Based on Code

1. **Multi-topic queries** - System resolves to single top-scoring topic, may miss nuance
2. **"financially broke"** - "broke" not in QUERY_TO_TOPIC, relies on "financially" alone
3. **Phrase detection order** - Longer phrases checked first, but "I am weak" vs "when I am weak" may differ
4. **Stop words filter** - "I", "am", "my" removed before analysis
5. **Single-word stemming** - "selflessness" may not stem to "selfless" correctly

---

## Testing Checklist

For each query, verify:
- ✅ Results render (not empty)
- ✅ Top 3-5 verses shown
- ✅ Verses relevant to query intent
- ✅ Guidance text appropriate for topic
- ❌ No errors in console
- ❌ No "Something went wrong" messages
- ❌ No stale cached results

---

## Success Criteria

**Strong Performance (8-10/10 queries):**
- Correct topic resolution
- Relevant verses
- Helpful guidance

**Acceptable Performance (6-7/10 queries):**
- Most queries work
- 1-2 fallback to keyword search
- Still provide useful results

**Poor Performance (<6/10 queries):**
- Empty results
- Generic fallbacks
- Irrelevant verses
