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

# Patch NativeWind's PostCSS to remove async plugins for Metro compatibility
# This must happen BEFORE any Metro bundler processes start
echo "Patching NativeWind PostCSS for Metro bundler compatibility..."
PATCH_FILE="node_modules/nativewind/dist/postcss/index.js"
if [ -f "$PATCH_FILE" ]; then
  # Create patched version without async plugins
  cat > "$PATCH_FILE" << 'EOFPATCH'
"use strict";
// Patched version - removed async PostCSS plugins for Metro bundler compatibility
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__importDefault) || (mod && { default: mod });
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const tailwindcss_1 = __importDefault(require("tailwindcss"));
const plugin_1 = require("./plugin");
// Removed async plugins: postcss-calc, postcss-css-variables, postcss-color-functional-notation, postcss-nested
// This allows Metro bundler to process CSS synchronously
const pluginPack = (options) => {
    const tailwindConfig = options && options.tailwindConfig ? options.tailwindConfig : (options || {});
    return (0, postcss_1.default)([
        (0, tailwindcss_1.default)(tailwindConfig),
        (0, plugin_1.plugin)(options),
    ]);
};
pluginPack.postcss = true;
exports.default = pluginPack;
EOFPATCH
  echo "✓ NativeWind PostCSS patched successfully"
else
  echo "⚠ Warning: NativeWind PostCSS file not found, patch skipped"
fi

# For Expo Router with Metro bundler, use expo export (NOT expo export:web)
# expo export:web requires Webpack, but we're using Metro
echo "Running expo export for web platform..."
npx expo export --platform web --output-dir dist

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

