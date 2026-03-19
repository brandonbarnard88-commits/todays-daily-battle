# Fix black site / CSP blocking styles — Cloudflare

Your site is black and the console shows "Refused to apply a stylesheet" because **Cloudflare is sending a Content-Security-Policy header** that does **not** include `'unsafe-inline'` for `style-src`. That header overrides the policy in your HTML, so styles are blocked.

The fix must be done in **Cloudflare Dashboard**. The repo cannot fix this.

---

## Trusted Types / DOMPurify errors (quick fix)

If you see:
- `Refused to create a TrustedTypePolicy named 'dompurify' because it violates... trusted-types default`
- `This assignment requires a TrustedHTML`

**Cause:** Your Cloudflare Transform Rule sets CSP with `trusted-types default` only. DOMPurify needs its own policy.

**Fix:** In Cloudflare **Rules → Transform Rules**, edit the rule that sets `Content-Security-Policy`. Change `trusted-types default` to **`trusted-types default dompurify`** (add `dompurify`).

Or replace the entire CSP value with the contents of **`CLOUDFLARE-CSP-COPY-PASTE.txt`** in this repo. Then **Purge cache** and hard-refresh.

---

**Quick fix:** In Cloudflare go to **Rules** → **Transform Rules** → create or edit a rule that **sets** the header `Content-Security-Policy` to the **exact value in Step 3** below (it includes `'unsafe-inline'` for both `style-src` and `script-src`). Then **purge cache** and hard-refresh.

> **“Refused to apply a stylesheet (line 316, x2)”** — That error will keep appearing until the Cloudflare-sent CSP includes `'unsafe-inline'` (and/or your nonce) in `style-src`. The repo has no inline styles left; the fix is only in Cloudflare.

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

### Alternative: Turwhatn off the CSP from Cloudflare

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

**Also:** If you see "Refused to load blob:... does not appear in the img-src directive", add **`blob:`** to `img-src` in the same CSP (the site uses blob URLs for canvas exports and SVG-to-image in Kids Corner). The value in Step 3 below already includes `blob:` in `img-src`.

**"Failed to load resource: 400 (token)"** — Often Cloudflare Turnstile (Quick Pray) or Supabase auth. Ensure CSP includes `https://challenges.cloudflare.com` in `script-src`, `frame-src`, and `connect-src` (see Step 3). If Turnstile is not in use, leave `TURNSTILE_SITE_KEY` empty in config; the 400 may then be Supabase token refresh (expired/invalid session).

---

## Troubleshooting: errors still after adding a Transform Rule

If you added a Transform Rule to **set** Content-Security-Policy but the site is still black:

1. **See what header is actually sent**
   - Open https://todaysdailybattle.com in Chrome.
   - DevTools → **Network** → select the first request (the document, `todaysdailybattle.com`).
   - In **Response Headers**, find **Content-Security-Policy**. Copy the full value.
   - If it does **not** contain `'unsafe-inline'` in `style-src` (and in `script-src` if you have inline scripts), then the rule is either not applying or another rule is overwriting it.

2. **Only one rule should set CSP**
   - Go to **Rules** → **Transform Rules**.
   - Check **every** rule. If more than one rule **sets** the header **Content-Security-Policy**, the order can make a strict one win. Edit or remove any rule that sets a CSP **without** `'unsafe-inline'` in both `style-src` and `script-src`.

3. **Use the CSP from `CLOUDFLARE-CSP-COPY-PASTE.txt` in the Transform Rule**
   - Action: **Set static** → Header name: `Content-Security-Policy`.
   - Header value: Copy the **full line** (starting with `default-src`) from `CLOUDFLARE-CSP-COPY-PASTE.txt` in this repo. It must include:
     - `trusted-types default dompurify` (not just `trusted-types default`)
     - `'unsafe-inline'` in both `script-src` and `style-src`
     - `'nonce-tdb2025s'` in `script-src` and `script-src-elem`
   - Condition: **All incoming requests** (or Hostname equals `todaysdailybattle.com`).

4. **Trusted Types errors** — If you see:
   - `Refused to create a TrustedTypePolicy named 'dompurify' because it violates... trusted-types default`
   - `This assignment requires a TrustedHTML`
   - Then your Cloudflare CSP has `trusted-types default` but must include **`dompurify`**: use `trusted-types default dompurify` in the CSP. The `_headers` file in this repo has the correct value; if a Transform Rule overrides it, update that rule to match `_headers` (see below).

5. **Make sure the deployed site sends the correct CSP**
   - This repo's `_headers` file defines the full CSP. If Cloudflare Transform Rules also set CSP, they **override** `_headers`. Ensure the Transform Rule uses the **exact** value from `_headers` (including `trusted-types default dompurify`).
   - In **Workers & Pages** → your project → **Deployments**, trigger **Retry deployment** and enable **Clear build cache** so the latest `_headers` and `index.html` are deployed.

6. **Purge and test**
   - **Caching** → **Configuration** → **Purge Everything**.
   - Test in an **incognito/private** window after a minute.

7. **Verify the CSP sent** — Run: `curl -sI https://todaysdailybattle.com | grep -i content-security-policy`
   - The output must include `trusted-types default dompurify`. If it shows only `trusted-types default`, the Transform Rule still has the old value.
