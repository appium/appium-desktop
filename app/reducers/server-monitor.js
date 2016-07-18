import { SERVER_STOP_REQ, SERVER_STOP_OK,
         SERVER_STOP_FAIL, LOG_RECEIVED,
         SERVER_EXIT, MONITOR_CLOSED } from '../actions/server-monitor';

export const STATUS_RUNNING = "running";
export const STATUS_STOPPED = "stopped";

const initialState = {
  logLines: [],
  serverStopping: false,
  serverStatus: STATUS_STOPPED,
  serverFailMsg: ""
};

export default function serverMonitor (state = initialState, action) {
  switch (action.type) {
    case SERVER_STOP_REQ:
      return {...state, serverStopping: true};
    case SERVER_STOP_OK:
      return {
        ...state,
        serverStopping: false,
        serverStatus: STATUS_STOPPED,
        serverFailMsg: ""
      };
    case SERVER_STOP_FAIL:
      return {
        ...state,
        serverStopping: false,
        serverFailMsg: action.reason
      };
    case LOG_RECEIVED:
      return {
        ...state,
        logLines: state.logLines.concat(action.msg),
        serverStatus: STATUS_RUNNING
      };
    case SERVER_EXIT:
      return {
        ...state,
        serverStopping: false,
        serverStatus: STATUS_STOPPED,
        serverFailMsg: `Appium exited unexpectedly. Code: ${action.code}. ` +
                       `Signal: ${action.signal}`
      };
    case MONITOR_CLOSED:
      return {...initialState};
    default:
      return state;
  }
}
