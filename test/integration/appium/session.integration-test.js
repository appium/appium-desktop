import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { DEFAULT_CAPS, startServer } from './helpers';
import Session from '../../../app/main/appium/session';

const should = chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

describe('appiumDriverExtender', function () {
  let driver, server;

  before(async function () {
    server = await startServer();
  });
  after(async function () {
    await server.close();
  });

  describe('.sessionCreation', function () {
    it('should start a WebDriverIO fake driver session', async function () {
      const session = await new Session(DEFAULT_CAPS);
      await session.init();
      session.client.should.exist;
      await session.client.getSource().should.eventually.match(/MockButton/);
    });
  });
});