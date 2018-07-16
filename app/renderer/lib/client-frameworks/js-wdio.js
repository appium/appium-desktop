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
    let proto = JSON.stringify(this.scheme);
    let path = JSON.stringify(this.path);
    return `// Requires the webdriverio client library
// (npm install webdriverio)
// Then paste this into a .js file and run with Node:
// node <file>.js

const wdio = require('webdriverio');
const caps = ${caps};
const driver = wdio.remote({
  protocol: ${proto},
  host: ${host},
  port: ${this.port},
  path: ${path},
  desiredCapabilities: caps
});

driver.init()
${this.indent(this.chainifyCode(code), 2)}
  .end();
`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    // wdio has its own way of indicating the strategy in the locator string
    switch (strategy) {
      case "xpath": break; // xpath does not need to be updated
      case "accessibility id": locator = `~${locator}`; break;
      case "id": locator = `${locator}`; break;
      case "name": locator = `name=${locator}`; break;
      case "class name": locator = `${locator}`; break;
      case "-android uiautomator": locator = `android=${locator}`; break;
      case "-ios predicate string": locator = `ios=${locator}`; break;
      case "-ios class chain": locator = `ios=${locator}`; break; // TODO: Handle IOS class chain properly. Not all libs support it. Or take it out
      default: throw new Error(`Can't handle strategy ${strategy}`);
    }
    if (isArray) {
      return `let ${localVar} = driver.elements(${JSON.stringify(locator)});`;
    } else {
      return `let ${localVar} = driver.element(${JSON.stringify(locator)});`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.click();`;
  }

  codeFor_clear (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.clearElement();`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `${this.getVarName(varName, varIndex)}.setValue(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `driver.back();`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `driver.touchAction({actions: 'tap', x: ${x}, y: ${y}})`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `driver.touchAction([
  {action: 'press', x: ${x1}, y: ${y1}},
  {action: 'moveTo', x: ${x2}, y: ${y2}},
  'release'
]);`;
  }
}

JsWdIoFramework.readableName = "JS - Webdriver.io";

export default JsWdIoFramework;
