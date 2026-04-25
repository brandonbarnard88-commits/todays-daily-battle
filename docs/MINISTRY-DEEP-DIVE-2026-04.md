# Today’s Daily Battle — Ministry & Product Deep Dive (maintainer reference)

**Last updated:** April 24, 2026  
**Audience:** Builder, press prep, partners, and future maintainers. Not linked from the public site as a standalone page; the public summary lives on [media.html](https://todaysdailybattle.com/media.html) (`media.html` in repo).

---

## What it is

**Today’s Daily Battle** ([todaysdailybattle.com](https://todaysdailybattle.com)) is a quiet, solo-built Christian web app and devotional ministry **focused exclusively on the public-domain King James Version (KJV)**. It is meant to feel like a calm, ad-free **porch** or **campus** for real spiritual and emotional battles—anxiety, worry, grief, fear, parenting strain, hope, habits, family life, and ordinary hard days.

**Core promise (pressure-free):** one grounded verse, a short prayer, one practical next step, with tools that work **offline after the first visit** and keep notes and prayers **private on the device by default** unless the user opts into sync.

**Framing: “God’s University of Life.”** The KJV is the textbook, the Holy Spirit is the Teacher, and the site avoids hype, performance language, and noisy feeds. The related **University of God** map ([university.html](https://todaysdailybattle.com/university.html)) names the same posture in five anchor verses—compass, not report card.

**Tone:** gentle, human-scale, honest—aligned with [NORTH-STAR-PRINCIPLES.md](NORTH-STAR-PRINCIPLES.md).

---

## Streaks, scores, and “no pressure”

The product **does not** use leaderboards, public rankings, or social competition. Some screens offer **optional, local** visit or plan context (e.g. progress and wins) so a user can *choose* to notice consistency; copy elsewhere explicitly allows **opt-out and grace** for skipped days. The **North Star** remains: not gamifying holiness—any counter is secondary to Scripture and rest.

---

## Creator and story

- **Builder:** Brandon Barnard — Dallas native, raised in West Tennessee (Union City, Martin, and Memphis areas). The work grew from a **hospital season** that made steady, simple KJV help essential; he still uses the site daily.
- **Public voice / X (examples):** [@todaysdailybattle](https://x.com/todaysdailybattle) (site); personal handle [@8randon8arnard](https://x.com/8randon8arnard) may appear in founder contexts.
- **Structure:** personal ministry; no corporate or organizational umbrella. Support flows described on [where-support-goes.html](https://todaysdailybattle.com/where-support-goes.html) and [give](https://todaysdailybattle.com/give).

---

## Domain, DNS, and “how new is it?” (verify before quoting externally)

Registrar and expiry dates **change**; re-check in GoDaddy / Cloudflare beforePress use.

- **As of a spring 2026 check:** `todaysdailybattle.com` was registered late January 2026 via GoDaddy; nameservers pointed at **Cloudflare** (e.g. `lara.ns.cloudflare.com`, `igor.ns.cloudflare.com`). Registrant contact may be privacy-protected (e.g. Domains By Proxy).
- **Web history:** expect **few or no** Wayback Machine snapshots in the first months after launch.
- **Visibility:** organic niche presence is intentional; off-site reviews and backlinks may stay minimal.

---

## Core content and features (non-exhaustive)

- **Daily verse / today’s path:** KJV, breakdowns where provided, listen/read-aloud where wired, one next step.
- **Battle plans / courses:** short KJV rhythms (see [plans.html](https://todaysdailybattle.com/plans.html)); many topics (anxiety, grief, family, seasons, University-named courses, etc.). Family and kids tracks where noted.
- **How I feel / search:** topic and phrase flows; see **PRIVACY-ANALYTICS.md** (repo root) for what is *never* sent in analytics.
- **Tools:** Bible Tool, chapter reader, My Study, prayer wall, memorize, calm/Möbius, Kids Corner, printables, church and pastor resources, mission packs, year-round rhythm, verse image generator, and more listed from [explore.html](https://todaysdailybattle.com/explore.html).

**Not part of the default promise:** AI-generated devotionals, multiple English translations as default, or algorithmic “feeds” that replace open Scripture. See [why-not-ai.html](https://todaysdailybattle.com/why-not-ai.html) and project rules.

---

## Tech, privacy, and security (pointers, not a duplicate of legal pages)

- **Canonical privacy & analytics contract:** [PRIVACY-ANALYTICS.md](../PRIVACY-ANALYTICS.md) and [privacy.html](https://todaysdailybattle.com/privacy.html).
- **Typical stack notes:** static/vanilla site, Vercel-style hosting, **Cloudflare** in front, **CSP** and **DOMPurify** / Trusted Types per **SECURITY.md**; optional **Supabase** auth/sync; giving via **Stripe**; optional push / Firebase per deployment docs. **Do not** commit secrets; see checklists in `docs/`.

---

## Analytics (short)

- **Plausible** (privacy-oriented) and **GA4** (with strict event hygiene) appear in the codebase; see `analytics-loader.js`, `script.js`, and PRIVACY-ANALYTICS. Search and sensitive text stay off the wire as policy.

---

## Monetization and sustainability

- **No third-party ads** as a business model. Core tools remain free.
- **Optional support** (e.g. Stripe) helps hosting and expansion; [pricing.html](https://todaysdailybattle.com/pricing.html) and where-support pages explain the posture.

---

## Contact

- **support@todaysdailybattle.com** — technical issues, ideas, topic suggestions, privacy requests (e.g. GDPR), and good-faith safety reports (see [contact.html](https://todaysdailybattle.com/contact.html)).

---

## Overall assessment (neutral)

The strength of the work is **restraint**: Scripture-first, privacy-minded, offline-capable, human tone. Public visibility may grow slowly; that can be consistent with a **quiet** ministry posture if that remains the goal.

*This file is a maintainer summary. It is not legal advice. For enforceable terms, use privacy.html, terms.html, and SECURITY.md.*
