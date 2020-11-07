import { DOMParser } from 'xmldom';
import xpath from 'xpath';

export function parseCoordinates (element) {
  let {bounds, x, y, width, height} = element.attributes || {};

  if (bounds) {
    let boundsArray = bounds.split(/\[|\]|,/).filter((str) => str !== '');
    return {x1: boundsArray[0], y1: boundsArray[1], x2: boundsArray[2], y2: boundsArray[3]};
  } else if (x) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    width = parseInt(width, 10);
    height = parseInt(height, 10);
    return {x1: x, y1: y, x2: x + width, y2: y + height};
  } else {
    return {};
  }
}

export function isUnique (attrName, attrValue, sourceXML) {
  // If no sourceXML provided, assume it's unique
  if (!sourceXML) {
    return true;
  }
  const doc = new DOMParser().parseFromString(sourceXML);
  return xpath.select(`//*[@${attrName}="${attrValue.replace(/"/g, '')}"]`, doc).length < 2;
}

// Map of the optimal strategies.
const STRATEGY_MAPPINGS = [
  ['name', 'accessibility id'],
  ['content-desc', 'accessibility id'],
  ['id', 'id'],
  ['rntestid', 'id'],
  ['resource-id', 'id'],
];

export function getLocators (attributes, sourceXML) {
  const res = {};
  for (let [strategyAlias, strategy] of STRATEGY_MAPPINGS) {
    const value = attributes[strategyAlias];
    if (value && isUnique(strategyAlias, value, sourceXML)) {
      res[strategy] = attributes[strategyAlias];
    }
  }
  return res;
}

export const SCREENSHOT_INTERACTION_MODE = {
  SELECT: 'select',
  SWIPE: 'swipe',
  TAP: 'tap',
};

export const APP_MODE = {
  NATIVE: 'native',
  WEB_HYBRID: 'web_hybrid',
};

export const actionArgTypes = {
  STRING: 'string',
  NUMBER: 'number',
};

const { STRING, NUMBER } = actionArgTypes;

// Note: When adding or removing actionDefinitions, update `en/translation.json`
export const actionDefinitions = {
  'Device': {
    'Execute Mobile': {
      'Execute': {methodName: 'executeScript', args: [['command', STRING], ['jsonArgument', STRING]]}
    },
    'Android Activity': {
      'Start Activity': {methodName: 'startActivity', args: [
        ['appPackage', STRING], ['appActivity', STRING], ['appWaitPackage', STRING],
        ['intentAction', STRING], ['intentCategory', STRING], ['intentFlags', STRING],
        ['optionalIntentArguments', STRING], ['dontStopAppOnReset', STRING],
      ], refresh: true},
      'Current Activity': {methodName: 'getCurrentActivity'},
      'Current Package': {methodName: 'getCurrentPackage'},
    },
    'App': {
      'Install App': {methodName: 'installApp', args: [['appPathOrUrl', STRING]]},
      'Is App Installed': {methodName: 'isAppInstalled', args: [['appId', STRING]]},
      'Launch App': {methodName: 'launchApp', refresh: true},
      'Background App': {methodName: 'background', args: [['timeout', NUMBER]], refresh: true},
      'Close App': {methodName: 'closeApp', refresh: true},
      'Reset App': {methodName: 'reset', refresh: true},
      'Remove App': {methodName: 'removeApp', args: [['bundleId', STRING]]},
      'Get App Strings': {methodName: 'getStrings', args: [['language', STRING], ['stringFile', STRING]], refresh: true},
    },
    'Clipboard': {
      'Get Clipboard': {methodName: 'getClipboard'},
      'Set Clipboard': {methodName: 'setClipboard', args: [['clipboardText', STRING]]},
    },
    'File': {
      'Push File': {methodName: 'pushFile', args: [['pathToInstallTo', STRING], ['fileContentString', STRING]]},
      'Pull File': {methodName: 'pullFile', args: [['pathToPullFrom', STRING]]},
      'Pull Folder': {methodName: 'pullFolder', args: [['folderToPullFrom', STRING]]},
    },
    'Interaction': {
      'Shake': {methodName: 'shake'},
      'Lock': {methodName: 'lock', args: [['seconds', NUMBER]], refresh: true},
      'Unlock': {methodName: 'unlock', refresh: true},
      'Is Device Locked': {methodName: 'isLocked'},
      'Rotate Device': {methodName: 'rotateDevice', args: [
        ['x', NUMBER], ['y', NUMBER], ['radius', NUMBER], ['rotatation', NUMBER], ['touchCount', NUMBER], ['duration', NUMBER]
      ], refresh: true},
    },
    'Keys': {
      'Press Key': {methodName: 'pressKeyCode', args: [['keyCode', NUMBER], ['metaState', NUMBER], ['flags', NUMBER]], refresh: true},
      'Long Press Key': {methodName: 'longPressKeyCode', args: [['keyCode', NUMBER], ['metaState', NUMBER], ['flags', NUMBER]], refresh: true},
      'Hide Keyboard': {methodName: 'hideKeyboard', refresh: true},
      'Is Keyboard Shown': {methodName: 'isKeyboardShown'},
    },
    'Network': {
      'Toggle Airplane Mode': {methodName: 'toggleAirplaneMode'},
      'Toggle Data': {methodName: 'toggleData'},
      'Toggle WiFi': {methodName: 'toggleWiFi'},
      'Toggle Location Services': {methodName: 'toggleLocationServices'},
      'Send SMS': {methodName: 'sendSMS', args: [['phoneNumber', STRING], ['text', STRING]]},
      'GSM Call': {methodName: 'gsmCall', args: [['phoneNumber', STRING], ['action', STRING]]},
      'GSM Signal': {methodName: 'gsmSignal', args: [['signalStrengh', NUMBER]]},
      'GSM Voice': {methodName: 'gsmVoice', args: [['state', STRING]]},
    },
    'Performance Data': {
      'Get Data': {methodName: 'getPerformanceData', args: [['packageName', STRING], ['dataType', STRING], ['dataReadTimeout', NUMBER]]},
      'Get Data Types': {methodName: 'getPerformanceDataTypes'},
    },
    'iOS Simulator': {
      'Perform Touch Id': {methodName: 'touchId', args: [['match', STRING]], refresh: true},
      'Toggle Touch Id Enrollment': {methodName: 'toggleEnrollTouchId', args: [['enroll', STRING]]},
    },
    'System': {
      'Open Notifications': {methodName: 'openNotifications', refresh: true},
      'Get System Time': {methodName: 'getDeviceTime'},
      'Fingerprint (Android)': {methodName: 'fingerprint', args: [['fingerPrintId', NUMBER]], refresh: true}
    },
  },
  'Session': {
    'Session Capabilities': {
      'Get Session Capabilities': {methodName: 'getSession'}
    },
    'Timeouts': {
      'Set Timeouts': {methodName: 'setTimeouts', args: [['timeoutsJson', STRING]]},
    },
    'Orientation': {
      'Get Orientation': {methodName: 'getOrientation'},
      'Set Orientation': {methodName: 'setOrientation', args: [['orientation', STRING]], refresh: true},
    },
    'Geolocation': {
      'Get Geolocation': {methodName: 'getGeoLocation'},
      'Set Geolocation': {methodName: 'setGeoLocation', args: [['latitude', NUMBER], ['longitude', NUMBER], ['altitude', NUMBER]]},
    },
    'Logs': {
      'Get Log Types': {methodName: 'getLogTypes'},
      'Get Logs': {methodName: 'getLogs', args: [['logType', STRING]]},
    },
    'Settings': {
      'Update Settings': {methodName: 'updateSettings', args: [['settingsJson', STRING]]},
      'Get Device Settings': {methodName: 'getSettings'},
    },
  },
  'Web': {
    'Navigation': {
      'Go to URL': {methodName: 'navigateTo', args: [['url', STRING]], refresh: true},
      'Get URL': {methodName: 'getUrl'},
      'Back': {methodName: 'back', refresh: true},
      'Forward': {methodName: 'forward', refresh: true},
      'Refresh': {methodName: 'refresh', refresh: true}
    }
  },
  'Context': {
    'Context': {
      'Get Context': {methodName: 'getContext'},
      'Get All Context': {methodName: 'getContexts'},
      'Set Context': {methodName: 'switchContexts', args: [['name', STRING]], refresh: true}
    },
    'Window (W3C)': {
      'Get Window Handle': {methodName: 'getWindowHandle'},
      'Close Window': {methodName: 'closeWindow', refresh: true},
      'Switch To Window': {methodName: 'switchToWindow', args: [['handle', STRING]], refresh: true},
      'Get Window Handles': {methodName: 'getWindowHandles'},
      'New Window': {methodName: 'createWindow', args: [['type', STRING]], refresh: true}
    }
  }
};

export const INTERACTION_MODE = {
  SOURCE: 'source',
  ACTIONS: 'actions',
};
