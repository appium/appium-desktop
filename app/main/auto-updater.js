import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import packageJSON from '../../package.json';

function connectAutoUpdater (win) {

  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";

  // Autoupdater only works in binaries. Don't do anything 
  try {
    autoUpdater.checkForUpdates();
    log.info(`Looking for updates. Current version is ${packageJSON.version}`);
  } catch (e) {
    return;
  }

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for an update!');
    win.webContents.send('checking-for-update');
  });

  autoUpdater.on('update-not-available', () => {
    log.info('Update is not available');
    win.webContents.send('update-not-available');
  });

  autoUpdater.on('update-available', () => {
    log.info('Update is available');
    win.webContents.send('update-available');
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded');
    win.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', () => {
    log.info('Update error');
    win.webContents.send('update-error');
  });
}

export { connectAutoUpdater };