let env = {};

// DefinePlugin doesn't work in dev so if _ENV_ is undefined, assume it's a development environment
if (typeof(_ENV_) === "undefined") {
  env = require('../env/.env-dev');
} else {
  env = _ENV_; // eslint-disable-line no-undef
}

export default env;