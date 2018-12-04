import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import path from 'path';
import wd from 'wd';
import AppiumMethodHandler from '../../app/main/appium-method-handler';

const should = chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

describe('appiumDriverExtender', function () {
  let driver, appiumHandler, server;

  before(async function () {
    server = await startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');
    driver = await wd.promiseChainRemote({
      hostname: '127.0.0.1',
      port: FAKE_DRIVER_PORT,
    });
    await driver.init(DEFAULT_CAPS);
    appiumHandler = new AppiumMethodHandler(driver);
  });
  after(async function () {
    await driver.quit();
    await server.close();
  });

  describe('.fetchElement, .fetchElements', function () {
    it('should return empty object if selector is null', async function () {
      const res = await appiumHandler.fetchElement('xpath', '//BadXPath');
      res.should.deep.equal({});
    });
    it('should fetchElement and cache it', async function () {
      const {id, variableName, variableType, strategy, selector} = await appiumHandler.fetchElement('xpath', '//MockListItem');
      id.should.exist;
      strategy.should.equal('xpath');
      selector.should.equal('//MockListItem');
      should.not.exist(variableName); // Shouldn't have a variable name until a method is performed on it
      variableType.should.equal('string');
      appiumHandler.elementCache[id].should.exist;
      should.not.exist(appiumHandler.elementCache[id].variableName);
      appiumHandler.elementCache[id].variableType.should.equal('string');
    });
    it('should fetchElements and cache all of them', async function () {
      const res = await appiumHandler.fetchElements('xpath', '//MockListItem');
      res.elements.length.should.be.above(0);
      res.variableName.should.equal('els1');
      res.variableType.should.equal('array');
      res.elements[0].variableName.should.equal('els1');
      res.elements[0].variableType.should.equal('string');
      res.elements[0].id.should.exist;
      res.elements[1].variableName.should.equal('els1');
      res.elements[1].variableType.should.equal('string');
      res.elements[1].id.should.exist;
      res.strategy.should.equal('xpath');
      res.selector.should.equal('//MockListItem');
      appiumHandler.elementCache[res.elements[0].id].variableName.should.equal('els1');
      appiumHandler.elementCache[res.elements[0].id].variableType.should.equal('string');
      appiumHandler.elementCache[res.elements[1].id].variableName.should.equal('els1');
      appiumHandler.elementCache[res.elements[1].id].variableType.should.equal('string');
    });
  });
  describe('.executeElementCommand', function () {
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {id, variableName, variableType} = await appiumHandler.fetchElement('xpath', '//MockListItem');
      should.not.exist(variableName); // Shouldn't have a cached variable name until a method is performed on it
      const {source, screenshot, variableName: repeatedVariableName,
             variableType: repeatedVariableType, id: repeatedId} = await appiumHandler.executeElementCommand(id, 'click');
      repeatedVariableName.should.exist;
      variableType.should.equal(repeatedVariableType);
      id.should.equal(repeatedId);
      source.should.exist;
      screenshot.should.exist;
    });
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {elements} = await appiumHandler.fetchElements('xpath', '//MockListItem');
      for (let element of elements) {
        const {id, variableName, variableType} = element;
        const {source, screenshot, variableName: repeatedVariableName,
               variableType: repeatedVariableType, id: repeatedId} = await appiumHandler.executeElementCommand(id, 'click');
        variableName.should.equal(repeatedVariableName);
        variableType.should.equal(repeatedVariableType);
        id.should.equal(repeatedId);
        source.should.exist;
        screenshot.should.exist;
      }
    });
  });
  describe('.executeMethod', function () {
    it('should call "setGeolocation" method and get result plus source and screenshot', async function () {
      const res = await appiumHandler.executeMethod('setGeoLocation', [100, 200]);
      res.screenshot.should.exist;
      res.source.should.exist;
      const getGeoLocationRes = await appiumHandler.executeMethod('getGeoLocation');
      getGeoLocationRes.res.latitude.should.equal(100);
      getGeoLocationRes.res.longitude.should.equal(200);

    });
  });
});