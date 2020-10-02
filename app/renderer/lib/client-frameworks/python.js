import Framework from './framework';

class PythonFramework extends Framework {

  get language () {
    return 'python';
  }

  getPythonVal (jsonVal) {
    if (typeof jsonVal === 'boolean') {
      return jsonVal ? 'True' : 'False';
    }
    return JSON.stringify(jsonVal);
  }

  wrapWithBoilerplate (code) {
    let capStr = Object.keys(this.caps).map((k) => `caps[${JSON.stringify(k)}] = ${this.getPythonVal(this.caps[k])}`).join('\n');
    return `# This sample code uses the Appium python client
# pip install Appium-Python-Client
# Then you can paste this into a file and simply run with Python

from appium import webdriver

caps = {}
${capStr}

driver = webdriver.Remote("${this.serverUrl}", caps)

${code}
driver.quit()`;
  }

  codeFor_executeScript (/*varNameIgnore, varIndexIgnore, args*/) {
    return `# TODO implement executeScript`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: 'xpath',
      'accessibility id': 'accessibility_id',
      'id': 'id',
      'name': 'name', // TODO: How does Python use name selector
      'class name': 'class_name',
      '-android uiautomator': 'android_uiautomator',
      '-android datamatcher': 'android_datamatcher',
      '-android viewtag': 'android_viewtag',
      '-ios predicate string': 'ios_predicate',
      '-ios class chain': 'ios_uiautomation', // TODO: Could not find iOS UIAutomation
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    if (isArray) {
      return `${localVar} = driver.find_elements_by_${suffixMap[strategy]}(${JSON.stringify(locator)})`;
    } else {
      return `${localVar} = driver.find_element_by_${suffixMap[strategy]}(${JSON.stringify(locator)})`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.click()`;
  }

  codeFor_clear (varName, varIndex) {
    return `${this.getVarName(varName, varIndex)}.clear()`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `${this.getVarName(varName, varIndex)}.send_keys(${JSON.stringify(text)})`;
  }

  codeFor_back () {
    return `driver.back()`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `TouchAction(driver).tap(x=${x}, y=${y}).perform()`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `TouchAction(driver) \
  .press(x=${x1}, y=${y1}) \
  .move_to(x=${x2}, y=${y2}) \
  .release() \
  .perform()
    `;
  }

  codeFor_getCurrentActivity () {
    return `activity_name = driver.current_activity`;
  }

  codeFor_getCurrentPackage () {
    return `package_name = driver.current_package`;
  }

  codeFor_installApp (varNameIgnore, varIndexIgnore, app) {
    return `driver.install_app('${app}');`;
  }

  codeFor_isAppInstalled (varNameIgnore, varIndexIgnore, app) {
    return `is_app_installed = driver.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `driver.launch_app()`;
  }

  codeFor_background (varNameIgnore, varIndexIgnore, timeout) {
    return `driver.background_app(${timeout})`;
  }

  codeFor_closeApp () {
    return `driver.close_app()`;
  }

  codeFor_reset () {
    return `driver.reset()`;
  }

  codeFor_removeApp (varNameIgnore, varIndexIgnore, app) {
    return `driver.remove_app('${app}');`;
  }

  codeFor_getStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `appStrings = driver.app_strings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''})`;
  }

  codeFor_getClipboard () {
    return `clipboard_text = driver.get_clipboard_text()`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `driver.set_clipboard_text('${clipboardText}')`;
  }

  codeFor_pressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.press_keycode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_longPressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.long_press_keycode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_hideKeyboard () {
    return `driver.hide_keyboard()`;
  }

  codeFor_isKeyboardShown () {
    return `# isKeyboardShown not supported`;
  }

  codeFor_pushFile (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `driver.push_file('${pathToInstallTo}', '${fileContentString}');`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `file_base64 = self.driver.pull_file('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `file_base64 = self.driver.pull_folder('${folderToPullFrom}');`;
  }

  codeFor_toggleAirplaneMode () {
    return `# Not supported: toggleAirplaneMode`;
  }

  codeFor_toggleData () {
    return `# Not supported: toggleData`;
  }

  codeFor_toggleWiFi () {
    return `# Not supported: toggleWifi`;
  }

  codeFor_toggleLocationServices () {
    return `driver.toggle_location_services();`;
  }

  codeFor_sendSMS () {
    return `# Not supported: sendSMS`;
  }

  codeFor_gsmCall () {
    return `# Not supported: gsmCall`;
  }

  codeFor_gsmSignal () {
    return `# Not supported: gsmSignal`;
  }

  codeFor_gsmVoice () {
    return `# Not supported: gsmVoice`;
  }

  codeFor_shake () {
    return `driver.shake();`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `driver.lock(${seconds});`;
  }

  codeFor_unlock () {
    return `driver.unlock();`;
  }

  codeFor_isLocked () {
    return `# Not supported: is device locked`;
  }

  codeFor_rotateDevice () {
    return `# Not supported: rotate device`;
  }

  codeFor_getPerformanceData () {
    return `# Not supported: getPerformanceData`;
  }

  codeFor_getPerformanceDataTypes () {
    return `# Not supported: getPerformanceDataTypes`;
  }

  codeFor_touchId (varNameIgnore, varIndexIgnore, match) {
    return `driver.touch_id(${match})`;
  }

  codeFor_toggleEnrollTouchId (varNameIgnore, varIndexIgnore, enroll) {
    return `driver.toggle_touch_id_enrollment(${enroll})`;
  }

  codeFor_openNotifications () {
    return `driver.open_notifications();`;
  }

  codeFor_getDeviceTime () {
    return `time = self.driver.device_time()`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `driver.finger_print(${fingerprintId})`;
  }

  codeFor_getSession () {
    return `desired_caps = self.driver.desired_capabilities()`;
  }

  codeFor_setTimeouts (/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '# TODO implement setTimeouts';
  }

  codeFor_getOrientation () {
    return `orientation = self.driver.orientation()`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `driver.orientation = "${orientation}"`;
  }

  codeFor_getGeoLocation () {
    return `location = self.driver.location()`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `driver.set_location(${latitude}, ${longitude}, ${altitude})`;
  }

  codeFor_getLogTypes () {
    return `log_types = driver.log_types();`;
  }

  codeFor_getLogs (varNameIgnore, varIndexIgnore, logType) {
    return `logs = driver.get_log('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `driver.update_settings(${settingsJson}))`;
  }

  codeFor_getSettings () {
    return `settings = driver.get_settings`;
  }

  // Web

  codeFor_navigateTo (url) {
    return `driver.get('${url}')`;
  }

  codeFor_getUrl () {
    return `current_url = driver.current_url`;
  }

  codeFor_forward () {
    return `driver.forward()`;
  }

  codeFor_refresh () {
    return `driver.refresh()`;
  }

  // Context

  codeFor_getContext () {
    return `driver.current_context`;
  }

  codeFor_getContexts () {
    return `driver.contexts()`;
  }

  codeFor_switchContexts (name) {
    return `driver.switch_to.context('${name}')`;
  }
}

PythonFramework.readableName = 'Python';

export default PythonFramework;
