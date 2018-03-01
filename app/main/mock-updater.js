import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import { getUpdate } from './auto-updater/update-checker';
import B from 'bluebird';

let fail, update, updateDone = false;

autoUpdater.checkForUpdates = async () => {
  if (update && !updateDone) {
    autoUpdater.emit('update-available', await getUpdate('0.0.0'));
  } else {
    await B.delay(5000);
    autoUpdater.emit('update-not-available');
  }
};

autoUpdater.downloadUpdate = async () => {
  let progress = {
    bytesPerSecond: 100000,
    percent: 0,
    total: 10000000,
    transferred: 1000000,
  };

  while (progress.percent <= 100) {
    await B.delay(2000);
    autoUpdater.emit('download-progress', progress);
    if (fail && progress.percent > 50) {
      return autoUpdater.emit('error', new Error('An error occurred'));
    }
    progress.bytesPerSecond += (Math.random() * 50) - 24.999999999;
    progress.percent += 19.999991;
    progress.total = 499.999999999 * 1000000;
    progress.transferred += 100.0000000001 * 1000000;
  }
  updateDone = true;
  autoUpdater.emit('update-downloaded');
};

autoUpdater.quitAndInstall = () => {
  app.quit();
};

export function forceFail () {
  fail = true;
}

export function updateAvailable () {
  update = true;
}