# Stripe test payment — Battle Pro $9.99/mo + 7-day trial

**Time:** ~15 min  
**Done when:** $9.99 shows in Stripe Dashboard (test or live).

## Steps

1. **Stripe Dashboard** → [dashboard.stripe.com](https://dashboard.stripe.com) → ensure you're in **Test mode** (toggle top-right) for a test payment.

2. **Create product (if needed)**  
   - **Products** → **Add product**  
   - Name: `Battle Pro`  
   - Price: **Recurring**, **$9.99** / month  
   - Optional: add a second price **$99** / year for yearly.

3. **Add 7-day free trial**  
   - When creating/editing the price, enable **Free trial** → **7 days**.  
   - Or: **Products** → select Battle Pro → edit the recurring price → **Free trial** = 7 days.

4. **Create Payment Link**  
   - **Payment Links** → **New**  
   - Product: Battle Pro (monthly $9.99, 7-day trial)  
   - Optional: add a second link for yearly.  
   - Create link → copy the URL (e.g. `https://buy.stripe.com/...`).

5. **Paste link into the site**  
   - In `config.js` (or your env), set:
     - `STRIPE_BATTLEPRO_MONTHLY_LINK = 'https://buy.stripe.com/...'`  
   - Pricing / upgrade buttons that use `TDB_GET_STRIPE_LINK('battle_pro', 'monthly')` will use this link.

6. **Test**  
   - Open your site → go to Pricing or the Battle Pro CTA → click the upgrade link.  
   - Complete checkout with test card `4242 4242 4242 4242`.  
   - **Done when:** Stripe Dashboard → **Payments** shows $9.99 (after 7-day trial, or $0 for trial then $9.99).

## Test cards (Stripe)

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Use any future expiry, any CVC, any postal code.

## Optional: send to one trusted person

Use the same Payment Link URL and send it (e.g. by email). They pay $9.99/mo after the 7-day trial. For real payments, use **Live mode** and a live Payment Link.
