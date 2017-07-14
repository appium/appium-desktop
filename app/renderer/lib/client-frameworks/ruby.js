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
    server_url: "http://${this.host}:${this.port}/wd/hub"
}
driver = Appium::Driver.new({caps: caps, appium_lib: opts}).start_driver

${code}
driver.quit`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: ":xpath",
      // TODO add other locator strategies
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

  codeFor_click (varName) {
    return `${varName}.click`;
  }

  codeFor_clear (varName) {
    return `${varName}.clear`;
  }

  codeFor_sendKeys (varName, text) {
    return `${varName}.send_keys ${JSON.stringify(text)}`;
  }

  codeFor_back () {
    return `driver.back`;
  }
}

RubyFramework.readableName = "Ruby";

export default RubyFramework;
