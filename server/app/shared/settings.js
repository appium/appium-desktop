import settings from 'electron-settings';

export const PRESETS = 'presets';
export const SERVER_ARGS = 'SERVER_ARGS';
export const PREFERRED_LANGUAGE = 'PREFERRED_LANGUAGE';

// set default persistent settings
// do it here because settings are kind of like state!
settings.defaults({
  [PRESETS]: {},
  [SERVER_ARGS]: null,
  [PREFERRED_LANGUAGE]: 'en',
});

export default settings;
