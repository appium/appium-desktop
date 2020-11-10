import i18n from './configs/i18next.config';
import { app, BrowserWindow, Menu, webContents } from 'electron';
import { installExtensions } from '../../shared/debug';
import { setupMainWindow } from '../../shared/windows';
import { rebuildMenus } from './main/menus';
import settings from './shared/settings';

let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  app.quit();
});


app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    titleBarStyle: 'hiddenInset',
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
    splashWindow,
    mainUrl: `file://${__dirname}/index.html`,
    splashUrl: `file://${__dirname}/splash.html`,
    isDev,
    Menu,
    i18n,
    rebuildMenus,
    settings,
    webContents
  });
});
