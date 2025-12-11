#!/bin/bash
set -e

echo "Building Expo web app for Vercel..."

# Check if we have the required environment variables
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ]; then
  echo "Warning: EXPO_PUBLIC_SUPABASE_URL not set"
fi

# For Expo Router with Metro bundler, export for web
# This creates a static export in the dist folder
echo "Running expo export for web platform..."
npx expo export --platform web --output-dir dist

# Verify build output
if [ ! -d "dist" ]; then
  echo "Error: Build output directory 'dist' not found"
  exit 1
fi

echo "Build complete! Output in ./dist"

