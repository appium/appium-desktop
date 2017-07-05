import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import path from 'path';
import wd from 'wd';
import AppiumDriverExtender from '../../app/main/appium-driver-extender';

chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve('node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

describe('appiumDriverExtender', function () {
  let driver;

  before(async function () {
    await startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');
    let p = await wd.promiseChainRemote({
      hostname: '127.0.0.1',
      port: FAKE_DRIVER_PORT,
    });
    await p.init(DEFAULT_CAPS);
    driver = new AppiumDriverExtender(p);
  });

  describe('.fetchElement, .fetchElements', function () {
    it('should return empty object if selector is null', async function () {
      const res = await driver.fetchElement('xpath', '//BadXPath');
      res.should.deep.equal({});
    });
    it('should fetchElement and cache it', async function () {
      const {id, variableName, variableType, strategy, selector} = await driver.fetchElement('xpath', '//MockListItem');
      id.should.exist;
      strategy.should.equal('xpath');
      selector.should.equal('//MockListItem');
      variableName.should.equal('el1');
      variableType.should.equal('string');
      driver.elementCache[id].should.exist;
      driver.elementCache[id].variableName.should.equal('el1');
      driver.elementCache[id].variableType.should.equal('string');
    });
    it('should fetchElements and cache all of them', async function () {
      const res = await driver.fetchElements('xpath', '//MockListItem');
      res.elements.length.should.be.above(0);
      res.variableName.should.equal('els1');
      res.variableType.should.equal('array');
      res.elements[0].variableName.should.equal('els1[0]');
      res.elements[0].variableType.should.equal('string');
      res.elements[0].id.should.exist;
      res.elements[1].variableName.should.equal('els1[1]');
      res.elements[1].variableType.should.equal('string');
      res.elements[1].id.should.exist;
      res.strategy.should.equal('xpath');
      res.selector.should.equal('//MockListItem');
      driver.elementCache[res.elements[0].id].variableName.should.equal('els1[0]');
      driver.elementCache[res.elements[0].id].variableType.should.equal('string');
      driver.elementCache[res.elements[1].id].variableName.should.equal('els1[1]');
      driver.elementCache[res.elements[1].id].variableType.should.equal('string');
    });
  });
  describe('.executeElementCommand', function () {
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {id, variableName, variableType} = await driver.fetchElement('xpath', '//MockListItem');
      const {source, screenshot, variableName:repeatedVariableName, 
        variableType:repeatedVariableType, id:repeatedId} = await driver.executeElementCommand(id, 'click');
      variableName.should.equal(repeatedVariableName);
      variableType.should.equal(repeatedVariableType);
      id.should.equal(repeatedId);
      source.should.exist;
      screenshot.should.exist;
    });
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {elements} = await driver.fetchElements('xpath', '//MockListItem');
      for (let element of elements) {
        const {id, variableName, variableType} = element;
        const {source, screenshot, variableName:repeatedVariableName, 
          variableType:repeatedVariableType, id:repeatedId} = await driver.executeElementCommand(id, 'click');
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
      const res = await driver.executeMethod('setGeoLocation', [100, 200]);
      res.screenshot.should.exist;
      res.source.should.exist;
      const getGeoLocationRes = await driver.executeMethod('getGeoLocation');
      getGeoLocationRes.res.latitude.should.equal(100);
      getGeoLocationRes.res.longitude.should.equal(200);

    });
  });
});