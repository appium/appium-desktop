export const overrideHttpUserAgent = () => {
  const packageJson = require('../../package'),
        wdPackageJson = require('../../node_modules/wd/package'),
        http = require('http'),
        originalHttpRequest = http.request;

  http.request = function (options, callback) {
    let _options = options;
    _options.headers['User-Agent'] = `${wdPackageJson.name}/${wdPackageJson.version} ${packageJson.name}/${packageJson.version}`;

    return originalHttpRequest(_options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
};
