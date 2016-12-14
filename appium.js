/* eslint-disable no-console */

import { ipcMain, BrowserWindow, Menu } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs, getParser } from 'appium/build/lib/parser';
import path from 'path';
import wd from 'wd';

const LOG_SEND_INTERVAL_MS = 250;
const isDev = process.env.NODE_ENV === 'development';

var server = null;
var logWatcher = null;
var batchedLogs = [];

let sessionDrivers = {};

/**
 * Kill session associated with session browser window
 */
async function killSession (sessionWinID) {
  let driver = sessionDrivers[sessionWinID];
  if (driver) {
    let sessionID;
    try {
      await driver.getSessionId();
      await driver.quit();
    } catch (e) {
      console.log(`Couldn't close session: ${sessionID || 'unknown session ID'}`);
    }
    delete sessionDrivers[sessionWinID];
  }
}

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
      server = await appiumServer(args, true);
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
    let sessionWin = new BrowserWindow({width: 800, height: 600, webPreferences: {devTools: true}});
    let sessionHTMLPath = path.resolve(__dirname, 'app', 'index.html#/session');
    sessionWin.loadURL(`file://${sessionHTMLPath}`);
    sessionWin.show();

    // When you close the session window, kill the associated Appium session
    let sessionWinID = sessionWin.webContents.id;
    sessionWin.on('closed', async () => {
      await killSession(sessionWinID);
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
  ipcMain.on('appium-create-new-session', async (event, args) => {
    const {desiredCapabilities, host, port, username, accessKey, https} = args;

    let driver = sessionDrivers[event.sender.id] = wd.promiseChainRemote({
      hostname: host,
      port,
      username,
      accessKey,
      https,
    });

    try {
      let p = driver.init(desiredCapabilities);
      event.sender.send('appium-new-session-successful');
      await p;
      event.sender.send('appium-new-session-ready');

    } catch (e) {

      // If the session failed, delete it from the cache
      delete sessionDrivers[event.sender.id];
      event.sender.send('appium-new-session-failed', JSON.parse(e.data).value.message);
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
