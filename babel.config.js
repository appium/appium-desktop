/* eslint global-require: off */
module.exports = (api) => {
  api.cache(true);
  return {
    plugins: ['@babel/plugin-transform-runtime', 'transform-class-properties'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { electron: require('./inspector/node_modules/electron/package.json').version },
          useBuiltIns: 'usage',
          corejs: 2,
        }
      ],
      ['@babel/preset-react'],
    ],
  };
};
