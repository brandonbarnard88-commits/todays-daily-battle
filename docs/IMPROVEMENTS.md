# How the site can be improved

Prioritized by impact and effort. Use as a backlog for polish and growth.

---

## Sermon Builder

### Quick wins
- **Sign-in gate / empty state**  
  When not signed in, show “Sign in to save and list sermons” and still allow editing (localStorage-only draft). After sign-in, offer “Save to cloud” so the current draft becomes a listed sermon.
- **Delete sermon**  
  Add a “Delete” or trash icon per row in My Sermons; confirm then `supabase.from('sermons').delete().eq('id', id)`.
- **Auto-save**  
  Debounced save (e.g. every 30s) while editing, plus “Saved” / “Saving…” indicator so users don’t lose work.
- **Toast instead of alert**  
  Replace `alert('Sermon draft saved.')` with `showEliteToast('Sermon draft saved.')` for consistency with the rest of the site.

### Medium effort
- **Verse picker**  
  “Add verse” per section (or next to Primary Text): open a small modal, search your verses/Bible API, insert reference + text into the outline or a “Verses” area.
- **Templates**  
  “Start from template”: e.g. “3-Point Expository”, “Topical”, “Armor of God” — prefill title, theme, and section headings so pastors can fill in content.
- **Share link**  
  “Create share link” saves a read-only snapshot to `shares` (or sermons with `share_id`); open `?share=xxx` to view (no edit). Good for sending to elders or team.
- **PDF filename**  
  When using Print → Save as PDF, suggest filename from title + date (e.g. `Faith-and-Work-2026-03-01.pdf`).

### Larger / later
- **Drag-and-drop section order**  
  Reorder Introduction / Main points / Conclusion (store sections as array in JSON).
- **Collaboration**  
  Optional “Invite co-editor” (share link + role) and realtime or polling sync (Supabase Realtime or periodic refetch).

---

## Site-wide UX

### Quick wins
- **Loading states**  
  Sermon list: skeleton or “Loading…” until fetch completes. Same for any list that depends on Supabase (e.g. prayer echo, saved verses).
- **Offline / errors**  
  If sermon list fetch fails (network or RLS), show “Couldn’t load sermons. Check connection and try again.” with a Retry button instead of staying on “Loading…”.
- **Keyboard**  
  Sermon: Escape to blur/cancel any “Add verse” modal; Enter in title to focus next field (optional).
- **Mobile**  
  Sermon grid: ensure Date and Status don’t wrap badly on small screens; list items tap target at least 44px.

### Medium effort
- **Pro/Supporter gate**  
  If Sermon Builder is Supporter/Pro only, show a clear “Upgrade to save unlimited sermons” (or “Sign in to sync”) and link to pricing instead of a dead list.
- **Onboarding**  
  First visit to sermon.html: one-line tooltip or banner (“Start with New Sermon or pick a template”) dismissible per session.
- **Consistent nav**  
  sermon.html (and other tool pages) use the same header/sidebar as index so “Sermon Builder” feels part of the main app.

---

## Technical / performance

- **Sermons table**  
  If you add many sections or rich content later, consider a `sermon_sections` table (sermon_id, order, type, content) instead of one big `outline`/`points` text block for easier reordering and versioning.
- **Sync**  
  Currently only the “latest” sermon is synced into the draft on login. Consider syncing the full list into a local cache and reconciling so “My Sermons” works offline and stays in sync.
- **Export**  
  For PDF, consider a small library (e.g. jsPDF or html2pdf.js) to generate a file with title/date in the filename and consistent styling, instead of relying only on the browser’s Print dialog.
- **CSP**  
  If you add inline scripts or new CDNs for PDF/export, remember to allow them in the Content-Security-Policy (and keep nonces if you use them).

---

## Growth / conversion

- **Sermon Builder CTA on homepage**  
  In “How It Works” or “Tools”, add a direct link: “Build a sermon outline →” to sermon.html so pastors discover it.
- **Pricing**  
  On pricing, call out “Sermon Builder (templates, save, export)” under Supporter/Pro so the feature is part of the value story.
- **Stripe**  
  Finish the Stripe test flow (see docs/STRIPE-TEST-PAYMENT.md), then add the live Battle Pro link so “Upgrade” leads to a real checkout.
- **Social proof**  
  “X pastors built sermons this week” or a short testimonial near Sermon Builder (if you can collect the number from Supabase or a simple counter).

---

## Summary

| Area           | Do first (quick)                          | Do next (medium)                    |
|----------------|-------------------------------------------|-------------------------------------|
| Sermon Builder | Toasts, delete, sign-in empty state       | Verse picker, templates, share link |
| Site-wide      | Loading/error states, mobile tap targets  | Pro gate, onboarding                |
| Technical      | —                                         | PDF library, optional sections table |
| Growth         | Homepage CTA, pricing copy                | Live Stripe, social proof           |

Use this as a living list: tick items off as you ship and add new ideas as you learn from users.
