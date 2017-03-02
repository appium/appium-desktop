import webpack from 'webpack';
import baseConfig from './webpack.config.base';

export default {
  ...baseConfig,

  devtool: 'source-map',

  entry: ['babel-polyfill', './app/main/main.development'],

  output: {
    ...baseConfig.output,
    path: __dirname,
    filename: './main.js'
  },

  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    )
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  resolve: {
    packageAlias: 'main'
  },

  externals: [
    ...baseConfig.externals,
    'font-awesome',
    'source-map-support',
    'appium',
    'teen_process'
  ]
};
