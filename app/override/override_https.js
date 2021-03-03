export function overrideHttpsUserAgent () {
  let packageJson = require('../../package');
  let https = require('https');
  let originalHttpsRequest = https.request;

  https.request = function (options, callback) {
    let _options = options;
    _options.headers['User-Agent'] = `${packageJson.name}/${packageJson.version}`;

    return originalHttpsRequest(_options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
}
