# Search analytics in Google Analytics 4

**User safety is the key. This is a safe place.** With `GA_MEASUREMENT_ID` set in `config.js`, the site sends **aggregate-only** events so you can see which topics are searched most. We **never** send who searched—no user ID, no email, no raw search text—to protect users from data breaches.

## What we send (and what we don’t)

| Event             | When it fires                    | Parameters sent | Not sent |
|-------------------|-----------------------------------|----------------|----------|
| **quick_search**  | User clicks a quick-topic button  | `topic` only (e.g. `hope`, `anxiety`) | No user ID, no query text |
| **search_query**  | User runs any search              | `topic` when it’s a known topic, or `search_type: 'keyword'` for other searches | **No raw query text**, no user ID |

So you get: “hope was searched 120 times,” “anxiety 95 times,” “keyword searches 200 times.” You do **not** get the actual words people typed or any identifier. **Your search is yours.**

## How to view in GA4

1. **GA4** → **Reports** → **Engagement** → **Events**  
   - Find `quick_search` and `search_query`.  
   - Click an event to see breakdown by `topic` or `search_type`.

2. **Which quick searches get used most**  
   - **Explore** → **Free form**.  
   - Event name = `quick_search`, rows = event parameter `topic`.  
   - You’ll see counts per topic (e.g. hope 120, anxiety 95, free will 80).

3. **Topic vs keyword searches**  
   - **Explore** → **Free form**.  
   - Event name = `search_query`.  
   - Rows = `topic` or `search_type`.  
   - You’ll see how many searches were for a known topic vs “keyword” (no topic stored).

## Privacy and data-breach protection

- **User safety is the key.** We do not send user ID, email, or any identifier with these events. This is a safe place.
- **No raw search text:** The actual query string is never sent. Only the **topic** (when it matches a known topic like hope, fear, anxiety) or a generic `search_type: 'keyword'` is sent.
- **Aggregate only:** Analytics are for product insight (which topics are popular), not for knowing who searched what.
- **If GA4 is breached:** Stored data would be topic names and counts only—not user identities or search text. We build it so your safety comes first.

In GA4 you can also turn off collection of IP and other identifiers in **Admin** → **Data settings** if you want to further limit what Google stores.
