import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer as startAppiumFakeDriverServer } from 'appium-fake-driver';
import path from 'path';
import { Web2Driver } from 'web2driver/node';
import AppiumClient from '../../app/renderer/lib/appium-client';

const should = chai.should();
chai.use(chaiAsPromised);

const FAKE_DRIVER_PORT = 12121;

const TEST_APP = path.resolve(__dirname, '..', '..', 'node_modules', 'appium-fake-driver', 'test', 'fixtures', 'app.xml');

const DEFAULT_CAPS = {
  platformName: 'Fake',
  deviceName: 'Fake',
  app: TEST_APP,
};

describe('Appium client actions', function () {
  let driver, server, client;

  before(async function () {
    server = await startAppiumFakeDriverServer(FAKE_DRIVER_PORT, '127.0.0.1');
    driver = await Web2Driver.remote({
      hostname: '127.0.0.1',
      port: FAKE_DRIVER_PORT,
      connectionRetryCount: 0,
    }, DEFAULT_CAPS);
    client = AppiumClient.instance(driver);
  });
  after(async function () {
    try {
      await driver.quit();
    } catch (ign) {}
    await server.close();
  });

  describe('.fetchElement, .fetchElements', function () {
    it('should return empty object if selector is null', async function () {
      const res = await client.fetchElement({strategy: 'xpath', selctor: '//BadXPath'});
      res.should.deep.equal({});
    });
    it('should fetchElement and cache it', async function () {
      const {id, variableName, variableType, strategy, selector} = await client.fetchElement({
        strategy: 'xpath',
        selector: '//MockListItem',
      });
      id.should.exist;
      strategy.should.equal('xpath');
      selector.should.equal('//MockListItem');
      should.not.exist(variableName); // Shouldn't have a variable name until a method is performed on it
      variableType.should.equal('string');
      client.elementCache[id].should.exist;
      should.not.exist(client.elementCache[id].variableName);
      client.elementCache[id].variableType.should.equal('string');
    });
    it('should fetchElements and cache all of them', async function () {
      const res = await client.fetchElements({strategy: 'xpath', selector: '//MockListItem'});
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
      client.elementCache[res.elements[0].id].variableName.should.equal('els1');
      client.elementCache[res.elements[0].id].variableType.should.equal('string');
      client.elementCache[res.elements[1].id].variableName.should.equal('els1');
      client.elementCache[res.elements[1].id].variableType.should.equal('string');
    });
  });
  describe('.executeMethod', function () {
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {id, variableName, variableType} = await client.fetchElement({strategy: 'xpath', selector: '//MockListItem'});
      should.not.exist(variableName); // Shouldn't have a cached variable name until a method is performed on it
      const {source, screenshot, variableName: repeatedVariableName, variableType: repeatedVariableType, id: repeatedId} =
        await client.executeMethod({elementId: id, methodName: 'click'});
      repeatedVariableName.should.exist;
      variableType.should.equal(repeatedVariableType);
      id.should.equal(repeatedId);
      source.should.exist;
      screenshot.should.exist;
    });
    it('should call the click method and have the variableName, variableType, etc... returned to it with source/screenshot', async function () {
      const {elements} = await client.fetchElements({strategy: 'xpath', selector: '//MockListItem'});
      for (let element of elements) {
        const {id, variableName, variableType} = element;
        const {source, screenshot, variableName: repeatedVariableName, variableType: repeatedVariableType, id: repeatedId} =
          await client.executeMethod({elementId: id, methodName: 'click'});
        variableName.should.equal(repeatedVariableName);
        variableType.should.equal(repeatedVariableType);
        id.should.equal(repeatedId);
        source.should.exist;
        screenshot.should.exist;
      }
    });
    it('should call "setGeolocation" method and get result plus source and screenshot', async function () {
      const res = await client.executeMethod({methodName: 'setGeoLocation', args: [{latitude: 100, longitude: 200, altitude: 0}]});
      res.screenshot.should.exist;
      res.source.should.exist;
      const getGeoLocationRes = await client.executeMethod({methodName: 'getGeoLocation'});
      getGeoLocationRes.commandRes.latitude.should.equal(100);
      getGeoLocationRes.commandRes.longitude.should.equal(200);

    });
  });
});
