# Privacy & Data Audit — Today's Daily Battle

**Generated:** March 2026  
**Scope:** All files, pages, features, API calls, forms, databases, storage, third-party scripts, and user data collection.

---

## 1. FILES & PAGES

### HTML Pages (52 total)

| Page | Purpose |
|------|---------|
| **Core** | |
| `index.html` | Homepage — daily verse, search, prayer, auth, newsletter |
| `verse.html` | Verse display |
| `reader.html` | Bible reader |
| `bible-tool.html` | Bible search, notes, concordance |
| `bible-study.html` | Bible studies |
| `study.html` | Study hub |
| `sermon.html` | Sermon builder |
| `message.html` | Message board (testimonies) |
| `church.html` | Church Center landing |
| `resources.html` | Resources |
| `about.html` | About |
| `faq.html` | FAQ |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms |
| `contact.html` | Contact form |
| `pricing.html` | Pricing, Stripe checkout, waitlist |
| `shop.html` | Shop |
| `reset.html` | Password reset |
| `approach.html` | Approach |
| `stats.html` | Stats dashboard (password-protected) |
| `wins-report.html` | Wins Report (Pro) |
| **Topics** | |
| `topic-anxiety.html`, `topic-hope.html`, `topic-strength.html`, `topic-fear.html`, `topic-grief.html`, `topic-forgiveness.html`, `topic-parenting.html` | Topic-specific verse pages |
| **Kids** | |
| `kids/index.html` | Kids Battle — daily verse, doodle, streak |
| `kids/corner.html` | Kids Corner — 52-story library |
| `kids/parent.html` | Parent dashboard |
| `kids/kids-beta.html` | Kids Beta waitlist signup |
| `kids-corner.html`, `kids-activities-print.html`, `kids-coloring-pack.html`, `coloring.html` | Kids activities |
| **Bible Hub** | |
| `bible/index.html` | Bible Hub daily verse |
| `bible/study.html` | Bible study, highlights |
| `bible/tools.html` | Concordance, maps, quiz, memory |
| **Pastor** | |
| `pastor/index.html` | Pastor Hub daily |
| `pastor/library.html` | Sermon library |
| `pastor/builder.html` | Sermon builder |
| `pastor/tools.html` | Pastor tools |
| **Church** | |
| `church/index.html` | Church join/create |
| `church/daily.html` | Church daily — reflections, prayer wall, voting, attendance |
| **Other** | |
| `pastor-toolkit.html`, `team-toolkit.html` | Toolkits |
| `reading-plan.html` | Reading plan |
| `404.html`, `404-admin.html` | Error pages |
| `admin.html` | Admin (protected) |
| `weekly-email-template.html` | Email template |

---

## 2. FEATURES (by area)

| Feature | Data collected | Where stored |
|---------|----------------|--------------|
| **Daily Battle** | Streak, done-for-today, prayer intent | localStorage, Supabase `user_sync_data` |
| **Quick Pray** | Intent, family_name (optional) | Supabase `prayers` via Edge Function |
| **Newsletter** | Email, weekly/daily preference, time | Supabase `newsletter_signups` |
| **Auth** | Email, password (Supabase Auth) | Supabase Auth |
| **Message Board** | User text (testimonies) | Supabase `messages` |
| **Kids Battle** | Kid name, streak, doodles, reflections, family code | localStorage, Supabase `kid_streaks`, `kid_reflections`, `kid-doodles` bucket |
| **Kids Beta** | Email, age_range, invite_code | Supabase `kids_beta_waitlist` |
| **Bible Hub** | Name, streak, prayer, reflection, highlights | localStorage, Supabase `adult_streaks`, `bible_reflections`, `bible_highlights` |
| **Pastor Hub** | Reflection, sermon drafts | localStorage, Supabase `bible_reflections`, `sermon_drafts` |
| **Church Hub** | Church code, reflections, prayer requests, votes, attendance, kid leaderboard | Supabase `church_*` tables |
| **Church Roundup** | Email (opt-in) | Supabase `church_subscribers` |
| **Supporter Waitlist** | Email | Supabase `supporter_waitlist` |
| **Stats** | Password (session only) | sessionStorage |

---

## 3. API CALLS & SUPABASE

### Edge Functions (Supabase)

| Function | Trigger | Data sent | Purpose |
|----------|---------|-----------|---------|
| `submit-prayer` | POST (Quick Pray) | turnstile_token, intent, family_name?, session_id? | Insert prayer, rate-limit, Turnstile verify |
| `post-message` | POST (Message Board) | text, user_id (from JWT) | Insert message, rate-limit |
| `create-checkout-session` | POST (Stripe) | tier, period, user_id (from JWT) | Create Stripe checkout |
| `create-donation-session` | POST | amount | Donation checkout |
| `send-beta-email` | Client call after Kids Beta signup | email, code | Mailgun welcome email |
| `notify-parent-on-redeem` | Client call after kid redeems code | — | Mailgun "kid connected" email |
| `notify-prayer-answered` | Client call when pastor marks prayer | — | Mailgun to poster |
| `weekly-story-email` | Cron (Sundays) | — | Kids story email to parents |
| `weekly-church-roundup` | Cron (Mondays) | — | Church roundup email |
| `streak-reminder-email` | Cron (daily) | — | "Come back tomorrow" to parents |
| `weekly-reflection-email` | Cron (Mondays) | — | Bible reflection recap |
| `seed-daily-battle` | Manual/cron | — | Seed daily_battles |
| `send-reminders` | Cron | — | Streak reminders |
| `stripe-webhook` | Stripe webhook | — | Update profiles.tier |

### Supabase RPCs (client-called)

| RPC | Data | Purpose |
|-----|------|---------|
| `get_waitlist_count` | — | Kids Beta spots left |
| `upsert_adult_streak` | anon_id, streak_count, last_day | Bible Hub streak |
| `upsert_kid_streak` | code, streak_count, last_day | Kids streak |
| `upsert_kid_reflection` | code, date, verse, text | Kid reflection |
| `upsert_bible_reflection` | anon_id, date, reflection, verse_ref | Bible reflection |
| `upsert_bible_reflection_subscriber` | anon_id, email | Weekly reflection email |
| `upsert_bible_highlight` | anon_id, verse_ref, note | Bible highlights |
| `join_group` | code, member_id (anon) | Church join |
| `create_church_group` | code, name, pastor_anon_id | Create church |
| `get_church_reflections`, `get_church_leaderboard`, `get_church_attendance_week` | group_id | Church data |
| `upsert_church_subscriber` | group_id, email, anon_id | Church roundup opt-in |
| `insert_church_reflection` | group_id, anon_id, text, date | Church reflection |
| `insert_church_prayer_request` | group_id, anon_id, text | Prayer wall |
| `toggle_church_prayer_like`, `insert_church_prayer_comment` | prayer_id, anon_id | Prayer interactions |
| `mark_church_prayer_answered` | prayer_id, pastor_anon_id | Pastor marks answered |
| `add_church_group_kid` | group_id, invite_code, kid_name | Kid leaderboard |
| `get_church_kid_leaderboard` | group_id | Kid streaks |
| `create_church_vote`, `cast_church_vote`, `close_church_vote` | draft_id, anon_id, vote | Sermon voting |
| `upsert_church_attendance` | group_id, anon_id, date | Attendance |
| `increment_church_group_streak` | group_id, week_key, anon_id | Verse challenge |
| `redeem_invite_code` | code | Kid connects to parent |
| `get_kid_reflections` | code | Parent fetches kid reflections |

### Supabase Tables (from SQL files)

| Table | Purpose |
|-------|---------|
| `prayers` | Quick Pray intents, family_name |
| `rate_limit` | Rate limiting (hashed IP) |
| `newsletter_signups` | Newsletter email, preferences |
| `messages` | Message board posts |
| `message_reports` | Report abuse |
| `daily_battles` | Daily verse, reflection, prayer |
| `user_sync_data` | Streak, prayer_list, badges, etc. (auth users) |
| `supporter_waitlist` | Pricing waitlist email |
| `profiles` | tier (Pro/Supporter) |
| `kids_beta_waitlist` | Email, age_range, invite_code, used |
| `kid_streaks` | invite_code, streak_count, last_day |
| `kid_reflections` | invite_code, date, verse, reflection |
| `kid-doodles` (bucket) | PNG doodles by familyCode |
| `adult_streaks` | anon_id, streak_count, last_day |
| `bible_reflections` | anon_id, date, reflection, verse_ref |
| `bible_reflection_subscribers` | anon_id, email |
| `bible_highlights` | anon_id, verse_ref, note |
| `sermon_drafts` | anon_id, title, scripture, outline_json |
| `church_groups` | code, name, pastor_anon_id, members |
| `church_reflections` | group_id, anon_id, text, date |
| `church_subscribers` | group_id, email, anon_id |
| `church_votes` | group_id, draft_id, votes, status |
| `church_attendance` | group_id, anon_id, date, present |
| `church_group_kids` | group_id, invite_code, kid_name |
| `church_prayer_requests` | group_id, anon_id, text, likes, status |
| `church_prayer_comments` | prayer_id, anon_id, text |
| `notes`, `saved_verses`, `sermons`, `lessons`, `saved_collections` | User content (auth) |

---

## 4. FORMS

| Form | Fields | Submit target |
|------|--------|---------------|
| **Newsletter** (index, pricing) | email, weekly/daily checkbox, time | Supabase `newsletter_signups` |
| **Auth modal** | email, password (or OAuth) | Supabase Auth |
| **Quick Pray** | intent, family_name (optional) | Edge Function `submit-prayer` |
| **Daily verse email** | email | `newsletter_signups` |
| **Beta email** (index) | email | `supporter_waitlist` or similar |
| **Kids Beta** | email, age_range | Supabase `kids_beta_waitlist` + Edge Function `send-beta-email` |
| **Church join** | church code | RPC `join_group` |
| **Church create** | code, name | RPC `create_church_group` |
| **Church roundup** | email | RPC `upsert_church_subscriber` |
| **Church kid add** | family_code, kid_name | RPC `add_church_group_kid` |
| **Church prayer** | text (3–1000 chars) | RPC `insert_church_reflection` / `insert_church_prayer_request` |
| **Bible Hub name** | name | localStorage `bibleUserName` |
| **Kid name** | name | localStorage `kidName` |
| **Contact** | (contact-form.js) | — |
| **Stats** | password | sessionStorage |

---

## 5. LOCALSTORAGE KEYS

| Key | Data | Risk |
|-----|------|------|
| **Main app** | | |
| `tdb_daily_battle_streak` | streak count, lastKey, dates | Low |
| `tdb_done_for_today` | date key | Low |
| `tdb_prayer_list_v1` | prayer list items | Medium (personal) |
| `tdb_household_armor` | armor pieces, count | Low |
| `tdb_heavenly_jewels` | jewels | Low |
| `tdb_family_name` | family display name | Medium |
| `tdb_daily_reminder` | reminder on/off | Low |
| `tdb_install_prompt_seen` | PWA prompt | Low |
| `tdb_referrer` | referral code | Low |
| `tdb_challenge_30_started` | challenge flag | Low |
| `tdb_badges`, `tdb_badge_dates` | badges | Low |
| `tdb_streak_repair` | repair usage | Low |
| `tdb_prayer_offline_queue` | queued prayers | Medium |
| `tdb_amen_*` | amen per prayer id | Low |
| `tdb_quick_pray_count_*` | count per day | Low |
| `tdb_silent_amen` | count | Low |
| `tdb_intent`, `tdb_intent_last` | prayer intent | Medium |
| `tdb_god_mode_sound`, `tdb_sacred_silence` | sound prefs | Low |
| `tdb_breath_count_*` | breath count | Low |
| **Kids** | | |
| `kidsVerseIndex` | verse index | Low |
| `kidsStreak` | streak data | Low |
| `kidName` | kid's name | **Medium** |
| `kidReflection` | reflections by date | **Medium** |
| `kidsFamilyCode` | 6-char invite code | Medium |
| `kidsBetaCode` | invite code from beta | Medium |
| `kidsBetaSubmitted` | signup flag | Low |
| `kidsRemindOpted` | push reminder | Low |
| `kidsTrailWelcomeShown` | welcome flag | Low |
| `kidsLibraryViewedStories` | story keys viewed | Low |
| `kidsDoodle_*` | doodle PNG base64 | **Medium** |
| `kidQuizDone`, `kidMemoryDone` | daily limits | Low |
| **Bible Hub** | | |
| `bibleReadStreak` | streak | Low |
| `bibleUserName` | name | **Medium** |
| `biblePrayer` | prayer by date | **Medium** |
| `bibleReflection` | reflection by date | **Medium** |
| `bibleHighlights` | verse ref, note | **Medium** |
| `bibleHubAnonId` | anon UUID | Medium (pseudonymous) |
| `challengeShared`, `challengeBonusApplied` | verse challenge | Low |
| **Pastor** | | |
| `pastorBuilderDraft` | sermon outline | **Medium** |
| `pastorHubAnonId` | anon UUID | Medium |
| **Church** | | |
| `churchCode`, `churchGroupId`, `churchGroupName` | Church join | Low |
| `churchHubAnonId` | anon UUID | Medium |
| `churchPastorAnonId` | pastor id | Low |
| `churchAttendanceDone_*` | attendance flag | Low |
| `groupMemoryWeek` | verse challenge | Low |

---

## 6. SESSIONSTORAGE KEYS

| Key | Data | Risk |
|-----|------|------|
| `tdb_armor_joined` | joined household id | Low |
| `tdb_armor_join_bonus` | bonus flag | Low |
| `tdb_pray_nudge_2min` | nudge flag | Low |
| `tdb_prayed_this_session` | prayed flag | Low |
| `tdb_just_prayed` | timestamp | Low |
| `tdb_night_close_shown_*` | modal shown | Low |
| `tdb_dawn_shown_*` | modal shown | Low |
| `tdb_prayer_session` | session id | Low |
| `tdb_last_results` | search results | Medium (verse refs) |
| `tdb_shown_refs` | shown refs | Low |
| `stats_auth` | stats password auth | Low |

---

## 7. COOKIES

**No direct `document.cookie` usage found.**  
Supabase Auth uses session cookies (httpOnly, secure) managed by Supabase client; Stripe may set cookies for checkout.

---

## 8. THIRD-PARTY SCRIPTS

| Script | Domain | Purpose |
|--------|--------|---------|
| **Supabase** | `*.supabase.co` | Auth, DB, Storage |
| **Google Fonts** | `fonts.googleapis.com`, `fonts.gstatic.com` | Fonts |
| **Canvas Confetti** | `cdn.jsdelivr.net` | Confetti animation |
| **DOMPurify** | `cdn.jsdelivr.net` | XSS sanitization (message.html) |
| **jsPDF** | `cdn.jsdelivr.net` | PDF export (Kids, Pastor) |
| **Cloudflare Turnstile** | `challenges.cloudflare.com` | Bot protection (Quick Pray) |
| **Cloudflare Insights** | `static.cloudflareinsights.com` | Analytics (if enabled) |
| **Plausible** | `plausible.io` | Privacy-friendly analytics (if enabled) |
| **Google Tag Manager / GA4** | `googletagmanager.com`, `google-analytics.com` | Analytics (if GA_MEASUREMENT_ID set) |
| **Stripe** | `js.stripe.com`, `api.stripe.com`, `hooks.stripe.com` | Payments |
| **Mailgun** | (Edge Functions server-side) | Transactional email |

---

## 9. USER DATA COLLECTION SUMMARY

| Data type | Where collected | Where stored |
|-----------|-----------------|--------------|
| **Email** | Newsletter, Auth, Kids Beta, Church roundup, Supporter waitlist, Bible reflection opt-in | Supabase tables |
| **Name** | Bible Hub, Kid name, Family name | localStorage + Supabase (Bible reflection) |
| **Prayer intent** | Quick Pray | Supabase `prayers` |
| **Family name** | Quick Pray (optional) | Supabase `prayers` |
| **Streaks** | Main app, Kids, Bible Hub | localStorage, Supabase |
| **Reflections** | Bible Hub, Pastor, Kids | localStorage, Supabase |
| **Highlights/notes** | Bible Hub, Study, Tools | localStorage, Supabase |
| **Doodles** | Kids | localStorage, Supabase Storage `kid-doodles` |
| **Church reflections** | Church daily | Supabase |
| **Prayer requests** | Church prayer wall | Supabase |
| **Sermon drafts** | Pastor Builder | Supabase |

---

## 10. PRIVACY RISKS — FLAGGED ITEMS

### 🔴 HIGH

1. **`config.js` / `inline-bootstrap.js`** — Supabase URL and anon key are public (by design). RLS protects data. **Admin identity** must not appear in client bundles (no email allowlists). **Mitigation:** Admin = `app_metadata.role === 'admin'` in Supabase only; optional Cloudflare Access / Worker on `/admin*`.

2. **Kids doodles** — PNGs uploaded to Supabase Storage `kid-doodles` with path `doodles/{familyCode}/{kidName}-{timestamp}.png`. Kid name in filename. **Mitigation:** RLS allows anon read; ensure bucket is not public-listable. Consider hashing filenames.

3. **Church prayer requests** — Text can be sensitive (health, family). Stored in `church_prayer_requests`. **Mitigation:** RLS restricts by group; pastor can mark answered; poster email stored for notify-prayer-answered.

### 🟡 MEDIUM

4. **Anon IDs** — `bibleHubAnonId`, `churchHubAnonId`, `pastorHubAnonId` are UUIDs in localStorage. Used to link streak/reflection/highlights across sessions without login. **Risk:** Same device = same anon; cross-device = new anon. Not truly anonymous if device is shared.

5. **Family code** — 6-char code links kid to parent. Stored in localStorage, used in Supabase. If code is guessed, another parent could see kid data. **Mitigation:** 1-use redeem; code is random.

6. **Bible Hub / Kids names** — `bibleUserName`, `kidName` are optional display names. Stored locally; Bible reflection sync may include. **Mitigation:** No PII in analytics; names stay in user's control.

7. **Search results in sessionStorage** — `tdb_last_results` stores verse refs. Low sensitivity but could reveal topics. **Mitigation:** Session-only; cleared on close.

### 🟢 LOW

8. **Analytics** — GA4 (if enabled) and Plausible. `trackSearchAnalytics()` strips query text and user identity per PRIVACY-ANALYTICS.md. **Compliant.**

9. **Turnstile** — Cloudflare bot check. Token sent to Edge Function; no long-term storage of IP (hashed for rate limit only).

10. **Stripe** — Payment data handled by Stripe; no card data on your servers.

---

## 11. RECOMMENDATIONS

1. **Privacy policy** — Ensure `privacy.html` lists all data collected (emails, names, streaks, reflections, doodles, church data) and retention.
2. **Kids COPPA** — Kids Beta collects age_range; no account required for Kids Battle. Parent code links kid to parent. Consider explicit parent consent language.
3. **Church data** — Church reflections and prayer requests are group-visible. Add notice that group members can see content.
4. **Export/delete** — Consider adding "Export my data" and "Delete my data" for GDPR/CCPA alignment.
5. **Doodle filenames** — Consider `doodles/{familyCode}/{hash}.png` instead of kid name in filename.

---

*Audit complete. Re-run when adding new features or data collection.*
