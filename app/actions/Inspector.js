import { ipcRenderer } from 'electron';
import settings from 'electron-settings';
import { push } from 'react-router-redux';

export const SET_SOURCE = 'SET_SOURCE';

/**
 * Send a command to 'wd'. 
 */
export function applyClientMethod (methodName, args) {
  return async (dispatch) => {
    ipcRenderer.send('appium-client-command-request', {methodName, args});
    ipcRenderer.once('appium-client-command-response', (evt, source) => {
      dispatch({type: SET_SOURCE, source});
    });

    ipcRenderer.once('appium-client-command-response-error', () => {
      alert('error occurred');
    });
  };
}

export function goBackToNewSessionPage () {
  return async (dispatch) => {
    // TODO: Kill the session and then when it's dead go back to /session
    dispatch(push('/session'));
  };
}