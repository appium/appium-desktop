import Framework from './framework';

class JsOxygenFramework extends Framework {

  get language () {
    return 'js';
  }

  get type () {
    if (this.caps && this.caps.platformName) {
      const platformName = this.caps.platformName.toLowerCase();
      if (platformName === 'windows') {
        return 'win';
      }
      if (['android', 'androiddriver'].includes(platformName)) {
        return 'mob';
      }
      if (['ios', 'iosdriver'].includes(platformName)) {
        return 'mob';
      }
    }
    return 'mob';
  }

  wrapWithBoilerplate (code) {
    if (code && code.includes('mob.open')) {
      this.caps.browserName = '__chrome_or_safari__';
    } else {
      this.caps.app = '__application_path_or_name__';
    }
    let caps = JSON.stringify(this.caps, null, 2);
    let url = JSON.stringify(`${this.scheme}://${this.host}:${this.port}${this.path}`);
    return `// Requires the Oxygen HQ client library
// (npm install oxygen-cli -g)
// Then paste this into a .js file and run with:
// oxygen <file>.js
const capabilities = ${caps};
const appiumUrl = ${url};
${this.type}.init(capabilities, appiumUrl);

${code}

`;
  }

  codeFor_executeScript (varNameIgnore, varIndexIgnore, args) {
    return `${this.type}.execute(${args})`;
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
    return `${this.type}.click(${this.getVarName(varName, varIndex)});`;
  }

  codeFor_clear (varName, varIndex) {
    return `${this.type}.clear(${this.getVarName(varName, varIndex)});`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `${this.type}.type(${this.getVarName(varName, varIndex)}, ${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `${this.type}.back();`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `${this.type}.tap(${x}, ${y});`;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `${this.type}.swipeScreen(${x1}, ${y1}, ${x2}, ${y2});`;
  }

  codeFor_getCurrentActivity () {
    return `let activityName = ${this.type}.getCurrentActivity();`;
  }

  codeFor_getCurrentPackage () {
    return `let packageName = ${this.type}.getCurrentPackage();`;
  }

  codeFor_installApp (varNameIgnore, varIndexIgnore, app) {
    return `${this.type}.installApp('${app}');`;
  }

  codeFor_isAppInstalled (varNameIgnore, varIndexIgnore, app) {
    return `let isAppInstalled = ${this.type}.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `${this.type}.launchApp();`;
  }

  codeFor_background (varNameIgnore, varIndexIgnore, timeout) {
    return `${this.type}.getDriver().background(${timeout});`;
  }

  codeFor_closeApp () {
    return `${this.type}.closeApp();`;
  }

  codeFor_reset () {
    return `${this.type}.resetApp();`;
  }

  codeFor_removeApp (varNameIgnore, varIndexIgnore, app) {
    return `${this.type}.removeApp('${app}')`;
  }

  codeFor_getStrings (varNameIgnore, varIndexIgnore, language, stringFile) {
    return `let appStrings = ${this.type}.getDriver().getStrings(${language ? `${language}, ` : ''}${stringFile ? `"${stringFile}` : ''});`;
  }

  codeFor_getClipboard () {
    return `let clipboardText = ${this.type}.getDriver().getClipboard();`;
  }

  codeFor_setClipboard (varNameIgnore, varIndexIgnore, clipboardText) {
    return `${this.type}.getDriver().setClipboard('${clipboardText}')`;
  }

  codeFor_pressKeyCode (varNameIgnore, varIndexIgnore, keyCode) {
    return `${this.type}.pressKeyCode(${keyCode});`;
  }

  codeFor_longPressKeyCode (varNameIgnore, varIndexIgnore, keyCode) {
    return `${this.type}.longPressKeyCode(${keyCode});`;
  }

  codeFor_hideKeyboard () {
    return `${this.type}.hideKeyboard();`;
  }

  codeFor_isKeyboardShown () {
    return `let isKeyboardShown = ${this.type}.getDriver().isKeyboardShown();`;
  }

  codeFor_pushFile (varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `${this.type}.getDriver().pushFile('${pathToInstallTo}', '${fileContentString}');`;
  }

  codeFor_pullFile (varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `let fileBase64 = ${this.type}.getDriver().pullFile('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let fileBase64 = ${this.type}.getDriver().pullFolder('${folderToPullFrom}');`;
  }

  codeFor_toggleAirplaneMode () {
    return `${this.type}.getDriver().toggleAirplaneMode();`;
  }

  codeFor_toggleData () {
    return `${this.type}.getDriver().toggleData();`;
  }

  codeFor_toggleWiFi () {
    return `${this.type}.getDriver().toggleWiFi();`;
  }

  codeFor_toggleLocationServices () {
    return `${this.type}.getDriver().toggleLocationServices();`;
  }

  codeFor_sendSMS (varNameIgnore, varIndexIgnore, phoneNumber, text) {
    return `${this.type}.getDriver().sendSms('${phoneNumber}', '${text}');`;
  }

  codeFor_gsmCall (varNameIgnore, varIndexIgnore, phoneNumber, action) {
    return `${this.type}.getDriver().gsmCall('${phoneNumber}', '${action}');`;
  }

  codeFor_gsmSignal (varNameIgnore, varIndexIgnore, signalStrength) {
    return `${this.type}.getDriver().gsmSignal(${signalStrength});`;
  }

  codeFor_gsmVoice (varNameIgnore, varIndexIgnore, state) {
    return `${this.type}.getDriver().gsmVoice('${state}');`;
  }

  codeFor_shake () {
    return `${this.type}.shake();`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `${this.type}.getDriver().lock(${seconds});`;
  }

  codeFor_unlock () {
    return `${this.type}.getDriver().unlock();`;
  }

  codeFor_isLocked () {
    return `let isLocked = ${this.type}.getDriver().isLocked();`;
  }

  codeFor_rotateDevice (varNameIgnore, varIndexIgnore, x, y, radius, rotation, touchCount, duration) {
    return `${this.type}.getDriver().rotateDevice({x: ${x}, y: ${y}, duration: ${duration}, radius: ${radius}, rotation: ${rotation}, touchCount: ${touchCount}});`;
  }

  codeFor_getPerformanceData (varNameIgnore, varIndexIgnore, packageName, dataType, dataReadTimeout) {
    return `let performanceData = ${this.type}.getDriver().getPerformanceData('${packageName}', '${dataType}', ${dataReadTimeout});`;
  }

  codeFor_getPerformanceDataTypes () {
    return `let supportedPerformanceDataTypes = ${this.type}.getDriver().getPerformanceDataTypes();`;
  }

  codeFor_touchId (varNameIgnore, varIndexIgnore, match) {
    return `${this.type}.getDriver().touchId(${match});`;
  }

  codeFor_toggleEnrollTouchId (varNameIgnore, varIndexIgnore, enroll) {
    return `${this.type}.getDriver().toggleEnrollTouchId(${enroll});`;
  }

  codeFor_openNotifications () {
    return `${this.type}.getDriver().openNotifications();`;
  }

  codeFor_getDeviceTime () {
    return `let time = ${this.type}.getDeviceTime();`;
  }

  codeFor_fingerprint (varNameIgnore, varIndexIgnore, fingerprintId) {
    return `${this.type}.getDriver().fingerPrint(${fingerprintId});`;
  }

  codeFor_getSession () {
    return `let caps = ${this.type}.getDriver().capabilities;`;
  }

  codeFor_setTimeouts (/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '/* TODO implement setTimeouts */';
  }

  codeFor_setCommandTimeout () {
    return `// Not supported: setCommandTimeout`;
  }

  codeFor_getOrientation () {
    return `let orientation = ${this.type}.getDriver().getOrientation();`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `${this.type}.getDriver().setOrientation("${orientation}");`;
  }

  codeFor_getGeoLocation () {
    return `let location = ${this.type}.getDriver().getGeoLocation();`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `${this.type}.getDriver().setGeoLocation({latitude: ${latitude}, longitude: ${longitude}, altitude: ${altitude}});`;
  }

  codeFor_getLogTypes () {
    return `let getLogTypes = ${this.type}.getDriver().getLogTypes();`;
  }

  codeFor_getLogs (varNameIgnore, varIndexIgnore, logType) {
    return `let logs = ${this.type}.getDriver().getLogs('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `${this.type}.getDriver().updateSettings(${settingsJson});`;
  }

  codeFor_getSettings () {
    return `let settings = ${this.type}.getDriver().getSettings();`;
  }
}

JsOxygenFramework.readableName = 'JS - Oxygen HQ';

export default JsOxygenFramework;
