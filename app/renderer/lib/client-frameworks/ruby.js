import Framework from './framework';

class RubyFramework extends Framework {

  get language () {
    return 'ruby';
  }

  wrapWithBoilerplate (code) {
    let capStr = Object.keys(this.caps).map((k) => {
      return `caps[${JSON.stringify(k)}] = ${JSON.stringify(this.caps[k])}`;
    }).join('\n');
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
      xpath: ':xpath',
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

  codeFor_getCurrentActivity () {
    return `current_activity = driver.current_activity`;
  }

  codeFor_getCurrentPackage () {
    return `current_package = driver.current_package`;
  }


  codeFor_installAppOnDevice (varNameIgnore, varIndexIgnore, app) {
    return `driver.app_installed?('${app}')`;
  }

  codeFor_isAppInstalledOnDevice (varNameIgnore, varIndexIgnore, app) {
    return `is_app_installed = driver.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `driver.launch_app`;
  }

  codeFor_backgroundApp (varNameIgnore, varIndexIgnore, timeout) {
    return `driver.background_app(${timeout})`;
  }

  codeFor_closeApp () {
    return `driver.close_app`;
  }

  codeFor_resetApp () {
    return `driver.reset`;
  }

  codeFor_removeAppFromDevice (varNameIgnore, varIndexIgnore, app) {
    return `driver.remove_app('${app}')`;
  }

  codeFor_getAppStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `driver.app_strings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''})`;
  }

  codeFor_getClipboard () {
    return `clipboard_text = driver.get_clipboard`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `driver.set_clipboard content: '${clipboardText}'`;
  }

  codeFor_pressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.press_keycode(${keyCode}, ${metaState}, ${flags})`;
  }

  codeFor_longPressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `driver.long_press_keycode(${keyCode}, ${metaState}, ${flags})`;
  }

  codeFor_hideDeviceKeyboard () {
    return `driver.hide_keyboard`;
  }

  codeFor_isKeyboardShown () {
    return `is_keyboard_shown = driver.is_keyboard_shown`;
  }

  codeFor_pushFileToDevice (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `driver.push_file('${pathToInstallTo}', '${fileContentString}')`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `driver.pull_file('${pathToPullFrom}')`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `driver.pull_folder('${folderToPullFrom}')`;
  }
}

RubyFramework.readableName = 'Ruby';

export default RubyFramework;
