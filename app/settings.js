import settings from 'electron-settings';
import { PRESETS } from './renderer/actions/StartServer';
import { SAVED_SESSIONS, SERVER_ARGS, SESSION_SERVER_PARAMS,
         SESSION_SERVER_TYPE } from './renderer/actions/Session';
import { SAVED_FRAMEWORK } from './renderer/actions/Inspector';
import { SAVED_TESTS } from './renderer/actions/PlaybackLibrary';

// set default persistent settings
// do it here because settings are kind of like state!
const defaults = {
  [PRESETS]: {},
  [SAVED_SESSIONS]: [],
  [SERVER_ARGS]: null,
  [SESSION_SERVER_PARAMS]: null,
  [SESSION_SERVER_TYPE]: null,
  [SAVED_FRAMEWORK]: 'java',
  [SAVED_TESTS]: [],
};

settings.defaults(defaults);
settings._defaultGet = settings.get;

// override the
async function get (key) {
  return (await settings._defaultGet(key)) || defaults[key];
}

settings.get = get;

export default settings;
