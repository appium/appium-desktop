import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import _ from 'lodash';
import { retryInterval } from 'asyncbox';

chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

const dcaps = _.toPairs(DEFAULT_CAPS);

let client;
let defaultUrl;

async function closeNotification (client) {
  try {
    await retryInterval(5, 500, () => {
      client.click('.ant-notification-notice-close');
    });
  } catch (ign) { }
}

describe('inspector window', function () {
  before(async function () {
    // Start an Appium fake driver server
    startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');

    // Navigate to session URL
    client = this.app.client;
    const url = await client.url();
    defaultUrl = url.value;
    await client.url(defaultUrl + 'session');

    // Set the desired capabilities
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

  after(async function () {
    await client.waitForExist('#btnClose');
    await client.click('#btnClose');
    await client.url(defaultUrl);
  });

  beforeEach(async function () {
    await client.waitForExist('div[class*=Inspector__inspector-toolbar]');
  });

  it('shows content in "Selected Element" pane when clicking on an item in the Source inspector', async function () {
    await client.getHTML('#selectedElementContainer .ant-card-body').should.eventually.contain('Select an element');
    await client.waitForExist('#sourceContainer .ant-tree-node-content-wrapper');
    await client.click('#sourceContainer .ant-tree-node-content-wrapper');
    await client.waitForExist('#selectedElementContainer #btnTapElement');
    await client.getHTML('#selectedElementContainer .ant-card-body').should.eventually.contain('btnTapElement');
    await client.click('#selectedElementContainer #btnTapElement');
    await closeNotification();
  });

  it('shows a loading indicator in screenshot afterwhen clicking "Refresh" and then indicator goes away when refresh is complete', async function () {
    await client.click('#btnReload');
    const spinDots = await client.elements('#screenshotContainer .ant-spin-dot');
    spinDots.value.length.should.equal(1);
    await retryInterval(15, 100, async () => {
      const spinDots = await client.elements('#screenshotContainer .ant-spin-dot');
      spinDots.value.length.should.equal(0);
    });
  });

  it('shows a new pane when click "Start Recording" button and then the pane disappears when clicking "Pause"', async function () {
    let recordedPanes = await client.elements('div[class*=Inspector__recorded-actions]');
    recordedPanes.value.length.should.equal(0);
    await client.click('#btnStartRecording');
    await client.waitForExist('div[class*=Inspector__recorded-actions]');
    recordedPanes = await client.elements('div[class*=Inspector__recorded-actions]');
    recordedPanes.value.length.should.equal(1);
    await client.click('#btnPause');
    recordedPanes = await client.elements('div[class*=Inspector__recorded-actions]');
    recordedPanes.value.length.should.equal(0);
  });
});