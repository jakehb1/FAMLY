// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure for web to handle import.meta properly
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), "mjs"],
};

// Transform import.meta to work in non-module context
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;

