/* eslint-disable no-console */

import { ipcMain } from 'electron';
import { main as appiumServer } from 'appium';

var server = null;

function logHandler (win) {
  return (level, message) => {
    win.webContents.send('appium-log-line', level, message);
  };
}

function connectStartServer (win) {
  ipcMain.on('start-server', async (event, address, port) => {
    let args = {address, port};
    args.logHandler = logHandler(win);
    try {
      // set up the appium subprocess
      server = await appiumServer(args);
      win.webContents.send('appium-start-ok');
    } catch (e) {
      win.webContents.send('appium-start-error', e.message);
      try {
        await server.close();
      } catch (ign) {}
    }
  });
}

function connectStopServer (win) {
  ipcMain.on('stop-server', async () => {
    try {
      await server.close();
      win.webContents.send('appium-stop-ok');
    } catch (e) {
      win.webContents.send('appium-stop-error', e.message);
    }
  });
}

function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
}

export { initializeIpc };
