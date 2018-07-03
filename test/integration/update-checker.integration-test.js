import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import request from 'request-promise';
import { checkUpdate } from '../../app/main/auto-updater/update-checker';

chai.should();
chai.use(chaiAsPromised);

describe('updateChecker', function () {
  let latestVersion;

  before(async function () {
    const latestReleaseUrl = `https://api.github.com/repos/appium/appium-desktop/releases/latest?access_token=${process.env.GITHUB_TOKEN}`;
    const res = JSON.parse(await request.get(latestReleaseUrl, {headers: {'user-agent': 'node.js'}}));
    latestVersion = res.name;
  });

  describe('.checkUpdate', function () {
    it('not find anything if latest release is same as current release', async function () {
      await checkUpdate(latestVersion).should.eventually.equal(false);
    });
    it('should find something if latest release is different from current release', async function () {
      const {name, notes, pub_date, url} = await checkUpdate('v0.0.0');
      name.should.be.a.string;
      notes.should.be.a.string;
      pub_date.should.be.a.string;
      url.should.be.a.string;
    });
    it('should return false if request for update throws error', async function () {
      let promiseStub = sinon.stub(request, 'get', () => { throw new Error(`Failed Request`); });
      await checkUpdate('v0.0.0').should.eventually.be.false;
      promiseStub.restore();
    });
  });
});