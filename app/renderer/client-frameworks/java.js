import Framework from './framework';

export default class JavaFramework extends Framework {

  get name () {
    return "Java - JUnit";
  }

  get language () {
    return "java";
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
    return `WebElement ${localVar} = driver.findElementBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
  }

  codeFor_click () {
    return `${this.lastAssignedVar}.click();`;
  }

  codeFor_clear () {
    return `${this.lastAssignedVar}.clear();`;
  }

  codeFor_sendKeys (text) {
    return `${this.lastAssignedVar}.sendKeys(${JSON.stringify(text)});`;
  }
}
