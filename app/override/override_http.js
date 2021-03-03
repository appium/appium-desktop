export function overrideHttpUserAgent () {
  let packageJson = require('../../package');
  let http = require('http');
  let originalHttpRequest = http.request;

  http.request = function (options, callback) {
    let _options = options;
    _options.headers['User-Agent'] = `${packageJson.name}/${packageJson.version}`;

    return originalHttpRequest(_options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
}
