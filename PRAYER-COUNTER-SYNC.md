# Prayer counter sync checklist

Use this when the site shows a different number than the database (e.g. "Total prayers: 9" but you expect 14+), or when tapping ♥ doesn't show "Amen—added!" and the count never moves.

---

## Run this now (one shot)

**If the counter is stuck at 9 and tap ♥ doesn't refresh or show a toast:**

1. **Supabase → SQL Editor** → New query → paste the **entire** contents of **`supabase-prayer-counter-fix.sql`** → **Run**.
2. **Check DB count:** Run `SELECT COUNT(*) FROM prayers;` — note the number (e.g. 9). If you want the site to show 10+, add one row in Table Editor: `intent` = `peace`, `created_at` = now().
3. **Hard refresh** the site (Ctrl+Shift+R). Tap ♥ (type something in the box, tap Pray). You should see **"Amen—added!"** and **"Last prayer: just now"**; the total count should update within a few seconds.

**If you still see "Saved locally—will sync when online" when you tap ♥,** the insert was blocked (RLS/anon). Run **`supabase-prayer-counter-fix.sql`** — it enables anon INSERT and the COUNT(*) RPC.

**Counter was 10 then showed 9 again?** Hard refresh (Ctrl+Shift+R) or try incognito—often cache. If it still shows 9 after a tap + 10 sec + hard reload, re-run **`supabase-prayer-counter-fix.sql`** and check **Supabase → SQL Editor:** `SELECT COUNT(*) FROM prayers;` (should match what you expect). Then hard refresh again.

---

## Quick path (10 min)

1. **Supabase → SQL Editor:** `SELECT COUNT(*) FROM prayers;`
2. **If result = 9:** Table Editor → **prayers** → Insert row: `intent` = `peace`, `created_at` = now(). Reload site.
3. **If result &gt; 9 or counter still wrong:** Run **`supabase-get-total-prayer-count-fix.sql`** in SQL Editor (redefines RPC so count matches DB).
4. **Test:** Tap ♥ → wait ~15s → hard reload (Ctrl+Shift+R). Counter should +1. Makes it feel real—users see growth.

---

## Step 1: Check DB count

**Supabase → SQL Editor:**

```sql
SELECT COUNT(*) FROM prayers;
```

Run it. Note the number (e.g. 9, 12, 14). The site should match this after the steps below.

---

## Step 2: If count &lt; 10 (or you want more rows)

- **Option A:** Run **`supabase-prayers-seed.sql`** once (adds 5 rows).
- **Option B:** Table Editor → **prayers** → Insert row: `intent` = `healing`, `created_at` = now() (repeat 2–3x).

Re-run `SELECT COUNT(*) FROM prayers;` to confirm the bump.

---

## Step 3: Fix RPC (force full count, no filters)

**Supabase → SQL Editor** — run the contents of **`supabase-get-total-prayer-count-fix.sql`** or:

```sql
CREATE OR REPLACE FUNCTION public.get_total_prayer_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.prayers;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_prayer_count() TO authenticated;
```

No filters — counts everything.

---

## Step 4: Keep raw prayer writes locked down

If the count doesn’t bump after tapping Pray/Amen, do **not** reopen anon table access. Run the protected RPC + RLS section from **`supabase-prayers.sql`** or keep this minimum lock:

```sql
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.prayers FROM anon;
REVOKE ALL ON public.prayers FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prayers TO service_role;
```

Then make sure the prayer RPCs in **`supabase-prayers.sql`** exist (`get_total_prayer_count`, `get_recent_prayers`, `increment_prayer_amen`, etc.).

---

## Step 5: Last prayer timestamp ("X min ago")

If "Last prayer: —" never updates, ensure the RPC exists. Run **`supabase-get-last-prayer-at.sql`** or:

```sql
CREATE OR REPLACE FUNCTION public.get_last_prayer_created_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT MAX(created_at) FROM public.prayers;
$$;

GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO anon;
GRANT EXECUTE ON FUNCTION public.get_last_prayer_created_at() TO authenticated;
```

Reload — badge should show "X min ago" when there are rows with `created_at`.

---

## Step 6: Test

1. **Hard refresh** the site (Ctrl+Shift+R / Cmd+Shift+R).
2. **Tap ♥** (quick pray).
3. **Wait ~15s** → reload. Counter should +1; "Last prayer" should update.
4. **Console / Network:** Look for **200** on the insert and the RPC requests. If **403**, RLS blocked — redo Step 4.

Once `SELECT COUNT(*)` matches the site counter and taps increment, you’re synced.
