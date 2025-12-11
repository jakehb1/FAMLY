#!/bin/bash
set -e

echo "Building Expo web app..."

# Check if we have the required environment variables
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ]; then
  echo "Warning: EXPO_PUBLIC_SUPABASE_URL not set"
fi

# For Expo Router with Metro bundler, we need to use expo export
# This will create a static export for web
echo "Running expo export..."
npx expo export --platform web --output-dir dist

echo "Build complete! Output in ./dist"

