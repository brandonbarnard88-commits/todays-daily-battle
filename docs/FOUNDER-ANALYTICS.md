# Founder analytics — know the porch without knowing the person

**Purpose:** Help you see what visitors *do* on todaysdailybattle.com while keeping the privacy promise: no raw search text, no journal/prayer body, no personal IDs in product analytics.

---

## Weekly 10-minute checklist

Do this every Monday (or Friday quiet hour).

### 1) Am I receiving data?

1. Open [Google Analytics](https://analytics.google.com) → property for **todaysdailybattle.com** (Measurement ID `G-NFQ5GWJXCB` unless you changed it).
2. **Reports → Realtime**.
3. On your phone or another browser: open the site, **accept analytics cookies**, view today’s verse, open BBE or layman, run one Ask the Word search, click Plans once.
4. Within ~30 seconds you should see **page views** and events like `home_verse_view`, `home_ask_focus`, `search_query` / `quick_search`.

**If Realtime is empty when you test with consent:** cookie consent or ad-blocker.  
**If only your tests show up:** traffic is low *or* most visitors decline cookies (still normal for a privacy-forward site).

### 2) What pages matter?

**Reports → Engagement → Pages and screens** (last 7 / 28 days)

Watch: `/`, `/plans.html`, `/calm.html`, `/kids/`, `/verse.html`, `/explore.html`, `/mystudy`.

### 3) What did people *do*?

**Reports → Engagement → Events**

| Event | Meaning |
|-------|---------|
| `home_verse_view` | Today’s verse was on screen (~35% visible) |
| `home_bbe_open` | Opened Simpler English (BBE) |
| `home_layman_open` | Opened Simple layman terms |
| `home_dig_deeper_open` | Opened More from the Word |
| `home_ask_focus` | Focused Ask the Word input |
| `home_ask_search` | Ran a search / topic chip from home |
| `home_plans_click` | Clicked a Plans link from home |
| `home_calm_click` | Clicked Calm from home |
| `home_capacity_click` | Used capacity door button |
| `home_secondary_seen` | Scrolled into secondary stack |
| `search_query` / `quick_search` | Ask the Word (topic labels only — **never** raw text) |
| `bbe_simple_shown` | BBE text filled (when shown) |
| `verse_breakdown_open` | Breakdown panel opened |

### 4) Which feelings (anonymous)?

**Explore → Free form**

- Rows: Event parameter `topic`  
- Filter: Event name = `search_query` **or** `quick_search`  
- Metric: Event count  

You see **labels** like `anxiety`, `hope` — not what they typed.

### 5) Cloudflare Web Analytics (page traffic without Google cookies)

1. Cloudflare Dashboard → **Web Analytics** → Add site → copy **beacon token**.  
2. Set env **`CF_ANALYTICS_TOKEN`** on Cloudflare Pages (build) *or* put in local `config.js`:

```js
window.TDB_CONFIG.CF_ANALYTICS_TOKEN = 'your-token-here';
```

3. Redeploy. Beacon loads from `script.js` when token is set (CSP already allows `static.cloudflareinsights.com`).  
4. View traffic in Cloudflare → Web Analytics (page views, top paths, countries — no ad profile).

### 6) Local founder summary (this browser)

- **Admin** (master account) → tab **Visibility**  
- Or **`/stats.html`** (if `STATS_PASSWORD` set) → funnel section  

These counters are **device-local** (your browser’s own funnel bumps). They prove the funnel fires; GA4/Cloudflare show the *world*.

---

## Home funnel story (read this chart in GA4)

```
home_verse_view
    → home_bbe_open / home_layman_open
    → home_ask_focus → home_ask_search  (+ search_query topic)
    → home_plans_click / home_calm_click
```

Healthy porch: many verse views, fewer searches, still some Plans/Calm.  
If verse views exist but almost no ask_focus: people bounce or don’t scroll to Ask.  
If ask_search is high but default_rate is high on search_query: improve topic maps.

---

## Privacy rules (do not break)

- Never send raw search query, email, user_id, journal, prayer body, or verse text in `trackEvent`.  
- Search uses **`trackSearchAnalytics` only** (allowlist).  
- See **`PRIVACY-ANALYTICS.md`**.

---

## Owner surfaces

| Surface | Who | What |
|---------|-----|------|
| GA4 | You | Real traffic + events (consenting users) |
| Cloudflare Web Analytics | You | Cookieless page views (when token set) |
| `/admin.html` → Visibility | Master account | Checklist + local funnel + links |
| `/stats.html` | Password (`STATS_PASSWORD`) | Push health + local funnel |

---

## One-time setup (if not done)

1. GA4 property linked to the site; `GA_MEASUREMENT_ID` in config (already `G-NFQ5GWJXCB` in repo defaults).  
2. Accept cookies yourself when testing.  
3. Optional: `CF_ANALYTICS_TOKEN` for Cloudflare Web Analytics.  
4. Optional: `STATS_PASSWORD` for `/stats.html`.

Last updated: 2026-08 (home funnel + founder Visibility tab).
