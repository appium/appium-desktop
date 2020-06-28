import { BrowserWindow, Menu } from 'electron';
import settings from '../shared/settings';
import path from 'path';
import i18n from '../configs/i18next.config';

const isDev = process.env.NODE_ENV === 'development';

export function openBrowserWindow (route, opts) {
  const defaultOpts = {
    width: 1080,
    minWidth: 1080,
    height: 570,
    minHeight: 570,
    backgroundColor: '#f2f2f2',
    frame: 'customButtonsOnHover',
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    },
  };

  let win = new BrowserWindow({
    ...defaultOpts,
    ...opts,
  });

  let htmlPath = path.resolve(__dirname, 'index.html');

  // on Windows we'll get backslashes, but we don't want these for a browser URL, so replace
  htmlPath = htmlPath.replace('\\', '/');
  htmlPath += `#/${route}`;
  win.loadURL(`file://${htmlPath}`);
  win.show();

  // If it's dev, go ahead and open up the dev tools automatically
  if (isDev) {
    win.openDevTools();
  }

  // Make 'devTools' available on right click
  win.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    Menu.buildFromTemplate([{
      label: i18n.t('Inspect element'),
      click () {
        win.inspectElement(x, y);
      }
    }]).popup(win);
  });

  return win;
}


// Sets the environment variables to a combination of process.env and whatever
// the user saved
export async function setSavedEnv () {
  const savedEnv = await settings.get('ENV');
  process.env = {
    ...process.env,
    ...savedEnv || {},
  };
}

/**
 * JS code that is executed in the webview to determine the status+address bar height
 */
export function getWebviewStatusAddressBarHeight ({statBarHeight}) {
  // Calculate the status + address bar height
  // Address bar height for iOS 11+ is 50, for lower it is 44,
  // but we take 50 as a default here
  // For Chrome it is 56 for Android 6 to 10
  const screenHeight = window.screen.height;
  const viewportHeight = window.innerHeight;
  // Need to determine this later for Chrome
  const osAddressBarDefaultHeight = 50;
  const addressToolBarHeight = screenHeight - viewportHeight - statBarHeight;
  // When a manual scroll has been executed for iOS and Android
  // the address bar becomes smaller
  const addressBarHeight = (addressToolBarHeight >= 0) && (addressToolBarHeight - osAddressBarDefaultHeight) < 0
    ? addressToolBarHeight : osAddressBarDefaultHeight;

  return statBarHeight + addressBarHeight;
}

/**
 * JS code that is executed in the webview to set the needed attributes on the DOM so the source can be used for the
 * native inspector window.
 */
export function setHtmlElementAttributes ({webviewStatusAddressBarHeight}) {
  const htmlElements = document.body.getElementsByTagName('*');

  Array.from(htmlElements).forEach((el) => {
    const rect = el.getBoundingClientRect();
    el.setAttribute('width', Math.round(rect.width));
    el.setAttribute('height', Math.round(rect.height));
    el.setAttribute('x', Math.round(rect.left));
    el.setAttribute('y', Math.round(rect.top + webviewStatusAddressBarHeight));
  });
}
