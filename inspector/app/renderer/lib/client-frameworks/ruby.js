import Framework from './framework';
import _ from 'lodash';

class RubyFramework extends Framework {

  get language () {
    return 'ruby';
  }

  wrapWithBoilerplate (code) {
    let capStr = Object.keys(this.caps).map((k) => `caps[${JSON.stringify(k)}] = ${JSON.stringify(this.caps[k])}`).join('\n');
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

  codeFor_executeScript (/*varNameIgnore, varIndexIgnore, args*/) {
    return `# TODO implement executeScript`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: ':xpath',
      'accessibility id': ':accessibility_id',
      'id': ':id',
      'name': ':name',
      'class name': ':class_name',
      '-android uiautomator': ':uiautomation',
      '-android datamatcher': ':datamatcher',
      '-android viewtag': ':viewtag',
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
  .move_to({x: ${x2}, y: ${y2}})
  .release
  .perform
    `;
  }

  codeFor_getCurrentActivity () {
    return `current_activity = driver.current_activity`;
  }

  codeFor_getCurrentPackage () {
    return `current_package = driver.current_package`;
  }


  codeFor_installApp (varNameIgnore, varIndexIgnore, app) {
    return `driver.app_installed?('${app}')`;
  }

  codeFor_isAppInstalled (varNameIgnore, varIndexIgnore, app) {
    return `is_app_installed = driver.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `driver.launch_app`;
  }

  codeFor_background (varNameIgnore, varIndexIgnore, timeout) {
    return `driver.background_app(${timeout})`;
  }

  codeFor_closeApp () {
    return `driver.close_app`;
  }

  codeFor_reset () {
    return `driver.reset`;
  }

  codeFor_removeApp (varNameIgnore, varIndexIgnore, app) {
    return `driver.remove_app('${app}')`;
  }

  codeFor_getStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `driver.app_strings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''})`;
  }

  codeFor_getClipboard () {
    return `clipboard_text = driver.get_clipboard`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `driver.set_clipboard content: '${clipboardText}'`;
  }

  codeFor_pressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.press_keycode(${keyCode}, ${metaState}, ${flags})`;
  }

  codeFor_longPressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.long_press_keycode(${keyCode}, ${metaState}, ${flags})`;
  }

  codeFor_hideKeyboard () {
    return `driver.hide_keyboard`;
  }

  codeFor_isKeyboardShown () {
    return `is_keyboard_shown = driver.is_keyboard_shown`;
  }

  codeFor_pushFile (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `driver.push_file('${pathToInstallTo}', '${fileContentString}')`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `driver.pull_file('${pathToPullFrom}')`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `driver.pull_folder('${folderToPullFrom}')`;
  }

  codeFor_toggleAirplaneMode () {
    return `driver.toggle_flight_mode`;
  }

  codeFor_toggleData () {
    return `driver.toggle_data`;
  }

  codeFor_toggleWiFi () {
    return `driver.toggle_wifi`;
  }

  codeFor_toggleLocationServices () {
    return `driver.toggle_location_services`;
  }

  codeFor_sendSMS (varNameIgnore, varIndexIgnore, phoneNumber, text) {
    return `driver.send_sms(phone_number: '${phoneNumber}', message: '${text}')`;
  }

  codeFor_gsmCall (varNameIgnore, varIndexIgnore, phoneNumber, action) {
    return `driver.gsm_call(phone_number: '${phoneNumber}', action: :${action})`;
  }

  codeFor_gsmSignal (varNameIgnore, varIndexIgnore, signalStrength) {
    return `driver.gsm_signal :${signalStrength}`;
  }

  codeFor_gsmVoice (varNameIgnore, varIndexIgnore, state) {
    return `driver.gsm_voice :${state}`;
  }

  codeFor_shake () {
    return `driver.shake`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `driver.lock(${seconds})`;
  }

  codeFor_unlock () {
    return `driver.unlock`;
  }

  codeFor_isLocked () {
    return `is_device_locked = driver.device_locked?`;
  }

  codeFor_rotateDevice () {
    return `# Not supported: rotateDevice`;
  }

  codeFor_getPerformanceData (varNameIgnore, varIndexIgnore, packageName, dataType, dataReadTimeout) {
    return `performance_data = driver.get_performance_data package_name: '${packageName}', data_type: '${dataType}', data_read_timeout: ${dataReadTimeout}`;
  }

  codeFor_getPerformanceDataTypes () {
    return `performance_data = driver.get_performance_data_types`;
  }

  codeFor_touchId (varNameIgnore, varIndexIgnore, match) {
    return `driver.touch_id ${match}`;
  }

  codeFor_toggleEnrollTouchId (varNameIgnore, varIndexIgnore, enroll) {
    return `driver.toggle_touch_id_enrollment ${enroll}`;
  }

  codeFor_openNotifications () {
    return `driver.open_notifications`;
  }

  codeFor_getDeviceTime () {
    return `device_time = driver.device_time`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `driver.finger_print ${fingerprintId}`;
  }

  codeFor_getSession () {
    return `session_capabilities = driver.session_capabilities`;
  }

  codeFor_setTimeouts (/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '# TODO implement setTimeouts';
  }

  codeFor_getOrientation () {
    return `orientation = driver.orientation`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `driver.rotation = :${orientation}`;
  }

  codeFor_getGeoLocation () {
    return `geo_location = driver.location`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `driver.set_location(${latitude}, ${longitude}, ${altitude})`;
  }

  codeFor_getLogTypes () {
    return `log_types = driver.logs.available_types`;
  }

  codeFor_getLogs (varNameIgnore, varIndexIgnore, logType) {
    return `driver.logs.get '${logType}'`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    try {
      let settings = '';
      for (let [settingName, settingValue] of _.toPairs(JSON.parse(settingsJson))) {
        settings += `driver.update_settings(${settingName}: '${settingValue}')\n`;
      }
      return settings;
    } catch (e) {
      return `// Could not parse: ${settingsJson}`;
    }
  }

  codeFor_getSettings () {
    return `settings = driver.get_settings`;
  }

  // Web

  codeFor_navigateTo (url) {
    return `driver.get '${url}'`;
  }

  codeFor_getUrl () {
    return `current_url = driver.current_url`;
  }

  codeFor_forward () {
    return `driver.navigate().forward`;
  }

  codeFor_refresh () {
    return `driver.navigate().refresh`;
  }

  // Context

  codeFor_getContext () {
    return `driver.current_context`;
  }

  codeFor_getContexts () {
    return `driver.available_contexts`;
  }

  codeFor_switchContexts (name) {
    return `set_context '${name}'`;
  }
}

RubyFramework.readableName = 'Ruby';

export default RubyFramework;
