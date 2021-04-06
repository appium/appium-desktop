import moment from 'moment';
import { SERVER_STOP_REQ, SERVER_STOP_OK, SERVER_STOP_FAIL, SET_SERVER_ARGS,
         START_SESSION_REQUEST,
         LOGS_RECEIVED, LOGS_CLEARED, MONITOR_CLOSED } from '../actions/ServerMonitor';

export const STATUS_RUNNING = 'running';
export const STATUS_STOPPED = 'stopped';
export const STATUS_STOPPING = 'stopping';

// Maximum amount of logs to keep in memory
const MAX_LOG_LINES = 10000;

const initialState = {
  logLines: [],
  serverStatus: STATUS_STOPPED,
  serverFailMsg: '',
  serverArgs: {},
};

export default function serverMonitor (state = initialState, action) {
  let logLines;
  switch (action.type) {
    case SERVER_STOP_REQ:
      return {...state, serverStatus: STATUS_STOPPING};
    case SERVER_STOP_OK:
      return {
        ...state,
        serverStatus: STATUS_STOPPED,
        serverFailMsg: ''
      };
    case SERVER_STOP_FAIL:
      return {
        ...state,
        serverStopping: false,
        serverFailMsg: action.reason
      };
    case START_SESSION_REQUEST:
      return {
        ...state,
        sessionStart: true,
        sessionId: action.sessionUUID,
      };
    case LOGS_RECEIVED:
      logLines = state.logLines.concat(action.logs.map((l) => {
        // attach a timestamp to each log line here when it comes in
        l.timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
        return l;
      }));

      // Don't log more than MAX_LOG_LINES
      if (logLines.length > MAX_LOG_LINES) {
        logLines = logLines.slice(logLines.length - MAX_LOG_LINES);
      }

      return {
        ...state,
        logLines,
        serverStatus: STATUS_RUNNING
      };
    case LOGS_CLEARED:
      return {
        ...state,
        logLines: []
      };
    case SET_SERVER_ARGS:
      return {
        ...state,
        serverArgs: action.args
      };
    case MONITOR_CLOSED:
      return {...initialState};
    default:
      return state;
  }
}
