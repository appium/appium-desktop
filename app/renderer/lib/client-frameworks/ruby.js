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

  codeFor_findAndAssign (strategy, locator, localVar) {
    let suffixMap = {
      xpath: ":xpath",
      // TODO add other locator strategies
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    return `${localVar} = driver.find_element(${suffixMap[strategy]}, ${JSON.stringify(locator)})`;
  }

  codeFor_click () {
    return `${this.lastAssignedVar}.click`;
  }

  codeFor_clear () {
    return `${this.lastAssignedVar}.clear`;
  }

  codeFor_sendKeys (text) {
    return `${this.lastAssignedVar}.send_keys ${JSON.stringify(text)}`;
  }

  codeFor_back () {
    return `driver.back`;
  }

  codeFor_clickElement () {
    return ''; // TODO: Implement this in a future PR
  }
}

RubyFramework.readableName = "Ruby";

export default RubyFramework;
