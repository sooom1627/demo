module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["@babel/plugin-transform-react-jsx", { jsxImportSource: "nativewind" }],
      'react-native-reanimated/plugin'
    ],
  };
};
