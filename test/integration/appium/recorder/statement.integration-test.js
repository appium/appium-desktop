import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { RecordBuilder, RecordingLanguages } from '../../../../app/main/appium/recorder/statement';

chai.use(chaiAsPromised);

describe('Statement', function () {
  describe('.toLanguage()', function () {
    describe('admc/wd', function () {
      it('should translate element fetches to webdriverio', function () {
        const jsStatement = new RecordBuilder()
          .withElVarName('elem')
          .withMethod('click')
          .build()
          .toLanguage(RecordingLanguages.JS_WD);
        jsStatement.should.equal(`await elem.click()`);
      });
    });
  });
});