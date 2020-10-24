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
    width: isDev ? 1200 : 650,
    height: 600,
    minWidth: 650,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  setupMainWindow({
    mainWindow,
    mainUrl: `file://${__dirname}/index.html`,
    isDev,
    Menu,
    i18n,
    rebuildMenus,
    settings,
    webContents
  });
});
