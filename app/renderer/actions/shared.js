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
    // TODO: Get rid of the destructuring and just send the whole object back
    const {id:elementId, elements, variableName, variableType, variableIndex, source, screenshot, result, strategy, selector, screenshotError, sourceError, uuid} = resp;
    let promise = clientMethodPromises[uuid];
    if (promise) {
      promise.resolve({elementId, elements, variableName, variableType, variableIndex, source, screenshot, strategy, selector, result, screenshotError, sourceError});
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

export function callClientMethod (params) {
  if (!ipcRenderer) {
    throw new Error('Cannot call ipcRenderer from main context');
  }
  let uuid = UUID.v4();
  let promise = new Promise((resolve, reject) => clientMethodPromises[uuid] = {resolve, reject});
  ipcRenderer.send('appium-client-command-request', {
    ...params,
    uuid,
  });
  return promise;
}