let env = {};

if (process.env.TARGET) {
  env = require(`./.env-${process.env.TARGET}`);
}

export default env;