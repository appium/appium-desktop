import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow, Menu } from 'electron';
import log from 'electron-log';
import path from 'path';
import B from 'bluebird';
const isDev = process.env.NODE_ENV === 'development';

// Mock auto updater. Used to aid development because testing using actual releases is super tedious.
if (process.env.NODE_ENV === 'development' && process.env.MOCK_AUTO_UPDATER) {
  let { forceFail } = require('./mock-updater');
  if (process.env.MOCK_FAILED_UPDATE) {
    forceFail();
  }
}

function openUpdaterWindow () {
  // Create and open the Browser Window
  let updaterWin = new BrowserWindow({
    width: 600, 
    height: 600, 
    title: "Update Available", 
    backgroundColor: "#f2f2f2", 
    webPreferences: {
      devTools: true
    }
  });

  // note that __dirname changes based on whether we're in dev or prod;
  // in dev it's the actual dirname of the file, in prod it's the root
  // of the project (where main.js is built), so switch accordingly
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

  return updaterWin;
}

function startAutoUpdater () {

  // We want the user to decide if they want to download the latest
  autoUpdater.autoDownload = false;

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";

  autoUpdater.on('update-not-available', () => {
    log.info('Update is not available');
  });

  autoUpdater.on('update-available', async (updateInfo) => {
    log.info('Update is available');
    await B.delay(3000); // Give the main window time to open BEFORE the update window
    openUpdaterWindow();
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

    ipcMain.on('update-quit-and-install', () => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.checkForUpdates();
}

export { startAutoUpdater };