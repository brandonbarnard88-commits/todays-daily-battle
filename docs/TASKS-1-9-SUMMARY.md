# Tasks 1–9: What Was Done and What It Secures

Summary of what was **supposed** to be done, what **was** done, and what each item **secures or improves**.

---

## 1. Fix Mobile Viewport & Base Styles

**Supposed to:** Update viewport meta (width, initial-scale, maximum-scale=5.0); add CSS for body (font-size 18px, line-height 1.6, padding 15px under 480px); make .card, .content-inner, .glass, .section, .content full-width; make buttons/inputs 100% width, 14px padding, 48px min-height.

**Done:**  
- Viewport set to `width=device-width, initial-scale=1.0, maximum-scale=5.0` on all HTML pages.  
- In `styles.css` under 480px: body font-size 18px, line-height 1.6, padding 15px; .card, .content-inner, .glass, .section, .content set to width 100%, max-width 100%; buttons and inputs given 100% width, 14px padding, 48px min-height.  
- Additional mobile fixes: 600px breakpoint for stacked search, overflow containment, compact selects, top bar tweaks.

**Secures/improves:** Better mobile UX, no horizontal scroll, readable text and tap targets; zoom allowed (accessibility).

---

## 2. Add Security Headers (Cloudflare-style)

**Supposed to:** Generate Cloudflare-compatible security headers for todaysdailybattle.com: HSTS max-age=31536000, CSP (default-src 'self'; script-src 'self' 'unsafe-inline'), X-Frame-Options DENY, X-Content-Type-Options nosniff. Output as meta or .htaccess; Cloudflare Pages uses `_headers`.

**Done:**  
- Added `_headers` at project root with: Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options.  
- Documented in `docs/SECURITY-HARDENING.md`.

**Secures:**  
- **HSTS** – browsers use HTTPS only for 1 year.  
- **CSP** – limits script/source origins (may need relaxing for CDNs/fonts).  
- **X-Frame-Options DENY** – reduces clickjacking.  
- **X-Content-Type-Options nosniff** – reduces MIME sniffing abuse.

---

## 3. Hide Admin Email

**Supposed to:** Rewrite config so MASTER_EMAIL is not exposed; replace with server-side check or obfuscate in HTML (e.g. m&#97;ster@...).

**Done:**  
- Introduced `MASTER_EMAIL_OBFUSCATED` (HTML-entity encoded).  
- `script.js`: `decodeObfuscatedEmail()` decodes at runtime; admin set built from obfuscated value first, then fallback to legacy MASTER_EMAIL/MASTER_EMAILS.  
- Removed plain admin email from inline TDB_CONFIG in all HTML and from `config.js`; replaced with obfuscated string.  
- `config.example.js` documents obfuscated option; 404-admin copy no longer mentions MASTER_EMAIL in config.

**Secures:** Admin email not in plain text in client or repo; harder for scrapers/bots to harvest. Stronger option remains: move “is admin?” to a Supabase RPC and remove email from client entirely.

---

## 4. Supabase RLS Lockdown

**Supposed to:** Write SQL to enable Row Level Security on daily_battles, messages, message_reports, newsletter_signups, saved_*; policy: only authenticated users read/write their own data; no anon access.

**Done:**  
- Added `supabase-rls-lockdown.sql` with: RLS enabled on all listed tables; policies so only authenticated users access “own” rows (user_id = auth.uid() or email = auth.email() for newsletter); daily_battles is authenticated read-only, writes only via service role.  
- message_reports: added user_id column and trigger to set auth.uid() on insert.

**You must:** Run `supabase-rls-lockdown.sql` in Supabase SQL Editor (or via migration) for it to take effect.

**Secures:**  
- **No anon access** to these tables.  
- **Data isolation:** users only see/edit their own messages, reports, newsletter signups, saved_verses, saved_collections, saved_verse_collections.  
- **daily_battles** writable only by service role (e.g. seed function), not by anon or normal authenticated users.

---

## 5. PWA Manifest & Service Worker

**Supposed to:** Create manifest.json and service-worker.js for todaysdailybattle.com: name Daily Battle, short_name Battle, theme_color #000000, start_url /, display standalone; cache today’s verse, prayer, and audio offline.

**Done:**  
- `manifest.json`: name "Daily Battle", short_name "Battle", theme_color "#000000", start_url "/", display "standalone", plus icons and background_color.  
- `service-worker.js`: caches kjv.json (verse text), daily_battles API (verse + prayer), same-origin audio; pre-caches core assets; activate keeps both caches.

**Secures/improves:** Installable PWA, offline verse/prayer (and audio when same-origin); no new security risks if CSP and HTTPS are correct.

---

## 6. Push Notifications (Firebase)

**Supposed to:** Firebase setup for daily 9 AM verse push; JS to register service worker and request permission; no UI—backend logic only.

**Done:**  
- **Config:** `config.example.js` has FIREBASE_* and FCM_SUBSCRIBE_URL.  
- **Client:** `firebase-push.js` registers SW, requests permission, gets FCM token, POSTs to FCM_SUBSCRIBE_URL.  
- **index.html:** Firebase SDK (app + messaging) and firebase-push.js loaded.  
- **script.js:** When user enables streak push, calls `tdbFirebasePushSubscribe()` if Firebase is configured, else existing VAPID flow.  
- **Backend:** `firebase-functions/savePushToken.js` (HTTPS, stores token in Firestore); `firebase-functions/sendDailyVerseNotification.js` (scheduled 9 AM America/Chicago, sends today’s verse to stored tokens); `index.js` and `package.json` for deploy.

**You must:** Create Firebase project, set FIREBASE_* and FCM_SUBSCRIBE_URL in config, deploy functions, optionally set Supabase env for verse fetch.

**Secures/improves:** Centralized, scalable push via FCM; tokens stored server-side; no sensitive data in notifications.

---

## 7. Accessibility & Zoom Fix

**Supposed to:** Update viewport to allow zoom (width, initial-scale, maximum-scale=5.0); add ARIA labels to buttons (e.g. “Read today’s verse”, “Submit prayer”).

**Done:**  
- Viewport already allows zoom (task 1: maximum-scale=5.0).  
- Many buttons/inputs already had aria-labels (search, menu, auth, focus mode, filters, TTS, share, etc.).  
- Added **aria-label="Read today's verse"** on “Today’s Battle” button and **aria-label="Submit prayer"** on prayer wall “Add” button.

**Secures/improves:** Zoom allowed for low-vision users; screen readers get clear names for key actions (including “Read today’s verse” and “Submit prayer”).

---

## 8 & 9

No separate tasks 8 or 9 were specified in the conversation. If you have specific items (e.g. from a checklist), share them and we can map to code or add missing work.

---

## Quick reference: what you still need to do

| Item | Action |
|------|--------|
| **RLS** | Run `supabase-rls-lockdown.sql` in Supabase SQL Editor. |
| **Firebase push** | Create Firebase project, fill FIREBASE_* and FCM_SUBSCRIBE_URL, deploy `firebase-functions`. |
| **CSP** | If CDNs/fonts break, extend Content-Security-Policy in `_headers` (see SECURITY-HARDENING.md). |
| **ACAO** | Ensure HTML responses do not send Access-Control-Allow-Origin: * (Cloudflare/server config). |
| **security.txt** | Confirm `/.well-known/security.txt` is served in production (and not ignored by .gitignore if you want it in repo). |

---

## Security and UX summary

- **Security:** Headers (HSTS, CSP, X-Frame-Options, nosniff), admin email hidden, RLS (once SQL is run), signup role fixed to member.  
- **Privacy / data:** RLS ensures users only see their own data; push tokens stored server-side.  
- **UX / accessibility:** Mobile viewport and base styles, zoom allowed, ARIA on key buttons, PWA and offline verse/prayer, optional 9 AM push.
