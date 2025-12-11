// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// NativeWind v2 uses Babel plugin, not Metro CSS transformer
// No special Metro config needed for NativeWind

module.exports = config;

