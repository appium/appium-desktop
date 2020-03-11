import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import { util } from 'appium-support';
import i18n from '../../configs/i18next.config.renderer';
import _ from 'lodash';
import { v4 as UUID } from 'uuid';
import Promise from 'bluebird';

const clientMethodPromises = {};

export function bindClient () {
  /**
   * When we hear back from the main process, resolve the promise
   */
  ipcRenderer.removeAllListeners('appium-client-command-response');
  ipcRenderer.on('appium-client-command-response', (evt, resp) => {
    // Rename 'id' to 'elementId'
    let {res, methodName} = resp;

    // Ignore empty objects
    if (_.isObject(res) && _.isEmpty(res)) {
      res = null;
    }

    const truncatedResult = _.truncate(JSON.stringify(res), {length: 2000});

    if (util.hasValue(res) && !resp.ignoreResult) {
      notification.success({
        message: i18n.t('methodCallResult', {methodName}),
        description: i18n.t('commandWasReturnedWithResult', {result: truncatedResult}),
        duration: 15,
      });
    }
    resp.elementId = resp.id;
    let promise = clientMethodPromises[resp.uuid];
    if (promise) {
      promise.resolve(resp);
      delete clientMethodPromises[resp.uuid];
    }
  });

  /**
   * If we hear back with an error, reject the promise
   */
  ipcRenderer.on('appium-client-command-response-error', (evt, resp) => {
    let {e, uuid} = resp;
    e = JSON.parse(e);
    let promise = clientMethodPromises[uuid];
    if (promise) {
      promise.reject(e);
      delete clientMethodPromises[uuid];
    }
  });
}

export function unbindClient () {
  ipcRenderer.removeAllListeners('appium-client-command-response');
  ipcRenderer.removeAllListeners('appium-client-command-response-error');
}

export function callClientMethod (params) {
  if (!ipcRenderer) {
    throw new Error('Cannot call ipcRenderer from main context');
  }
  let uuid = UUID();
  let promise = new Promise((resolve, reject) => clientMethodPromises[uuid] = {resolve, reject});
  ipcRenderer.send('appium-client-command-request', {
    ...params,
    uuid,
  });
  return promise;
}