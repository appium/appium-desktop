import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import { serverLogReceived } from './server-monitor';

export const SERVER_START_REQ = 'SERVER_START_REQ';
export const SERVER_START_OK = 'SERVER_START_OK';
export const SERVER_START_FAIL = 'SERVER_START_FAIL';
export const UPDATE_ARGS = 'UPDATE_ARGS';

export function startServerReq () {
  return {type: SERVER_START_REQ};
}

export function startServerOK () {
  return {type: SERVER_START_OK};
}

export function startServerFailed (reason) {
  return {type: SERVER_START_FAIL, reason};
}

export function startServer (evt) {
  evt.preventDefault();
  return (dispatch, getState) => {
    // signal to the UI that we are beginning our request
    dispatch(startServerReq());
    const {serverArgs} = getState().startServer;

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

    ipcRenderer.on('appium-log-line', (event, level, message) => {
      dispatch(serverLogReceived(level, message));
    });

    ipcRenderer.send('start-server', serverArgs);
  };
}

export function updateArgs (args) {
  return (dispatch) => {
    dispatch({type: UPDATE_ARGS, args});
  };
}
