# Polish Release Guide — Deployment, Wording & Promotion

Post-March 2026 polish features: offline widget, copy verse, pray feedback, carousel, Trust plan, testimonials, mood footer, PWA timing. This guide covers getting them live, wording options, and gentle promotion.

---

## Immediate Next Step: Purge & Redeploy (Do This First)

### Pre-purge sanity check (~2 min)

- **Cloudflare** → Workers & Pages → your project → **Deployments**
- Confirm latest successful deploy includes your changes (commit message or diffs: `offline.html`, `plans.html`, `about.html`, `footerMoodInsight`, etc.).
- If latest deploy is older than your last push → **trigger manual redeploy first**, then purge.

### 1. Purge Cloudflare cache

**Option A — Dashboard:**  
- **Dashboard** → **Caching** → **Configuration**
- Click **Purge Everything** (safest for full refresh)

**Option B — API (one-liner):**  
```bash
CF_ZONE_ID=your_zone_id CF_API_TOKEN=your_token npm run purge:cloudflare
```
- Zone ID: Cloudflare → your domain → Overview (right sidebar)
- Token: My Profile → API Tokens → Create Token → "Edit zone cache" template

**Option C — GitHub Action (one-click):**  
1. Add repo secrets: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**  
   - `CF_ZONE_ID` (from Cloudflare → domain → Overview)  
   - `CF_API_TOKEN` (from My Profile → API Tokens → "Edit zone cache")  
2. **Actions** → **Purge Cloudflare Cache** → **Run workflow**
- Or **Custom Purge** → enter:
  - `https://todaysdailybattle.com/`
  - `https://todaysdailybattle.com/offline.html`
  - `https://todaysdailybattle.com/plans.html`
  - `https://todaysdailybattle.com/about.html`
  - `https://todaysdailybattle.com/calm.html`
- Wait 10–30 seconds for purge to complete.
- **After purge:** Wait 30–60 seconds before testing (Cloudflare propagation time).

### 2. Trigger redeploy

- **Cloudflare Pages:** Deployments → **Trigger deploy** or push a commit.
- **Vercel/Netlify:** Manual redeploy or push a tiny change (e.g. comment in `index.html`).
- Confirm build logs include latest files (inline JS, `#footerMoodInsight`, testimonials).

### 3. Verify post-purge (incognito + cleared storage)

- Open incognito → hard refresh each page (Ctrl+Shift+R / Cmd+Shift+R).
- **Check:** `/offline.html` (DevTools → Network → Offline → reload) → 5-verse + Copy.
- **Check:** `/plans.html` → open 2–3 plans → reload → "Continue" carousel.
- **Check:** `/about.html` → "Stories from users" → click to expand.
- **Check:** Homepage footer → `#footerMoodInsight` → rotating line.
- **Check:** Save a prayer → "Prayer saved" ✓ + delayed PWA prompt.

### 4. If still missing

- **Console** — Look for JS errors.
- **Service worker** — DevTools → Application → Service Workers → **Update on reload**.
- **Bump CACHE_NAME** in `service-worker.js` → commit + push → redeploy.

### 5. Monitor 48–72 hours

- **Engagement** — Pages/visit nudge up? (target 4+)
- **Returning users** — Slight increase from carousel + streaks
- **Share events** — Clicks on new Share buttons (even 5–10/day compounds)
- **PWA adds** — Count via beforeinstallprompt or analytics
- **Mood footer** — Rotates correctly (Peace·Strength·Anxiety → next set)
- **Testimonials** — Expand works, quotes load, email link clickable
- **Trust plan** — Visible between 7-Day Peace and 10-Day Battle

---

## 1. Deployment & Cache Troubleshooting

### Why features don't show after deploy

- **Service worker** — PWA precaches HTML. Bump `CACHE_NAME` in `service-worker.js` (e.g. `tdb-static-20260315` → `tdb-static-20260316`), commit, push. New SW fetches fresh HTML.
- **Cloudflare cache** — Edge cache holds old HTML. Purge after deploy.
- **Conditional logic** — Carousel needs localStorage history (open a plan first). Testimonials are collapsed (click "Stories from users"). Mood footer runs on page load.

### Step-by-step: Make polish features visible

1. **Bump service worker**  
   Edit `service-worker.js` → change `CACHE_NAME` → commit + push.

2. **Trigger deploy**  
   Cloudflare Dashboard → Workers & Pages → your project → Deployments → **Trigger deploy** (or **Redeploy**). If available: **Clear cache and deploy**.

3. **Purge cache**  
   Caching → Configuration → **Purge Everything** (or Custom Purge: `/index.html`, `/plans.html`, `/about.html`, `/offline.html`, `/calm.html`).

4. **Hard refresh**  
   Cmd+Shift+R (Mac) or Ctrl+F5 (Windows). Or incognito + DevTools → Application → Clear site data.

### Verify each feature

| Feature | How to verify |
|---------|---------------|
| Offline widget | DevTools → Network → Offline → reload `/offline.html` → see 5-verse set + Copy button |
| Copy verse | `/calm.html` → click pill → verse shows → "Copy to clipboard" below |
| Pray feedback | Homepage → Invite & Share → type prayer → Pray → "Prayer saved" ✓ for ~2s |
| Carousel | `/plans.html` → open 2–3 plans → reload → "Continue" row with progress bars |
| Trust plan | `/plans.html` → "7-Day Trust in Uncertainty" between Peace and 10-Day Battle |
| Testimonials | `/about.html` → "Stories from users" button → click to expand quotes |
| Mood footer | Homepage footer → "This month people searched most for: Peace · Strength · Anxiety" |
| PWA prompt | Save a prayer or complete streak → install nudge appears (no auto-show on load) |

### Build output

- **Build command:** `npm run build`
- **Output directory:** `dist`
- Ensure `offline.html`, `calm.html`, `about.html` are copied to `dist` (check `build-copy-static.js` if needed).

### What to do if still seeing old version

1. **Service worker** — Most common. Bump `CACHE_NAME` in `service-worker.js`, push, redeploy. Returning users get new SW and fresh HTML.
2. **Development Mode** — Cloudflare → Caching → turn on **Development Mode** (disables cache 3 hours) to test.
3. **Clear site data** — DevTools → Application → Storage → **Clear site data** (localStorage, SW, cache).
4. **Different browser/device** — Rules out local cache.
5. **Build logs** — Confirm `index.html`, `plans.html`, `about.html`, `offline.html`, `calm.html` are in deploy output.

---

## 2. Wording Options

### 7-Day Trust in Uncertainty (plan card + detail)

**Current:**  
"For seasons of job uncertainty, health scares, or when the future feels shaky. Trust when you can't see the path."

**Alternates:**

- "Job loss, health scares, shifting ground. Seven verses for when you can't see the path."
- "When the future feels shaky—trust verses for real uncertainty. Job, health, or life."
- "For seasons when the ground shifts. Trust when you can't see the path—7 days of verses."

### Testimonial placeholders (about.html)

**Current set (4):**
1. "This verse came right when my anxiety peaked—thank you."
2. "The mood search found exactly what I needed. No fluff."
3. "Offline mode got me through a week without service."
4. "Seven days of Peace got me through the hardest month."

**Expand to 5–6 (varied tones):**
- "Found Isaiah 41:10 when I needed it most. No ads, no noise." *(anxiety relief)*
- "The armor stories got my kids asking about the Bible. Finally." *(family use)*
- "Privacy-first. No tracking. Exactly what I was looking for." *(daily habit / trust)*
- "One verse before work. Two minutes. Game changer." *(habit win)*
- "Built during recovery—I felt that. Thank you for making this." *(recovery resonance)*

**Submission guidelines (for email link):**  
"Have a story? Email us with your permission to share anonymously. We add 1–2 each month."

**Note:** Start with 3 quotes visible on expand; add more as submissions come in (keep anonymized).

### Mood footer (index.html)

**Current:**  
"This month people searched most for: [Peace · Strength · Anxiety]." (rotates by month)

**Alternate phrasing:**
- "People are searching for: Peace · Strength · Anxiety this month."
- "Top searches this month: Peace, Strength, Anxiety."

---

## 3. Promotion Ideas

### Gentle X (Twitter) posts (@todaysdailybattle or @8randon8arnard)

**Verse-of-the-day (no hype):**
- "One verse. One moment. KJV. todaysdailybattle.com"
- "Need a verse for anxiety, hope, or grief? Search by feeling. No app. todaysdailybattle.com"

**Recovery / personal (story hook):**
- "Built during recovery. No ads. No tracking. Just verses when you need them. todaysdailybattle.com"
- "Built the Bible companion I needed when life got loud. One verse, one prayer, every day. todaysdailybattle.com"
- "Hospital season taught me: one verse beats endless scroll. So I built it. todaysdailybattle.com"

**Feature highlight:**
- "7-Day Trust in Uncertainty — for job loss, health scares, shifting ground. New plan. todaysdailybattle.com/plans.html"
- "Offline mode: verses when there's no signal. todaysdailybattle.com"

**Hashtags (pick 1–2):** #DailyVerse #KJV #LessScrollMoreSoul #FaithApp  
**Low-volume, targeted:** #DailyBattle #KJV #FaithJourney

### Church QR flyers

**Flyer copy (fits on a card):**
```
Need a verse right now?
Scan → Search by feeling (anxiety, hope, grief)
KJV · No app · Works offline
todaysdailybattle.com
```

**QR code target:** `https://todaysdailybattle.com/calm.html` (feeling pills) or `https://todaysdailybattle.com` (homepage).  
**QR tip:** Use qr-code-generator.com or similar. For story + privacy emphasis: `https://todaysdailybattle.com/about.html`

**Exact bulletin insert (copy-paste):**
```
Need a verse for today? Search by how you feel—anxiety, hope, grief, peace. 
One verse. KJV. No app. Works offline. todaysdailybattle.com
```

**Shorter bulletin line:**
```
One verse, one moment—search by feeling. todaysdailybattle.com. No signup. No ads.
```

### Email opt-in growth

- **Footer CTA:** "Get Daily Verse + Prayer Nudge" (already on homepage).
- **Post-prayer:** After saving a prayer, subtle: "Want a daily verse by email? One a day. No spam."
- **Plan complete:** After finishing a 7-day plan: "Get the next plan in your inbox—weekly recap or daily verse."

### Low-effort amplification

- **Link in bio** — X, Instagram, church site.
- **Signature line** — "Daily KJV verse: todaysdailybattle.com"
- **Church resource page** — Add to "Recommended tools" or "Devotionals" list.

---

## Quick reference

| Area | Key file | Action |
|------|----------|--------|
| Service worker | `service-worker.js` | Bump CACHE_NAME on HTML changes |
| Cache purge | Cloudflare Dashboard | Purge Everything after deploy |
| Trust plan | `plans.html` | Card + PLANS.trust.desc |
| Testimonials | `about.html` | Collapsed section, 4 quotes |
| Mood footer | `index.html` | #footerMoodInsight, byMonth array |

---

*Last updated: March 2026*
