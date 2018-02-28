import log from 'electron-log';
import { ipcMain, BrowserWindow, Menu, autoUpdater, app } from 'electron';
import path from 'path';
import _ from 'lodash';
import request from 'request-promise';
import { version } from '../../package.json';
import settings from '../settings';
import B from 'bluebird';
const isDev = process.env.NODE_ENV === 'development';

// Get server and feed url
const server = `https://hazel-server-cfuovrxdtd.now.sh/`;
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
autoUpdater.setFeedURL(feed);

// Logs data to 
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;
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
}

class AutoUpdaterController {

  constructor () {
    this.updaterWin = null;
    this.state = {};

    autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this));
    autoUpdater.on('update-not-available', this.handleUpdateNotAvailable.bind(this));
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
      downloadProgress: {
        percent: 0,
      },
    });
    autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
  }

  async handleUpdateAvailable (updateInfo) {
    log.info('Found update', updateInfo);
    let releaseNotes;
    try {
      let url = `https://api.github.com/repos/appium/appium-desktop/releases/tags/v${version}`;
      let userAgent = 'appium-desktop';
      releaseNotes = JSON.parse(await request({url, headers: {'User-Agent': userAgent}})).body;
    } catch (ign) { }
    // If window not open, open it to notify user
    this.openUpdaterWindow(this.mainWindow);
    this.forceFocus();
    this.setState({
      hasUpdateAvailable: true,
      updateInfo,
      releaseNotes,
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
    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const SQUIRREL_FIRST_RUN = 'SQUIRREL_FIRST_RUN';

    // Only check for updates on Mac and Windows (auto update not supported in linux)
    if (isMac || isWin) {
      log.info('Checking for updates');

      // squirrel.windows needs time to initialize the first time it's run (https://github.com/electron/electron/issues/4306)
      // if it's a first run, give it a long time (20 seconds) to let squirrel.windows initialize before checking for updates
      if (isWin && !await settings.get(SQUIRREL_FIRST_RUN)) {
        await B.delay(20000);
        await settings.set(SQUIRREL_FIRST_RUN, true);
      }
      this.setState({
        isCheckingForUpdates: true,
      });
      autoUpdater.checkForUpdates();
    } else {
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
