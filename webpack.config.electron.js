import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import path from 'path';

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
    new webpack.EnvironmentPlugin([
      'TARGET'
    ]),
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    new webpack.DefinePlugin({
      _ENV_: process.env.TARGET ? require(`./env/.env-${process.env.TARGET}`) : require('./env/.env')
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  resolve: {
    packageAlias: 'main',
    alias: {
      env: path.resolve(__dirname, 'env', process.env.TARGET ? `.env-${process.env.TARGET}` : '.env'),
    },
  },

  externals: [
    ...baseConfig.externals,
    'font-awesome',
    'source-map-support',
    'appium',
    'teen_process'
  ]
};
