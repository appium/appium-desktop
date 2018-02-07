import Framework from './framework';

class RubyFramework extends Framework {

  get language () {
    return "ruby";
  }

  wrapWithBoilerplate (code) {
    let capStr = Object.keys(this.caps).map((k) => {
      return `caps[${JSON.stringify(k)}] = ${JSON.stringify(this.caps[k])}`;
    }).join("\n");
    return `# This sample code uses the Appium ruby client
# gem install appium_lib
# Then you can paste this into a file and simply run with Ruby

require 'rubygems'
require 'appium_lib'

caps = {}
${capStr}
opts = {
    sauce_username: nil,
    server_url: "${this.serverUrl}"
}
driver = Appium::Driver.new({caps: caps, appium_lib: opts}).start_driver

${code}
driver.quit`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: ":xpath",
      'accessibility id': ':accessibility_id',
      'id': ':id',
      'name': ':name',
      'class name': ':class_name',
      '-android uiautomator': ':uiautomation',
      '-ios predicate string': ':predicate',
      '-ios class chain': ':class_chain',
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    if (isArray) {
      return `${localVar} = driver.find_element(${suffixMap[strategy]}, ${JSON.stringify(locator)})`;
    } else {
      return `${localVar} = driver.find_elements(${suffixMap[strategy]}, ${JSON.stringify(locator)})`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.click`;
  }

  codeFor_clear (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.clear`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `${this.getVarName(varName, varIndex)}.send_keys ${JSON.stringify(text)}`;
  }

  codeFor_back () {
    return `driver.back`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `TouchAction
  .new
  .tap(x: ${x}, y: ${y})
  .perform
    `;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `TouchAction
  .new
  .press({x: ${x1}, y: ${y1}})
  .moveTo({x: ${x2}, y: ${y2}})
  .release
  .perform
    `;
  }
}

RubyFramework.readableName = "Ruby";

export default RubyFramework;
