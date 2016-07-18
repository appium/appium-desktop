import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import { serverLogReceived } from './server-monitor';

export const SERVER_START_REQ = 'SERVER_START_REQ';
export const SERVER_START_OK = 'SERVER_START_OK';
export const SERVER_START_FAIL = 'SERVER_START_FAIL';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const UPDATE_PORT = 'UPDATE_PORT';

export function startServerReq () {
  return {type: SERVER_START_REQ};
}

export function startServerOK () {
  return {type: SERVER_START_OK};
}

export function startServerFailed (reason) {
  return {type: SERVER_START_FAIL, reason};
}

export function startServer () {
  return (dispatch, getState) => {
    // signal to the UI that we are beginning our request
    dispatch(startServerReq());
    const {address, port} = getState().startServer;

    // if we get an error from electron, fail with the message
    ipcRenderer.once('appium-start-error', (event, message) => {
      dispatch(startServerFailed(message));
    });

    // likewise if appium exits with a code and signal
    let exitListener = (event, arg) => {
      let [code, sig] = arg;
      dispatch(startServerFailed(`Appium exited with code ${code} and ` +
                                 `signal ${sig}`));
    };
    ipcRenderer.once('appium-exit', exitListener);

    ipcRenderer.once('appium-start-ok', () => {
      dispatch(startServerOK());
      dispatch(push('/monitor'));
      // remove this component's exit listener since it was just for
      // startup errors
      ipcRenderer.removeListener('appium-exit', exitListener);
    });

    ipcRenderer.on('appium-log-line', (event, line) => {
      dispatch(serverLogReceived(line));
    });

    ipcRenderer.send('start-server', address, port);
  };
}

export function updateAddress (evt) {
  return (dispatch) => {
    dispatch({type: UPDATE_ADDRESS, address: evt.target.value});
  };
}

export function updatePort (evt) {
  return (dispatch) => {
    let port = parseInt(evt.target.value, 10);
    dispatch({type: UPDATE_PORT, port});
  };
}
