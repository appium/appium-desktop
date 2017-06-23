import Framework from './framework';

class JsWdIoFramework extends Framework {

  get language () {
    return "js";
  }

  chainifyCode (code) {
    return code
      .replace(/let .+ = /g, '')
      .replace(/(\n|^)(driver|el.+)\./g, '\n.')
      .replace(/;\n/g, '\n');
  }

  wrapWithBoilerplate (code) {
    let host = JSON.stringify(this.host);
    let caps = JSON.stringify(this.caps);
    return `// Requires the webdriverio client library
// (npm install webdriverio)
// Then paste this into a .js file and run with Node:
// node <file>.js

const wdio = require('webdriverio');
const caps = ${caps};
const driver = wdio.remote({
  host: ${host},
  port: ${this.port},
  desiredCapabilities: caps
});

driver.init()
${this.indent(this.chainifyCode(code), 2)}
  .end();
`;
  }

  codeFor_findAndAssign (strategy, locator, localVar) {
    // wdio has its own way of indicating the strategy in the locator string
    switch (strategy) {
      case "xpath": break; // xpath does not need to be updated
      case "accessibility id": locator = `~${locator}`; break;
      default: throw new Error(`Can't handle strategy ${strategy}`);
    }
    return `let ${localVar} = driver.element(${JSON.stringify(locator)});`;
  }

  codeFor_click () {
    return `${this.lastAssignedVar}.click();`;
  }

  codeFor_clear () {
    return `${this.lastAssignedVar}.clearElement();`;
  }

  codeFor_sendKeys (text) {
    return `${this.lastAssignedVar}.setValue(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `driver.back();`;
  }
}

JsWdIoFramework.readableName = "JS - Webdriver.io";

export default JsWdIoFramework;
