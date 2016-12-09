import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

export const SET_SOURCE_AND_SCREENSHOT = 'SET_SOURCE';
export const QUIT_SESSION_REQUESTED = 'QUIT_SESSION_REQUESTED';
export const QUIT_SESSION_DONE = 'QUIT_SESSION_DONE';
export const SELECT_ELEMENT_BY_XPATH = 'SELECT_ELEMENT_BY_XPATH';

export function bindSessionDone () {
  return async (dispatch) => {
    ipcRenderer.on('appium-session-done', () => {
      ipcRenderer.removeAllListeners('appium-client-command-response');
      ipcRenderer.removeAllListeners('appium-client-command-response-error');
      dispatch({type: QUIT_SESSION_DONE});
      dispatch(push('/session'));
    });

    ipcRenderer.on('appium-client-command-response', (evt, resp) => {
      const { source, screenshot } = resp;
      dispatch({type: SET_SOURCE_AND_SCREENSHOT, source, screenshot});
    });

    ipcRenderer.once('appium-client-command-response-error', (e) => {
      alert('Could not complete command');
    });
  };
}

export function selectElementByXPath (xpath) {
  return async (dispatch) => {
    dispatch({type: SELECT_ELEMENT_BY_XPATH, xpath});
  };
}

/**
 * Send a command to 'wd'. 
 */
export function applyClientMethod (params) {
  return async (dispatch) => {
    ipcRenderer.send('appium-client-command-request', params);
  };
}

export function quitSession () {
  return async (dispatch) => {
    dispatch({type: QUIT_SESSION_REQUESTED});
    ipcRenderer.send('appium-client-command-request', {methodName: 'quit'});
  };
}