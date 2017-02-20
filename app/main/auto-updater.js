import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

function connectAutoUpdater (win) {

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";

  console.log('Looking for updates');
  autoUpdater.checkForUpdates();

  autoUpdater.on('checking-for-update', function () {
    console.log('Checking for an update!');
    win.webContents.send('checking-for-update');
  });

  autoUpdater.on('update-not-available', function () {
    console.log('Update is available');
    win.webContents.send('update-not-available');
  });

  autoUpdater.on('update-available', function () {
    console.log('Update is available');
    win.webContents.send('update-available');
  });
}

export { connectAutoUpdater };