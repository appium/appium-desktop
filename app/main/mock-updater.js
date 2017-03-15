import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import B from 'bluebird';

let fail, update, updateDone = false;

autoUpdater.checkForUpdates = async () => {
  if (update && !updateDone) {
    await B.delay(Math.random() * 10000);
    autoUpdater.emit('update-available', {
      version: 'v0.0.0',
      releaseDate: 'July 24th, 1985 asdfasdf asdfafds asdf  asdf  asfd asadfasd as dff',
      releaseNotes: `
          1. Feature 1
          2. Feature 2
          3. Feature 3
          4. Feature 4
          5. Feature 5
          6. Feature 6
          7. Feature 7
      `,
    });
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