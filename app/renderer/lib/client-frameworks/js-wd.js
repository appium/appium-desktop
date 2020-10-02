import Framework from './framework';

class JsWdFramework extends Framework {

  get language () {
    return 'js';
  }

  wrapWithBoilerplate (code) {
    let caps = JSON.stringify(this.caps);
    return `// Requires the admc/wd client library
// (npm install wd)
// Then paste this into a .js file and run with Node 7.6+

const wd = require('wd');
const driver = wd.promiseChainRemote("${this.serverUrl}");
const caps = ${caps};

async function main () {
  await driver.init(caps);
${this.indent(code, 2)}
  await driver.quit();
}

main().catch(console.log);
`;
  }

  codeFor_executeScript (/*varNameIgnore, varIndexIgnore, args*/) {
    return `/* TODO implement executeScript */`;
  }


  codeFor_findAndAssign (strategy, locator, localVar, isArray) {
    let suffixMap = {
      xpath: 'XPath',
      'accessibility id': 'AccessibilityId',
      'id': 'Id',
      'name': 'Name',
      'class name': 'ClassName',
      '-android uiautomator': 'AndroidUIAutomator',
      '-android datamatcher': 'AndroidDataMatcher',
      '-android viewtag': 'unsupported',
      '-ios predicate string': 'IosUIAutomation',
      '-ios class chain': 'IosClassChain',
    };
    if (!suffixMap[strategy]) {
      throw new Error(`Strategy ${strategy} can't be code-gened`);
    }
    if (isArray) {
      return `let ${localVar} = await driver.elementsBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    } else {
      return `let ${localVar} = await driver.elementBy${suffixMap[strategy]}(${JSON.stringify(locator)});`;
    }
  }

  codeFor_click (varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.click();`;
  }

  codeFor_clear (varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.clear();`;
  }

  codeFor_sendKeys (varName, varIndex, text) {
    return `await ${this.getVarName(varName, varIndex)}.sendKeys(${JSON.stringify(text)});`;
  }

  codeFor_back () {
    return `await driver.back();`;
  }

  codeFor_tap (varNameIgnore, varIndexIgnore, x, y) {
    return `await (new wd.TouchAction(driver))
  .tap({x: ${x}, y: ${y}})
  .perform()
    `;
  }

  codeFor_swipe (varNameIgnore, varIndexIgnore, x1, y1, x2, y2) {
    return `await (new wd.TouchAction(driver))
  .press({x: ${x1}, y: ${y1}})
  .moveTo({x: ${x2}, y: ${y2}})
  .release()
  .perform()
    `;
  }

  codeFor_getCurrentActivity () {
    return `let activityName = await driver.getCurrentActivity()`;
  }

  codeFor_getCurrentPackage () {
    return `let packageName = await driver.getCurrentPackage()`;
  }


  codeFor_installApp (varNameIgnore, varIndexIgnore, app) {
    return `let isAppInstalled = await driver.installApp('${app}');`;
  }

  codeFor_isAppInstalled (varNameIgnore, varIndexIgnore, app) {
    return `driver.isAppInstalled("${app}");`;
  }

  codeFor_launchApp () {
    return `await driver.launchApp();`;
  }

  codeFor_background (varNameIgnore, varIndexIgnore, timeout) {
    return `await driver.background(${timeout});`;
  }

  codeFor_closeApp () {
    return `await driver.closeApp();`;
  }

  codeFor_reset () {
    return `await driver.reset();`;
  }

  codeFor_removeApp (varNameIgnore, varIndexIgnore, app) {
    return `await driver.removeApp('${app}');`;
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
    return `let fileBase64 = await driver.pullFile('${pathToPullFrom}');`;
  }

  codeFor_pullFolder (varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let fileBase64 = await driver.pullFolder('${folderToPullFrom}');`;
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

  codeFor_sendSMS (varNameIgnore, varIndexIgnore, phoneNumber, text) {
    return `await driver.sendSms('${phoneNumber}', '${text}');`;
  }

  codeFor_gsmCall (varNameIgnore, varIndexIgnore, phoneNumber, action) {
    return `await driver.gsmCall('${phoneNumber}', '${action}');`;
  }

  codeFor_gsmSignal (varNameIgnore, varIndexIgnore, signalStrength) {
    return `await driver.gsmSignal(${signalStrength});`;
  }

  codeFor_gsmVoice (varNameIgnore, varIndexIgnore, state) {
    return `await driver.gsmVoice('${state}');`;
  }

  codeFor_shake () {
    return `await driver.shake();`;
  }

  codeFor_lock (varNameIgnore, varIndexIgnore, seconds) {
    return `await driver.lock(${seconds})`;
  }

  codeFor_unlock () {
    return `await driver.unlock()`;
  }

  codeFor_isLocked () {
    return `let isLocked = await driver.isLocked();`;
  }

  codeFor_rotateDevice (varNameIgnore, varIndexIgnore, x, y, radius, rotation, touchCount, duration) {
    return `driver.rotateDevice({x: ${x}, y: ${y}, duration: ${duration}, radius: ${radius}, rotation: ${rotation}, touchCount: ${touchCount}});`;
  }

  codeFor_getPerformanceData (varNameIgnore, varIndexIgnore, packageName, dataType, dataReadTimeout) {
    return `let performanceData = await driver.getPerformanceData('${packageName}', '${dataType}', ${dataReadTimeout});`;
  }

  codeFor_getPerformanceDataTypes () {
    return `let supportedPerformanceDataTypes = await driver.getPerformanceDataTypes();`;
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
    return `let caps = await driver.getSession();`;
  }

  codeFor_setTimeouts (/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '/* TODO implement setTimeouts */';
  }

  codeFor_getOrientation () {
    return `let orientation = await driver.getOrientation();`;
  }

  codeFor_setOrientation (varNameIgnore, varIndexIgnore, orientation) {
    return `await driver.setOrientation('${orientation}');`;
  }

  codeFor_getGeoLocation () {
    return `let location = await driver.getGeoLocation();`;
  }

  codeFor_setGeoLocation (varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `await driver.setGeoLocation(${latitude}, ${longitude}, ${altitude});`;
  }

  codeFor_getLogTypes () {
    return `let getLogTypes = await driver.getLogTypes();`;
  }

  codeFor_getLogs (varNameIgnore, varIndexIgnore, logType) {
    return `let logs = await driver.log('${logType}');`;
  }

  codeFor_updateSettings (varNameIgnore, varIndexIgnore, settingsJson) {
    return `await driver.updateSettings(${settingsJson});`;
  }

  codeFor_getSettings () {
    return `let settings = await driver.settings();`;
  }

  // Web

  codeFor_navigateTo (url) {
    return `driver.get('${url}');`;
  }

  codeFor_getUrl () {
    return `let current_url = driver.url();`;
  }

  codeFor_forward () {
    return `driver.forward();`;
  }

  codeFor_refresh () {
    return `driver.refresh();`;
  }

  // Context

  codeFor_getContext () {
    return `driver.currentContext();`;
  }

  codeFor_getContexts () {
    return `driver.contexts();`;
  }

  codeFor_switchContexts (name) {
    return `driver.context('${name}');`;
  }
}

JsWdFramework.readableName = 'JS - WD (Promise)';

export default JsWdFramework;
