# Prayer counter sync checklist

Use this when the site shows a different number than the database (e.g. "Total prayers: 9" but you expect 14+).

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

## Step 4: Fix anon INSERT (so ♥ taps stick)

If the count doesn’t bump after tapping ♥, anon may be blocked. Run the RLS section from **`supabase-prayers.sql`** or:

```sql
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prayers_anon_insert" ON public.prayers;
CREATE POLICY "prayers_anon_insert" ON public.prayers
  FOR INSERT WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.prayers TO anon;
```

(Skip if policies already exist — check Table Editor → **prayers** → Policies.)

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
