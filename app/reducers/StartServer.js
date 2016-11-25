import { SERVER_START_REQ, SERVER_START_OK, SERVER_START_ERR, GET_PRESETS,
         UPDATE_ARGS, SWITCH_TAB, PRESET_SAVE_REQ, PRESET_SAVE_OK
       } from '../actions/StartServer';

import { ipcRenderer } from 'electron';
import settings from 'electron-settings';

export const DEFAULT_ARGS = ipcRenderer.sendSync('get-default-args');
export const ARG_DATA = ipcRenderer.sendSync('get-args-metadata');

// set default user settings
settings.defaults({
  presets: {}
});

const initialState = {
  serverArgs: {...DEFAULT_ARGS},
  serverStarting: false,
  serverFailMsg: "",
  tabId: 0,
  presetSaving: false,
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
    default:
      return state;
  }
}
