import { ipcRenderer } from 'electron';
import settings from 'electron-settings';
import { push } from 'react-router-redux';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';
export const QUIT_SESSION_REQUESTED = 'QUIT_SESSION_REQUESTED';
export const QUIT_SESSION_DONE = 'QUIT_SESSION_DONE';

export function bindSessionDone () {
  return async (dispatch) => {
    ipcRenderer.on('appium-session-done', () => {
      ipcRenderer.removeAllListeners('appium-client-command-response');
      ipcRenderer.removeAllListeners('appium-client-command-response-error');
      dispatch({type: QUIT_SESSION_DONE});
      dispatch(push('/session'));
    });
  };
}

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

export function quitSession () {
  return async (dispatch) => {
    dispatch({type: QUIT_SESSION_REQUESTED});
    ipcRenderer.send('appium-client-command-request', {methodName: 'quit'});
  };
}