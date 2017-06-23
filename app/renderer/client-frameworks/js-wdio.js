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
    let str = "";
    let host = JSON.stringify(this.host);
    let caps = JSON.stringify(this.caps);
    str += "// Requires webdriverio\n" +
           "// (npm install -g webdriverio)\n" +
           "// Then paste this into a .js file and run with the wdio runner:\n" +
           "// wdio <file>.js\n\n" +
           "const wdio = require('webdriverio');\n\n" +
           `const caps = ${caps};\n\n` +
           "const driver = wdio.remote({\n" +
           `  host: ${host},\n` +
           `  port: ${this.port},\n` +
           `  desiredCapabilities: caps\n` +
           "});\n" +
           "driver.init()\n";
    str += this.indent(this.chainifyCode(code), 2) + "\n";
    str += "  .end();\n";
    return str;
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
