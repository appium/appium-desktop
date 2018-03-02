import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { version } from '../../package.json';
import request from 'request-promise';
import { getUpdate } from '../../app/main/auto-updater/update-checker';

chai.should();
chai.use(chaiAsPromised);

describe('appiumDriverExtender', function () {
  let latestVersion;

  before(async function () {
    const latestReleaseUrl = `https://api.github.com/repos/appium/appium-desktop/releases/latest`;
    const res = JSON.parse(await request.get(latestReleaseUrl, { headers: {'user-agent': 'node.js'} }));
    latestVersion = res.name;
  });

  describe('.fetchElement, .fetchElements', function () {
    it('not find anything if latest release is same as current release', async function () {
      await getUpdate(latestVersion).should.eventually.equal(false);
    });
    it('should find something if latest release is different from current release', async function () {
      const {name, notes, pub_date, url} = await getUpdate('v0.0.0');
      name.should.be.a.string;
      notes.should.be.a.string;
      pub_date.should.be.a.string;
      url.should.be.a.string;
    });
  });
});