import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import path from 'path';
const FAKE_DRIVER_PORT = 12121;
const FAKE_DRIVER_HOST = '127.0.0.1';

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

export const DEFAULT_CAPS = {
  desiredCapabilities: {
    platformName: 'Fake',
    deviceName: 'Fake',
    app: TEST_APP,
  },
  host: FAKE_DRIVER_HOST,
  port: FAKE_DRIVER_PORT,
};

export async function startServer () {
  return await startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');
}