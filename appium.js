/* eslint-disable no-console */

import { ipcMain, BrowserWindow, Menu } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs, getParser } from 'appium/build/lib/parser';
import path from 'path';
import wd from 'wd';
import Bluebird from 'bluebird';

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

/**
 * Opens a new window for creating new sessions
 */
function connectCreateNewSessionWindow (win) {
  ipcMain.on('create-new-session-window', () => {

    // Create and open the Browser Window
    let sessionWin = new BrowserWindow({width: 1200, height: 800, webPreferences: {devTools: true}});
    let sessionHTMLPath = path.resolve(__dirname, 'app', 'index.html#/session');
    sessionWin.loadURL(`file://${sessionHTMLPath}`);
    sessionWin.show();

    // When you close the session window, kill its associated Appium session (if there is one)
    let sessionID = sessionWin.webContents.id;
    sessionWin.on('closed', async () => {
      if (sessionDrivers[sessionID]) {
        await sessionDrivers[sessionID].quit();
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
      await killSession(event.sender);
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
    let renderer = evt.sender;
    let driver = sessionDrivers[renderer.id];
    let source, screenshot;

    try {
      if (methodName === 'quit') {
        renderer.send('appium-session-done');
        await killSession(renderer);
      } else {

        // Execute the requested method
        if (methodName !== 'source') {
          if (xpath) {
            await driver.elementByXPath(xpath)[methodName](...args);
          } else {
            await driver[methodName](...args);
          }
        }

        // Give method time to finish altering the source before getting source and screenshot
        await Bluebird.delay(500);

        // Send back the new source and screenshot
        source = await driver.source();
        screenshot = await driver.takeScreenshot();
        renderer.send('appium-client-command-response', {source, screenshot});
      }

    } catch (e) {
      // If the status is '6' that means the session has been terminated
      if (e.status === 6) {
        renderer.send('appium-session-done', e);
      } 
        
      renderer.send('appium-client-command-response-error', e);
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
