# Kid Doodles Storage Bucket

Kids Battle doodle upload: kid saves canvas → Supabase Storage → parent sees gallery.

## Setup

1. **Run SQL** in Supabase Dashboard → SQL Editor:
   - Open `supabase-kid-doodles-bucket.sql`
   - Execute the script

2. **If bucket creation fails** (e.g. `storage.buckets` schema differs):
   - Create manually: Storage → New bucket → name `kid-doodles`, Public ✓
   - Re-run the RLS policy section only

## Flow

- **Kid** (on `/kids/`): Clicks "Save Doodle!" → canvas PNG → upload to `doodles/{familyCode}/{kidName}-{timestamp}.png`
- **Parent** (on `/kids/parent.html`): Lists `doodles/{kidsBetaCode}/` → shows last 5 in Polaroid grid

## Requirements

- Kid must be "connected" (entered parent's code) for upload to work
- Parent must have `kidsBetaCode` in localStorage (from beta signup) to see gallery
