import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export function getAutoUpdaterFeedUrl (version, baseFeedUrl) {
  let platform = process.platform;
  if (platform.toLowerCase() === 'linux') {
    platform = 'AppImage';
  }
  return `${baseFeedUrl}/update/${platform}/${version}`;
}

export async function checkUpdate ({request, getFeedUrl, semver, currentVersion}) {
  try {
    // The response is like (macOS):
    // {  "name":"v1.15.0-1",
    //    "notes":"* Bump up Appium to v1.15.0",
    //    "pub_date":"2019-10-04T04:40:37Z",
    //    "url":"https://github.com/appium/appium-desktop/releases/download/v1.15.0-1/Appium-1.15.0-1-mac.zip"}
    const res = await request.get(getFeedUrl(currentVersion));
    if (res) {
      const j = JSON.parse(res);
      if (semver.lt(currentVersion, j.name)) {
        return j;
      }
    }
  } catch (ign) { }

  return false;
}

export function setUpAutoUpdater ({
  request,
  getFeedUrl,
  semver,
  autoUpdater,
  app,
  moment,
  i18n,
  env,
  dialog,
  B
}) {
  autoUpdater.setFeedURL(getFeedUrl(app.getVersion()));

  /**
   * Check for new updates
   */
  const checkNewUpdates = async function (fromMenu) {
    // autoupdate.checkForUpdates always downloads updates immediately
    // This method (getUpdate) let's us take a peek to see if there is an update
    // available before calling .checkForUpdates
    if (process.env.RUNNING_IN_SPECTRON) {
      return;
    }
    const update = await checkUpdate({request, getFeedUrl, semver, currentVersion: app.getVersion()});
    if (update) {
      let {name, notes, pub_date: pubDate} = update;
      pubDate = moment(pubDate).format(i18n.t('datetimeFormat'));

      let detail = i18n.t('updateDetails', {pubDate, notes: notes.replace('*', '\n*')});
      if (env.NO_AUTO_UPDATE) {
        detail += `\n\nhttps://www.github.com/appium/appium-desktop/releases/latest`;
      }


      // Ask user if they wish to install now or later
      if (!process.env.RUNNING_IN_SPECTRON) {
        dialog.showMessageBox({
          type: 'info',
          buttons: env.NO_AUTO_UPDATE
            ? [i18n.t('OK')]
            : [i18n.t('Install Now'), i18n.t('Install Later')],
          message: i18n.t('appiumIsAvailable', {name}),
          detail,
        }, (response) => {
          if (response === 0) {
            // If they say yes, get the updates now
            if (!env.NO_AUTO_UPDATE) {
              autoUpdater.checkForUpdates();
            }
          }
        });
      }
    } else {
      if (fromMenu) {
        autoUpdater.emit('update-not-available');
      } else {
        // If no updates found check for updates every hour
        await B.delay(60 * 60 * 1000);
        checkNewUpdates();
      }
    }
  };

  // Inform user when the download is starting and that they'll be notified again when it is complete
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      buttons: [i18n.t('OK')],
      message: i18n.t('Update Download Started'),
      detail: i18n.t('updateIsBeingDownloaded'),
    });
  });

  // Handle the unusual case where we checked the updates endpoint, found an update
  // but then after calling 'checkForUpdates', nothing was there
  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      type: 'info',
      buttons: [i18n.t('OK')],
      message: i18n.t('No update available'),
      detail: i18n.t('Appium Desktop is up-to-date'),
    });
  });

  // When it's done, ask if user want to restart now or later
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    dialog.showMessageBox({
      type: 'info',
      buttons: [i18n.t('Restart Now'), i18n.t('Later')],
      message: i18n.t('Update Downloaded'),
      detail: i18n.t('updateIsDownloaded', {releaseName}),
    }, (response) => {
      // If they say yes, restart now
      if (response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Handle error case
  autoUpdater.on('error', (message) => {
    dialog.showMessageBox({
      type: 'error',
      message: i18n.t('Could not download update'),
      detail: i18n.t('updateDownloadFailed', {message}),
    });
  });

  return checkNewUpdates;
}

export function makeOpenBrowserWindow ({BrowserWindow, Menu, i18n}) {
  return (route, opts) => {
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
  };
}


// Sets the environment variables to a combination of process.env and whatever
// the user saved
export function makeSetSavedEnv (settings) {
  return async () => {
    const savedEnv = await settings.get('ENV');
    process.env = {
      ...process.env,
      ...savedEnv || {},
    };
  };
}
