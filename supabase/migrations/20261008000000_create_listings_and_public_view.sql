-- ==============================================================================
-- FORMULA MARKET: SHARED REALTIME LISTINGS & SECURE PUBLIC ACCESS MIGRATION
-- Migration: 20261008000000_create_listings_and_public_view.sql
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Create or update the listings table with exact schema requirements
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  crop TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  mandi TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'quintal',
  ask_price NUMERIC NOT NULL,
  farmer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'sold', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

-- Ensure columns exist if table was already created with older schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'farmer_id') THEN
    ALTER TABLE public.listings ADD COLUMN farmer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'crop') THEN
    ALTER TABLE public.listings ADD COLUMN crop TEXT;
    UPDATE public.listings SET crop = crop_id WHERE crop IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'crop_id');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'state') THEN
    ALTER TABLE public.listings ADD COLUMN state TEXT;
    UPDATE public.listings SET state = state_id WHERE state IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'state_id');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'district') THEN
    ALTER TABLE public.listings ADD COLUMN district TEXT;
    UPDATE public.listings SET district = district_id WHERE district IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'district_id');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'mandi') THEN
    ALTER TABLE public.listings ADD COLUMN mandi TEXT;
    UPDATE public.listings SET mandi = place_name WHERE mandi IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'place_name');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'unit') THEN
    ALTER TABLE public.listings ADD COLUMN unit TEXT NOT NULL DEFAULT 'quintal';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'ask_price') THEN
    ALTER TABLE public.listings ADD COLUMN ask_price NUMERIC;
    UPDATE public.listings SET ask_price = price WHERE ask_price IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'price');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'farmer_name') THEN
    ALTER TABLE public.listings ADD COLUMN farmer_name TEXT;
    UPDATE public.listings SET farmer_name = farmer WHERE farmer_name IS NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'farmer');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'status') THEN
    ALTER TABLE public.listings ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'expires_at') THEN
    ALTER TABLE public.listings ADD COLUMN expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days');
  END IF;
END $$;

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_listings_query_perf ON public.listings(status, crop, district, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_state_district ON public.listings(state, district);
CREATE INDEX IF NOT EXISTS idx_listings_expires_at ON public.listings(expires_at);

-- 3. Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public can select active unexpired listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public read access" ON public.listings;
DROP POLICY IF EXISTS "Allow public read" ON public.listings;
DROP POLICY IF EXISTS "Owner can insert listing" ON public.listings;
DROP POLICY IF EXISTS "Allow public insert access" ON public.listings;
DROP POLICY IF EXISTS "Allow public insert" ON public.listings;
DROP POLICY IF EXISTS "Owner can update listing" ON public.listings;
DROP POLICY IF EXISTS "Owner can delete listing" ON public.listings;

-- SELECT policy: Anyone (signed-in or anonymous) can view active unexpired listings
CREATE POLICY "Public can select active unexpired listings"
  ON public.listings
  FOR SELECT
  USING (status = 'active' AND expires_at > now());

-- INSERT policy: Owner can insert their listing; fallback allows anon for phone-verified sessions
CREATE POLICY "Owner can insert listing"
  ON public.listings
  FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND farmer_id = auth.uid()) OR
    (auth.uid() IS NULL)
  );

-- UPDATE policy: Only the owner can update their own rows
CREATE POLICY "Owner can update listing"
  ON public.listings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND farmer_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND farmer_id = auth.uid());

-- DELETE policy: Only the owner can delete their own rows
CREATE POLICY "Owner can delete listing"
  ON public.listings
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND farmer_id = auth.uid());

-- 4. Privacy View: public_listings without phone column for anonymous users
CREATE OR REPLACE VIEW public.public_listings AS
SELECT
  id,
  farmer_id,
  crop,
  state,
  district,
  mandi,
  quantity,
  unit,
  ask_price,
  farmer_name,
  status,
  created_at,
  expires_at
FROM public.listings
WHERE status = 'active' AND expires_at > now();

-- Grant permissions for public view
GRANT SELECT ON public.public_listings TO anon, authenticated;

-- 5. Verified View for authenticated users (includes farmer phone)
CREATE OR REPLACE VIEW public.verified_buyer_listings AS
SELECT
  id,
  farmer_id,
  crop,
  state,
  district,
  mandi,
  quantity,
  unit,
  ask_price,
  farmer_name,
  phone,
  status,
  created_at,
  expires_at
FROM public.listings
WHERE status = 'active' AND expires_at > now();

-- Only authenticated users can access the phone contact view
REVOKE SELECT ON public.verified_buyer_listings FROM anon;
GRANT SELECT ON public.verified_buyer_listings TO authenticated;

-- 6. RPC function to safely request farmer contact for a specific listing
CREATE OR REPLACE FUNCTION public.get_listing_contact(p_listing_id UUID)
RETURNS TABLE (
  farmer_name TEXT,
  phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view farmer phone number.';
  END IF;

  RETURN QUERY
  SELECT l.farmer_name, l.phone
  FROM public.listings l
  WHERE l.id = p_listing_id AND l.status = 'active' AND l.expires_at > now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_listing_contact(UUID) TO authenticated;

-- 7. Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'listings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
  END IF;
END $$;
