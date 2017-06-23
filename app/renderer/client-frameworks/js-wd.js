import Framework from './framework';

class JsWdFramework extends Framework {

  get language () {
    return "js";
  }

  get boilerplate () {
    // TODO fill out boilerplate for script initialization
    return "";
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
}

JsWdFramework.readableName = "JS - WD";

export default JsWdFramework;
