-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/cfrlknbpfzpkwpqodmfr/sql/new

-- 1. Create the lead captures table
CREATE TABLE IF NOT EXISTS public.lead_captures (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  constraint_id TEXT NOT NULL,
  scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- 3. Allow inserts from anon key (the form is public)
CREATE POLICY "allow_public_insert" ON public.lead_captures
  FOR INSERT TO anon
  WITH CHECK (true);

-- 4. Only allow select with service_role (for internal queries)
CREATE POLICY "allow_service_role_select" ON public.lead_captures
  FOR SELECT TO service_role
  USING (true);

-- 5. Index on email for dedup/lookup
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON public.lead_captures(email);

-- 6. Index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON public.lead_captures(created_at DESC);
