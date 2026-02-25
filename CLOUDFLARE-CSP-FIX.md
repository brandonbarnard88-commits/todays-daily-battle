# Fix black site / CSP blocking styles — Cloudflare

Your site is black and the console shows "Refused to apply a stylesheet" because **Cloudflare is sending a Content-Security-Policy header** that does **not** include `'unsafe-inline'` for `style-src`. That header overrides the policy in your HTML, so styles are blocked.

The fix must be done in **Cloudflare Dashboard**. The repo cannot fix this.

---

## Step 1: Log in to Cloudflare

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and select the account that owns **todaysdailybattle.com**.

---

## Step 2: Find where CSP is set

**Option A — Transform Rules (most common)**

1. Open **Rules** → **Transform Rules** (or **Rules** → **Modify response header**).
2. Look for any rule that **sets** or **adds** the header **Content-Security-Policy** (or **content-security-policy**).
3. That rule is what’s blocking your styles.

**Option B — Configuration Rules (Pages)**

1. Go to **Workers & Pages** → your **todaysdailybattle** project.
2. Open **Settings** → **Functions** or **Configuration**.
3. Check for any place that sets security headers or CSP.

**Option C — WAF / Scrape Shield**

1. Go to **Security** → **Settings** or **Scrape Shield**.
2. See if “Content Security Policy” or similar is enabled and defines a policy.

---

## Step 3: Fix it (choose one)

### Recommended: Edit the CSP to allow inline styles

1. Open the rule that sets **Content-Security-Policy**.
2. Find the **style-src** part of the policy (e.g. `style-src 'self' https://fonts.googleapis.com`).
3. Add **`'unsafe-inline'`** inside **style-src**, for example:
   - Before: `style-src 'self' https://fonts.googleapis.com`
   - After:  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
4. Save the rule.

### Alternative: Turn off the CSP from Cloudflare

1. In the same place (Transform Rules / Modify response header), **delete** the rule that sets **Content-Security-Policy**, or **disable** it.
2. After that, the only CSP will be the one in your HTML (meta tag), which already includes `'unsafe-inline'` for styles, so the site should load correctly.

---

## Step 4: Purge cache

1. In Cloudflare, go to **Caching** → **Configuration**.
2. Click **Purge Everything** (or purge the cache for todaysdailybattle.com).
3. Wait a minute, then do a **hard refresh** on the site (Cmd+Shift+R or Ctrl+Shift+R).

---

## If you can’t find the rule

- Use **Search** in the Cloudflare dashboard for “Content-Security-Policy” or “CSP”.
- Check both the **zone** (domain) and the **Pages project** (if you use Pages).
- If someone else set up the account, ask them where the CSP header is configured.

Once the header sent by Cloudflare either includes `'unsafe-inline'` in `style-src` or is removed, the black screen and “Refused to apply a stylesheet” errors should stop.
