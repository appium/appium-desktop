import Framework from './framework';

class JsOxygenFramework extends Framework {

  get language () {
    return 'js';
  }

  wrapWithBoilerplate (code) {
    let caps = JSON.stringify(this.caps);
    let url = JSON.stringify(`${this.scheme}://${this.host}:${this.port}${this.path}`);
    return `// Requires the Oxygen HQ client library
// (npm install oxygen-cli -g)
// Then paste this into a .js file and run with:
// oxygen <file>.js

mob.init(${caps}, ${url});

${code}

`;
  }

  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    // wdio has its own way of indicating the strategy in the locator string
    switch (strategy) {
      case 'xpath': break; // xpath does not need to be updated
      case 'accessibility id': locator = `~${locator}`; break;
      case 'id': locator = `id=${locator}`; break;
      case 'name': locator = `name=${locator}`; break;
      case 'class name': locator = `css=${locator}`; break;
      case '-android uiautomator': locator = `android=${locator}`; break;
      case '-android datamatcher': locator = `android=${locator}`; break;
      case '-ios predicate string': locator = `ios=${locator}`; break;
      case '-ios class chain': locator = `ios=${locator}`; break; // TODO: Handle IOS class chain properly. Not all libs support it. Or take it out
      default: throw new Error(`Can't handle strategy ${strategy}`);
    }
    if (isArray) {
      return `let ${localVar} = mob.findElements(${JSON.stringify(locator)});`;
    } else {
      return `let ${localVar} = mob.findElement(${JSON.stringify(locator)});`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `mob.click(${this.getVarName(varName, varIndex)});`;
  }

  codeFor_clear (varName, varIndex) {
    return `mob.clear(${this.getVarName(varName, varIndex)});`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `mob.type(${this.getVarName(varName, varIndex)}, ${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `mob.back();`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `mob.tap(${x}, ${y});`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `mob.swipeScreen(${x1}, ${y1}, ${x2}, ${y2});`;
  }

  codeFor_getCurrentActivity () {
    return `let activityName = mob.getCurrentActivity();`;
  }

  codeFor_getCurrentPackage () {
    return `let packageName = mob.getCurrentPackage();`;
  }

  codeFor_installAppOnDevice (varNameIgnore, varIndexIgnore, app) {
    return `mob.installApp('${app}');`;
  }

  codeFor_isAppInstalledOnDevice (varNameIgnore, varIndexIgnore, app) {
    return `let isAppInstalled = mob.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `mob.launchApp();`;
  }

  codeFor_backgroundApp (varNameIgnore, varIndexIgnore, timeout) {
    return `mob.driver().background(${timeout});`;
  }

  codeFor_closeApp () {
    return `mob.closeApp();`;
  }

  codeFor_resetApp () {
    return `mob.resetApp();`;
  }

  codeFor_removeAppFromDevice (varNameIgnore, varIndexIgnore, app) {
    return `mob.removeApp('${app}')`;
  }

  codeFor_getAppStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `let appStrings = mob.driver().getAppStrings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''});`;
  }

  codeFor_getClipboard () {
    return `let clipboardText = mob.driver().getClipboard();`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `mob.driver().setClipboard('${clipboardText}')`;
  }

  codeFor_pressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `mob.driver().longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_longPressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `mob.driver().longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_hideDeviceKeyboard () {
    return `mob.driver().hideKeyboard();`;
  }

  codeFor_isKeyboardShown () {
    return `//isKeyboardShown not supported`;
  }

  codeFor_pushFileToDevice (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `mob.driver().pushFile('${pathToInstallTo}', '${fileContentString}');`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `let data = mob.driver().pullFile('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let data = mob.driver().pullFolder('${folderToPullFrom}');`;
  }

  codeFor_toggleAirplaneMode () {
    return `mob.driver().toggleAirplaneMode();`;
  }

  codeFor_toggleData () {
    return `mob.driver().toggleData();`;
  }

  codeFor_toggleWiFi () {
    return `mob.driver().toggleWiFi();`;
  }

  codeFor_toggleLocationServices () {
    return `mob.driver().toggleLocationServices();`;
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
    return `mob.shake();`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `mob.driver().lock(${seconds});`;
  }

  codeFor_unlock () {
    return `mob.driver().unlock();`;
  }

  codeFor_isLocked () {
    return `let isLocked = mob.driver().isLocked();`;
  }

  codeFor_rotateDevice (varNameIgnore, varIndexIgnore, x, y, radius, rotation, touchCount, duration) {
    return `mob.driver().rotateDevice(${x}, ${y}, ${radius}, ${rotation}, ${touchCount}, ${duration});`;
  }

  codeFor_getPerformanceData () {
    return `// Not supported: getPerformanceData`;
  }

  codeFor_getSupportedPerformanceDataTypes () {
    return `// Not supported: getSupportedPerformanceDataTypes`;
  }

  codeFor_performTouchId (varNameIgnore, varIndexIgnore, match) {
    return `mob.driver().touchId(${match});`;
  }

  codeFor_toggleTouchIdEnrollment (varNameIgnore, varIndexIgnore, enroll) {
    return `mob.driver().toggleEnrollTouchId(${enroll});`;
  }

  codeFor_openNotifications () {
    return `mob.driver().openNotifications();`;
  }

  codeFor_getDeviceTime () {
    return `let time = mob.getDeviceTime();`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `mob.driver().fingerPrint(${fingerprintId});`;
  }

  codeFor_sessionCapabilities () {
    return `let caps = mob.driver().capabilities;`;
  }

  codeFor_setPageLoadTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.driver().setTimeout({'pageLoad': ${ms}});`;
  }

  codeFor_setAsyncScriptTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.driver().setTimeout({'script': ${ms}});`;
  }

  codeFor_setImplicitWaitTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.driver().setTimeout({'implicit': ${ms}});`;
  }

  codeFor_setCommandTimeout () {
    return `// Not supported: setCommandTimeout`;
  }

  codeFor_getOrientation () {
    return `let orientation = mob.driver().getOrientation();`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `mob.driver().setOrientation("${orientation}");`;
  }

  codeFor_getGeoLocation () {
    return `let location = mob.driver().getGeoLocation();`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `mob.driver().setGeoLocation({latitude: ${latitude}, longitude: ${longitude}, altitude: ${altitude}});`;
  }

  codeFor_logTypes () {
    return `let logTypes = mob.driver().getLogTypes();`;
  }

  codeFor_log (varNameIgnore, varIndexIgnore, logType) {
    return `let logs = mob.driver().getLogs('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `mob.driver().updateSettings(${settingsJson});`;
  }

  codeFor_settings () {
    return `let settings = mob.driver().getSettings();`;
  }
}

JsOxygenFramework.readableName = 'JS - Oxygen HQ';

export default JsOxygenFramework;
