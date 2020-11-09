import path from 'path';
import os from 'os';
import { retryInterval } from 'asyncbox';

const platform = os.platform();

export function e2eBefore ({appName, log, Application, fs}) {
  async function before () {
    let appPath;
    let args = [];
    if (process.env.SPECTRON_TEST_PROD_BINARIES) {
      if (platform === 'linux') {
        appPath = path.join(__dirname, '..', appName, 'release', 'linux-unpacked', 'appium-desktop');
      } else if (platform === 'darwin') {
        appPath = path.join(__dirname, '..', appName, 'release', 'mac', 'Appium.app', 'Contents', 'MacOS', 'Appium');
      } else if (platform === 'win32') {
        appPath = path.join(__dirname, '..', appName, 'release', 'win-ia32-unpacked', 'Appium.exe');
      }
    } else {
      appPath = require(path.join(__dirname, '..', appName, 'node_modules', 'electron'));
      args = [path.join(__dirname, '..', appName)];
    }

    this.timeout(process.env.E2E_TIMEOUT || 60 * 1000);
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
      },
      args,
    });
    log.info(`Spectron Application instance created. Starting app`);
    await this.app.start();
    const client = this.app.client;
    log.info(`App started; waiting for splash page to go away`);
    await retryInterval(20, 1000, async function () {
      const handles = (await client.windowHandles()).value;
      await client.window(handles[0]);
      (await client.getUrl()).should.include('index.html');
    });
    log.info(`App ready for automation`);
  }

  return before;
}

export function e2eAfter () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
}
