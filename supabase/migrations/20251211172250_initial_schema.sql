-- Migration: Initial Schema Setup
-- This migration creates all base tables required for the Famly app
-- Run this BEFORE setup_auth_database migration

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create families table
CREATE TABLE IF NOT EXISTS public.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  neighborhood text,
  location_lat numeric NOT NULL DEFAULT 0,
  location_lng numeric NOT NULL DEFAULT 0,
  location_city text,
  location_zip text,
  location_point geography(POINT, 4326),
  bio text,
  photo_url text,
  interests text[] DEFAULT '{}',
  verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  privacy_radius integer DEFAULT 500,
  active boolean DEFAULT true
);

-- Create children table
CREATE TABLE IF NOT EXISTS public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  name text NOT NULL,
  age_years integer NOT NULL,
  age_months integer,
  interests text[] DEFAULT '{}',
  school_age_group text CHECK (school_age_group IN ('infant', 'toddler', 'preschool', 'elementary', 'middle', 'high'))
);

-- Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  requester_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  receiver_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message text
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now(),
  family_ids uuid[] NOT NULL UNIQUE CHECK (array_length(family_ids, 1) = 2)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  host_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location_name text,
  location_address text,
  location_lat numeric,
  location_lng numeric,
  location_point geography(POINT, 4326),
  datetime timestamptz NOT NULL,
  age_range_min integer,
  age_range_max integer,
  max_families integer,
  attendees uuid[] DEFAULT '{}',
  visibility text NOT NULL DEFAULT 'neighborhood' CHECK (visibility IN ('connections_only', 'neighborhood', 'public')),
  active boolean DEFAULT true
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  reporter_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  reported_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

-- Create blocks table
CREATE TABLE IF NOT EXISTS public.blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  blocker_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  blocked_family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_families_user_id ON public.families(user_id);
CREATE INDEX IF NOT EXISTS idx_families_location_point ON public.families USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_children_family_id ON public.children(family_id);
CREATE INDEX IF NOT EXISTS idx_connections_requester ON public.connections(requester_family_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.connections(receiver_family_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_family_id ON public.messages(sender_family_id);
CREATE INDEX IF NOT EXISTS idx_events_host_family_id ON public.events(host_family_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_family_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_family_id);

-- Enable RLS on all tables
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

