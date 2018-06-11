/**
 * Auto Updater
 * 
 * Similar to https://electronjs.org/docs/api/auto-updater#events
 * See https://electronjs.org/docs/tutorial/updates for documentation
 */
import { app, autoUpdater, dialog } from 'electron';
import moment from 'moment';
import B from 'bluebird';
import { checkUpdate } from './update-checker';
import { getFeedUrl } from './config';
import _ from 'lodash';
import env from '../../env';

const isDev = process.env.NODE_ENV === 'development';
  
let checkNewUpdates = _.noop;

if (!isDev) {

  autoUpdater.setFeedURL(getFeedUrl(app.getVersion()));

  /** 
   * Check for new updates
   */
  checkNewUpdates = async function (fromMenu) {
    // autoupdate.checkForUpdates always downloads updates immediately 
    // This method (getUpdate) let's us take a peek to see if there is an update 
    // available before calling .checkForUpdates
    const update = await checkUpdate(app.getVersion());
    if (update) {
      let {name, notes, pub_date:pubDate} = update;
      pubDate = moment(pubDate).format('MMM Do YYYY, h:mma');

      let detail = `Release Date: ${pubDate}\n\nRelease Notes: ${notes.replace("*", "\n*")}`;
      if (env.NO_AUTO_UPDATE) {
        detail += `\n\nhttps://www.github.com/appium/appium-desktop/releases/latest`;
      }


      // Ask user if they wish to install now or later
      if (!process.env.RUNNING_IN_SPECTRON) {
        dialog.showMessageBox({
          type: 'info',
          buttons: env.NO_AUTO_UPDATE ? ['Ok'] : ['Install Now', 'Install Later'],
          message: `Appium Desktop ${name} is available`,
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
      buttons: ['Ok'],
      message: 'Update Download Started',
      detail: 'Update is being downloaded now. You will be notified again when it is complete',
    });
  });

  // Handle the unusual case where we checked the updates endpoint, found an update
  // but then after calling 'checkForUpdates', nothing was there
  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Ok'],
      message: 'No update available',
      detail: 'Appium Desktop is up-to-date',
    });
  });

  // When it's done, ask if user want to restart now or later
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart Now', 'Later'],
      message: 'Update Downloaded',
      detail: `Appium Desktop ${releaseName} has been downloaded. ` +
        `Must restart to apply the updates ` +
        `(note: it may take several minutes for Appium Desktop to install and restart)`,
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
      message: 'Could not download update',
      detail: `Failed to download update. Reason: ${message}`,
    });
  });

}

export { checkNewUpdates };
