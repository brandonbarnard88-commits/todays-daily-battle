# Feature freeze — 90 days (four pillars)

**Start:** 2026-08-04  
**End:** 2026-11-02  
**Status:** Active  

## Rule

No new product features for **90 days**, except **Grove polish**.

“Grove polish” means improving what already ships on the home front door:

- Today’s verse (hero) clarity, plain meaning, first-paint calm  
- Ask the Word UX and copy  
- Density / scroll / typography on The Grove  
- Accessibility and performance of the Grove path  
- Bug fixes and security fixes anywhere  

## Not in freeze exceptions

Do **not** start during the freeze (unless a real production incident):

- New campus wings, hubs, or taxonomies  
- New University of X tracks or large plan batches  
- New languages / locale pilots  
- New shop products or fulfillment work  
- Feature parity with big Bible apps  
- AI chat as a product surface  
- New major kids story batches  
- SaaS-style account growth features  

## Allowed always

- Security, CSP, privacy, and dependency patches  
- Broken-link / redirect / deploy pipeline fixes  
- Copy corrections that reduce pressure or confusion  
- Dist/build token sync required to ship Grove polish  
- Docs that restate this freeze or founder capacity  

## Decision filter

| Ship if… | Defer if… |
|----------|-----------|
| A heavy night visitor rests sooner | Power users get another map door |
| It removes HTML/JS weight from Home | It adds a new primary door on Home |
| Brandon can maintain it without heroic weeks | It needs a new subsystem to keep alive |

## Repo guardrails

- This file is the source of truth for the freeze window.  
- Companion: [SCOPE-FREEZE-AND-CAPACITY.md](./SCOPE-FREEZE-AND-CAPACITY.md), [NORTH-STAR-PRINCIPLES.md](./NORTH-STAR-PRINCIPLES.md).  
- PR checklist: if the change is not Grove polish / bugfix / security, **do not merge** until 2026-11-02 (or explicit owner override with a written reason).  

## Review

On or after **2026-11-02**, revisit with:

1. Did Home stay merciful under load?  
2. Is founder capacity better or worse?  
3. What one Grove improvement still matters most?  

Silence after ship is valid ministry.
