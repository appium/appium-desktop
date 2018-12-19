/* eslint global-require: off */
module.exports = (api) => {
  api.cache(true);
  return {
    plugins: ["@babel/plugin-transform-runtime", "transform-class-properties"],
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version },
          useBuiltIns: 'usage'
        }
      ],
    ],
  };
};