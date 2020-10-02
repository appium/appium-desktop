import Framework from './framework';

class JsWdIoFramework extends Framework {

  get language () {
    return 'js';
  }

  chainifyCode (code) {
    return code
      .replace(/let .+ = /g, '')
      .replace(/(\n|^)(driver|el[0-9]+)\./g, '\n.')
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

  codeFor_executeScript (/*varNameIgnore, varIndexIgnore, args*/) {
    return `/* TODO implement executeScript */`;
  }


  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    // wdio has its own way of indicating the strategy in the locator string
    switch (strategy) {
      case 'xpath': break; // xpath does not need to be updated
      case 'accessibility id': locator = `~${locator}`; break;
      case 'id': locator = `${locator}`; break;
      case 'name': locator = `name=${locator}`; break;
      case 'class name': locator = `${locator}`; break;
      case '-android uiautomator': locator = `android=${locator}`; break;
      case '-android datamatcher': locator = `android=${locator}`; break;
      case '-android viewtag': locator = `android=unsupported`; break;
      case '-ios predicate string': locator = `ios=${locator}`; break;
      case '-ios class chain': locator = `ios=${locator}`; break; // TODO: Handle IOS class chain properly. Not all libs support it. Or take it out
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

  codeFor_getCurrentActivity () {
    return `let activityName = await driver.currentActivity();`;
  }

  codeFor_getCurrentPackage () {
    return `let packageName = await driver.currentPackage();`;
  }


  codeFor_installApp (varNameIgnore, varIndexIgnore, app) {
    return `await driver.installApp('${app}');`;
  }

  codeFor_isAppInstalled (varNameIgnore, varIndexIgnore, app) {
    return `let isAppInstalled = await driver.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `await driver.launch();`;
  }

  codeFor_background (varNameIgnore, varIndexIgnore, timeout) {
    return `await driver.background(${timeout});`;
  }

  codeFor_closeApp () {
    return `await driver.close_app();`;
  }

  codeFor_reset () {
    return `await driver.reset();`;
  }

  codeFor_removeApp (varNameIgnore, varIndexIgnore, app) {
    return `await driver.removeApp('${app}')`;
  }

  codeFor_getStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `let appStrings = await driver.getStrings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''});`;
  }

  codeFor_getClipboard () {
    return `let clipboardText = await driver.getClipboard();`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `await driver.setClipboard('${clipboardText}')`;
  }

  codeFor_pressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `await driver.longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_longPressKeyCode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `await driver.longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_hideKeyboard () {
    return `await driver.hideKeyboard();`;
  }

  codeFor_isKeyboardShown () {
    return `await driver.isKeyboardShown();`;
  }

  codeFor_pushFile (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `await driver.pushFile('${pathToInstallTo}', '${fileContentString}');`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `let data = await driver.pullFile('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let data = await driver.pullFolder('${folderToPullFrom}');`;
  }

  codeFor_toggleAirplaneMode () {
    return `await driver.toggleAirplaneMode();`;
  }

  codeFor_toggleData () {
    return `await driver.toggleData();`;
  }

  codeFor_toggleWiFi () {
    return `await driver.toggleWiFi();`;
  }

  codeFor_toggleLocationServices () {
    return `await driver.toggleLocationServices();`;
  }

  codeFor_sendSMS () {
    return `// Not supported: sendSms;`;
  }

  codeFor_gsmCall () {
    return `// Not supported: gsmCall`;
  }

  codeFor_gsmSignal () {
    return `// Not supported: gsmSignal`;
  }

  codeFor_gsmVoice () {
    return `// Not supported: gsmVoice`;
  }

  codeFor_shake () {
    return `await driver.shake();`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `await driver.lock(${seconds});`;
  }

  codeFor_unlock () {
    return `await driver.unlock();`;
  }

  codeFor_isLocked () {
    return `let isLocked = await driver.isLocked();`;
  }

  codeFor_rotateDevice (varNameIgnore, varIndexIgnore, x, y, radius, rotation, touchCount, duration) {
    return `driver.rotate(${x}, ${y}, ${radius}, ${rotation}, ${touchCount}, ${duration});`;
  }

  codeFor_getPerformanceData () {
    return `// Not supported: getPerformanceData`;
  }

  codeFor_getPerformanceDataTypes () {
    return `// Not supported: getPerformanceDataTypes`;
  }

  codeFor_touchId (varNameIgnore, varIndexIgnore, match) {
    return `await driver.touchId(${match});`;
  }

  codeFor_toggleEnrollTouchId (varNameIgnore, varIndexIgnore, enroll) {
    return `await driver.toggleEnrollTouchId(${enroll});`;
  }

  codeFor_openNotifications () {
    return `await driver.openNotifications();`;
  }

  codeFor_getDeviceTime () {
    return `let time = await driver.getDeviceTime();`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `await driver.fingerprint(${fingerprintId});`;
  }

  codeFor_getSession () {
    return `let caps = await driver.session('c8db88a0-47a6-47a1-802d-164d746c06aa');`;
  }

  codeFor_setTimeouts (/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '/* TODO implement setTimeouts */';
  }

  codeFor_setCommandTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `await driver.timeouts('command', ${ms})`;
  }

  codeFor_getOrientation () {
    return `let orientation = await driver.orientation();`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `driver.orientation("${orientation}");`;
  }

  codeFor_getGeoLocation () {
    return `let location = await driver.location();`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `await driver.location({latitude: ${latitude}, longitude: ${longitude}, altitude: ${altitude}});`;
  }

  codeFor_getLogTypes () {
    return `let getLogTypes = await driver.log();`;
  }

  codeFor_getLogs (varNameIgnore, varIndexIgnore, logType) {
    return `let logs = await driver.log('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `await driver.settings(${settingsJson});`;
  }

  codeFor_getSettings () {
    return `let settings = await driver.settings();`;
  }

  // Web

  codeFor_navigateTo (url) {
    return `driver.navigateTo('${url}');`;
  }

  codeFor_getUrl () {
    return `let current_url = driver.getUrl();`;
  }

  codeFor_forward () {
    return `driver.forward();`;
  }

  codeFor_refresh () {
    return `driver.refresh();`;
  }

  // Context

  codeFor_getContext () {
    return `let context = driver.getContext();`;
  }

  codeFor_getContexts () {
    return `driver.getContexts();`;
  }

  codeFor_switchContexts (name) {
    return `driver.switchContext('${name}');`;
  }
}

JsWdIoFramework.readableName = 'JS - Webdriver.io';

export default JsWdIoFramework;
