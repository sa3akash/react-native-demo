module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src/app',
          '@core': './src/core',
          '@domain': './src/domain',
          '@design-system': './src/design-system',
          '@features': './src/features',
          '@shared': './src/shared',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
