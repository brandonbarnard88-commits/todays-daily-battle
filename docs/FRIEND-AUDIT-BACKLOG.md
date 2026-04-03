# Friend audit backlog (Apr 2026)

Constructive feedback from a full-site pass—tracked here so shipped work stays honest and small diffs stay reviewable. **Not a promise timeline**; items need design, privacy review, or content time.

## Shipped in-repo (this pass)

- Primary nav: **Site guide** + **Print hub** (More).
- **Battle Plans**: second filter row (feel / calm doorways), **Recommended for right now** band (including a separated **Still in the works** note for upcoming tracks), clearer **signed-in vs on-device** copy (plans hero), **44px** day selector chips and lane chips.

## Live HTML + CDN cache

`build-copy-static.js` copies root `plans.html` and `index.html` into `dist/` on every `npm run build`. If **production** still shows older markup (missing nav or Plans sections), usual causes are **edge cache** or a **deploy that did not include the latest build output**.

**After a push that changes static HTML:**

1. Local proof: `npm run build` then search **`dist/plans.html`** for `plans-still-in-the-works` and **`dist/index.html`** for `nav-site-guide`. The build **fails** if those markers are missing (guards in `build-copy-static.js`).
2. Confirm the host finished deploy (`view-source:` on live `plans.html` → find `Still in the works` or `id="plans-still-in-the-works"`).
3. Purge Cloudflare (if the zone sits in front of the host): from the repo, with `CF_API_TOKEN` in `.env`:
   - `npm run purge:cloudflare:social` — purges `/`, `/index.html`, `/plans.html`, `/site-guide.html`, and related URLs (see `scripts/cloudflare-purge.mjs`).
   - **Minimal URLs only:**  
     `CF_PURGE_FILES=https://todaysdailybattle.com/plans.html,https://todaysdailybattle.com/index.html,https://todaysdailybattle.com/site-guide.html npm run purge:cloudflare`
   - Full zone: `npm run purge:cloudflare`
4. Hard-refresh or incognito to bypass the browser cache.
5. **Optional network proof** (after purge): `npm run verify:live-key-html`  
   (uses `LIVE_BASE_URL`, default `https://todaysdailybattle.com`; fails if `plans-still-in-the-works` or `nav-site-guide` are missing on live).

**Headers note:** `/`, `/index.html`, `/plans.html`, and `/plans` now send `no-store` and `s-maxage=0` so shared CDNs are less likely to serve ghost HTML (see root `_headers`). Path-specific rules apply where `_headers` is honored (e.g. Cloudflare Pages); `vercel.json` still derives only the global `/*` security block—so **a missing deploy** (old `dist` on the host) can still look like “CDN cache” until production is rebuilt from this repo.

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
