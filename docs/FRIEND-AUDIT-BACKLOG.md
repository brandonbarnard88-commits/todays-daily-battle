# Friend audit backlog (Apr 2026)

Constructive feedback from a full-site pass—tracked here so shipped work stays honest and small diffs stay reviewable. **Not a promise timeline**; items need design, privacy review, or content time.

## Shipped in-repo (this pass)

- Primary nav: **Site guide** + **Print hub** (More).
- **Battle Plans**: second filter row (feel / calm doorways), **Recommended for right now** band, clearer **signed-in vs on-device** copy (plans hero), **44px** day selector chips and lane chips.

## Search & discoverability

- Client-side or build-time **site-wide search** (verses, plan titles, topic pages, keywords in plan copy).
- Deeper **tag taxonomy** (e.g. chronic illness, beginner) if it stays maintainable.

## Navigation & onboarding

- Optional **floating “Need help finding something?”** (links Explore + Site guide + Feel).
- Stronger **first-visit** treatment (tour already exists—surface without noise).
- **Theme toggle** more visible on non-home shells (today: strong on home settings; `tt-bootstrap.js` persists `tdb-theme`).

## Community & encouragement

- Prayer wall: **featured** or weekly digest (anonymized, moderated, privacy-safe).
- **Wins / testimonies** opt-in public feed (moderated, non-performative).
- **Gift a plan** flow (share URL + short note; no new accounts required).

## Accessibility & usability

- **High-contrast** mode and/or **larger default text** site-wide (tokens in `styles.css`).
- Audit **alt text** on verse images and icon-only controls.
- Continue **44px+** targets anywhere still tight.

## Content (Battle Plans & hubs)

- New **full plans** (KJV days): depression when hope feels gone (distinct from grief); **sleep / rest** when the body fights it; **singleness / post-divorce**; **ministry burnout**; **kids/teens anxiety**; short **3-day emergency** tracks; more guided **Proverbs / Psalms** days.
- Nearest lanes **today** are linked from Plans (hope thin, caregiver rest, topics, read-alongs).

## Growth & sustainability

- **Privacy-safe aggregate** encouragement for the builder (no per-user tracking).
- Smoother **give** copy (“what you get” without hype).
- **Export / backup** for My Study / My Verses (JSON or PDF bundle)—extend beyond print.
- Public **What’s new** / changelog page for returning visitors.
- **Email** daily verse (opt-in, minimal data).
- **Embeddable** verse-of-the-day for churches/blogs.
- **Human-narrated** audio for select plans (optional later; TTS remains default).

## References

- `SUPABASE-SYNC-TABLES.md` — what syncs when signed in.
- `PRIVACY-ANALYTICS.md` — analytics rules.
