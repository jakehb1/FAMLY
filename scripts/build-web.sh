#!/bin/bash
set -e

echo "Building Expo web app..."

# Export for web
npx expo export -p web --output-dir dist

echo "Build complete! Output in ./dist"

