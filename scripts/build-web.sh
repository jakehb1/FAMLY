#!/bin/bash
set -e

echo "Building Expo web app..."

# For Expo Router with Metro, export for web
# This creates a static export in the dist folder
npx expo export --output-dir dist

echo "Build complete! Output in ./dist"

