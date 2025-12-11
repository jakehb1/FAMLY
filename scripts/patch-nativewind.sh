#!/bin/bash
# Patch NativeWind PostCSS before Metro bundler starts
# This fixes async plugin issues with Metro

PATCH_FILE="node_modules/nativewind/dist/postcss/index.js"

if [ -f "$PATCH_FILE" ]; then
  # Check if already patched
  if grep -q "Patched version - removed async PostCSS plugins" "$PATCH_FILE" 2>/dev/null; then
    echo "✓ NativeWind PostCSS already patched"
  else
    echo "Patching NativeWind PostCSS for Metro bundler compatibility..."
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
fi

# Also patch extract-styles.js to use sync processing
EXTRACT_STYLES_FILE="node_modules/nativewind/dist/postcss/extract-styles.js"
if [ -f "$EXTRACT_STYLES_FILE" ]; then
  if ! grep -q "Use sync() method for synchronous processing" "$EXTRACT_STYLES_FILE" 2>/dev/null; then
    echo "Patching extract-styles.js for synchronous PostCSS processing..."
    # Backup original
    cp "$EXTRACT_STYLES_FILE" "$EXTRACT_STYLES_FILE.backup" 2>/dev/null || true
    
    # Use sed to replace the problematic line
    sed -i.bak 's/(0, postcss_1.default)(plugins).process(cssInput).css;/(0, postcss_1.default)(plugins).process(cssInput, { from: undefined }).sync();/g' "$EXTRACT_STYLES_FILE" 2>/dev/null || {
      # If sed fails, use a more robust approach
      python3 << 'PYTHONPATCH'
import re
file_path = "node_modules/nativewind/dist/postcss/extract-styles.js"
with open(file_path, 'r') as f:
    content = f.read()
    
# Replace the problematic line
content = content.replace(
    '(0, postcss_1.default)(plugins).process(cssInput).css;',
    '(0, postcss_1.default)(plugins).process(cssInput, { from: undefined }).sync();'
)

with open(file_path, 'w') as f:
    f.write(content)
PYTHONPATCH
    }
    echo "✓ extract-styles.js patched successfully"
  else
    echo "✓ extract-styles.js already patched"
  fi
fi
else
  echo "⚠ Warning: NativeWind PostCSS file not found at $PATCH_FILE"
fi

# Create JSX runtime shims (both production and dev)
mkdir -p node_modules/nativewind
if [ ! -f "node_modules/nativewind/jsx-runtime.js" ]; then
  echo "Creating NativeWind JSX runtime shim..."
  echo 'module.exports = require("react/jsx-runtime");' > node_modules/nativewind/jsx-runtime.js
fi
if [ ! -f "node_modules/nativewind/jsx-dev-runtime.js" ]; then
  echo "Creating NativeWind JSX dev runtime shim..."
  echo 'module.exports = require("react/jsx-dev-runtime");' > node_modules/nativewind/jsx-dev-runtime.js
fi

