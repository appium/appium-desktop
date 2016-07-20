/* eslint-disable no-console */

import { ipcMain } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs } from 'appium/build/lib/parser';

var server = null;

function logHandler (win) {
  return (level, message) => {
    win.webContents.send('appium-log-line', level, message);
  };
}

function connectStartServer (win) {
  ipcMain.on('start-server', async (event, args) => {
    // clean up args object for appium log purposes (so it doesn't show in
    // non-default args list
    if (args.defaultCapabilities &&
        Object.keys(args.defaultCapabilities).length === 0) {
      delete args.defaultCapabilities;
    }
    args.logHandler = logHandler(win);
    // make sure if the server barfs on startup, it throws an error rather
    // than the typical behavior, which is process.exit o_O
    args.throwInsteadOfExit = true;
    try {
      // set up the appium server running in this thread
      server = await appiumServer(args, true);
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

function connectGetDefaultArgs () {
  ipcMain.on('get-default-args', (evt) => {
    evt.returnValue = getDefaultArgs();
  });
}

function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
  connectGetDefaultArgs(win);
}

export { initializeIpc };
