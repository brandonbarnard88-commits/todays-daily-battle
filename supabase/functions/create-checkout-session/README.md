# create-checkout-session

**Status (Phase 2b-1):** Feature subscriptions are **closed**. This function no longer creates Stripe Checkout Sessions.

All spiritual/study tools are free. Sustainability is voluntary giving via [`/give`](https://todaysdailybattle.com/give) and `create-donation-session`.

## Current behavior

- **POST** → **410 Gone** with:
  ```json
  {
    "error": "subscriptions_closed",
    "message": "Feature subscriptions are closed. Everything is free. Giving is optional — use the Give page if you want to support the porch.",
    "give_url": "https://todaysdailybattle.com/give"
  }
  ```
- Frontend: `TDB_GO_TO_CHECKOUT` redirects to `/give` (does not call this endpoint for new checkouts).

## Historical note

Previously this endpoint created subscription Checkout Sessions with `metadata.user_id` / `metadata.tier` for webhook upgrades. That path is retired; existing subscribers are handled via Stripe Dashboard cancel-at-period-end (ops), not via new checkouts.

## Related

- Donations: `supabase/functions/create-donation-session`
- Give page: `/give.html` (routed as `/give`)
