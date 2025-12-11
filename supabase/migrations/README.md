# Supabase Migrations

This directory contains database migrations for the Famly app.

## Applied Migrations

1. `enable_postgis` - Enables PostGIS extension for geospatial queries
2. `create_families_table` - Creates families table with location support
3. `create_children_table` - Creates children table
4. `create_connections_table` - Creates connections table for family connections
5. `create_conversations_table` - Creates conversations table
6. `create_messages_table` - Creates messages table
7. `create_events_table` - Creates events table (for v1.1)
8. `create_reports_table` - Creates reports table for safety features
9. `create_blocks_table` - Creates blocks table
10. `create_triggers_and_functions` - Creates triggers and helper functions
11. `enable_rls_policies` - Enables Row Level Security and creates policies
12. `create_nearby_families_function` - Creates function for querying nearby families
13. `setup_auth_database` - Sets up secure auth functions and automatic family profile creation

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

