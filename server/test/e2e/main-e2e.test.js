import { fs } from 'appium-support';
import B from 'bluebird';
import os from 'os';
import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dirCompare from 'dir-compare';
import MainPage from './pages/main-page-object';

const platform = os.platform();

chai.should();
chai.use(chaiAsPromised);

describe('application launch', function () {

  let main;
  let client;

  before(function () {
    client = this.app.client;
    main = new MainPage(client);
  });

  it('starts the server', async function () {
    // Start the server
    await client.waitForExist(main.startServerButton);
    await main.startServer();

    // Wait for the server monitor container to be present
    await client.waitForExist(main.serverMonitorContainer);
    await B.delay(5000);
    const source = await client.source();
    source.value.indexOf('Welcome to Appium').should.be.above(0);
  });

  it('check that WebDriverAgent folder is the same in /releases as it is in /node_modules (regression test for https://github.com/appium/appium-desktop/issues/417)', async function () {
    // NOTE: This isn't really an "e2e" test, but the test has to be written here because the /release
    // folder needs to be built in order to run the test
    if (platform !== 'darwin' || !process.env.SPECTRON_TEST_PROD_BINARIES) {
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
