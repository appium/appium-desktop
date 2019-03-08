import { Application } from 'spectron';
import { fs, logger } from 'appium-support';
import B from 'bluebird';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirCompare from 'dir-compare';
import { retryInterval } from 'asyncbox';
import MainPage from './pages/main-page-object';

const log = logger.getLogger('E2E Test');

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
  this.timeout(60 * 1000);
  log.info(`Running Appium from: ${appPath}`);
  log.info(`Checking that "${appPath}" exists`);
  const applicationExists = await fs.exists(appPath);
  if (!applicationExists) {
    log.error(`Could not run tests. "${appPath}" does not exist.`);
    process.exit(1);
  }
  log.info(`App exists. Creating Spectron Application instance`);
  this.app = new Application({
    path: appPath,
    env: {
      FORCE_NO_WRONG_FOLDER: true,
    }
  });
  log.info(`Spectron Application instance created. Starting app`);
  await this.app.start();
  log.info(`App started`);
});

after(function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
});

describe('application launch', function () {

  let main;
  let client;

  before(function () {
    client = this.app.client;
    main = new MainPage(client);
  });

  it('starts the server and opens a new session window', async function () {
    // Start the server
    const initialWindowCount = await client.getWindowCount();
    await client.waitForExist(main.startServerButton);
    await main.startServer();

    // Wait for the server monitor container to be present
    await client.waitForExist(main.serverMonitorContainer);
    await B.delay(5000);
    const source = await client.source();
    source.value.indexOf('Welcome to Appium').should.be.above(0);

    // Start a new session and confirm that it opens a new window
    await main.startNewSession();
    await retryInterval(15, 1000, async () => await client.getWindowCount().should.eventually.equal(initialWindowCount + 1));
  });

  it('check that WebDriverAgent folder is the same in /releases as it is in /node_modules (regression test for https://github.com/appium/appium-desktop/issues/417)', async function () {
    // NOTE: This isn't really an "e2e" test, but the test has to be written here because the /release
    // folder needs to be built in order to run the test
    if (platform !== 'darwin') {
      return this.skip();
    }

    const resourcesWDAPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'Resources',
      'app', 'node_modules', 'appium-xcuitest-driver', 'WebDriverAgent');

    await fs.exists(path.join(resourcesWDAPath, 'PrivateHeaders')).should.eventually.be.true;

    const localWDAPath = path.join(__dirname, '..', '..', 'node_modules', 'appium-xcuitest-driver', 'WebDriverAgent');
    const res = await dirCompare.compare(resourcesWDAPath, localWDAPath);
    res.distinct.should.equal(0);
  });
});