# HARD-TEST-PLAN.md
Last updated: March 17, 2026

Run in **incognito** + **hard refresh** (Ctrl+Shift+R). Test on desktop and mobile.

## Phase 1: Core Search & Verse Delivery

- [ ] 1. "brothers fighting"  
  Expected: Family topic → Matt 18:15, Col 3:13, Prov 17:17, Eph 4:31–32, Psalm 133:1, etc. + heartfelt + breakdowns  
  Result / Notes: ______________________________

- [ ] 2. "brothers fighting over inheritance"  
  Expected: Family (possibly blended grief/caregiver) → more verses + badges + heartfelt  
  Result / Notes: ______________________________

- [ ] 3. "my boss is a dick"  
  Expected: Anger/frustration → Col 3:23, Prov 15:1, Rom 12:17–19 + justice message  
  Result / Notes: ______________________________

- [ ] 4. "postpartum depression bible"  
  Expected: Suffering/grief blend → Psalm 30:5, Isaiah 40:11 + new mom message  
  Result / Notes: ______________________________

- [ ] 5. "my dog died sad"  
  Expected: Grief/pet loss → Psalm 36:6, Matt 10:29, Psalm 147:3 + pet heartfelt  
  Result / Notes: ______________________________

- [ ] 6. "random unicorn"  
  Expected: 8 shuffled DEFAULT_VERSES + Context/Real talk/Do this breakdowns  
  Result / Notes: ______________________________

- [ ] 7. "not alone anymore"  
  Expected: Negation → courage/peace/strength (no loneliness) + positive message  
  Result / Notes: ______________________________

- [ ] 8. "abide"  
  Expected: John 15:4–5 + toast "Without Him, we can do nothing."  
  Result / Notes: ______________________________

## Phase 2: Mobile & UX

- [ ] 9. Any results page, resize ≤768px  
  Expected: 6 verses visible + "View more results" button; tap loads rest  
  Result / Notes: ______________________________

- [ ] 10. Search hero on mobile  
  Expected: Chips tappable, accordion opens, results scrollable  
  Result / Notes: ______________________________

## Phase 3: Easter Eggs & Secrets

- [ ] 11. Konami code (↑↑↓↓←→←→ B A) on any page  
  Expected: Toast "You found a hidden blessing!"  
  Result / Notes: ______________________________

- [ ] 12. Search "secrets" after Konami  
  Expected: Redirect to /secrets.html  
  Result / Notes: ______________________________

- [ ] 13. secrets.html — 1st visit  
  Expected: Tier 1 quick-door breadcrumbs + progress panel + "Return later" copy  
  Result / Notes: ______________________________

- [ ] 14. secrets.html — 3rd visit  
  Expected: Full breadcrumb map (including family/kids + legendary sections) + confetti + final message  
  Result / Notes: ______________________________

## Phase 4: Suggest Form & Analytics

- [ ] 15. Submit normal suggestion  
  Expected: Success toast, entry in Supabase feeling_suggestions table  
  Result / Notes: ______________________________

- [ ] 16. Submit with honeypot filled  
  Expected: Fake success toast, **no** Supabase insert  
  Result / Notes: ______________________________

- [ ] 17. Run `npm run suggest:fetch`  
  Expected: Shows total rows, unique phrases, "Top 8 for mapping" line  
  Result / Notes: ______________________________

## Phase 5: Global & Edge

- [ ] 18. Browser lang = bn-BD  
  Expected: Bengali default on no-match query  
  Result / Notes: ______________________________

- [ ] 19. Browser lang = ru-RU  
  Expected: Russian default  
  Result / Notes: ______________________________

- [ ] 20. "chemo sucks"  
  Expected: Suffering/cancer cluster → Isaiah 40:31, 2 Cor 12:9 + fatigue message  
  Result / Notes: ______________________________

**Total passes**: ____ / 20  
**Overall rating**:  
- 18–20 → Outstanding (9.8–10/10)  
- 15–17 → Very strong (9.0–9.5)  
- <15 → Share failures and we fix

**Date tested**: ____________________  
**Browser / device**: ____________________  
**Notes / Bugs**:  
________________________________________________________________________________
________________________________________________________________________________
