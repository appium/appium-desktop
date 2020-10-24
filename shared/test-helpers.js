import path from 'path';
import os from 'os';

const platform = os.platform();

export function e2eBefore () {
  async function before ({log, Application, fs}) {
    let appPath;
    let args = [];
    if (process.env.SPECTRON_TEST_PROD_BINARIES) {
      if (platform === 'linux') {
        appPath = path.join(__dirname, '..', '..', 'release', 'linux-unpacked', 'appium-desktop');
      } else if (platform === 'darwin') {
        appPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'MacOS', 'Appium');
      } else if (platform === 'win32') {
        appPath = path.join(__dirname, '..', '..', 'release', 'win-ia32-unpacked', 'Appium.exe');
      }
    } else {
      appPath = require('electron');
      args = [path.join(__dirname, '..', '..')];
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
    log.info(`App started`);
  }

  return before;
}

export function e2eAfter () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
}
