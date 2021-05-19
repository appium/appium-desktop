const makeBabelConfig = require('./gui-common/babel-config-maker');
module.exports = makeBabelConfig(require('./node_modules/electron/package.json').version);
