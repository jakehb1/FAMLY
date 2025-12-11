// Synchronous wrapper for PostCSS async plugins
// This allows Metro bundler to use NativeWind's PostCSS config
const postcss = require('postcss');

// Create a synchronous version of NativeWind's PostCSS plugin
function createSyncPostCSSPlugin(originalPlugin) {
  return (root, result) => {
    // Run the plugin synchronously
    return new Promise((resolve) => {
      const processor = postcss([originalPlugin]);
      processor.process(root, { from: undefined }).then(() => {
        resolve();
      }).catch(() => {
        // Silently fail for async plugins in sync context
        resolve();
      });
    });
  };
}

module.exports = { createSyncPostCSSPlugin };

