import { Application } from  'spectron';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

const platform = os.platform();

chai.should();
chai.use(chaiAsPromised);

let appPath;
if (platform === 'linux') {
  appPath = path.join(__dirname, '..', '..', 'release', 'linux-unpacked', 'appium-desktop');
} else if (platform === 'darwin') {
  appPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'MacOS', 'Appium');
} else if (platform === 'win32') {
  appPath = path.join(__dirname, '..', '..', 'release', 'win-ia32-unpacked', 'Appium.exe');
}

before(function () {
  this.timeout(process.env.TRAVIS || process.env.APPVEYOR ? 10 * 60 * 1000 : 30 * 1000);
  this.app = new Application({
    path: appPath,
  });
  return this.app.start();
});

after(function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
});

describe('application launch', function () {
  it('shows an initial window', async function () {
    await this.app.client.getWindowCount().should.eventually.equal(1);
  });

  it('starts the server and opens a new session window', async function () {
    var client = this.app.client;
    await client.waitForExist('form button.ant-btn-primary');
    var startServerBtn = client.element('form button.ant-btn-primary');
    startServerBtn.click();
    await client.waitForExist('div[class^="ServerMonitor"]');
    const source = await client.source();
    source.value.indexOf('Welcome to Appium').should.be.above(0);
    client.element('*[class*="button-container"] button').click();
    await client.pause(500);
    await client.getWindowCount().should.eventually.equal(2);
  });
});