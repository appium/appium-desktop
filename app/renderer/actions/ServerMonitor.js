import { ipcRenderer, shell } from 'electron';
import { push } from 'react-router-redux';
import { fs } from 'appium-support';

export const SERVER_STOP_REQ = 'SERVER_STOP_REQ';
export const SERVER_STOP_OK = 'SERVER_STOP_OK';
export const SERVER_STOP_FAIL = 'SERVER_STOP_FAIL';
export const LOGS_RECEIVED = 'LOGS_RECEIVED';
export const LOGS_CLEARED = 'LOGS_CLEARED';
export const MONITOR_CLOSED = 'MONITOR_CLOSED';
export const START_SESSION_REQUEST = 'START_SESSION';
export const SET_SERVER_ARGS = 'SET_SERVER_ARGS';

export function stopServerReq () {
  return {type: SERVER_STOP_REQ};
}

export function stopServerOK () {
  return {type: SERVER_STOP_OK};
}

export function stopServerFailed (reason) {
  return {type: SERVER_STOP_FAIL, reason};
}

export function startSessionRequest (sessionUUID) {
  return {type: START_SESSION_REQUEST, sessionUUID};
}

export function serverLogsReceived (logs) {
  return {type: LOGS_RECEIVED, logs};
}

export function setServerArgs (args) {
  return {type: SET_SERVER_ARGS, args};
}

export function monitorClosed () {
  return {type: MONITOR_CLOSED};
}

function stopListening () {
  ipcRenderer.removeAllListeners('appium-log-line');
  ipcRenderer.removeAllListeners('appium-stop-error');
}

export function stopServer () {
  return (dispatch) => {
    dispatch(stopServerReq());

    ipcRenderer.once('appium-stop-error', (event, message) => {
      alert(`Stop server failed: ${message}`);
      dispatch(stopServerFailed(message));
    });

    stopListening();

    ipcRenderer.once('appium-stop-ok', () => {
      dispatch(serverLogsReceived([{
        level: 'info',
        msg: "Appium server stopped successfully"
      }]));
      setTimeout(() => {
        dispatch(stopServerOK());
      }, 0);
    });

    ipcRenderer.send('stop-server');
  };
}

export function closeMonitor () {
  return (dispatch) => {
    dispatch(monitorClosed());
    dispatch(push("/"));
  };
}

export function clearLogs () {
  return (dispatch, getState) => {
    const logfilePath = getState().startServer.logfilePath;
    if (logfilePath) {
      ipcRenderer.send('appium-clear-logfile', {logfilePath});
    }
    dispatch({type: LOGS_CLEARED});
  };
}

export function startSession () {
  return (dispatch) => {
    dispatch({type: START_SESSION_REQUEST});
    ipcRenderer.send('create-new-session-window');
  };
}

export function getRawLogs () {
  return (dispatch, getState) => {
    const logfilePath = getState().startServer.logfilePath;
    if (logfilePath) {
      shell.openExternal(`file://${logfilePath}`);
    } else {
      alert('An error has occurred: Logs not available');
    }
  };
}