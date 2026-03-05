# notify-prayer-answered

Sends a "Your prayer was answered!" email to the poster when a pastor marks their prayer request as answered on the Church Prayer Wall.

**Trigger:** Client calls POST after `mark_church_prayer_answered` RPC succeeds (if poster has subscribed with email).

**POST body:** `{ prayer_id: string, to_email: string, text_preview?: string }`

**Env:** `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM`
