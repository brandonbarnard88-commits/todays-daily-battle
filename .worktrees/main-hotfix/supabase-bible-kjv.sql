-- =============================================================================
-- Bible KJV table with pgvector for semantic search (Ask the Bible)
-- Run in Supabase SQL Editor. Requires pgvector extension.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.bible_kjv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter int NOT NULL,
  verse int NOT NULL,
  text text NOT NULL,
  ref text NOT NULL UNIQUE,
  embedding vector(384),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bible_kjv_ref_idx ON public.bible_kjv (ref);
CREATE INDEX IF NOT EXISTS bible_kjv_book_chapter_verse_idx ON public.bible_kjv (book, chapter, verse);

-- HNSW index for fast vector similarity (cosine distance)
CREATE INDEX IF NOT EXISTS bible_kjv_embedding_idx ON public.bible_kjv
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

ALTER TABLE public.bible_kjv ENABLE ROW LEVEL SECURITY;

-- Public read for bible-qa (anon can search)
CREATE POLICY "bible_kjv_public_read"
  ON public.bible_kjv FOR SELECT
  USING (true);

-- Only service role can insert/update (via Edge Functions)
CREATE POLICY "bible_kjv_service_write"
  ON public.bible_kjv FOR ALL
  USING (auth.role() = 'service_role');

-- RPC for vector similarity search (used by bible-qa Edge Function)
CREATE OR REPLACE FUNCTION public.match_bible_verses(
  query_embedding vector(384),
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.3
)
RETURNS TABLE (id uuid, ref text, verse_text text, similarity float)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id,
    b.ref,
    b.text AS verse_text,
    1 - (b.embedding <=> query_embedding) AS similarity
  FROM bible_kjv b
  WHERE b.embedding IS NOT NULL
    AND (1 - (b.embedding <=> query_embedding)) > match_threshold
  ORDER BY b.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
