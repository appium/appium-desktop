import {BrowserWindow, Menu} from 'electron';
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
