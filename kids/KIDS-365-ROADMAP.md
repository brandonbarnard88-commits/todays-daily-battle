# Kids 365 Gentle Stories Roadmap

**Vision**: One beautiful, pressure-free story for every day of the year (365 total), written for ages 3–8, with the same story gently expanding for older children (9–12 and 13–17) and offering rich reflection for adults and parents.

## Three Age Levels (One Story File, Multiple Depths)

- **Ages 3–8** (Core gentle level)
  - Short, warm read-aloud
  - Coloring prompt
  - Simple response line
  - 5 gentle Q&A questions

- **Ages 9–12**
  - Slightly longer, still calm retelling
  - A few thoughtful questions that invite wondering or personal connection

- **Ages 13–17 + Adults**
  - Richer reflection
  - “How this story relates to life today”
  - Practical, non-preachy takeaways and application

All levels live in one `package.md` file. The generator creates the appropriate materials for each level automatically.

## Current Status (as of right now)

- **275 stories** have the full 3–8 gentle treatment (Batches 1–11 complete).
- Tooling is ready for the multi-age structure.
- Gentle Journey ORDER currently contains 455 keys (plenty of room to grow the kids library to 365 and beyond).

## Proposed Next Steps

We can continue in calm batches of 25 while gradually introducing the richer levels.

**Batch 12 Recommendation** (Old Testament Heroes + Wisdom – 276–300)
Focus on well-loved, emotionally powerful Old Testament stories that teach trust, courage, and God’s faithfulness.

Suggested keys for Batch 12 (in gentle priority order):
1. mosesRedSea
2. joshuaJericho
3. gideon
4. samson
5. ruthBoaz
6. samuelAnointsDavid
7. davidGoliath
8. davidJonathan
9. davidCave
10. solomonWisdom
11. elijahRavens
12. elijahWidow
13. elijahFire
14. elishaOil
15. naaman
16. jonah
17. esther
18. nehemiah
19. danielLions
20. danielFieryFurnace
21. job
22. isaiahComfort
23. jeremiah
24. psalm23
25. psalm91

**Batch 13 – NT Stories & Early Church (301–325)**  
Skeletons created: `node scripts/scaffold-batch-13-packages.mjs` (24 new files; 1 key already had a package). Fill 3–8 when ready, then `npm run gentle:qa`.

This roadmap lives alongside `kids/GENTLE-100-PROGRESS.md`. Move at whatever pace feels peaceful and sustainable.