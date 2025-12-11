#!/bin/bash
set -e

echo "Building Expo web app for Vercel..."

# Check if we have the required environment variables
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ]; then
  echo "Warning: EXPO_PUBLIC_SUPABASE_URL not set"
fi

# For Expo Router, we need to use expo export
# Note: Expo Router with Metro may require different approach
echo "Running expo export..."
npx expo export --platform web --output-dir dist 2>&1 || {
  echo "Error: expo export failed"
  echo "Trying alternative: expo export without platform flag..."
  npx expo export --output-dir dist
}

# Check if dist/web exists (Expo may organize by platform)
if [ -d "dist/web" ]; then
  echo "Found dist/web, moving contents to dist..."
  mv dist/web/* dist/ 2>/dev/null || true
  rmdir dist/web 2>/dev/null || true
fi

# Verify build output
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
  echo "Error: Build output directory 'dist' is empty or not found"
  exit 1
fi

echo "Build complete! Output in ./dist"
ls -la dist/ | head -10

