#!/bin/bash
set -e

echo "Building Expo web app for Vercel..."

# Check if we have the required environment variables
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ]; then
  echo "Warning: EXPO_PUBLIC_SUPABASE_URL not set"
fi

# Create NativeWind JSX runtime shim if it doesn't exist
if [ ! -f "node_modules/nativewind/jsx-runtime.js" ]; then
  echo "Creating NativeWind JSX runtime shim..."
  mkdir -p node_modules/nativewind
  echo 'module.exports = require("react/jsx-runtime");' > node_modules/nativewind/jsx-runtime.js
fi

# For Expo Router with Metro bundler, use expo export (NOT expo export:web)
# expo export:web requires Webpack, but we're using Metro
# Disable CSS processing during export to avoid PostCSS async plugin issues
echo "Running expo export for web platform..."
EXPO_NO_CSS=1 npx expo export --platform web --output-dir dist || npx expo export --platform web --output-dir dist

# Expo may create platform-specific subdirectories
# Check for common output structures
if [ -d "dist/web" ]; then
  echo "Found dist/web, moving contents to dist root..."
  cp -r dist/web/* dist/ 2>/dev/null || true
  rm -rf dist/web 2>/dev/null || true
fi

# Verify build output exists
if [ ! -d "dist" ]; then
  echo "Error: Build output directory 'dist' not found"
  exit 1
fi

# Check if dist has content
if [ -z "$(ls -A dist 2>/dev/null)" ]; then
  echo "Error: Build output directory 'dist' is empty"
  exit 1
fi

echo "Build complete! Output in ./dist"
echo "Build contents:"
ls -la dist/ | head -15

