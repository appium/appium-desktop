import { Application } from  'spectron';
import { fs } from 'appium-support';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirCompare from 'dir-compare';
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

  let main;
  let client;

  before(async function () {
    client = this.app.client;
    main = new MainPage(client);
    initialWindowCount = await this.app.client.getWindowCount();
  });

  it('starts the server and opens a new session window', async function () {
    // Start the server
    await client.waitForExist(main.startServerButton);
    await main.startServer();

    // Wait for the server monitor container to be present
    await client.waitForExist(main.serverMonitorContainer);
    const source = await client.source();
    source.value.indexOf('Welcome to Appium').should.be.above(0);

    // Start a new session and confirm that it opens a new window
    await main.startNewSession();
    await client.pause(500);
    await client.getWindowCount().should.eventually.equal(initialWindowCount + 1);
  });

  it('check that WebDriverAgent folder is the same in /releases as it is in /node_modules (regression test for https://github.com/appium/appium-desktop/issues/417)', async function () {
    // NOTE: This isn't really an "e2e" test, but the test has to be written here because the /release 
    // folder needs to be built in order to run the test
    if (platform !== 'darwin') {
      return this.skip();
    }

    const resourcesWDAPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'Resources', 
      'app', 'node_modules', 'appium', 'node_modules', 'appium-xcuitest-driver', 'WebDriverAgent');

    await fs.exists(path.join(resourcesWDAPath, 'PrivateHeaders')).should.eventually.be.true;

    const localWDAPath = path.join(__dirname, '..', '..', 'node_modules', 'appium', 'node_modules', 'appium-xcuitest-driver', 'WebDriverAgent');
    const res = await dirCompare.compare(resourcesWDAPath, localWDAPath);
    res.distinct.should.equal(0);
  });
});