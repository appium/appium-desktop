import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import _ from 'lodash';
import B from 'bluebird';

chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('..', '..', 'node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

const dcaps = _.toPairs(DEFAULT_CAPS);

let client;

describe('inspector window', function () {
  before(async function () {
    // Start an Appium fake driver server
    startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');

    // Navigate to session URL
    client = this.app.client;
    const currentUrl = await client.url();
    await client.url(currentUrl.value + 'session');

    // Add three dcaps to the row
    await client.waitForExist('#btnAddDesiredCapability');
    for (let i=0; i<dcaps.length - 1; i++) {
      await client.click('#btnAddDesiredCapability');
    }
    let i =0;
    for (let [name, value] of dcaps) {
      await client.setValue(`#desiredCapabilityName_${i}`, name);
      await client.setValue(`#desiredCapabilityValue_${i}`, value);
      i++;
    }

    // Set the fake driver server and port
    await client.setValue('#customServerHost', '127.0.0.1');
    await client.setValue('#customServerPort', FAKE_DRIVER_PORT);

    // Start the session
    await client.click('.ant-btn-primary');
  });

  it('starts a fake driver session', async function () {
    
  });
});