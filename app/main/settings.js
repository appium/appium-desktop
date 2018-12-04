import settings from 'electron-settings';
import { PRESETS } from '../renderer/actions/StartServer';
import { SAVED_SESSIONS, SERVER_ARGS, SESSION_SERVER_PARAMS,
         SESSION_SERVER_TYPE } from '../renderer/actions/Session';
import { SAVED_FRAMEWORK } from '../renderer/actions/Inspector';

// set default persistent settings
// do it here because settings are kind of like state!
settings.defaults({
  [PRESETS]: {},
  [SAVED_SESSIONS]: [],
  [SERVER_ARGS]: null,
  [SESSION_SERVER_PARAMS]: null,
  [SESSION_SERVER_TYPE]: null,
  [SAVED_FRAMEWORK]: 'java',
});

export default settings;
