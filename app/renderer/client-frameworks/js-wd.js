import Framework from './framework';

class JsWdFramework extends Framework {

  get language () {
    return "js";
  }

  wrapWithBoilerplate (code) {
    let str = "";
    str += "// Requires the admc/wd client library\n" +
           "// npm install -g wd\n\n" +
           "// Then paste this into a .js file and run with Node 7.6+\n\n";
    str += "const wd = require('wd');\n\n" +
           "async function main () {\n" +
           "  let driver = wd.promiseChainRemote();\n" +
           "  await driver.init(caps);\n";
    str += this.indent(code, 2) + "\n";
    str += "}\n\n" +
           "main().catch(console.log);\n";
    return str;
  }

  codeFor_findAndAssign (strategy, locator, localVar) {
    let suffixMap = {
      xpath: "XPath",
      // TODO add other locator strategies
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    return `let ${localVar} = await driver.elementBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
  }

  codeFor_click () {
    return `await ${this.lastAssignedVar}.click();`;
  }

  codeFor_clear () {
    return `await ${this.lastAssignedVar}.clear();`;
  }

  codeFor_sendKeys (text) {
    return `await ${this.lastAssignedVar}.sendKeys(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `await driver.back();`;
  }
}

JsWdFramework.readableName = "JS - WD (Promise)";

export default JsWdFramework;
