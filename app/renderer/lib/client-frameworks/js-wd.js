import Framework from './framework';

class JsWdFramework extends Framework {

  get language () {
    return "js";
  }

  wrapWithBoilerplate (code) {
    let host = JSON.stringify(this.host);
    let caps = JSON.stringify(this.caps);
    return `// Requires the admc/wd client library
// (npm install wd)
// Then paste this into a .js file and run with Node 7.6+

const wd = require('wd');
const driver = wd.promiseChainRemote(${host}, ${this.port});
const caps = ${caps};

async function main () {
  await driver.init(caps);
${this.indent(code, 2)}
  await driver.quit();
}

main().catch(console.log);
`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: "XPath",
      'accessibility id': 'AccessibilityId',
      'id': 'Id',
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    if (isArray) {
      return `let ${localVar} = await driver.elementsBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    } else {
      return `let ${localVar} = await driver.elementBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.click();`;
  }

  codeFor_clear (varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.clear();`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `await ${this.getVarName(varName, varIndex)}.sendKeys(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `await driver.back();`;
  }

}

JsWdFramework.readableName = "JS - WD (Promise)";

export default JsWdFramework;
