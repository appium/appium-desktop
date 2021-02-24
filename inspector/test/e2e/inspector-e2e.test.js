import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import { retryInterval } from 'asyncbox';
import InspectorPage from './pages/inspector-page-object';

chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve(__dirname, '..', '..', 'node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

let client;

describe('inspector window', function () {

  let inspector, server;

  before(async function () {
    // Start an Appium fake driver server
    server = await startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');

    // Navigate to session URL
    client = this.app.client;
    inspector = new InspectorPage(client);

    // Set the desired capabilities
    await client.waitForExist(inspector.addDesiredCapabilityButton);
    await inspector.addDCaps(DEFAULT_CAPS);

    // Set the fake driver server and port
    await inspector.setCustomServerHost('127.0.0.1');
    await inspector.setCustomServerPort(FAKE_DRIVER_PORT);

    // Start the session
    await inspector.startSession();
  });

  after(async function () {
    await server.close();
    await inspector.goHome();
  });

  beforeEach(async function () {
    await client.waitForExist(inspector.inspectorToolbar);
  });

  it('shows content in "Selected Element" pane when clicking on an item in the Source inspector', async function () {
    await client.getHTML(inspector.selectedElementBody).should.eventually.contain('Select an element');
    await client.waitForExist(inspector.sourceTreeNode);
    await client.click(inspector.sourceTreeNode);
    await client.waitForExist(inspector.tapSelectedElementButton);
    await client.waitForEnabled(inspector.tapSelectedElementButton);
    await client.getHTML(inspector.selectedElementBody).should.eventually.contain('btnTapElement');
    await client.click(inspector.tapSelectedElementButton);
    await inspector.closeNotification();
  });

  it('shows a loading indicator in screenshot after clicking "Refresh" and then indicator goes away when refresh is complete', async function () {
    await inspector.reload();
    const spinDots = await client.elements(inspector.screenshotLoadingIndicator);
    spinDots.value.length.should.equal(1);
    await retryInterval(15, 1000, async function () {
      const spinDots = await client.elements(inspector.screenshotLoadingIndicator);
      spinDots.value.length.should.equal(0);
    });
  });

  it('shows a new pane when click "Start Recording" button and then the pane disappears when clicking "Pause"', async function () {
    // Check that there's no recorded actions pane
    let recordedPanes = await client.elements(inspector.recordedActionsPane);
    recordedPanes.value.length.should.equal(0);

    // Start a recording and check that there is a recorded actions pane
    await inspector.startRecording();
    await client.waitForExist(inspector.recordedActionsPane);
    recordedPanes = await client.elements(inspector.recordedActionsPane);
    recordedPanes.value.length.should.equal(1);

    // Pause the recording and check that the recorded actions pane is gone again
    await inspector.pauseRecording();
    recordedPanes = await client.elements(inspector.recordedActionsPane);
    recordedPanes.value.length.should.equal(0);
  });
});
