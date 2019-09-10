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
// Then paste this into a .js file and run with Node:
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
    return `mob.setValue(${this.getVarName(varName, varIndex)}, ${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `mob.back();`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `mob.tap(${x}, ${y})`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `mob.getDriver().touchAction([
  {action: 'press', x: ${x1}, y: ${y1}},
  {action: 'moveTo', x: ${x2}, y: ${y2}},
  'release'
]);`;
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
    return `mob.getDriver().background(${timeout});`;
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
    return `let appStrings = mob.getDriver().getAppStrings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''});`;
  }

  codeFor_getClipboard () {
    return `let clipboardText = mob.getDriver().getClipboard();`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `mob.getDriver().setClipboard('${clipboardText}')`;
  }

  codeFor_pressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `mob.getDriver().longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_longPressKeycode (varNameIgnore, varIndexIgnore, keyCode, metaState, flags) {
    return `mob.getDriver().longPressKeyCode(${keyCode}, ${metaState}, ${flags});`;
  }

  codeFor_hideDeviceKeyboard () {
    return `mob.getDriver().hideDeviceKeyboard();`;
  }

  codeFor_isKeyboardShown () {
    return `//isKeyboardShown not supported`;
  }

  codeFor_pushFileToDevice (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `mob.getDriver().pushFile('${pathToInstallTo}', '${fileContentString}');`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `let data = mob.getDriver().pullFile('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let data = mob.getDriver().pullFolder('${folderToPullFrom}');`;
  }

  codeFor_toggleAirplaneMode () {
    return `mob.getDriver().toggleAirplaneMode();`;
  }

  codeFor_toggleData () {
    return `mob.getDriver().toggleData();`;
  }

  codeFor_toggleWiFi () {
    return `mob.getDriver().toggleWiFi();`;
  }

  codeFor_toggleLocationServices () {
    return `mob.getDriver().toggleLocationServices();`;
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
    return `mob.getDriver().lock(${seconds});`;
  }

  codeFor_unlock () {
    return `mob.getDriver().unlock();`;
  }

  codeFor_isLocked () {
    return `let isLocked = mob.getDriver().isLocked();`;
  }

  codeFor_rotateDevice (varNameIgnore, varIndexIgnore, x, y, radius, rotation, touchCount, duration) {
    return `mob.getDriver()(${x}, ${y}, ${radius}, ${rotation}, ${touchCount}, ${duration});`;
  }

  codeFor_getPerformanceData () {
    return `// Not supported: getPerformanceData`;
  }

  codeFor_getSupportedPerformanceDataTypes () {
    return `// Not supported: getSupportedPerformanceDataTypes`;
  }

  codeFor_performTouchId (varNameIgnore, varIndexIgnore, match) {
    return `mob.getDriver().touchId(${match});`;
  }

  codeFor_toggleTouchIdEnrollment (varNameIgnore, varIndexIgnore, enroll) {
    return `mob.getDriver().toggleTouchIdEnrollment(${enroll});`;
  }

  codeFor_openNotifications () {
    return `mob.getDriver().openNotifications();`;
  }

  codeFor_getDeviceTime () {
    return `let time = mob.getDeviceTime();`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `mob.getDriver().fingerprint(${fingerprintId});`;
  }

  codeFor_sessionCapabilities () {
    return `let caps = mob.getDriver().session('c8db88a0-47a6-47a1-802d-164d746c06aa');`;
  }

  codeFor_setPageLoadTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.getDriver().timeouts('page load', ${ms})`;
  }

  codeFor_setAsyncScriptTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.getDriver().timeouts('script', ${ms})`;
  }

  codeFor_setImplicitWaitTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.getDriver().timeouts('implicit', ${ms})`;
  }

  codeFor_setCommandTimeout (varNameIgnore, varIndexIgnore, ms) {
    return `mob.getDriver().timeouts('command', ${ms})`;
  }

  codeFor_getOrientation () {
    return `let orientation = mob.getDriver().orientation();`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `mob.getDriver().orientation("${orientation}");`;
  }

  codeFor_getGeoLocation () {
    return `let location = mob.getDriver().location();`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `mob.getDriver().location({latitude: ${latitude}, longitude: ${longitude}, altitude: ${altitude}});`;
  }

  codeFor_logTypes () {
    return `let logTypes = mob.getDriver().log();`;
  }

  codeFor_log (varNameIgnore, varIndexIgnore, logType) {
    return `let logs = mob.getDriver().log('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `mob.getDriver().settings(${settingsJson});`;
  }

  codeFor_settings () {
    return `let settings = mob.getDriver().settings();`;
  }
}

JsOxygenFramework.readableName = 'JS - Oxygen HQ';

export default JsOxygenFramework;
