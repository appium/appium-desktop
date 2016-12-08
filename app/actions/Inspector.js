import { ipcRenderer } from 'electron';
import settings from 'electron-settings';
import { push } from 'react-router-redux';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';

/**
 * Send a command to 'wd'. 
 */
export function applyClientMethod (methodName, args) {
  return async (dispatch) => {
    ipcRenderer.send('appium-client-command-request', {methodName, args});
    ipcRenderer.once('appium-client-command-response', (evt, resp) => {
      const { source, screenshot } = resp;
      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source, screenshot});
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