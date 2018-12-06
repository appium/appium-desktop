import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { StatementBuilder } from '../../../../app/main/appium/recorder/statement';
import { ElemTestCases, ElemFindTestCases } from './fixtures/el-language-test-cases';
import _ from 'lodash';

chai.should();
chai.use(chaiAsPromised);

describe('Statement', function () {
  describe('.toLanguage()', function () {
    // Test a matrix of element names, methods and expected results
    for (let testCase of ElemTestCases) {
      const [varName, method] = testCase;
      for (let [language, expectedResult] of _.toPairs(testCase[2])) {
        it(`should translate '${method}' statement to '${language}' `, function () {
          const statementStr = new StatementBuilder()
            .withElVarName(varName)
            .withMethod(method)
            .build()
            .toLanguage(language);
          statementStr.should.equal(expectedResult);
        });
      }
    }

    for (let testCase of ElemFindTestCases) {
      for (let [language, expectedResult] of _.toPairs(testCase[3])) {
        const [method, varName, args] = testCase;
        it(`should translate element finding statement '${method}' for '${language}`, function () {
          const statementStr = new StatementBuilder()
            .withMethod(method)
            .withVarName(varName)
            .withArgs(args)
            .build()
            .toLanguage(language);
          statementStr.should.equal(expectedResult);
        });
      }
    }
  });
});