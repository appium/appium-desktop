/* eslint global-require: off */
module.exports = (api) => {
  return {
    plugins: ["@babel/plugin-transform-runtime", "transform-class-properties"],
    presets: [
      require("@babel/env"),
      {
        targets: { node: 10 },
        useBuiltIns: 'usage'
      }
    ],
  };
};