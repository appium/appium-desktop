import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { DEFAULT_CAPS, startServer } from './helpers';
import Session from '../../../app/main/appium/session';

const should = chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

describe('Session', function () {
  let driver, server;

  before(async function () {
    server = await startServer();
  });
  after(async function () {
    await server.close();
  });

  describe.only('.init()', function () {
    it('should start a WebDriverIO fake driver session and close it', async function () {
      const session = await new Session(DEFAULT_CAPS);
      await session.init();
      session.client.should.exist;
      await session.client.getSource().should.eventually.match(/MockButton/);
      await session.end();
      try {
        await session.client.getSource().should.eventually.match(/MockButton/);
      } catch (e) {
        e.message.should.match(/A session id is required for this command /);
      }
    });
  });

  describe('.fetchElement', function () {
    let session;
    before(async function () {
      session = await new Session(DEFAULT_CAPS);
    });

    after(async function () {
      // await 
    });

    it('should fetch element and it should return the source and screenshot too', async function () {

    });
    it('should fetch element and be able to suppress source and screenshot', async function () {

    });
    it('should fetch multiple elements', async function () {

    });
    it('should fetch multiple elements and be able to supressed source and screenshot', async function () {

    });
  });
});