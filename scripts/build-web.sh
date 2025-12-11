#!/bin/bash
set -e

echo "Building Expo web app..."

# Export for web using Metro bundler
# For Expo Router with Metro, we use expo export with platform web
EXPO_PUBLIC_APP_ENV=production npx expo export --platform web --output-dir dist

echo "Build complete! Output in ./dist"

