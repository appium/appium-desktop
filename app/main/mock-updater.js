import { autoUpdater } from 'electron-updater';
import B from 'bluebird';

console.log('!!!overriding update check');
autoUpdater.checkForUpdates = async () => {
  console.log('!!!checking for updates now');
  await B.delay(2000);
  autoUpdater.emit('update-available', true);
};