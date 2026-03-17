# Search & Feeling Coverage — Review Cadence

**Rhythm:** Every 1–2 months. Set a calendar reminder.

---

## 1. Pull analytics

- [ ] Run dashboard queries (see `docs/ANALYTICS-DASHBOARD-QUERIES.md`)
- [ ] Note: % defaults last 7 days
- [ ] Note: Top 10 blended pairs
- [ ] Note: Most common topics
- [ ] Note: Topics with high default rate

---

## 2. Prioritize gaps

- [ ] If `default_pct` > 10%: identify top unmatched patterns
- [ ] If a blend spikes (e.g. suffering+anxiety): add or refine template
- [ ] If a topic dominates: add more phrases/verses for that cluster
- [ ] Review `feeling_suggestions` table for crowdsourced phrases (see docs/SUGGEST-FORM-REVIEW.md)

---

## 3. Add content

- [ ] Add 20–30 new phrases to `PHRASE_SEMANTIC_MAP` / `PHRASE_TO_TOKENS`
- [ ] Add 5–10 verses for top gaps (update `topics` in script.js)
- [ ] Add `HEARTFELT_INQUIRY_MESSAGES` for new clusters if needed
- [ ] Add `BLENDED_HEARTFELT_TEMPLATES` for new pairs if needed

---

## 4. Verify

- [ ] `npm run test:site`
- [ ] `npm run test:security`
- [ ] Manual: test 3–5 new phrases in incognito
- [ ] Deploy

---

## 5. Optional

- [ ] Add new cluster (e.g. addiction, racial trauma) if data suggests demand
- [ ] Add another language to `DEFAULT_FALLBACK_MESSAGES` (Arabic, Hindi, Mandarin)
- [ ] Review crisis resources (findahelpline.com, befrienders.org) still current

---

*Last updated: 2026-03*
