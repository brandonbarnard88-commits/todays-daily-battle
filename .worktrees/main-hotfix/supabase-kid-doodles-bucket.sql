-- Kids Battle: doodle upload bucket. Run in Supabase SQL Editor.
-- Bucket: kid-doodles (public read, anon upload for kids without auth).
-- Path: doodles/{familyCode}/{kidName}-{timestamp}.png
-- =============================================================================

-- Create bucket (id = name). Run once. If bucket exists, create via Dashboard: Storage → New bucket → kid-doodles, Public.
INSERT INTO storage.buckets (id, name, public)
VALUES ('kid-doodles', 'kid-doodles', true)
ON CONFLICT (id) DO NOTHING;

-- RLS on storage.objects: anon read (public bucket), anon insert (kids upload)
DROP POLICY IF EXISTS "kid_doodles_anon_select" ON storage.objects;
CREATE POLICY "kid_doodles_anon_select"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'kid-doodles');

DROP POLICY IF EXISTS "kid_doodles_anon_insert" ON storage.objects;
CREATE POLICY "kid_doodles_anon_insert"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'kid-doodles'
    AND (storage.foldername(name))[1] = 'doodles'
    AND lower(name) LIKE '%.png'
  );
