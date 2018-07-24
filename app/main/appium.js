/* eslint-disable no-console */

import { ipcMain, app } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs, getParser } from 'appium/build/lib/parser';
import path from 'path';
import wd from 'wd';
import { fs, tempDir } from 'appium-support';
import _ from 'lodash';
import settings from '../settings';
import AppiumMethodHandler from './appium-method-handler';
import request from 'request-promise';
import { checkNewUpdates } from './auto-updater';
import { openBrowserWindow } from './helpers';

const LOG_SEND_INTERVAL_MS = 250;

const defaultEnvironmentVariables = _.clone(process.env);

var server = null;
var logWatcher = null;
var batchedLogs = [];

let appiumHandlers = {};
let logFile;

// Delete saved server args, don't start until a server has been started
settings.deleteSync('SERVER_ARGS');

// Sets the environment variables to a combination of process.env and whatever
// the user saved
async function setEnv () {
  const savedEnv = await settings.get('ENV', {});
  process.env = {
    ...defaultEnvironmentVariables,
    ...savedEnv,
  };
}

setEnv();

async function deleteLogfile () {
  if (logFile) {
    try {
      await fs.rimraf(logFile);
    } catch (ign) { }
  }
}

/**
 * Kill session associated with session browser window
 */
async function killSession (sessionWinID, killedByUser=false) {
  let handler = appiumHandlers[sessionWinID];
  if (handler) {
    await handler.close('', killedByUser);  
  }
  
  delete appiumHandlers[sessionWinID];
}

function connectStartServer (win) {
  ipcMain.on('start-server', async (event, args) => {
    // log the server logs to a file
    try {
      const dir = await tempDir.openDir();
      logFile = path.resolve(dir, 'appium-server-logs.txt');
      win.webContents.send('path-to-logs', logFile);
      win.on('close', deleteLogfile);
    } catch (ign) { }

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
    logWatcher = setInterval(async () => {
      if (batchedLogs.length) {
        try {
          await fs.writeFile(
            logFile,
            batchedLogs.map((log) => `[${log.level}] ${log.msg}`).join('\n'),
            {flag: 'a'}
          );
          win.webContents.send('appium-log-line', batchedLogs);
        } catch (ign) { }
        batchedLogs = [];
      }
    }, LOG_SEND_INTERVAL_MS);

    try {
      // set up the appium server running in this thread
      server = await appiumServer(args, true);
      await settings.set('SERVER_ARGS', args);
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
    await settings.delete('SERVER_ARGS');
  });
}

function connectGetDefaultArgs () {

  ipcMain.on('get-default-args', (evt) => {
    evt.returnValue = getDefaultArgs();
  });

  ipcMain.on('get-args-metadata', (evt) => {
    // If argv isn't defined, set it now. If argv[1] isn't defined, set it to empty string.
    // If process.argv[1] is undefined, calling getParser() will break because argparse expects it to be a string
    if (!process.argv) {
      process.argv = [];
    }

    if (!process.argv[1]) {
      process.argv[1] = '';
    }
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
    createNewSessionWindow(win);
  });
}

function connectClearLogFile () {
  ipcMain.on('appium-clear-logfile', async (event, {logfilePath}) => {
    await fs.writeFile(logfilePath, '');
  });
}

export function createNewSessionWindow (win) {
  let sessionWin = openBrowserWindow('session', {
    title: "Start Session",
    titleBarStyle: 'hidden',
  });

  // When you close the session window, kill its associated Appium session (if there is one)
  let sessionID = sessionWin.webContents.id;
  sessionWin.on('closed', async () => {
    await killSession(sessionID);
    sessionWin = null;
  });

  // When the main window is closed, close the session window too
  win.once('closed', () => {
    sessionWin.close();
  });
}

function connectCreateNewSession () {
  ipcMain.on('appium-create-new-session', async (event, args) => {
    const {desiredCapabilities, host, port, path, username, accessKey, https,
      attachSessId, rejectUnauthorized, proxy} = args;

    try {
      // If there is an already active session, kill it. Limit one session per window.
      if (appiumHandlers[event.sender.id]) {
        await killSession(event.sender);
      }

      // Create the driver and cache it by the sender ID
      let driver = wd.promiseChainRemote({
        hostname: host,
        port,
        path,
        username,
        accessKey,
        https,
      });
      driver.configureHttp({rejectUnauthorized, proxy});
      const handler = appiumHandlers[event.sender.id] = new AppiumMethodHandler(driver, event.sender);

      // If we're just attaching to an existing session, do that and
      // short-circuit the rest of the logic
      if (attachSessId) {
        driver._isAttachedSession = true;
        await driver.attach(attachSessId);
        // get the session capabilities to prove things are working
        await driver.sessionCapabilities();
        event.sender.send('appium-new-session-ready');
        return;
      }

      // If a newCommandTimeout wasn't provided, set it to 0 so that sessions don't close on users
      if (!desiredCapabilities.newCommandTimeout) {
        desiredCapabilities.newCommandTimeout = 0;
      }

      // If someone didn't specify connectHardwareKeyboard, set it to true by
      // default
      if (typeof desiredCapabilities.connectHardwareKeyboard === "undefined") {
        desiredCapabilities.connectHardwareKeyboard = true;
      }

      // Try initializing it. If it fails, kill it and send error message to sender
      let p = driver.init(desiredCapabilities);
      event.sender.send('appium-new-session-successful');
      await p;

      if (host !== '127.0.0.1' && host !== 'localhost') {
        handler.runKeepAliveLoop();
      }


      // we don't really support the web portion of apps for a number of
      // reasons, so pre-emptively ensure we're in native mode before doing the
      // rest of the inspector startup. Since some platforms might not implement
      // contexts, ignore any failures here.
      try {
        await driver.context('NATIVE_APP');
      } catch (ign) {}
      event.sender.send('appium-new-session-ready');
    } catch (e) {
      // If the session failed, delete it from the cache
      await killSession(event.sender);
      event.sender.send('appium-new-session-failed', e);
    }
  });
}

function connectRestartRecorder () {
  ipcMain.on('appium-restart-recorder', (evt) => {
    appiumHandlers[evt.sender.id].restart();
  });
}

function connectKeepAlive () {
  ipcMain.on('appium-keep-session-alive', (evt) => {
    appiumHandlers[evt.sender.id].keepSessionAlive();
  });
}

/**
 * When a Session Window makes method request, find it's corresponding driver, execute requested method
 * and send back the result
 */
function connectClientMethodListener () {
  ipcMain.on('appium-client-command-request', async (evt, data) => {
    const {
      uuid, // Transaction ID
      methodName, // Optional. Name of method being provided
      strategy, // Optional. Element locator strategy
      selector, // Optional. Element fetch selector
      fetchArray = false, // Optional. Are we fetching an array of elements or just one?
      elementId, // Optional. Element being operated on
      args = [], // Optional. Arguments passed to method
      skipScreenshotAndSource = false, // Optional. Do we want the updated source and screenshot?
    } = data;

    let renderer = evt.sender;
    let methodHandler = appiumHandlers[renderer.id];

    try {
      if (methodName === 'quit') {
        await killSession(renderer.id, true);
        // when we've quit the session, there's no source/screenshot to send
        // back
        renderer.send('appium-client-command-response', {
          source: null,
          screenshot: null,
          windowSize: null,
          uuid,
          result: null
        });
      } else {
        let res = {};
        if (methodName) {
          if (elementId) {
            console.log(`Handling client method request with method '${methodName}', args ${JSON.stringify(args)} and elementId ${elementId}`);
            res = await methodHandler.executeElementCommand(elementId, methodName, args, skipScreenshotAndSource);
          } else {
            console.log(`Handling client method request with method '${methodName}' and args ${JSON.stringify(args)}`);
            res = await methodHandler.executeMethod(methodName, args, skipScreenshotAndSource);
          }
        } else  if (strategy && selector) {
          if (fetchArray) {
            console.log(`Fetching elements with selector '${selector}' and strategy ${strategy}`);
            res = await methodHandler.fetchElements(strategy, selector, skipScreenshotAndSource);
          } else {
            console.log(`Fetching an element with selector '${selector}' and strategy ${strategy}`);
            res = await methodHandler.fetchElement(strategy, selector);
          }
        }

        renderer.send('appium-client-command-response', {
          ...res,
          uuid,
        });
      }

    } catch (e) {
      // If the status is '6' that means the session has been terminated
      if (e.status === 6) {
        console.log('Session terminated: e.status === 6');
        renderer.send('appium-session-done', e);
      }
      console.log('Caught an exception: ', e);
      renderer.send('appium-client-command-response-error', {e: e.message, uuid});
    }
  });
}

function connectGetSessionsListener () {
  ipcMain.on('appium-client-get-sessions', async (evt, data) => {
    const {host, port, ssl} = data;
    try {
      const res = await request(`http${ssl ? 's' : ''}://${host}:${port}/wd/hub/sessions`);
      evt.sender.send('appium-client-get-sessions-response', {res});
    } catch (e) {
      evt.sender.send('appium-client-get-sessions-fail');
    }
  });
}

function connectMoveToApplicationsFolder () {
  ipcMain.on('appium-move-to-applications-folder', (evt) => {
    app.moveToApplicationsFolder();
    evt.sender.send('appium-done-moving-to-applications-folder');
  });
}

function connectOpenConfig (win) {
  ipcMain.on('appium-open-config', () => {
    openBrowserWindow('config', {
      title: "Config",
      parent: win,
    });
  });
}

function connectGetEnv () {
  ipcMain.on('appium-get-env', async (event) => {
    event.sender.send('appium-env', {
      defaultEnvironmentVariables,
      savedEnvironmentVariables: await settings.get('ENV', {}),
    });
  });
}

function connectSaveEnv () {
  ipcMain.on('appium-save-env', async (event, environmentVariables) => {
    // Pluck unset values
    const env = _.pickBy(environmentVariables, _.identity);

    await settings.set('ENV', env);
    setEnv();
    event.sender.send('appium-save-env-done');
  });
}

function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
  // listen for 'create-new-session-window' from the renderer
  connectCreateNewSessionWindow(win);
  connectGetDefaultArgs();
  connectCreateNewSession(win);
  connectClientMethodListener(win);
  connectGetSessionsListener();
  connectRestartRecorder();
  connectMoveToApplicationsFolder();
  connectKeepAlive();
  connectClearLogFile();
  connectOpenConfig(win);
  connectGetEnv();
  connectSaveEnv();

  setTimeout(checkNewUpdates, 10000);
}

export { initializeIpc };
