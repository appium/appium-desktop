import Framework from './framework';

class JsWdIoFramework extends Framework {

  get language () {
    return "js";
  }

  get boilerplate () {
    // TODO fill out boilerplate for script initialization
    return "";
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
}

JsWdIoFramework.readableName = "JS - Webdriver.io";

export default JsWdIoFramework;
