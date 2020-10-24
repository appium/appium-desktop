let env = {};

if (typeof (_ENV_) === 'undefined') {
  env = require('../env/.env-dev');
} else {
  env = _ENV_; // eslint-disable-line no-undef
}

export default env;