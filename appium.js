/* eslint-disable no-console */

import { ipcMain, BrowserWindow, Menu } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs, getParser } from 'appium/build/lib/parser';
import path from 'path';
import wd from 'wd';

const LOG_SEND_INTERVAL_MS = 250;
const isDev = process.env.NODE_ENV === 'development';

var server = null;
var serverArgs = null;
var logWatcher = null;
var batchedLogs = [];

let sessionDrivers = {};

/**
 * Kill session associated with session browser window
 */
async function killSession (sender) {
  let sessionWinID = sender.id;
  if (sessionDrivers[sessionWinID]) {
    await sessionDrivers[sessionWinID].quit();
    delete sessionDrivers[sessionWinID];
    sender.send('appium-session-done');
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

/**
 * Opens a new window for creating new sessions
 */
function connectCreateNewSessionWindow (win) {
  ipcMain.on('create-new-session-window', () => {

    // Create and open the Browser Window
    let sessionWin = new BrowserWindow({width: 1500, height: 600, webPreferences: {devTools: true}});
    let sessionHTMLPath = path.resolve(__dirname, 'app', 'index.html#/session');
    sessionWin.loadURL(`file://${sessionHTMLPath}`);
    sessionWin.show();

    // When you close the session window, kill it's associated Appium session (if there is one)
    let sessionID = sessionWin.webContents.id;
    sessionWin.on('closed', () => {
      if (sessionDrivers[sessionID]) {
        sessionDrivers[sessionID].quit();
        delete sessionDrivers[sessionID];
      }
      sessionWin = null; 
    });

    // When the main window is closed, close the session window too
    win.once('closed', () => {
      sessionWin = null;
    });

    // If it's dev, include devTools and 'inspect element' context menu option
    if (isDev) {
      sessionWin.openDevTools();
      sessionWin.webContents.on('context-menu', (e, props) => {
        const {x, y} = props;

        Menu.buildFromTemplate([{
          label: 'Inspect element',
          click () {
            sessionWin.inspectElement(x, y);
          }
        }]).popup(sessionWin);
      });
    }
  });
}

/**
 * Creates a new WD client session
 */
function connectCreateNewSession () {
  ipcMain.on('appium-create-new-session', async (event, args) => {
    const {desiredCapabilities, host, port, username, accessKey, https} = args;

    // If there is an already active session, kill it. Limit one session per window.
    if (sessionDrivers[event.sender.id]) {
      await killSession(event.sender);
    }

    // Create the driver and cache it by the sender ID
    let driver = sessionDrivers[event.sender.id] = wd.promiseChainRemote({
      hostname: host,
      port,
      username,
      accessKey,
      https,
    });

    // Try initializing it. If it fails, kill it and send error message to sender
    try {
      let p = driver.init(desiredCapabilities);
      event.sender.send('appium-new-session-successful');
      await p;
      event.sender.send('appium-new-session-ready');
    } catch (e) {
      // If the session failed, delete it from the cache
      killSession(event.sender);
      event.sender.send('appium-new-session-failed');
    }

  });
}

/**
 * When a Session Window makes method request, find it's corresponding driver, execute requested method
 * and send back the result
 */
function connectClientMethodListener () {
  ipcMain.on('appium-client-command-request', async (evt, data) => {
    const {methodName, args = [], xpath} = data;
    let driver = sessionDrivers[evt.sender.id];

    let source, screenshot;
    try {
      if (methodName === 'quit') {
        await killSession(evt.sender);
      } else {
        if (methodName !== 'source') {
          if (xpath) {
            await driver.elementByXPath(xpath)[methodName](...args);
          } else {
            await driver[methodName].apply(driver, args);
          }
        }
        setTimeout(async () => {
          source = await driver.source();
          screenshot = await driver.takeScreenshot();
          evt.sender.send('appium-client-command-response', {source, screenshot});
        }, 500);
      }

    } catch (e) {
      evt.sender.send('appium-client-command-response-error', e);
    }
  });
}

function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
  // listen for 'create-new-session-window' from the renderer
  connectCreateNewSessionWindow(win);
  connectGetDefaultArgs(win);
  connectCreateNewSession(win);
  connectClientMethodListener(win);
}

export { initializeIpc };
