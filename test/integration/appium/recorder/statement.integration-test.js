import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { StatementBuilder } from '../../../../app/main/appium/recorder/statement';
import { ElemTestCases, ElemFindTestCases } from './fixtures/el-language-test-cases';
import _ from 'lodash';

chai.should();
chai.use(chaiAsPromised);

describe('Statement', function () {
  describe('.toLanguage()', function () {
    it('should translate element methods', function () {
      // Test a matrix of element names, methods and expected results
      for (let testCase of ElemTestCases) {
        for (let [language, expectedResult] of _.toPairs(testCase[2])) {
          const statementStr = new StatementBuilder()
            .withElVarName(testCase[0])
            .withMethod(testCase[1])
            .build()
            .toLanguage(language);
          statementStr.should.equal(expectedResult);
        }
      }
    });

    it('should translate element find methods', function () {
      for (let testCase of ElemFindTestCases) {
        for (let [language, expectedResult] of _.toPairs(testCase[3])) {
          const statementStr = new StatementBuilder()
            .withMethod(testCase[0])
            .withVarName(testCase[1])
            .withArgs(testCase[2])
            .build()
            .toLanguage(language);
          statementStr.should.equal(expectedResult);
        }
      }
    });
  });
});