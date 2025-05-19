// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

// Apply NativeWind first
const nativeWindConfig = withNativeWind(config, { input: "./assets/global.css" });

// Then wrap with Reanimated
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
