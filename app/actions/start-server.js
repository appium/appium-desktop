import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import { serverLogsReceived, clearLogs } from './server-monitor';

export const SERVER_START_REQ = 'SERVER_START_REQ';
export const SERVER_START_OK = 'SERVER_START_OK';
export const SERVER_START_ERR = 'SERVER_START_ERR';
export const UPDATE_ARGS = 'UPDATE_ARGS';

export function startServer (evt) {
  evt.preventDefault();
  return (dispatch, getState) => {
    // signal to the UI that we are beginning our request
    dispatch({type: SERVER_START_REQ});
    const {serverArgs} = getState().startServer;

    // if we get an error from electron, fail with the message
    ipcRenderer.once('appium-start-error', (event, message) => {
      // don't listen for log lines any more if we failed to start, other-
      // wise we'll start to stack listeners for subsequent attempts
      ipcRenderer.removeAllListeners('appium-log-line');
      alert(`Error starting Appium server: ${message}`);
      dispatch({type: SERVER_START_ERR});
    });

    ipcRenderer.once('appium-start-ok', () => {
      // don't listen for subsequent server start failures later in the
      // lifetime of this app instance
      ipcRenderer.removeAllListeners('appium-start-error');
      dispatch({type: SERVER_START_OK});
      dispatch(push('/monitor'));
    });

    ipcRenderer.on('appium-log-line', (event, logs) => {
      dispatch(serverLogsReceived(logs));
    });

    dispatch(clearLogs());
    ipcRenderer.send('start-server', serverArgs);
  };
}

export function updateArgs (args) {
  return (dispatch) => {
    dispatch({type: UPDATE_ARGS, args});
  };
}
