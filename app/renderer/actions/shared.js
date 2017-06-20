import { ipcRenderer } from 'electron';
import UUID from 'uuid';
import Promise from 'bluebird';

const clientMethodPromises = {};

// Don't do anything if we're in 'main' context
if (ipcRenderer) {

  /**
   * When we hear back from the main process, resolve the promise
   */
  ipcRenderer.on('appium-client-command-response', (evt, resp) => {
    const {source, screenshot, result, screenshotError, sourceError, uuid} = resp;
    let promise = clientMethodPromises[uuid];
    if (promise) {
      promise.resolve({source, screenshot, result, screenshotError, sourceError});
      delete clientMethodPromises[uuid];
    }
  });

  /**
   * If we hear back with an error, reject the promise
   */
  ipcRenderer.on('appium-client-command-response-error', (evt, resp) => {
    const {e, uuid} = resp;
    let promise = clientMethodPromises[uuid];
    if (promise) {
      promise.reject(e);
      delete clientMethodPromises[uuid];
    }
  });
}

export function callClientMethod (...params) {
  if (!ipcRenderer) {
    throw new Error('Cannot call ipcRenderer from main context');
  }
  let opts;
  if (typeof(params[params.length - 1]) === 'object') {
    opts = params[params.length - 1];
    params = params.slice(params.length - 1);
  }
  let [methodName, args, xpath] = params;
  let uuid = UUID.v4();
  let promise = new Promise((resolve, reject) => clientMethodPromises[uuid] = {resolve, reject});
  ipcRenderer.send('appium-client-command-request', {methodName, args, xpath, uuid, opts});
  return promise;
}