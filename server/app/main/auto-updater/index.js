/**
 * Auto Updater
 *
 * Similar to https://electronjs.org/docs/api/auto-updater#events
 * See https://electronjs.org/docs/tutorial/updates for documentation
 */
import { app, autoUpdater, dialog } from 'electron';
import request from 'request-promise';
import moment from 'moment';
import B from 'bluebird';
import semver from 'semver';
import { getFeedUrl } from './config';
import _ from 'lodash';
import env from '../../env';
import i18n from '../../configs/i18next.config';
import { setUpAutoUpdater } from '../../../../shared/util';

const isDev = process.env.NODE_ENV === 'development';
const runningLocally = isDev || process.env.RUNNING_LOCALLY;

let checkNewUpdates = _.noop;

if (!runningLocally && !process.env.RUNNING_IN_SPECTRON) {
  checkNewUpdates = setUpAutoUpdater({
    request,
    getFeedUrl,
    semver,
    autoUpdater,
    app,
    moment,
    i18n,
    env,
    dialog,
    B
  });
}

export { checkNewUpdates };
