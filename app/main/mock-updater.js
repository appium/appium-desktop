import { autoUpdater } from 'electron-updater';
import B from 'bluebird';

autoUpdater.checkForUpdates = async () => {
  await B.delay(2000);
  autoUpdater.emit('update-available', {
    version: 'v0.0.0',
    releaseDate: 'July 24th, 1985',
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
};

autoUpdater.downloadUpdate = async () => {
  let progress = {
    bytesPerSecond: 1000,
    percent: 0,
    total: 1,
    transferred: 1,
  };

  while (progress.percent <= 100) {
    autoUpdater.emit('download-progress', progress);
    await B.delay(1000);
    progress.bytesPerSecond += (Math.random() * 50) - 25;
    progress.percent += 20;
    progress.total += 100;
    progress.transferred += 100;
  }

  autoUpdater.emit('update-downloaded');
};