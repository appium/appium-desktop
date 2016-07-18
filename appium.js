/* eslint-disable no-console */

import path from 'path';
import { ipcMain } from 'electron';
import { SubProcess } from 'teen_process';
import { logServer } from './log-server';

const BIN_PATH = path.resolve(__dirname, "node_modules", "appium", "build",
                              "lib", "main.js");
const LOG_PORT = 9587;
const LOG_HOST = "127.0.0.1";

var proc = null;
var server = null;

function connectStartServer (win) {
  ipcMain.on('start-server', async (event, address, port) => {
    const args = [
      BIN_PATH,
      '-a', address,
      '-p', port,
      '-G', `${LOG_HOST}:${LOG_PORT}`
    ];

    server = logServer(LOG_PORT, win);
    try {
      // set up the appium subprocess
      console.log(`Starting Appium with args: ${JSON.stringify(args)}`);
      proc = new SubProcess("node", args);

      // handle out-of-bound exit
      proc.on('exit', (code, signal) => {
        win.webContents.send('appium-exit', [code, signal]);
        server.close();
      });

      // start subproc and wait for log output
      await proc.start();

      // tell the renderer everything is ok
      win.webContents.send('appium-start-ok');

    } catch (e) {
      win.webContents.send('appium-start-error', e.message);
      server.close();
    }
  });
}

function connectStopServer (win) {
  ipcMain.on('stop-server', async () => {
    try {
      await proc.stop();
      server.close();
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
