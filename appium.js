/* eslint-disable no-console */

import { ipcMain, BrowserWindow, Menu } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs, getParser } from 'appium/build/lib/parser';
import path from 'path';
const webdriverio = require('webdriverio');

const LOG_SEND_INTERVAL_MS = 250;
const isDev = process.env.NODE_ENV === 'development';

var server = null;
var serverArgs = null;
var logWatcher = null;
var batchedLogs = [];
let sessionWin = null;

function connectStartServer (win) {
  ipcMain.on('start-server', async (event, args) => {
    // clean up args object for appium log purposes (so it doesn't show in
    // non-default args list
    if (args.defaultCapabilities &&
        Object.keys(args.defaultCapabilities).length === 0) {
      delete args.defaultCapabilities;
    }
    args.logHandler = (level, msg) => {
      batchedLogs.push({level, msg});
    };
    // make sure if the server barfs on startup, it throws an error rather
    // than the typical behavior, which is process.exit o_O
    args.throwInsteadOfExit = true;

    // set up our log watcher
    logWatcher = setInterval(() => {
      if (batchedLogs.length) {
        win.webContents.send('appium-log-line', batchedLogs);
        batchedLogs = [];
      }
    }, LOG_SEND_INTERVAL_MS);

    try {
      // set up the appium server running in this thread
      serverArgs = args;
      server = await appiumServer(serverArgs, true);
      win.webContents.send('appium-start-ok');
    } catch (e) {
      win.webContents.send('appium-start-error', e.message);
      try {
        await server.close();
      } catch (ign) {}
      clearInterval(logWatcher);
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
    clearInterval(logWatcher);
  });
}

function connectGetDefaultArgs () {

  ipcMain.on('get-default-args', (evt) => {
    evt.returnValue = getDefaultArgs();
  });

  ipcMain.on('get-args-metadata', (evt) => {
    let defArgs = Object.keys(getDefaultArgs());
    evt.returnValue = getParser().rawArgs
                        .filter((a) => defArgs.indexOf(a[1].dest) !== -1)
                        .map((a) => a[1]);
  });
}

function connectStartSession (win) {
  ipcMain.on('start-session', () => {
    sessionWin = new BrowserWindow({width: 800, height: 600, webPreferences: {devTools: true}});
    let sessionHTMLPath = path.resolve(__dirname, 'app', 'index.html#/session');
    sessionWin.loadURL(`file://${sessionHTMLPath}`);
    sessionWin.show();
    sessionWin.on('closed', () => {
      sessionWin = null;
    });

    sessionWin.on('closed', () => {
      sessionWin = null;
    });

    win.once('closed', () => {
      sessionWin.close();
      sessionWin = null;
    });

    if (isDev) {
      sessionWin.openDevTools();
    }

    sessionWin.webContents.on('context-menu', (e, props) => {
      const {x, y} = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click () {
          sessionWin.inspectElement(x, y);
        }
      }]).popup(sessionWin);
    });
  });
}

function connectCreateNewSession () {
  ipcMain.on('appium-create-new-session', (evt, desiredCapabilities) => {
    try {
      let client = webdriverio.remote({
        port: serverArgs.port,
        host: serverArgs.address,
        desiredCapabilities,
      });
      client.init();
      sessionWin.webContents.send('appium-new-session-ready');
    } catch (e) {
      sessionWin.webContents.send('appium-new-session-failed');
    }
  });
}

function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
  // listen for 'start-session' from the renderer
  connectStartSession(win);
  connectGetDefaultArgs(win);
  connectCreateNewSession(win);
}

export { initializeIpc };
