/* eslint no-useless-escape: 0 */

import Framework from './framework';

class RobotFramework extends Framework {

  get language () {
    //TODO: Make https://highlightjs.org/ use robot syntax
    return 'python';
  }

  get getCapsVariables () {
    return Object.keys(this.caps).map((k) => `\$\{${k}\}    ${this.getPythonVal(this.caps[k])}`).join('\n');
  }

  getPythonVal (jsonVal) {
    if (typeof jsonVal === 'boolean') {
      return jsonVal ? 'True' : 'False';
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
$\{REMOTE_URL\}   ${this.serverUrl}
${this.getCapsVariables}

*** Test Cases ***
Test case name
${this.indent(this.getApplicationInitialization(), 4)}
${this.indent(code, 4)}

*** Test Teardown ***
    Quit Application

*** Suite Teardown ***
    Close Application`;
  }

  codeFor_findAndAssign (strategy, locator/*, localVar, isArray*/) {
    let suffixMap = {
      xpath: 'xpath',
      'accessibility id': 'accessibility_id',
      'id': 'id',
      'name': 'name', // TODO: How does Python use name selector
      'class name': 'class_name',
      '-android uiautomator': 'unsupported',
      '-android datamatcher': 'unsupported',
      '-android viewtag': 'unsupported',
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

  getApplicationInitialization () {
    let varString = Object.keys(this.caps).map((k) => `${k}=\$\{${k}\}`).join('  ');
    return `Open Application    \$\{REMOTE_URL\}   ${varString}`;
  }

  codeFor_click (/*varName, varIndex*/) {
    return `Click Element    ${this.lastID}`;
  }

  codeFor_clear (/*varName, varIndex*/) {
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

  // TODO: Add these robot framework commands
  codeFor_getCurrentActivity () {
    return '';
  }

  codeFor_getCurrentPackage () {
    return '';
  }

  codeFor_installAppOnDevice () {
    return ``;
  }

  codeFor_isAppInstalledOnDevice () {
    return ``;
  }

  codeFor_launchApp () {
    return ``;
  }

  codeFor_backgroundApp () {
    return ``;
  }

  codeFor_closeApp () {
    return ``;
  }

  codeFor_resetApp () {
    return ``;
  }

  codeFor_removeAppFromDevice () {
    return ``;
  }

  codeFor_getAppStrings () {
    return ``;
  }

  codeFor_getClipboard () {
    return ``;
  }

  codeFor_setClipboard () {
    return ``;
  }

  codeFor_pressKeycode () {
    return ``;
  }

  codeFor_longPressKeycode () {
    return ``;
  }

  codeFor_hideDeviceKeyboard () {
    return ``;
  }

  codeFor_isKeyboardShown () {
    return ``;
  }

  codeFor_pushFileToDevice () {
    return ``;
  }

  codeFor_pullFile () {
    return ``;
  }

  codeFor_pullFolder () {
    return ``;
  }

  codeFor_toggleAirplaneMode () {
    return ``;
  }

  codeFor_toggleData () {
    return ``;
  }

  codeFor_toggleWiFi () {
    return ``;
  }

  codeFor_toggleLocationServices () {
    return ``;
  }

  codeFor_sendSMS () {
    return ``;
  }

  codeFor_gsmCall () {
    return ``;
  }

  codeFor_gsmSignal () {
    return ``;
  }

  codeFor_gsmVoice () {
    return ``;
  }

  codeFor_shake () {
    return ``;
  }

  codeFor_lock () {
    return ``;
  }

  codeFor_unlock () {
    return ``;
  }

  codeFor_isLocked () {
    return ``;
  }

  codeFor_rotateDevice () {
    return ``;
  }

  codeFor_getPerformanceData () {
    return ``;
  }

  codeFor_getSupportedPerformanceDataTypes () {
    return ``;
  }

  codeFor_performTouchId () {
    return ``;
  }

  codeFor_toggleTouchIdEnrollment () {
    return ``;
  }

  codeFor_openNotifications () {
    return ``;
  }

  codeFor_getDeviceTime () {
    return ``;
  }

  codeFor_fingerprint () {
    return ``;
  }

  codeFor_sessionCapabilities () {
    return ``;
  }

  codeFor_setPageLoadTimeout () {
    return ``;
  }

  codeFor_setAsyncScriptTimeout () {
    return ``;
  }

  codeFor_setImplicitWaitTimeout () {
    return ``;
  }

  codeFor_setCommandTimeout () {
    return ``;
  }

  codeFor_getOrientation () {
    return ``;
  }

  codeFor_setOrientation () {
    return ``;
  }

  codeFor_getGeoLocation () {
    return ``;
  }

  codeFor_setGeoLocation () {
    return ``;
  }

  codeFor_logTypes () {
    return ``;
  }

  codeFor_log () {
    return ``;
  }

  codeFor_updateSettings () {
    return ``;
  }

  codeFor_settings () {
    return ``;
  }

  // Web

  codeFor_get () {
    return ``;
  }

  codeFor_url () {
    return ``;
  }

  codeFor_forward () {
    return ``;
  }

  codeFor_refresh () {
    return ``;
  }

  // Context

  codeFor_currentContext () {
    return ``;
  }

  codeFor_contexts () {
    return ``;
  }

  codeFor_context () {
    return ``;
  }
}

RobotFramework.readableName = 'Robot Framework';

export default RobotFramework;
