export const overrideHttpsUserAgent = () => {
  const packageJson = require('../../package'),
        wdPackageJson = require('../../node_modules/wd/package'),
        https = require('https'),
        originalHttpsRequest = https.request;

  https.request = function (options, callback) {
    let _options = options;
    _options.headers['User-Agent'] = `${wdPackageJson.name}/${wdPackageJson.version} ${packageJson.name}/${packageJson.version}`;

    return originalHttpsRequest(_options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
};
