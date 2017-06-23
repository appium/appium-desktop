import Framework from './framework';

class JsWdIoFramework extends Framework {

  get language () {
    return "js";
  }

  wrapWithBoilerplate (code) {
    // TODO fill out boilerplate for script initialization
    let str = "";
    str += "// Requires webdriverio\n" +
           "// npm install -g webdriverio\n\n" +
           "// Then paste this into a .js file and run with Node 7+\n\n";
    str += code;
    return str;
  }

  codeFor_findAndAssign (strategy, locator, localVar) {
    // wdio has its own way of indicating the strategy in the locator string
    switch (strategy) {
      case "xpath": break; // xpath does not need to be updated
      case "accessibility id": locator = `~${locator}`; break;
      default: throw new Error(`Can't handle strategy ${strategy}`);
    }
    return `let ${localVar} = $(${JSON.stringify(locator)});`;
  }

  codeFor_click () {
    return `${this.lastAssignedVar}.click();`;
  }

  codeFor_clear () {
    return `${this.lastAssignedVar}.clear();`;
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
