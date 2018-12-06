import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { RecordBuilder } from '../../../../app/main/appium/recorder/statement';
import TestCases from './fixtures/el-language-test-cases';
import _ from 'lodash';

chai.should();
chai.use(chaiAsPromised);

describe('Statement', function () {
  describe('.toLanguage()', function () {
    describe('admc/wd', function () {
      it('should translate element methods', function () {
        // Test a matrix of element names, methods and expected results
        for (let testCase of TestCases) {
          for (let [language, expectedResult] of _.toPairs(testCase[2])) {
            const jsStatement = new RecordBuilder()
              .withElVarName(testCase[0])
              .withMethod(testCase[1])
              .build()
              .toLanguage(language);
            jsStatement.should.equal(expectedResult);
          }
        }
      });
    });
  });
});