import Framework from './framework';

class RobotFramework extends Framework {

  get language () {
    //TODO: Make https://highlightjs.org/ use robot syntax
    return "python";
  }

  get getCapsVariables() {
    return Object.keys(this.caps).map((k) => {
      return `${k}    ${this.getPythonVal(this.caps[k])}`;
    }).join("\n");
  }

  getPythonVal (jsonVal) {
    if (typeof jsonVal === 'boolean') {
      return jsonVal ? "True" : "False";
    }
    return jsonVal;
  }

  wrapWithBoilerplate (code) {
    return `# This sample code uses the Appium robot client
# pip install robotframework-appiumlibrary
# Then you can paste this into a file and simply run with robot
#
#  more keywords on: http://serhatbolsu.github.io/robotframework-appiumlibrary/AppiumLibrary.html

*** Settings ***
Library           AppiumLibrary

*** Variables ***
\$\{REMOTE_URL\}   ${this.serverUrl}
${this.getCapsVariables}

*** Test Cases ***
Test case name
${this.indent(this.getApplicationInitialization(), 4)}
${this.indent(code, 4)}

*** Test Teardonw ***
    Quit Application

*** Suite Teardonw ***
    Close Application`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: "xpath",
      'accessibility id': 'accessibility_id',
      'id': 'id',
      'name': 'name', // TODO: How does Python use name selector
      'class name': 'class_name',
      '-android uiautomator': 'AndroidUIAutomator',
      '-ios predicate string': 'ios_predicate',
      '-ios class chain': 'ios_uiautomation', // TODO: Could not find iOS UIAutomation
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    //TODO: in the robot case, we need the ID on the codeFor_ for execution
    this.lastID = `${strategy}=${locator}`;
    return `# ${this.lastID}`;
  } 

  getApplicationInitialization() {
    let varString = Object.keys(this.caps).map((k) => {
      return `${k}=\$\{${k}\}`;
    }).join(" ");
    return `Open Application    \$\{REMOTE_URL\}   ${varString}`;
  }

  codeFor_click (varName, varIndex) {
    return `Click Element    ${this.lastID}`;
  }

  codeFor_clear (varName, varIndex) {
    return `Clear Text    ${this.lastID}`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `Input Text    ${this.lastID}    ${text}`;
  }

  codeFor_back () {
    return `Go Back`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `Tap    ${this.lastID}    ${x}    ${y}`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `Swipe    ${x1}    ${y1}    ${x2}    ${y2}`;
  }
}

RobotFramework.readableName = "Robot Framework";

export default RobotFramework;
