import { SERVER_START_REQ, SERVER_START_OK,
         SERVER_START_FAIL, UPDATE_ARGS } from '../actions/start-server';

import { ipcRenderer } from 'electron';

const defaultArgs = ipcRenderer.sendSync('get-default-args');

const initialState = {
  serverArgs: defaultArgs,
  serverStarting: false,
  serverFailMsg: ""
};

export default function startServer (state = initialState, action) {
  switch (action.type) {
    case SERVER_START_REQ:
      return {...state, serverStarting: true};
    case SERVER_START_OK:
      return {
        ...state,
        serverStarting: false,
      };
    case SERVER_START_FAIL:
      return {
        ...state,
        serverStarting: false,
        serverFailMsg: action.reason
      };
    case UPDATE_ARGS:
      return {
        ...state,
        serverArgs: Object.assign({}, state.serverArgs, action.args)
      };
    default:
      return state;
  }
}
