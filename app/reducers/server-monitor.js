import { SERVER_STOP_REQ, SERVER_STOP_OK,
         SERVER_STOP_FAIL, LOGS_RECEIVED,
         LOGS_CLEARED, MONITOR_CLOSED } from '../actions/server-monitor';

export const STATUS_RUNNING = "running";
export const STATUS_STOPPED = "stopped";
export const STATUS_STOPPING = "stopping";

const initialState = {
  logLines: [],
  serverStatus: STATUS_STOPPED,
  serverFailMsg: ""
};

export default function serverMonitor (state = initialState, action) {
  switch (action.type) {
    case SERVER_STOP_REQ:
      return {...state, serverStatus: STATUS_STOPPING};
    case SERVER_STOP_OK:
      return {
        ...state,
        serverStatus: STATUS_STOPPED,
        serverFailMsg: ""
      };
    case SERVER_STOP_FAIL:
      return {
        ...state,
        serverStopping: false,
        serverFailMsg: action.reason
      };
    case LOGS_RECEIVED:
      return {
        ...state,
        logLines: state.logLines.concat(action.logs),
        serverStatus: STATUS_RUNNING
      };
    case LOGS_CLEARED:
      return {
        ...state,
        logLines: []
      };
    case MONITOR_CLOSED:
      return {...initialState};
    default:
      return state;
  }
}
