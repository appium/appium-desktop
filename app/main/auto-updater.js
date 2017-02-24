import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow, Menu } from 'electron';
import log from 'electron-log';
import path from 'path';
const isDev = process.env.NODE_ENV === 'development';

// Singleton instance of updaterWindow
let updaterWin;

export function openUpdaterWindow (mainWindow) {
  // If we already opened the window, don't do anything
  if (updaterWin) {
    return;
  }

  // Create and open the Browser Window
  updaterWin = new BrowserWindow({
    width: 600, 
    height: 600, 
    title: "Update Available", 
    backgroundColor: "#f2f2f2", 
    webPreferences: {
      devTools: true
    }
  });

  let updaterHTMLPath = path.resolve(__dirname,  isDev ? '..' : 'app', 'renderer', 'index.html');
  // on Windows we'll get backslashes, but we don't want these for a browser URL, so replace
  updaterHTMLPath = updaterHTMLPath.replace("\\", "/");
  updaterHTMLPath += '#/updater';
  updaterWin.loadURL(`file://${updaterHTMLPath}`);
  updaterWin.show();

  // When the main window is closed, close the session window too
  updaterWin.once('closed', () => {
    updaterWin = null;
  });

  // If it's dev, go ahead and open up the dev tools automatically
  if (isDev) {
    updaterWin.openDevTools();
  }
  updaterWin.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click () {
        updaterWin.inspectElement(x, y);
      }
    }]).popup(updaterWin);
  });

  // If the main window closes, close the updater window too
  mainWindow.on('closed', updaterWin.close);

  updaterWin.on('closed', () => updaterWin = null);

  // Focus on this window
  updaterWin.focus();
}

export function forceCheckForUpdates (mainWindow) {
  openUpdaterWindow(mainWindow);
  autoUpdater.checkForUpdates();
}

export function initAutoUpdater (mainWindow) {
  // Mock auto updater. Used to aid development because testing using actual releases is super tedious.
  if (process.env.NODE_ENV === 'development') {
    let { forceFail, updateAvailable } = require('./mock-updater');
    if (process.env.MOCK_FAILED_UPDATE) {
      forceFail();
    }
    if (process.env.MOCK_AUTO_UPDATER) {
      updateAvailable();
    }
  }

  // We want the user to decide if they want to download the latest
  autoUpdater.autoDownload = false;

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";


  autoUpdater.on('update-not-available', () => {
    if (updaterWin) {
      updaterWin.webContents.send('update-not-available');
    }
  });

  autoUpdater.on('update-available', (updateInfo) => {
    log.info('Update is available');

    // If an update is available, force   
    openUpdaterWindow(mainWindow);

    ipcMain.on('update-info-request', (evt) => {
      evt.sender.send('update-info', updateInfo);
    });

    // If a download is requested, start the download and send progress along the way
    ipcMain.on('update-download-request', (evt) => {
      autoUpdater.downloadUpdate();

      autoUpdater.on('download-progress', (downloadProgress) => {
        evt.sender.send('download-progress', downloadProgress);
      });

      autoUpdater.on('update-downloaded', () => {
        evt.sender.send('update-download-complete');
      });

      autoUpdater.on('error', () => {
        log.info('Update error');
        evt.sender.send('update-error');
      });
    });

    // If user asks to quit and install, do so
    ipcMain.on('update-quit-and-install', () => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.checkForUpdates();
}