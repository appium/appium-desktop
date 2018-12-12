import settings from 'electron-settings';
import _ from 'lodash';
import { PRESETS } from '../renderer/actions/StartServer';
import { SAVED_SESSIONS, SERVER_ARGS, SESSION_SERVER_PARAMS,
         SESSION_SERVER_TYPE } from '../renderer/actions/Session';
import { SAVED_FRAMEWORK } from '../renderer/actions/Inspector';

// set default persistent settings
const defaults = {
  [PRESETS]: {},
  [SAVED_SESSIONS]: [],
  [SERVER_ARGS]: null,
  [SESSION_SERVER_PARAMS]: null,
  [SESSION_SERVER_TYPE]: null,
  [SAVED_FRAMEWORK]: 'java',
};

for (let [settingName, defaultSettingValue] of _.toPairs(defaults)) {
  if (_.isUndefined(settings.get(settingName))) {
    settings.set(settingName, defaultSettingValue);
  }
}



export default settings;
