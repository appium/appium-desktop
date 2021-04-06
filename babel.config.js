const makeBabelConfig = require('@appium/gui-libs/babel-config-maker');
module.exports = makeBabelConfig(require('./node_modules/electron/package.json').version);
