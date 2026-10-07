-- ==============================================================================
-- FORMULA MARKET: SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY DEFAULT ('lst_' || REPLACE(gen_random_uuid()::text, '-', '')),
  crop_id TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  farmer TEXT NOT NULL,
  phone TEXT NOT NULL,
  state_id TEXT NOT NULL,
  district_id TEXT NOT NULL,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  distance_km NUMERIC DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create index for high performance querying by region & creation time
CREATE INDEX IF NOT EXISTS idx_listings_state_district ON public.listings(state_id, district_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies (Allow buyers & farmers to read and post listings)
DROP POLICY IF EXISTS "Allow public read access" ON public.listings;
CREATE POLICY "Allow public read access"
  ON public.listings
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.listings;
CREATE POLICY "Allow public insert access"
  ON public.listings
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON public.listings;
CREATE POLICY "Allow public update access"
  ON public.listings
  FOR UPDATE
  USING (true);

-- 5. Enable Supabase Realtime Replication for listings
-- This allows Buyers to see new harvests instantly without page refresh when Farmers list them!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'listings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
  END IF;
END $$;

-- 6. Insert sample seed harvests (Optional, if table is empty)
INSERT INTO public.listings (id, crop_id, quantity, price, farmer, phone, state_id, district_id, place_id, place_name, distance_km)
VALUES
  ('lst_seed_1', 'tomato', 10, 2140, 'Ravi Farms', '+91 98400 11223', 'tn', 'coimbatore', 'kurumbapakkam', 'Kurumbapakkam', 2),
  ('lst_seed_2', 'onion', 15, 1480, 'Sulochana Co-op', '+91 94430 55110', 'tn', 'madurai', 'usilampatti', 'Usilampatti Market Yard', 12),
  ('lst_seed_3', 'chilli', 8, 14600, 'Prakash Gardens', '+91 90030 77441', 'ap', 'guntur', 'guntur-market', 'Guntur Mirchi Yard', 18),
  ('lst_seed_4', 'turmeric', 20, 8100, 'Anjaneyulu N.', '+91 99590 22087', 'ts', 'nizamabad', 'nizamabad-yard', 'Nizamabad APMC Turmeric Yard', 11)
ON CONFLICT (id) DO NOTHING;
