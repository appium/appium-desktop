import path from 'path';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import { retryInterval } from 'asyncbox';
import InspectorPage from './pages/inspector-page-object';

chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

let client;

describe('inspector window', function () {

  let InspectorPageObject;
  
  before(async function () {
    // Start an Appium fake driver server
    startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');

    // Navigate to session URL
    client = this.app.client;
    InspectorPageObject = new InspectorPage(client);
    InspectorPageObject.open('session');

    // Set the desired capabilities
    await client.waitForExist(InspectorPageObject.addDesiredCapabilityButton);
    await InspectorPageObject.addDCaps(DEFAULT_CAPS);

    // Set the fake driver server and port
    await InspectorPageObject.setCustomServerHost('127.0.0.1');
    await InspectorPageObject.setCustomServerPort(FAKE_DRIVER_PORT);

    // Start the session
    await InspectorPageObject.startSession();
  });

  after(async function () {
    await InspectorPageObject.goHome();
  });

  beforeEach(async function () {
    await client.waitForExist(InspectorPageObject.inspectorToolbar);
  });

  it('shows content in "Selected Element" pane when clicking on an item in the Source inspector', async function () {
    await client.getHTML(InspectorPageObject.selectedElementBody).should.eventually.contain('Select an element');
    await client.waitForExist(InspectorPageObject.sourceTreeNode);
    await client.click(InspectorPageObject.sourceTreeNode);
    await client.waitForExist(InspectorPageObject.tapSelectedElementButton);
    await client.getHTML(InspectorPageObject.selectedElementBody).should.eventually.contain('btnTapElement');
    await client.click(InspectorPageObject.tapSelectedElementButton);
    await InspectorPageObject.closeNotification();
  });

  it('shows a loading indicator in screenshot after clicking "Refresh" and then indicator goes away when refresh is complete', async function () {
    await InspectorPageObject.reload();
    const spinDots = await client.elements(InspectorPageObject.screenshotLoadingIndicator);
    spinDots.value.length.should.equal(1);
    await retryInterval(15, 100, async () => {
      const spinDots = await client.elements(InspectorPageObject.screenshotLoadingIndicator);
      spinDots.value.length.should.equal(0);
    });
  });

  it('shows a new pane when click "Start Recording" button and then the pane disappears when clicking "Pause"', async function () {
    // Check that there's no recorded actions pane
    let recordedPanes = await client.elements(InspectorPageObject.recordedActionsPane);
    recordedPanes.value.length.should.equal(0);

    // Start a recording and check that there is a recorded actions pane
    await InspectorPageObject.startRecording();
    await client.waitForExist(InspectorPageObject.recordedActionsPane);
    recordedPanes = await client.elements(InspectorPageObject.recordedActionsPane);
    recordedPanes.value.length.should.equal(1);

    // Pause the recording and check that the recorded actions pane is gone again
    await InspectorPageObject.pauseRecording();
    recordedPanes = await client.elements(InspectorPageObject.recordedActionsPane);
    recordedPanes.value.length.should.equal(0);
  });
});