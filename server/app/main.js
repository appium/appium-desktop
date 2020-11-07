import i18n from './configs/i18next.config';
import { app, BrowserWindow, Menu, webContents } from 'electron';
import { initializeIpc } from './main/appium';
import { setSavedEnv } from './main/helpers';
import { installExtensions } from '../../shared/debug';
import { rebuildMenus } from './main/menus';
import { setupMainWindow } from '../../shared/windows';
import shellEnv from 'shell-env';
import fixPath from 'fix-path';
import settings from './shared/settings';

let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('electron-debug')(); // eslint-disable-line global-require
}

if (!isDev) {
  // if we're running from the app package, we won't have access to env vars
  // normally loaded in a shell, so work around with the shell-env module
  const decoratedEnv = shellEnv.sync();
  process.env = {...process.env, ...decoratedEnv};

  // and we need to do the same thing with PATH
  fixPath();
}
setSavedEnv();

app.on('window-all-closed', () => {
  app.quit();
});


app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: isDev ? 1200 : 650,
    height: 600,
    minWidth: 650,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const splashWindow = new BrowserWindow({
    width: 300,
    height: 300,
    minWidth: 300,
    minHeight: 300,
    frame: false,
  });

  setupMainWindow({
    mainWindow,
    mainUrl: `file://${__dirname}/index.html`,
    splashWindow,
    splashUrl: `file://${__dirname}/splash.html`,
    isDev,
    Menu,
    i18n,
    rebuildMenus,
    settings,
    webContents
  });

  initializeIpc(mainWindow);
});
