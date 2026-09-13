module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-screens|react-native-safe-area-context|@react-navigation|immer|react-native-keychain|react-native-mmkv|react-native-webrtc|moti|lottie-react-native)/)',
  ],
};
