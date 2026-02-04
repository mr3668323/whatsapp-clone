module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {
        jsxRuntime: 'classic', // Force classic JSX runtime to avoid jsx-runtime errors
      },
    ],
  ],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
