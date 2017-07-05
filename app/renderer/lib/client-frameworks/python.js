import Framework from './framework';

class PythonFramework extends Framework {

  get language () {
    return "python";
  }

  getPythonVal (jsonVal) {
    if (typeof jsonVal === 'boolean') {
      return jsonVal ? "True" : "False";
    }
    return JSON.stringify(jsonVal);
  }

  wrapWithBoilerplate (code) {
    let capStr = Object.keys(this.caps).map((k) => {
      return `caps[${JSON.stringify(k)}] = ${this.getPythonVal(this.caps[k])}`;
    }).join("\n");
    return `# This sample code uses the Appium python client
# pip install Appium-Python-Client
# Then you can paste this into a file and simply run with Python

from appium import webdriver

caps = {}
${capStr}

driver = webdriver.remote("http://${this.host}:${this.port}/wd/hub", caps)

${code}
driver.quit()`;
  }

  codeFor_findAndAssign (strategy, locator, localVar) {
    let suffixMap = {
      xpath: "xpath",
      // TODO add other locator strategies
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    return `${localVar} = driver.find_element_by_${suffixMap[strategy]}(${JSON.stringify(locator)})`;
  }

  codeFor_click () {
    return `${this.lastAssignedVar}.click()`;
  }

  codeFor_clear () {
    return `${this.lastAssignedVar}.clear()`;
  }

  codeFor_sendKeys (text) {
    return `${this.lastAssignedVar}.send_keys(${JSON.stringify(text)})`;
  }

  codeFor_back () {
    return `driver.back()`;
  }

  codeFor_clickElement () {
    return '';
  }
}

PythonFramework.readableName = "Python";

export default PythonFramework;
