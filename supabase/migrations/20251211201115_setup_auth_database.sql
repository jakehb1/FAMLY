-- Migration: Setup Auth Database
-- This migration ensures proper authentication setup with secure helper functions
-- and automatic family profile creation on user signup

-- 1. Fix security warnings: Set search_path on all helper functions
-- This prevents search path injection attacks

-- Fix get_user_family_id function
CREATE OR REPLACE FUNCTION public.get_user_family_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT id FROM families WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Fix update_family_location_point function
CREATE OR REPLACE FUNCTION public.update_family_location_point()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_point := ST_SetSRID(
      ST_MakePoint(NEW.location_lng, NEW.location_lat),
      4326
    )::geography;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_event_location_point function
CREATE OR REPLACE FUNCTION public.update_event_location_point()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_point := ST_SetSRID(
      ST_MakePoint(NEW.location_lng, NEW.location_lat),
      4326
    )::geography;
  END IF;
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Fix update_conversation_last_message function
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

-- Drop and recreate get_nearby_families function with secure search_path
DROP FUNCTION IF EXISTS public.get_nearby_families(numeric, numeric, integer, integer);
CREATE FUNCTION public.get_nearby_families(
  user_lat numeric,
  user_lng numeric,
  radius_meters integer DEFAULT 5000,
  max_results integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  name text,
  bio text,
  photo_url text,
  interests text[],
  verified boolean,
  phone_verified boolean,
  distance_meters numeric,
  location_lat numeric,
  location_lng numeric,
  neighborhood text,
  location_city text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_point geography;
  user_family_id uuid;
BEGIN
  -- Get current user's family ID
  user_family_id := get_user_family_id();
  
  -- Create point from user location
  user_point := ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;
  
  -- Query nearby families
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    f.bio,
    f.photo_url,
    f.interests,
    f.verified,
    f.phone_verified,
    ROUND(ST_Distance(user_point, f.location_point)::numeric, 0) as distance_meters,
    f.location_lat,
    f.location_lng,
    f.neighborhood,
    f.location_city
  FROM families f
  WHERE 
    f.active = true
    AND f.id != user_family_id
    AND f.location_point IS NOT NULL
    AND ST_DWithin(user_point, f.location_point, radius_meters)
    -- Exclude blocked families
    AND NOT EXISTS (
      SELECT 1 FROM blocks b
      WHERE (b.blocker_family_id = user_family_id AND b.blocked_family_id = f.id)
         OR (b.blocked_family_id = user_family_id AND b.blocker_family_id = f.id)
    )
  ORDER BY ST_Distance(user_point, f.location_point)
  LIMIT max_results;
END;
$$;

-- 2. Create function to automatically create family profile on user signup
-- This ensures every authenticated user has a family profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only create family if one doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM families WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.families (
      user_id,
      name,
      location_lat,
      location_lng,
      privacy_radius,
      active
    ) VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      ),
      0, -- Default location (will be set during onboarding)
      0,
      500, -- Default privacy radius in meters
      true
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Create trigger to automatically create family profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant necessary permissions for auth functions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- 5. Ensure RLS is enabled on all user-facing tables (already done, but verify)
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- 6. Create index on families.user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_families_user_id ON public.families(user_id);

-- 7. Add comment for documentation
COMMENT ON FUNCTION public.get_user_family_id() IS 
  'Returns the family ID for the currently authenticated user. Used in RLS policies.';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Automatically creates a family profile when a new user signs up.';

COMMENT ON FUNCTION public.get_nearby_families(numeric, numeric, integer, integer) IS 
  'Returns families within the specified radius, excluding blocked families.';

