import settings from 'electron-settings';

export const PRESETS = 'presets';
export const SAVED_SESSIONS = 'SAVED_SESSIONS';
export const SERVER_ARGS = 'SERVER_ARGS';
export const SESSION_SERVER_PARAMS = 'SESSION_SERVER_PARAMS';
export const SESSION_SERVER_TYPE = 'SESSION_SERVER_TYPE';
export const SAVED_FRAMEWORK = 'SAVED_FRAMEWORK';

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
