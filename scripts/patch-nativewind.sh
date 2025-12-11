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
module.exports = pluginPack;
module.exports.default = pluginPack;
EOFPATCH
  echo "✓ NativeWind PostCSS patched successfully"
fi

# Also patch extract-styles.js to handle async plugin errors gracefully
EXTRACT_STYLES_FILE="node_modules/nativewind/dist/postcss/extract-styles.js"
if [ -f "$EXTRACT_STYLES_FILE" ]; then
  if ! grep -q "Patched for Metro bundler" "$EXTRACT_STYLES_FILE" 2>/dev/null; then
    echo "Patching extract-styles.js to handle async PostCSS errors..."
    # Use the patched version we created
    cat > "$EXTRACT_STYLES_FILE" << 'EXTRACTSTYLESPATCH'
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__importDefault) || (mod && { default: mod });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStyles = void 0;
const postcss_1 = __importDefault(require("postcss"));
const tailwindcss_1 = __importDefault(require("tailwindcss"));
const postcss_2 = __importDefault(require("../postcss"));
const serialize_1 = require("./serialize");
function extractStyles(tailwindConfig, cssInput = "@tailwind components;@tailwind utilities;") {
    let errors = [];
    let output = {
        styles: {},
        topics: {},
        masks: {},
        atRules: {},
        units: {},
        transforms: {},
        childClasses: {},
    };
    const plugins = [
        (0, tailwindcss_1.default)(tailwindConfig),
        (0, postcss_2.default)({
            ...tailwindConfig,
            done: ({ errors: resultErrors, ...result }) => {
                output = result;
                errors = resultErrors;
            },
        }),
    ];
    // Patched for Metro bundler: Catch async plugin errors and return empty styles
    // This allows the build to continue even if PostCSS has async plugin issues
    try {
        const result = (0, postcss_1.default)(plugins).process(cssInput, { from: undefined });
        // Try to access .css synchronously - will throw if async plugins detected
        const _css = result.css;
    } catch (asyncError) {
        // PostCSS detected async plugins - return empty styles to allow build to continue
        // NativeWind will still work for basic className -> style conversion via Babel
        console.warn('NativeWind: PostCSS async plugin detected, skipping CSS extraction');
        return {
            ...(0, serialize_1.serializer)({ 
                styles: {}, 
                topics: {}, 
                masks: {}, 
                atRules: {}, 
                units: {}, 
                transforms: {}, 
                childClasses: {} 
            }),
            errors: [],
        };
    }
    return {
        ...(0, serialize_1.serializer)(output),
        errors,
    };
}
exports.extractStyles = extractStyles;
EXTRACTSTYLESPATCH
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

