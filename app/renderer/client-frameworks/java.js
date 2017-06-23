import Framework from './framework';

class JavaFramework extends Framework {

  get language () {
    return "java";
  }

  wrapWithBoilerplate (code) {
    // TODO fill out boilerplate for script initialization
    let str = "";
    str += "// Java boilerplate. Assumes all packages are accessible\n";
    str += code;
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

  codeFor_back () {
    return `driver.navigate().back();`;
  }
}

JavaFramework.readableName = "Java - JUnit";

export default JavaFramework;
