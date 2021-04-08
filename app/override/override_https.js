export const overrideHttpsUserAgent = () => {
  const packageJson = require('../../package'),
        wdPackageJson = require('../../node_modules/wd/package'),
        https = require('https'),
        originalHttpsRequest = https.request;

  https.request = function (options, callback) {
    options.headers['User-Agent'] = `admc/${wdPackageJson.name}/${wdPackageJson.version} ${packageJson.name}/${packageJson.version}`;

    return originalHttpsRequest(options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
};
