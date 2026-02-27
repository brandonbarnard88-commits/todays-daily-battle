# Link won't open for others — troubleshooting

When someone says the link to your site won't open, it's usually one of these. **Most reports are from mobile** (tap from WhatsApp, iMessage, etc.), but test on **both mobile and desktop** to confirm.

---

## 1. Share the correct link

- Use the **full URL**: `https://todaysdailybattle.com/`
- Use **https** (not `http://`) so redirects and in-app browsers behave correctly.
- Avoid truncation: send the link in a way that doesn't get cut off (e.g. paste into a new message, not mid-sentence).

---

## 2. Cloudflare blocking in-app browsers (most common on mobile)

Links opened from **WhatsApp, iMessage, Facebook, Slack**, etc. often open in an **in-app browser** (especially on **mobile**). Cloudflare can treat that traffic as bot-like and either:

- Show a challenge that doesn't render well in the in-app browser, or
- Block the request so the page never loads ("link won't open").

**What to do:**

1. **Cloudflare Dashboard** → your domain → **Security** → **Settings**.
2. **Security Level**
   - If it's "High" or "I'm Under Attack", try **Medium** or **Low** so normal in-app browsers get through.
   - You can also try **Essentially Off** temporarily to confirm the issue is Cloudflare.
3. **Bot Fight Mode**
   - If it's **On**, turn it **Off** (it can block or challenge in-app browsers and link-preview crawlers).
4. **Save** and ask the person to try again. Have them test **on mobile** (tap link in the app, then try "Open in Safari/Chrome") and **on desktop** (click link in email/Slack in a real browser) so you know if it's mobile-only or both.

Optional: use **Configuration Rules** or **Page Rules** to skip challenges for the homepage when the request looks like a browser (e.g. allow known in-app browser User-Agents). For most sites, lowering Security Level and turning off Bot Fight Mode is enough.

---

## 3. Test both mobile and desktop

Before and after changing Cloudflare, verify the link yourself:

| Where | How to test |
|-------|--------------|
| **Mobile – in-app** | Send the link to yourself in WhatsApp (or iMessage). Tap it. Does the in-app browser load the site or show blank/error? |
| **Mobile – real browser** | Same link in **Safari** (iOS) or **Chrome** (Android). Open directly or use "Open in Safari" / "Open in Chrome" from the in-app browser. Should load. |
| **Desktop** | Click the link in an email or Slack in **Chrome**, **Safari**, or **Edge**. Should load. |

If it works on desktop and in the phone's real browser but **not** in the in-app browser on mobile, the fix is Cloudflare (Section 2) and/or telling users to use "Open in browser."

---

## 4. "Open in browser" instead of in-app

If the link works in Safari/Chrome but not inside the app:

- On iOS: tap the **…** or "Open in Safari" (or similar) in the in-app browser.
- On Android: "Open in Chrome" or "Open in browser".

That confirms the site is fine and the in-app view is the one being blocked or broken.

---

## 5. Quick checklist

| Check | Action |
|-------|--------|
| Link format | Share `https://todaysdailybattle.com/` (https, no typo). |
| Cloudflare Security Level | Set to **Low** or **Medium** (not High / I'm Under Attack). |
| Bot Fight Mode | **Off**. |
| Test on mobile (in-app) | Tap link in WhatsApp/iMessage — does it load or stay blank? |
| Test on mobile (Safari/Chrome) | Open same link in Safari or Chrome on phone — should load. |
| Test on desktop | Click link in Chrome/Safari/Edge — should load. |
| "Open in browser" | If in-app fails but real browser works, tell users to use "Open in Safari/Chrome." |

---

## 6. Other causes (less common)

- **Corporate / school firewall** blocking the domain.
- **Regional blocking** (if you enabled that in Cloudflare).
- **Wrong or redirected URL** (e.g. old short link, wrong domain).

If you've relaxed Cloudflare and the link still doesn't open in the in-app browser, keep Security at **Low** or **Medium** and Bot Fight Mode **Off**; the site is still protected by HTTPS, CSP, and Supabase RLS.
