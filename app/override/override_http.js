export const overrideHttpUserAgent = () => {
  const packageJson = require('../../package'),
        wdPackageJson = require('../../node_modules/wd/package'),
        http = require('http'),
        originalHttpRequest = http.request;

  http.request = function (options, callback) {
    options.headers['User-Agent'] = `${wdPackageJson.name}/${wdPackageJson.version} ${packageJson.name}/${packageJson.version}`;

    return originalHttpRequest(options, function (res) {
      if (callback) {
        callback(res);
      }
    });
  };
};
