var Application = require('spectron').Application;
var assert = require('assert');
var os = require('os');
var platform = os.platform();
var path = require('path');

describe('application launch', function () {
  this.timeout(process.env.TRAVIS || process.env.APPVEYOR ? 10 * 60 * 1000 : 30 * 1000);

  var appPath;
  if (platform === 'linux') {
    appPath = path.join(__dirname, '..', '..', 'release', 'linux-unpacked', 'appium-desktop');
  } else if (platform === 'darwin') {
    appPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'MacOS', 'Appium');
  } else if (platform === 'win32') {
    appPath = path.join(__dirname, '..', '..', 'release', 'win-ia32-unpacked', 'Appium.exe');
  }

  beforeEach(function () {
    this.app = new Application({
      path: appPath,
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });

  it('starts the server and opens a new session window', function (done) {
    var client = this.app.client;
    client.waitForExist('form button.ant-btn-primary');
    var startServerBtn = client.element('form button.ant-btn-primary');
    startServerBtn.click();
    client.waitForExist('div[class^="ServerMonitor"]').then(function () {
      client.source().then(function (source) {
        assert.equal(source.value.indexOf('Welcome to Appium') >= 0, true);
        client.element('*[class*="button-container"] button').click();
        client.pause(500).then(function () {
          client.getWindowCount().then(function (count) {
            assert.equal(count, 2);
            done();
          });
        });
      });
    });
  });
});