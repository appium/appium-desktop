import { Application } from  'spectron';
import os from 'os';
import path from 'path';
import chai from 'chai';
import B from 'bluebird';
import chaiAsPromised from 'chai-as-promised';
import { retryInterval } from 'asyncbox';
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

after(function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
});

async function startApplicationWithEnv (env) {
  let app = new Application({
    path: appPath,
    env: {
      [env]: true
    }
  });
  await app.start();
  return app;
}

describe('application launch', function () {
  let app;

  afterEach(function () {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });
  it('shows an update message when one is available', async function () {
    // TODO: Make app close
    let app = await startApplicationWithEnv('FORCE_UPDATE');
    const client = app.client;
    await retryInterval(10, 1000, async function () {
      const windowCount = await client.getWindowCount();
      if (windowCount === 1) {
        throw new Error('Still waiting for update window');
      }
      const handles = await client.windowHandles();
      const [, updateWin] = handles.value;
      client.window(updateWin);
      await client.getText('h3').should.eventually.match(/a new version/i);
    });
  });

  it('downloads the update when download button is clicked', async function () { });

  it('does not download the update when window is closed', async function () { });

  it('does not download the update when download is declined', async function () { });

  it('handles errors if check update failed', async function () { });
  
  it('handles errors if download failed', async function () { });

});