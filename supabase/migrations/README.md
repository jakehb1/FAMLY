# Supabase Migrations

This directory contains database migrations for the Famly app.

## Applied Migrations

**IMPORTANT: Run migrations in this order:**

1. `20251211172250_initial_schema.sql` - **Run this first!** Creates all base tables (families, children, connections, etc.)
2. `20251211201115_setup_auth_database.sql` - Sets up secure auth functions and automatic family profile creation

### Migration Details

1. `initial_schema` - Creates all base tables with PostGIS support, indexes, and RLS enabled
2. `setup_auth_database` - Secures helper functions and adds automatic family profile creation on signup

## Storage Buckets

The following storage buckets need to be created manually in the Supabase dashboard:

1. **profile-photos** (public, authenticated upload)
   - Public read access
   - Authenticated users can upload
   - Max file size: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

## Next Steps

- Create storage bucket for profile photos via Supabase dashboard
- Set up Edge Functions for:
  - `/families/nearby` - Get nearby families with privacy blur
  - `/connections` - Handle connection requests
  - `/conversations` - Manage conversations and messages

