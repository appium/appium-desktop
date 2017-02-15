var Application = require('spectron').Application;
var assert = require('assert');

describe('application launch', function () {
  this.timeout(30000);

  var app = __dirname + '/../../release/mac/Appium.app/Contents/MacOS/Appium';

  beforeEach(function () {
    this.app = new Application({
      path: app,
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