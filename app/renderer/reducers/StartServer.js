import { SERVER_START_REQ, SERVER_START_OK, SERVER_START_ERR, GET_PRESETS,
         UPDATE_ARGS, SWITCH_TAB, PRESET_SAVE_REQ, PRESET_SAVE_OK,
         PRESET_DELETE_REQ, PRESET_DELETE_OK, SET_LOGFILE_PATH,
} from '../actions/StartServer';

import { ipcRenderer } from 'electron';
import { version as SERVER_VERSION } from 'appium/package.json';

export const DEFAULT_ARGS = ipcRenderer.sendSync('get-default-args');

// TODO: Add this back when 'getParser' issue (https://github.com/appium/appium/issues/11320) has been fixed
//export const ARG_DATA = ipcRenderer.sendSync('get-args-metadata');

const initialState = {
  serverArgs: {
    ...DEFAULT_ARGS,
    // Turn on all insecure features, this is needed to auto download ChromeDriver
    // A tooltip is added to the settings screen
    ...{relaxedSecurityEnabled: true}
  },
  serverVersion: SERVER_VERSION,
  serverStarting: false,
  serverFailMsg: '',
  tabId: 0,
  presetSaving: false,
  presetDeleting: false,
  presets: {},
};

export default function startServer (state = initialState, action) {
  switch (action.type) {
    case SERVER_START_REQ:
      return {...state, serverStarting: true};
    case SERVER_START_OK:
    case SERVER_START_ERR:
      return {
        ...state,
        serverStarting: false,
      };
    case UPDATE_ARGS:
      return {
        ...state,
        serverArgs: Object.assign({}, state.serverArgs, action.args)
      };
    case SWITCH_TAB:
      return {
        ...state,
        tabId: action.tabId
      };
    case GET_PRESETS:
      return {...state, presets: action.presets};
    case PRESET_SAVE_REQ:
      return {...state, presetSaving: true};
    case PRESET_SAVE_OK:
      return {...state, presetSaving: false, presets: action.presets};
    case PRESET_DELETE_REQ:
      return {...state, presetDeleting: true};
    case PRESET_DELETE_OK:
      return {...state, presetDeleting: false, presets: action.presets};
    case SET_LOGFILE_PATH:
      return {...state, logfilePath: action.logfilePath};
    default:
      return state;
  }
}
