import { Application } from  'spectron';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import MainPage from './pages/main-page-object';

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

before(async function () {
  this.timeout(process.env.TRAVIS || process.env.APPVEYOR ? 10 * 60 * 1000 : 30 * 1000);
  this.app = new Application({
    path: appPath,
  });
  await this.app.start();
});

after(function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
});

describe('application launch', function () {
  let initialWindowCount;

  let MainPageObject;
  let client;

  before(async function () {
    client = this.app.client;
    MainPageObject = new MainPage(client);
    initialWindowCount = await this.app.client.getWindowCount();
  });

  it('starts the server and opens a new session window', async function () {
    // Start the server
    await client.waitForExist(MainPageObject.startServerButton);
    await MainPageObject.startServer();

    // Wait for the server monitor container to be present
    await client.waitForExist(MainPageObject.serverMonitorContainer);
    const source = await client.source();
    source.value.indexOf('Welcome to Appium').should.be.above(0);

    // Start a new session and confirm that it opens a new window
    await MainPageObject.startNewSession();
    await client.pause(500);
    await client.getWindowCount().should.eventually.equal(initialWindowCount + 1);
  });
});