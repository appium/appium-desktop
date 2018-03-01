import log from 'electron-log';
import { ipcMain, BrowserWindow, Menu, autoUpdater } from 'electron';
import path from 'path';
import _ from 'lodash';
import { version } from '../../package.json';
import { getUpdate } from './auto-updater/update-checker';
import B from 'bluebird';
const isDev = process.env.NODE_ENV === 'development';

// Logs data to 
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('Auto updater starting');

// Mock auto updater. Used to aid development because testing using actual releases is super tedious.
if (process.env.NODE_ENV === 'development') {
  let {forceFail, updateAvailable} = require('./mock-updater');

  // Mock a failed update
  if (process.env.MOCK_FAILED_UPDATE) {
    forceFail();
  }

  // Mock update being made available
  if (process.env.MOCK_AUTO_UPDATER) {
    updateAvailable();
  }
} else {
  const checkVersion = process.env.FORCE_UPDATE ? 'v0.0.0' : version;
  // TODO: Make this import config getFeedUrl
  autoUpdater.setFeedURL(`https://hazel-server-cfuovrxdtd.now.sh/update/${process.platform}/${checkVersion}`);
}

class AutoUpdaterController {

  constructor () {
    this.updaterWin = null;
    this.state = {};

    autoUpdater.on('update-not-available', this.handleUpdateNotAvailable.bind(this));
    autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this));
    autoUpdater.on('checking-for-update', this.handleCheckingForUpdate.bind(this));
    autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this));
    autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this));
    autoUpdater.on('error', this.handleError.bind(this));

    ipcMain.on('update-state-request', (e) => e.sender.send('update-state-change', this.state));
    ipcMain.on('update-download', this.downloadUpdate.bind(this));
    ipcMain.on('update-quit-and-install', autoUpdater.quitAndInstall || _.noop);

  }

  setMainWindow (mainWindow) {
    this.mainWindow = mainWindow;
  }

  downloadUpdate () {
    this.updaterWin.setSize(500, 150);
    this.setState({
      // TODO: Change from 'downloadProgress' to 'isDownloading'
      downloadProgress: {
        percent: 0,
      },
    });

    // .checkForUpdates automatically downloads the update
    autoUpdater.checkForUpdates && autoUpdater.checkForUpdates();
  }

  handleUpdateAvailable (updateInfo) {
    log.info('Found update', updateInfo);

    // If window not open, open it to notify user
    this.openUpdaterWindow(this.mainWindow);
    this.forceFocus();
    this.setState({
      hasUpdateAvailable: true,
      updateInfo,
    });
  }

  handleUpdateNotAvailable () {
    log.info('No update available');
    this.setState({
      hasNoUpdateAvailable: true,
    });
  }

  handleCheckingForUpdate () {
    log.info('Looking for updates');
    this.setState({
      checkingForUpdate: true,
    });
  }

  // TODO: Get rid of this and replace with 'isDownloading'
  handleDownloadProgress (downloadProgress) {
    log.info('Downloading...', downloadProgress);
    this.setState({
      downloadProgress
    });
  }

  handleUpdateDownloaded (updateInfo) {
    log.info('Download complete', updateInfo);
    // Focus on window when the download is done to get the user's attention
    this.forceFocus();
    this.setState({
      updateDownloaded: true,
      updateInfo,
    });
  }

  handleError (error) {
    log.info('Updater error occurred', error);
    this.updaterWin.setSize(500, 125);
    this.setState({
      error,
    });
  }

  forceFocus () {
    if (this.updaterWin) {
      this.updaterWin.focus();
    }
  }

  async checkForUpdates () {
    try {
      this.setState({
        isCheckingForUpdates: true,
      });
      const updateInfo = await getUpdate('0.0.0');
      if (updateInfo) {
        autoUpdater.emit('update-available', updateInfo);
      } else {
        autoUpdater.emit('update-not-available');
      }
    } catch (e) {
      this.setState({
        unsupported: true,
      });
    }
  }

  /**
   * Update the state of the autoUpdater and send that state to the
   * updater window
   */
  setState (newState) {
    this.state = {...newState};
    if (this.updaterWin) {
      this.updaterWin.send('update-state-change', this.state);
    }
  }

  /**
   * Opens a browser window that shows the state of the updates in a UI
   */
  openUpdaterWindow (mainWindow) {
    // If we already opened the window, don't do anything
    let updaterWin = this.updaterWin;
    if (updaterWin) {
      return;
    }

    // Create and open the Browser Window
    this.updaterWin = updaterWin = new BrowserWindow({
      width: 550, 
      height: 250, 
      title: "Update Available", 
      backgroundColor: "#f2f2f2", 
      webPreferences: {
        devTools: true
      },
      resizable: false,
    });

    let updaterHTMLPath = path.resolve(__dirname,  isDev ? '..' : 'app', 'renderer', 'index.html');
    // on Windows we'll get backslashes, but we don't want these for a browser URL, so replace
    updaterHTMLPath = updaterHTMLPath.replace("\\", "/");
    updaterHTMLPath += '#/updater';
    updaterWin.loadURL(`file://${updaterHTMLPath}`);
    updaterWin.show();

    // When the main window is closed, close the session window too
    updaterWin.once('closed', () => {
      this.updaterWin = null;
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
  }
}

let autoUpdaterInstance = new AutoUpdaterController();
export default autoUpdaterInstance;
