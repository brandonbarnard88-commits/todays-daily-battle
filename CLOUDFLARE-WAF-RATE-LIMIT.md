# Cloudflare WAF, Bot Fight Mode & rate limiting

Step-by-step to turn on WAF, Bot Fight Mode, and a simple rate limit for your Edge Function. All done in the Cloudflare dashboard for **todaysdailybattle.com**.

---

## 1. WAF (Web Application Firewall)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and select the zone for **todaysdailybattle.com**.
2. Open **Security** → **WAF** (or **Security** → **Settings**).
3. Under **Security Level** (or **Security level**):
   - Set to **Medium** (recommended).  
   - Use **High** if you see obvious bot/scraper traffic and few false positives.
4. Save. No need to create custom rules unless you want to block specific paths or countries.

---

## 2. Bot Fight Mode

1. In the same account, go to **Security** → **Bots** (or **Scrape Shield** → **Bot Fight Mode**).
2. Turn **Bot Fight Mode** **On**.
3. This challenges likely bots automatically (free tier). If you have **Super Bot Fight Mode** (paid), you can use that for more control; otherwise the free option is enough.

---

## 3. Rate limiting rule (e.g. for Edge Function calls)

Your **submit-prayer** and **create-checkout-session** endpoints live on **Supabase** (`*.supabase.co`), not on your Cloudflare zone. So Cloudflare **cannot** rate limit those URLs directly (traffic goes client → Supabase).

You **can** rate limit:

- **Your own domain** (e.g. limit requests to `todaysdailybattle.com/*` by IP to reduce abuse to your HTML/JS/assets). Usually less critical.
- **If you put a Worker in front of something** later, you could rate limit there.

For **Supabase Edge Functions**, rate limiting is best done:

- **Inside the function** (e.g. in **submit-prayer** keep a simple in-memory or Deno KV counter per IP and return 429 after N requests per minute), or  
- **Supabase** (if they offer rate limits in your plan).

**Optional Cloudflare rate limit on your site (general):**

1. **Security** → **WAF** → **Rate limiting rules** (or **Rate rules**).
2. Click **Create rule**.
3. **Name:** e.g. `Limit per IP - site`.
4. **If:**  
   - Field = **Hostname**, Operator = **equals**, Value = `todaysdailybattle.com`  
   - (Or leave “All incoming requests” to cover the whole zone.)
5. **Then:**  
   - **Block** (or **Challenge**) when **Request rate** is **above** e.g. **100 requests per 1 minute** per **IP**.
6. **Duration:** 1 minute (or 10 minutes if you want a longer block).
7. Save.

Adjust the number (e.g. 60 or 200) so normal users aren’t blocked; this mainly stops single IPs from hammering your pages.

---

## 4. Summary

| Item | Where | Action |
|------|--------|--------|
| WAF Security Level | Security → WAF | Set to **Medium** (or High). |
| Bot Fight Mode | Security → Bots | Turn **On**. |
| Rate limit (optional) | Security → WAF → Rate limiting | Create rule: e.g. block when &gt; 100 req/min per IP. |
| Edge Function rate limit | Supabase / submit-prayer | Add in function or Supabase if needed; Cloudflare can’t see Supabase URLs. |

After this, bots and simple floods are better contained. Revisit **SECURITY-FORTRESS.md** for the full checklist.
