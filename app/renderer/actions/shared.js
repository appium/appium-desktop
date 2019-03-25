import { ipcRenderer } from 'electron';
import { notification } from 'antd';
import i18n from '../../configs/i18next.config.renderer';
import _ from 'lodash';
import UUID from 'uuid';
import Promise from 'bluebird';

const clientMethodPromises = {};

export function bindClient () {
  /**
   * When we hear back from the main process, resolve the promise
   */
  ipcRenderer.removeAllListeners('appium-client-command-response');
  ipcRenderer.on('appium-client-command-response', (evt, resp) => {
    // Rename 'id' to 'elementId'
    let {res} = resp;

    // Ignore empty objects
    if (_.isObject(res) && _.isEmpty(res)) {
      res = null;
    }

    if (!_.isNull(res) && !_.isUndefined(res)) {
      notification.success({
        message: `${i18n.t('Command was returned with result')}: '${_.truncate(JSON.stringify(res), {length: 2000})}'`,
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
  let uuid = UUID.v4();
  let promise = new Promise((resolve, reject) => clientMethodPromises[uuid] = {resolve, reject});
  ipcRenderer.send('appium-client-command-request', {
    ...params,
    uuid,
  });
  return promise;
}