/* eslint-disable no-console */

import { ipcMain, app } from 'electron';
import { main as appiumServer } from 'appium';
import { getDefaultArgs } from 'appium/build/lib/parser';
import path from 'path';
import { fs, tempDir } from 'appium-support';
import _ from 'lodash';
import settings from '../shared/settings';
import { checkNewUpdates } from './auto-updater';
import { openBrowserWindow, setSavedEnv } from './helpers';

const LOG_SEND_INTERVAL_MS = 250;

const defaultEnvironmentVariables = _.clone(process.env);

let server = null;
let logWatcher = null;
let batchedLogs = [];

let logFile;

// Delete saved server args, don't start until a server has been started
settings.deleteSync('SERVER_ARGS');

async function deleteLogfile () {
  if (logFile) {
    try {
      await fs.rimraf(logFile);
    } catch (ign) { }
  }
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
        batchedLogs.splice(0, batchedLogs.length);
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

  ipcMain.on('get-args-metadata', (/*evt*/) => {
    // If argv isn't defined, set it now. If argv[1] isn't defined, set it to empty string.
    // If process.argv[1] is undefined, calling getParser() will break because argparse expects it to be a string
    if (!process.argv) {
      process.argv = [];
    }

    if (!process.argv[1]) {
      process.argv[1] = '';
    }
    // Temporarily remove this feature until 'getParser' issue (https://github.com/appium/appium/issues/11320) has been fixed
    /*const backupPathResolve = path.resolve;
    path.resolve = () => "node_modules/appium/package.json";
    let defArgs = Object.keys(getDefaultArgs());
    evt.returnValue = getParser().rawArgs
                        .filter((a) => defArgs.indexOf(a[1].dest) !== -1)
                        .map((a) => a[1]);
    path.resolve = backupPathResolve;*/
  });
}

/**
 * Opens a new window for creating new sessions
 */
function connectCreateNewSessionWindow () {
  ipcMain.on('create-new-session-window', () => {
    createNewSessionWindow();
  });
}

function connectClearLogFile () {
  ipcMain.on('appium-clear-logfile', async (event, {logfilePath}) => {
    await fs.writeFile(logfilePath, '');
  });
}

export function createNewSessionWindow () {
  let sessionWin = openBrowserWindow('session', {
    title: 'Start Session',
    titleBarStyle: 'hidden',
  });

  sessionWin.on('closed', () => {
    sessionWin = null;
  });
}

function connectMoveToApplicationsFolder () {
  ipcMain.on('appium-move-to-applications-folder', (evt) => {
    app.moveToApplicationsFolder();
    evt.sender.send('appium-done-moving-to-applications-folder');
  });
}

export function createNewConfigWindow (win) {
  openBrowserWindow('config', {
    title: 'Config',
    parent: win,
    width: 1080 / 2,
    height: 1080 / 4,
  });
}

function connectOpenConfig (win) {
  ipcMain.on('appium-open-config', () => {
    createNewConfigWindow(win);
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
    await setSavedEnv();
    event.sender.send('appium-save-env-done');
  });
}

export function connectServerErrorBackdoor () {
  ipcMain.on('appium-force-nodejs-error', () => {
    throw new Error('A NodeJS error was intentionally thrown');
  });
}

export function initializeIpc (win) {
  // listen for 'start-server' from the renderer
  connectStartServer(win);
  // listen for 'stop-server' from the renderer
  connectStopServer(win);
  // listen for 'create-new-session-window' from the renderer
  connectCreateNewSessionWindow();
  connectGetDefaultArgs();
  connectMoveToApplicationsFolder();
  connectClearLogFile();
  connectOpenConfig(win);
  connectGetEnv();
  connectSaveEnv();

  setTimeout(checkNewUpdates, 10000);
}
